from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Path

from qualibrate.api.core.local_storage.branch import BranchLocalStorage
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
    return branch.content


@local_storage_branch_router.get("/snapshots_history")
def get_snapshots_history(
    num: int,
    branch: Annotated[BranchLocalStorage, Depends(_get_branch_instance)],
) -> DocumentSequenceType:
    snapshots = branch.get_latest_snapshots(num)
    return snapshots


@local_storage_branch_router.get("/nodes_history")
def get_nodes_history(
    num: int,
    branch: Annotated[BranchLocalStorage, Depends(_get_branch_instance)],
) -> DocumentSequenceType:
    nodes = branch.get_latest_nodes(num)
    return nodes