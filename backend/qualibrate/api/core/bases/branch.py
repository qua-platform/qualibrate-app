from abc import ABC, abstractmethod
from datetime import datetime
from enum import IntEnum

__all__ = ["BranchBase", "BranchLoadType"]

from typing import Optional, Sequence

from qualibrate.api.core.bases.node import NodeBase
from qualibrate.api.core.bases.snapshot import SnapshotBase
from qualibrate.api.core.types import DocumentType, IdType


class BranchLoadType(IntEnum):
    Empty = 0
    Full = 1


class BranchBase(ABC):
    def __init__(self, name: str, content: Optional[DocumentType] = None):
        self._name = name
        if content is None:
            self.content = {}
            self._load_type = BranchLoadType.Empty
            return
        self.content = dict(content)
        self._load_type = BranchLoadType.Full

    @property
    def load_type(self) -> BranchLoadType:
        return self._load_type

    @property
    def name(self) -> str:
        return self._name

    @property
    @abstractmethod
    def created_at(self) -> Optional[datetime]:
        pass

    @abstractmethod
    def load(self, load_type: BranchLoadType) -> None:
        pass

    @abstractmethod
    def get_snapshot(self, id: Optional[IdType] = None) -> SnapshotBase:
        pass

    @abstractmethod
    def get_node(self, id: Optional[IdType] = None) -> NodeBase:
        pass

    @abstractmethod
    def get_latest_snapshots(self, num: int = 50) -> Sequence[SnapshotBase]:
        pass

    @abstractmethod
    def get_latest_nodes(self, num: int = 50) -> Sequence[NodeBase]:
        pass

    def dump(self) -> DocumentType:
        return {
            "name": self._name,
            **self.content,
        }
