from abc import ABC, abstractmethod
from enum import IntEnum

__all__ = ["NodeBase", "NodeLoadType"]

from typing import Optional

from qualibrate.api.core.bases.i_dump import IDump
from qualibrate.api.core.bases.snapshot import SnapshotBase
from qualibrate.api.core.bases.storage import DataFileStorage
from qualibrate.api.core.types import DocumentType, IdType


class NodeLoadType(IntEnum):
    Empty = 0
    Snapshot = 1
    Full = 2


class NodeBase(IDump, ABC):
    def __init__(self, node_id: IdType) -> None:
        self._node_id = node_id
        self._load_type = NodeLoadType.Empty
        self._snapshot: SnapshotBase
        self._storage: Optional[DataFileStorage]

    @property
    def load_type(self) -> NodeLoadType:
        return self._load_type

    @abstractmethod
    def load(self, load_type: NodeLoadType) -> None:
        pass

    @property
    @abstractmethod
    def snapshot(self) -> Optional[SnapshotBase]:
        pass

    @property
    @abstractmethod
    def storage(self) -> Optional[DataFileStorage]:
        pass

    def dump(self) -> DocumentType:
        return {
            "snapshot": (
                None if self._snapshot is None else self._snapshot.dump()
            ),
            "storage": None if self._storage is None else self._storage.dump(),
        }
