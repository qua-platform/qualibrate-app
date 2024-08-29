from typing import Annotated, Any, Sequence, Union

from fastapi import APIRouter, Depends, Query

from qualibrate_app.api.core.domain.bases.branch import BranchLoadType
from qualibrate_app.api.core.domain.bases.node import NodeLoadType
from qualibrate_app.api.core.domain.bases.root import RootBase
from qualibrate_app.api.core.domain.bases.snapshot import SnapshotLoadType
from qualibrate_app.api.core.domain.local_storage.root import RootLocalStorage
from qualibrate_app.api.core.domain.timeline_db.root import RootTimelineDb
from qualibrate_app.api.core.models.branch import Branch as BranchModel
from qualibrate_app.api.core.models.node import Node as NodeModel
from qualibrate_app.api.core.models.paged import PagedCollection
from qualibrate_app.api.core.models.snapshot import (
    SimplifiedSnapshotWithMetadata,
)
from qualibrate_app.api.core.models.snapshot import Snapshot as SnapshotModel
from qualibrate_app.api.core.types import IdType
from qualibrate_app.api.dependencies.search import get_search_path
from qualibrate_app.config import (
    QualibrateAppSettings,
    StorageType,
    get_settings,
)

root_router = APIRouter(prefix="/root", tags=["root"])


def _get_root_instance(
    settings: Annotated[QualibrateAppSettings, Depends(get_settings)],
) -> RootBase:
    root_types = {
        StorageType.local_storage: RootLocalStorage,
        StorageType.timeline_db: RootTimelineDb,
    }
    return root_types[settings.qualibrate.storage.type](settings=settings)


@root_router.get("/branch")
def get_branch(
    *,
    branch_name: str = "main",
    load_type: BranchLoadType = BranchLoadType.Full,
    root: Annotated[RootBase, Depends(_get_root_instance)],
) -> BranchModel:
    branch = root.get_branch(branch_name)
    branch.load(load_type)
    return branch.dump()


@root_router.get("/node")
def get_node_by_id(
    *,
    id: IdType,
    load_type: NodeLoadType = NodeLoadType.Full,
    root: Annotated[RootBase, Depends(_get_root_instance)],
) -> NodeModel:
    node = root.get_node(id)
    node.load(load_type)
    return node.dump()


@root_router.get("/node/latest")
def get_latest_node(
    *,
    load_type: NodeLoadType = NodeLoadType.Full,
    root: Annotated[RootBase, Depends(_get_root_instance)],
) -> NodeModel:
    node = root.get_node()
    node.load(load_type)
    return node.dump()


@root_router.get("/snapshot")
def get_snapshot_by_id(
    *,
    id: IdType,
    load_type: SnapshotLoadType = SnapshotLoadType.Metadata,
    root: Annotated[RootBase, Depends(_get_root_instance)],
) -> SnapshotModel:
    snapshot = root.get_snapshot(id)
    snapshot.load(load_type)
    return snapshot.dump()


@root_router.get("/snapshot/latest")
def get_latest_snapshot(
    *,
    load_type: SnapshotLoadType = SnapshotLoadType.Metadata,
    root: Annotated[RootBase, Depends(_get_root_instance)],
) -> SnapshotModel:
    snapshot = root.get_snapshot()
    snapshot.load(load_type)
    return snapshot.dump()


@root_router.get("/snapshots_history")
def get_snapshots_history(
    *,
    page: int = Query(1, gt=0),
    per_page: int = Query(50, gt=0),
    reverse: bool = False,
    global_reverse: bool = False,
    root: Annotated[RootBase, Depends(_get_root_instance)],
) -> PagedCollection[SimplifiedSnapshotWithMetadata]:
    total, snapshots = root.get_latest_snapshots(page, per_page, global_reverse)
    snapshots_dumped = [
        SimplifiedSnapshotWithMetadata(**snapshot.dump().model_dump())
        for snapshot in snapshots
    ]
    if reverse:
        snapshots_dumped = list(reversed(snapshots_dumped))
    return PagedCollection[SimplifiedSnapshotWithMetadata](
        page=page,
        per_page=per_page,
        total_items=total,
        items=snapshots_dumped,
    )


@root_router.get("/nodes_history")
def get_nodes_history(
    *,
    page: int = Query(1, gt=0),
    per_page: int = Query(50, gt=0),
    reverse: bool = False,
    global_reverse: bool = False,
    root: Annotated[RootBase, Depends(_get_root_instance)],
) -> PagedCollection[NodeModel]:
    total, nodes = root.get_latest_nodes(page, per_page, global_reverse)
    nodes_dumped = [node.dump() for node in nodes]
    if reverse:
        # TODO: make more correct relationship update
        nodes_dumped = list(reversed(nodes_dumped))
    return PagedCollection[NodeModel](
        page=page,
        per_page=per_page,
        total_items=total,
        items=nodes_dumped,
    )


@root_router.get("/search")
def search_snapshot(
    id: IdType,
    data_path: Annotated[Sequence[Union[str, int]], Depends(get_search_path)],
    root: Annotated[RootBase, Depends(_get_root_instance)],
) -> Any:
    return root.search_snapshot(id, data_path)
