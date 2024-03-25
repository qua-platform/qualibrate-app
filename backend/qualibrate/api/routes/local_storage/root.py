from typing import Annotated, Optional, cast

from fastapi import APIRouter, Depends

from qualibrate.api.core.bases.branch import BranchLoadType
from qualibrate.api.core.bases.node import NodeLoadType
from qualibrate.api.core.bases.snapshot import SnapshotLoadType
from qualibrate.api.core.local_storage.node import NodeLocalStorage
from qualibrate.api.core.local_storage.root import RootLocalStorage
from qualibrate.api.core.types import DocumentSequenceType, DocumentType, IdType

local_storage_root_router = APIRouter(
    prefix="/root", tags=["root local storage"]
)


def _get_root_instance() -> RootLocalStorage:
    return RootLocalStorage()


@local_storage_root_router.get("/", tags=["root local storage"])
def get_branch(
    root: Annotated[RootLocalStorage, Depends(_get_root_instance)],
    load_type: BranchLoadType = BranchLoadType.Full,
) -> DocumentType:
    branch = root.get_branch("main")
    branch.load(load_type)
    return branch.content


@local_storage_root_router.get("/node")
def get_node_by_id(
    root: Annotated[RootLocalStorage, Depends(_get_root_instance)],
    id: IdType,
    load_type: NodeLoadType = NodeLoadType.Full,
) -> Optional[DocumentType]:
    node = cast(NodeLocalStorage, root.get_node(id))
    node.load(load_type)
    return node.dump()


@local_storage_root_router.get("/node/latest")
def get_latest_node(
    root: Annotated[RootLocalStorage, Depends(_get_root_instance)],
    load_type: NodeLoadType = NodeLoadType.Full,
) -> Optional[DocumentType]:
    node = cast(NodeLocalStorage, root.get_node())
    node.load(load_type)
    return node.dump()


@local_storage_root_router.get("/snapshot")
def get_snapshot_by_id(
    root: Annotated[RootLocalStorage, Depends(_get_root_instance)],
    id: IdType,
    load_type: SnapshotLoadType = SnapshotLoadType.Metadata,
) -> Optional[DocumentType]:
    snapshot = root.get_snapshot(id)
    snapshot.load(load_type)
    return snapshot.content


@local_storage_root_router.get("/snapshot/latest")
def get_latest_snapshot(
    root: Annotated[RootLocalStorage, Depends(_get_root_instance)],
    load_type: SnapshotLoadType = SnapshotLoadType.Metadata,
) -> Optional[DocumentType]:
    snapshot = root.get_snapshot()
    snapshot.load(load_type)
    return snapshot.content


@local_storage_root_router.get("/snapshots_history")
def get_snapshots_history(
    num: int,
    root: Annotated[RootLocalStorage, Depends(_get_root_instance)],
) -> DocumentSequenceType:
    branch = root.get_branch("main")
    snapshots = branch.get_latest_snapshots(num)
    return snapshots


@local_storage_root_router.get("/nodes_history")
def get_nodes_history(
    num: int,
    root: Annotated[RootLocalStorage, Depends(_get_root_instance)],
) -> DocumentSequenceType:
    branch = root.get_branch("main")
    nodes = branch.get_latest_nodes(num)
    return nodes