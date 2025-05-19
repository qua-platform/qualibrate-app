from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query
from qualibrate_config.models import QualibrateConfig, StorageType

from qualibrate_app.api.core.domain.bases.branch import (
    BranchBase,
    BranchLoadType,
)
from qualibrate_app.api.core.domain.bases.node import NodeLoadType
from qualibrate_app.api.core.domain.bases.snapshot import (
    SnapshotLoadType,
    SnapshotLoadTypeFlag,
)
from qualibrate_app.api.core.domain.local_storage.branch import (
    BranchLocalStorage,
)
from qualibrate_app.api.core.domain.timeline_db.branch import BranchTimelineDb
from qualibrate_app.api.core.models.branch import Branch as BranchModel
from qualibrate_app.api.core.models.node import Node as NodeModel
from qualibrate_app.api.core.models.paged import PagedCollection
from qualibrate_app.api.core.models.snapshot import (
    SimplifiedSnapshotWithMetadata,
)
from qualibrate_app.api.core.models.snapshot import Snapshot as SnapshotModel
from qualibrate_app.api.core.types import IdType, PageFilter, PageSearchFilter
from qualibrate_app.api.routes.utils.snapshot_load_type import (
    parse_load_type_flag,
)
from qualibrate_app.config import get_settings

branch_router = APIRouter(prefix="/branch/{name}", tags=["branch"])


def _get_branch_instance(
    name: Annotated[str, Path()],
    settings: Annotated[QualibrateConfig, Depends(get_settings)],
) -> BranchBase:
    branch_types = {
        StorageType.local_storage: BranchLocalStorage,
        StorageType.timeline_db: BranchTimelineDb,
    }
    return branch_types[settings.storage.type](name=name, settings=settings)


@branch_router.get("/")
def get(
    *,
    load_type: BranchLoadType = BranchLoadType.Full,
    branch: Annotated[BranchBase, Depends(_get_branch_instance)],
) -> BranchModel:
    branch.load(load_type)
    return branch.dump()


@branch_router.get("/snapshot")
def get_snapshot(
    *,
    snapshot_id: IdType,
    load_type: SnapshotLoadType = SnapshotLoadType.Metadata,
    branch: Annotated[BranchBase, Depends(_get_branch_instance)],
) -> SnapshotModel:
    snapshot = branch.get_snapshot(snapshot_id)
    snapshot.load(load_type)
    return snapshot.dump()


@branch_router.get("/snapshot/latest")
def get_latest_snapshot(
    *,
    load_type: SnapshotLoadType = SnapshotLoadType.Metadata,
    load_type_flag: Annotated[
        SnapshotLoadTypeFlag, Depends(parse_load_type_flag)
    ],
    branch: Annotated[BranchBase, Depends(_get_branch_instance)],
) -> SnapshotModel:
    # TODO: process new snapshot load type
    print(f"{load_type_flag = }")
    snapshot = branch.get_snapshot()
    snapshot.load(load_type)
    return snapshot.dump()


@branch_router.get("/node")
def get_node(
    *,
    node_id: int,
    load_type: NodeLoadType = NodeLoadType.Full,
    branch: Annotated[BranchBase, Depends(_get_branch_instance)],
) -> NodeModel:
    node = branch.get_node(node_id)
    node.load(load_type)
    return node.dump()


@branch_router.get("/node/latest")
def get_latest_node(
    *,
    load_type: NodeLoadType = NodeLoadType.Full,
    branch: Annotated[BranchBase, Depends(_get_branch_instance)],
) -> NodeModel:
    node = branch.get_node()
    node.load(load_type)
    return node.dump()


@branch_router.get("/snapshots_history")
def get_snapshots_history(
    *,
    page: int = Query(1, gt=0),
    per_page: int = Query(50, gt=0),
    reverse: bool = False,
    global_reverse: bool = False,
    branch: Annotated[BranchBase, Depends(_get_branch_instance)],
) -> PagedCollection[SimplifiedSnapshotWithMetadata]:
    total, snapshots = branch.get_latest_snapshots(
        pages_filter=PageFilter(page=page, per_page=per_page),
        reverse=global_reverse,
    )
    snapshots_dumped = [
        SimplifiedSnapshotWithMetadata(**snapshot.dump().model_dump())
        for snapshot in snapshots
    ]
    if reverse:
        # TODO: make more correct relationship update
        snapshots_dumped = list(reversed(snapshots_dumped))
    return PagedCollection[SimplifiedSnapshotWithMetadata](
        page=page,
        per_page=per_page,
        total_items=total,
        items=snapshots_dumped,
    )


@branch_router.get("/nodes_history")
def get_nodes_history(
    *,
    page: int = Query(1, gt=0),
    per_page: int = Query(50, gt=0),
    reverse: bool = False,
    global_reverse: bool = False,
    branch: Annotated[BranchBase, Depends(_get_branch_instance)],
) -> PagedCollection[NodeModel]:
    total, nodes = branch.get_latest_nodes(
        pages_filter=PageFilter(page=page, per_page=per_page),
        reverse=global_reverse,
    )
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


@branch_router.get("/search/")
def search_filtered_snapshots(
    filters: Annotated[PageSearchFilter, Query()],
    branch: Annotated[BranchBase, Depends(_get_branch_instance)],
) -> PagedCollection[SimplifiedSnapshotWithMetadata]:
    total, snapshots = branch.get_latest_snapshots(
        pages_filter=filters,
        search_filter=filters,
    )
    snapshots_dumped = [
        SimplifiedSnapshotWithMetadata(**snapshot.dump().model_dump())
        for snapshot in snapshots
    ]
    return PagedCollection[SimplifiedSnapshotWithMetadata](
        page=filters.page,
        per_page=filters.per_page,
        total_items=total,
        items=snapshots_dumped,
    )


# @branch_router.get("/search/data")
# def search_all_snapshots_data(
#     filters: Annotated[FilteredSnapshotsDataQuery, Query()],
#     branch: Annotated[BranchBase, Depends(_get_branch_instance)],
# ) -> Mapping[IdType, Any]:
#     if filters.data_path is None:
#         raise HTTPException(
#             status_code=400,
#             detail="Path parameter 'data_path' is required.",
#         )
#     return branch.search_snapshots_data(
#         data_path=filters.data_path,
#         filter_no_change=filters.filter_no_change,
#         pages_filter=filters,
#         search_filter=filters,
#     )
