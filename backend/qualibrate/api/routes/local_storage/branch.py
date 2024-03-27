from typing import Annotated, Optional, cast

from fastapi import APIRouter, Depends, Path, Query

from qualibrate.api.core.bases.branch import BranchLoadType
from qualibrate.api.core.bases.node import NodeLoadType
from qualibrate.api.core.bases.snapshot import SnapshotLoadType
from qualibrate.api.core.local_storage.branch import BranchLocalStorage
from qualibrate.api.core.local_storage.node import NodeLocalStorage
from qualibrate.api.core.types import DocumentSequenceType, DocumentType

local_storage_branch_router = APIRouter(
    prefix="/branch/{name}", tags=["branch local storage"]
)


def _get_branch_instance(name: Annotated[str, Path()]) -> BranchLocalStorage:
    return BranchLocalStorage(name=name)


@local_storage_branch_router.get("/")
def get(
    branch: Annotated[BranchLocalStorage, Depends(_get_branch_instance)],
    load_type: BranchLoadType = BranchLoadType.Full,
) -> Optional[DocumentType]:
    branch.load(load_type)
    return branch.dump()


@local_storage_branch_router.get("/snapshot")
def get_snapshot(
    branch: Annotated[BranchLocalStorage, Depends(_get_branch_instance)],
    snapshot_id: int,
) -> Optional[DocumentType]:
    snapshot = branch.get_snapshot(snapshot_id)
    snapshot.load(SnapshotLoadType.Metadata)
    return snapshot.dump()


@local_storage_branch_router.get("/snapshot/latest")
def get_latest_snapshot(
    branch: Annotated[BranchLocalStorage, Depends(_get_branch_instance)],
) -> Optional[DocumentType]:
    snapshot = branch.get_snapshot()
    snapshot.load(SnapshotLoadType.Metadata)
    return snapshot.dump()


@local_storage_branch_router.get("/node")
def get_node(
    branch: Annotated[BranchLocalStorage, Depends(_get_branch_instance)],
    node_id: int,
) -> Optional[DocumentType]:
    node = cast(NodeLocalStorage, branch.get_node(node_id))
    node.load(NodeLoadType.Full)
    return node.dump()


@local_storage_branch_router.get("/node/latest")
def get_latest_node(
    branch: Annotated[BranchLocalStorage, Depends(_get_branch_instance)],
) -> Optional[DocumentType]:
    node = cast(NodeLocalStorage, branch.get_node())
    node.load(NodeLoadType.Full)
    return node.dump()


@local_storage_branch_router.get("/snapshots_history")
def get_snapshots_history(
    *,
    num: Annotated[int, Query(gt=0)] = 50,
    reverse: bool = False,
    branch: Annotated[BranchLocalStorage, Depends(_get_branch_instance)],
) -> DocumentSequenceType:
    snapshots = branch.get_latest_snapshots(num)
    snapshots_dumped = [snapshot.dump() for snapshot in snapshots]
    if reverse:
        snapshots_dumped = list(reversed(snapshots_dumped))
    return snapshots_dumped


@local_storage_branch_router.get("/nodes_history")
def get_nodes_history(
    *,
    num: Annotated[int, Query(gt=0)] = 50,
    reverse: bool = False,
    branch: Annotated[BranchLocalStorage, Depends(_get_branch_instance)],
) -> DocumentSequenceType:
    nodes = branch.get_latest_nodes(num)
    nodes_dumped = [node.dump() for node in nodes]
    if reverse:
        nodes_dumped = list(reversed(nodes_dumped))
    return nodes_dumped
