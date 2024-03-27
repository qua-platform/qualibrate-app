from datetime import datetime
from typing import Optional, Sequence
from urllib.parse import urljoin

from qualibrate.api.core.bases.branch import BranchBase, BranchLoadType
from qualibrate.api.core.bases.node import NodeBase, NodeLoadType
from qualibrate.api.core.bases.snapshot import SnapshotBase, SnapshotLoadType
from qualibrate.api.core.timeline_db.node import NodeTimelineDb
from qualibrate.api.core.timeline_db.snapshot import SnapshotTimelineDb
from qualibrate.api.core.types import DocumentType, IdType
from qualibrate.api.core.utils.request_utils import get_with_db
from qualibrate.api.exceptions.classes.timeline_db import QJsonDbException
from qualibrate.config import get_settings

__all__ = ["BranchTimelineDb"]


class BranchTimelineDb(BranchBase):
    def __init__(self, name: str, content: Optional[DocumentType] = None):
        super().__init__(name, content)

    @property
    def created_at(self) -> Optional[datetime]:
        if "created_at" not in self.content:
            return None
        return datetime.fromisoformat(str(self.content.get("created_at")))

    def load(self, load_type: BranchLoadType) -> None:
        if self._load_type == BranchLoadType.Full:
            return
        settings = get_settings()
        req_url = urljoin(
            str(settings.timeline_db.address), f"branch/{self._name}/"
        )
        result = get_with_db(req_url)
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
            latest = self.get_latest_snapshots(1)
            if len(latest) != 1:
                raise QJsonDbException("Can't load latest snapshot of branch")
            return latest[0]
        # TODO: Check if snapshot is part of branch history
        snapshot = SnapshotTimelineDb(id=id)
        snapshot.load(SnapshotLoadType.Metadata)
        return snapshot

    def get_node(self, id: Optional[IdType] = None) -> NodeBase:
        if id is None:
            latest = self.get_latest_nodes(1)
            if len(latest) != 1:
                raise QJsonDbException("Can't load latest node of branch")
            return latest[0]
        # TODO: Check if snapshot is part of branch history
        node = NodeTimelineDb(node_id=id)
        node.load(NodeLoadType.Full)
        return node

    def get_latest_snapshots(self, num: int = 50) -> list[SnapshotBase]:
        """Retrieve last num_snapshots from this branch"""
        settings = get_settings()
        req_url = urljoin(
            str(settings.timeline_db.address),
            f"branch/{self._name}/history",
        )
        result = get_with_db(
            req_url,
            params={"metadata": True, "num_snapshots": num},
        )
        if result.status_code != 200:
            raise QJsonDbException("Branch history wasn't retrieved.")
        snapshots = result.json()
        if not isinstance(snapshots, Sequence):
            raise QJsonDbException("Branch history wasn't retrieved.")
        return [
            SnapshotTimelineDb(id=snapshot["id"], content=snapshot)
            for snapshot in snapshots
        ]

    def get_latest_nodes(self, num: int = 50) -> list[NodeBase]:
        """Retrieve last num_snapshots from this branch"""
        settings = get_settings()
        req_url = urljoin(
            str(settings.timeline_db.address),
            f"branch/{self._name}/history",
        )
        result = get_with_db(
            req_url,
            params={"metadata": False, "num_snapshots": num},
        )
        if result.status_code != 200:
            raise QJsonDbException("Branch history wasn't retrieved.")
        snapshots = result.json()
        if not isinstance(snapshots, Sequence):
            raise QJsonDbException("Branch history wasn't retrieved.")
        return [
            NodeTimelineDb(
                node_id=snapshot.get("id"),
                snapshot_content=snapshot,
            )
            for snapshot in snapshots
        ]
