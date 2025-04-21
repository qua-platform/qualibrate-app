from abc import ABC, abstractmethod
from collections.abc import Mapping, Sequence
from typing import Any, Optional, Union

from qualibrate_config.models import QualibrateConfig

from qualibrate_app.api.core.domain.bases.base_with_settings import (
    DomainWithConfigBase,
)
from qualibrate_app.api.core.domain.bases.branch import BranchBase
from qualibrate_app.api.core.domain.bases.node import NodeBase
from qualibrate_app.api.core.domain.bases.snapshot import SnapshotBase
from qualibrate_app.api.core.types import IdType, PageSearchFilter

__all__ = ["RootBase"]


class RootBase(DomainWithConfigBase, ABC):
    def __init__(self, settings: QualibrateConfig):
        super().__init__(settings)

    @abstractmethod
    def get_branch(self, branch_name: str) -> BranchBase:
        pass

    @abstractmethod
    def get_snapshot(self, id: Optional[IdType] = None) -> SnapshotBase:
        pass

    @abstractmethod
    def get_node(self, id: Optional[IdType] = None) -> NodeBase:
        pass

    @abstractmethod
    def get_latest_snapshots(
        self,
        filters: PageSearchFilter,
        reverse: bool = False,
    ) -> tuple[int, Sequence[SnapshotBase]]:
        pass

    @abstractmethod
    def get_latest_nodes(
        self,
        filters: PageSearchFilter,
        reverse: bool = False,
    ) -> tuple[int, Sequence[NodeBase]]:
        pass

    @abstractmethod
    def search_snapshot(
        self,
        snapshot_id: IdType,
        data_path: Sequence[Union[str, int]],
    ) -> Any:
        pass

    @abstractmethod
    def search_snapshots_data(
        self, filters: PageSearchFilter, data_path: Sequence[Union[str, int]]
    ) -> Mapping[IdType, Any]:
        pass
