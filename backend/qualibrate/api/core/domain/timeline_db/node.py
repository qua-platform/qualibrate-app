from typing import Optional

from qualibrate.api.core.domain.bases.node import NodeBase
from qualibrate.api.core.domain.timeline_db.snapshot import SnapshotTimelineDb
from qualibrate.api.core.types import DocumentType, IdType

__all__ = ["NodeTimelineDb"]


class NodeTimelineDb(NodeBase):
    def __init__(
        self, node_id: IdType, snapshot_content: Optional[DocumentType] = None
    ):
        super().__init__(node_id, SnapshotTimelineDb(node_id, snapshot_content))
