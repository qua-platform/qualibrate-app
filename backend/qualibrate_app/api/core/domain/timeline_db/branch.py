from collections.abc import Sequence
from datetime import datetime
from typing import Optional

from qualibrate_config.models import QualibrateConfig

from qualibrate_app.api.core.domain.bases.branch import (
    BranchBase,
    BranchLoadType,
)
from qualibrate_app.api.core.domain.bases.node import NodeBase, NodeLoadType
from qualibrate_app.api.core.domain.bases.snapshot import (
    SnapshotBase,
    SnapshotLoadTypeFlag,
)
from qualibrate_app.api.core.domain.timeline_db.node import NodeTimelineDb
from qualibrate_app.api.core.domain.timeline_db.snapshot import (
    SnapshotTimelineDb,
)
from qualibrate_app.api.core.types import (
    DocumentType,
    IdType,
    PageFilter,
    SearchWithIdFilter,
)
from qualibrate_app.api.core.utils.request_utils import request_with_db
from qualibrate_app.api.exceptions.classes.timeline_db import QJsonDbException

__all__ = ["BranchTimelineDb"]


class BranchTimelineDb(BranchBase):
    def __init__(
        self,
        name: str,
        content: Optional[DocumentType] = None,
        *,
        settings: QualibrateConfig,
    ):
        super().__init__(name, content, settings=settings)

    @property
    def created_at(self) -> Optional[datetime]:
        if "created_at" not in self.content:
            return None
        return datetime.fromisoformat(
            str(self.content.get("created_at"))
        ).astimezone()

    def load(self, load_type: BranchLoadType) -> None:
        if self._load_type == BranchLoadType.Full:
            return
        timeline_db_config = self.timeline_db_config
        result = request_with_db(
            f"branch/{self._name}/",
            db_name=self._settings.project,
            host=timeline_db_config.address_with_root,
            timeout=timeline_db_config.timeout,
        )
        no_branch_ex = QJsonDbException("Branch data wasn't retrieved.")
        if result.status_code != 200:
            raise no_branch_ex
        content = result.json()
        if content is None:
            raise no_branch_ex
        self.content.update(content)
        self._load_type = BranchLoadType.Full

    def get_snapshot(self, id: Optional[IdType] = None) -> SnapshotBase:
        if id is None:
            latest = self.get_latest_snapshots(
                pages_filter=PageFilter(page=1, per_page=1)
            )
            if len(latest) != 1:
                raise QJsonDbException("Can't load latest snapshot of branch")
            return latest[1][0]
        timeline_db_config = self.timeline_db_config
        res = request_with_db(
            f"branch/{self.name}/is_snapshot_belong",
            params={"snapshot_id": id},
            host=timeline_db_config.address_with_root,
            db_name=self._settings.project,
            timeout=timeline_db_config.timeout,
        )
        snapshot_belonged_to_branch = bool(res.json())
        if not snapshot_belonged_to_branch:
            raise QJsonDbException("Snapshot doesn't belong to branch.")
        snapshot = SnapshotTimelineDb(id=id, settings=self._settings)
        snapshot.load_from_flag(SnapshotLoadTypeFlag.Metadata)
        return snapshot

    def get_node(self, id: Optional[IdType] = None) -> NodeBase:
        if id is None:
            latest = self.get_latest_nodes(
                pages_filter=PageFilter(page=1, per_page=1)
            )
            if len(latest) != 1:
                raise QJsonDbException("Can't load latest node of branch")
            return latest[1][0]
        timeline_db_config = self.timeline_db_config
        res = request_with_db(
            f"branch/{self.name}/is_snapshot_belong",
            params={"snapshot_id": id},
            host=timeline_db_config.address_with_root,
            db_name=self._settings.project,
            timeout=timeline_db_config.timeout,
        )
        snapshot_belonged_to_branch = bool(res.json())
        if not snapshot_belonged_to_branch:
            raise QJsonDbException("Node snapshot doesn't belong to branch.")
        node = NodeTimelineDb(node_id=id, settings=self._settings)
        node.load(NodeLoadType.Full)
        return node

    def _get_remote_snapshots(
        self,
        metadata: bool,
        page_filter: PageFilter,
        reverse: bool,
    ) -> tuple[int, Sequence[DocumentType]]:
        timeline_db_config = self.timeline_db_config
        result = request_with_db(
            f"branch/{self._name}/history",
            params={
                "metadata": metadata,
                "page": page_filter.page,
                "per_page": page_filter.per_page,
                "reverse": reverse,
            },
            host=timeline_db_config.address_with_root,
            db_name=self._settings.project,
            timeout=timeline_db_config.timeout,
        )
        if result.status_code != 200:
            raise QJsonDbException("Branch history wasn't retrieved.")
        snapshots = result.json()
        if not isinstance(snapshots, Sequence):
            raise QJsonDbException("Branch history wasn't retrieved.")
        # TODO: func for parse all paged items
        parsed = result.json()
        return parsed["total"], list(parsed["items"])

    def get_latest_snapshots(
        self,
        pages_filter: PageFilter,
        search_filter: Optional[SearchWithIdFilter] = None,
        descending: bool = False,
    ) -> tuple[int, list[SnapshotBase]]:
        """Retrieve last num_snapshots from this branch"""
        total, snapshots = self._get_remote_snapshots(
            True, pages_filter, descending
        )
        return total, [
            SnapshotTimelineDb(
                id=snapshot["id"], content=snapshot, settings=self._settings
            )
            for snapshot in snapshots
        ]

    def get_latest_nodes(
        self,
        pages_filter: PageFilter,
        search_filter: Optional[SearchWithIdFilter] = None,
        descending: bool = False,
    ) -> tuple[int, list[NodeBase]]:
        """Retrieve last num_snapshots from this branch"""
        total, snapshots = self._get_remote_snapshots(
            False, pages_filter, descending
        )
        return total, [
            NodeTimelineDb(
                node_id=snapshot["id"],
                snapshot_content=snapshot,
                settings=self._settings,
            )
            for snapshot in snapshots
        ]

    # def search_snapshots_data(
    #     self,
    #     data_path: Sequence[Union[str, int]],
    #     filter_no_change: bool,
    #     pages_filter: PageFilter,
    #     search_filter: Optional[SearchFilter] = None,
    # ) -> Mapping[IdType, Any]:
    #     # not implemented yet
    #     return {}
