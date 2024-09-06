from typing import Annotated, Any, Mapping, Optional, Type, Union

import requests
from fastapi import APIRouter, Body, Depends, Path, Query

from qualibrate_app.api.core.domain.bases.snapshot import (
    SnapshotBase,
    SnapshotLoadType,
)
from qualibrate_app.api.core.domain.local_storage.snapshot import (
    SnapshotLocalStorage,
)
from qualibrate_app.api.core.domain.timeline_db.snapshot import (
    SnapshotTimelineDb,
)
from qualibrate_app.api.core.models.paged import PagedCollection
from qualibrate_app.api.core.models.snapshot import (
    SimplifiedSnapshotWithMetadata,
)
from qualibrate_app.api.core.models.snapshot import Snapshot as SnapshotModel
from qualibrate_app.api.core.types import DocumentSequenceType, IdType
from qualibrate_app.api.core.utils.types_parsing import types_conversion
from qualibrate_app.api.dependencies.search import get_search_path
from qualibrate_app.config import (
    QualibrateAppSettings,
    StorageType,
    get_settings,
)

snapshot_router = APIRouter(prefix="/snapshot/{id}", tags=["snapshot"])


def is_float(string: str) -> bool:
    try:
        float(string)
        return True
    except ValueError:
        return False


def _get_snapshot_instance(
    id: Annotated[IdType, Path()],
    settings: Annotated[QualibrateAppSettings, Depends(get_settings)],
) -> SnapshotBase:
    snapshot_types: dict[StorageType, Type[SnapshotBase]] = {
        StorageType.local_storage: SnapshotLocalStorage,
        StorageType.timeline_db: SnapshotTimelineDb,
    }
    return snapshot_types[settings.qualibrate.storage.type](
        id=id, settings=settings
    )


@snapshot_router.get("/")
def get(
    *,
    load_type: SnapshotLoadType = SnapshotLoadType.Full,
    snapshot: Annotated[SnapshotBase, Depends(_get_snapshot_instance)],
) -> SnapshotModel:
    snapshot.load(load_type)
    return snapshot.dump()


@snapshot_router.get("/history")
def get_history(
    *,
    page: int = Query(1, gt=0),
    per_page: int = Query(50, gt=0),
    reverse: bool = False,
    global_reverse: bool = False,
    snapshot: Annotated[SnapshotBase, Depends(_get_snapshot_instance)],
) -> PagedCollection[SimplifiedSnapshotWithMetadata]:
    total, history = snapshot.get_latest_snapshots(
        page, per_page, global_reverse
    )
    history_dumped = [
        SimplifiedSnapshotWithMetadata(**snapshot.dump().model_dump())
        for snapshot in history
    ]
    if reverse:
        # TODO: make more correct relationship update
        history_dumped = list(reversed(history_dumped))
    return PagedCollection[SimplifiedSnapshotWithMetadata](
        page=page, per_page=per_page, total_items=total, items=history_dumped
    )


@snapshot_router.get("/compare")
def compare_by_id(
    id_to_compare: IdType,
    snapshot: Annotated[SnapshotBase, Depends(_get_snapshot_instance)],
) -> Mapping[str, Mapping[str, Any]]:
    return snapshot.compare_by_id(id_to_compare)


@snapshot_router.post("/update_entry")
def update_entity(
    *,
    snapshot: Annotated[SnapshotBase, Depends(_get_snapshot_instance)],
    data_path: Annotated[
        str,
        Body(
            ...,
            min_length=3,
            pattern="^#/.*",
            examples=["#/qubits/q0/frequency"],
        ),
    ],
    value: Annotated[Any, Body()],
    settings: Annotated[QualibrateAppSettings, Depends(get_settings)],
) -> bool:
    type_ = snapshot.extract_state_update_type(data_path)
    if type_ is not None:
        value = types_conversion(value, type_)
    updated = snapshot.update_entry({data_path: value})
    if updated:
        try:
            requests.post(
                f"{settings.runner.address}/record_state_update",
                params={"key": data_path},
                timeout=settings.runner.timeout,
            )
        except requests.exceptions.ConnectionError:
            pass
    return updated


@snapshot_router.get("/search/data/values")
def search(
    snapshot: Annotated[SnapshotBase, Depends(_get_snapshot_instance)],
    data_path: Annotated[list[Union[str, int]], Depends(get_search_path)],
) -> Optional[DocumentSequenceType]:
    return snapshot.search(data_path, load=True)


@snapshot_router.get("/search/data/value/any_depth")
def search_recursive(
    snapshot: Annotated[SnapshotBase, Depends(_get_snapshot_instance)],
    target_key: str,
) -> Optional[DocumentSequenceType]:
    return snapshot.search_recursive(target_key, load=True)
