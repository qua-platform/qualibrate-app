from typing import Optional, cast

from qualibrate.api.core.bases.node import NodeBase, NodeLoadType
from qualibrate.api.core.bases.storage import DataFileStorage
from qualibrate.api.core.timeline_db.snapshot import (
    SnapshotTimelineDb,
    SnapshotLoadType,
)
from qualibrate.api.core.utils.path_utils import resolve_and_check_relative
from qualibrate.api.exceptions.classes.values import QValueException
from qualibrate.api.exceptions.classes.storage import QNotADirectoryException
from qualibrate.config import get_settings


__all__ = ["NodeTimelineDb", "NodeLoadType"]


class NodeTimelineDb(NodeBase):
    def __init__(
        self,
        snapshot_id: Optional[int] = None,
        snapshot: Optional[SnapshotTimelineDb] = None,
    ):
        if sum(item is None for item in (snapshot_id, snapshot)) != 1:
            raise QValueException("Must provide either snapshot_id or snapshot")
        self._storage: Optional[DataFileStorage] = None
        if snapshot_id is not None:
            self._snapshot = SnapshotTimelineDb(snapshot_id)
            self._load_type = NodeLoadType.Empty
            return
        self._snapshot = cast(SnapshotTimelineDb, snapshot)
        # TODO: think about this init part
        if self._snapshot.load_type < SnapshotLoadType.Metadata:
            self._load_type = NodeLoadType.Snapshot
        else:
            pass
        self._fill_storage()

    def _fill_storage(self) -> None:
        settings = get_settings()
        metadata = self._snapshot.metadata
        if metadata is None or not isinstance(
            metadata.get(settings.timeline_db.metadata_out_path), str
        ):
            self._storage = None
            self._load_type = NodeLoadType.Snapshot
            return
        rel_output_path = metadata[settings.timeline_db.metadata_out_path]
        abs_output_path = resolve_and_check_relative(
            settings.user_storage,
            metadata[settings.timeline_db.metadata_out_path],
        )
        if not abs_output_path.is_dir():
            raise QNotADirectoryException(
                f"{rel_output_path} is not a directory"
            )
        self._storage = DataFileStorage(abs_output_path)
        self._load_type = NodeLoadType.Full

    @property
    def load_type(self) -> NodeLoadType:
        return self._load_type

    def load(self, load_type: NodeLoadType) -> None:
        if self._load_type == NodeLoadType.Full:
            return
        self._snapshot.load(SnapshotLoadType.Metadata)
        if load_type < NodeLoadType.Full:
            return
        self._fill_storage()

    @property
    def snapshot(self) -> Optional[SnapshotTimelineDb]:
        return self._snapshot

    @property
    def storage(self) -> Optional[DataFileStorage]:
        return self._storage