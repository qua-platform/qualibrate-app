from typing import Any, Mapping, Optional

from qualibrate.api.core.bases.node import NodeBase, NodeLoadType
from qualibrate.api.core.bases.snapshot import SnapshotBase, SnapshotLoadType
from qualibrate.api.core.bases.storage import DataFileStorage
from qualibrate.api.core.local_storage.snapshot import SnapshotLocalStorage
from qualibrate.api.core.types import IdType
from qualibrate.api.core.utils.path_utils import resolve_and_check_relative
from qualibrate.api.exceptions.classes.storage import QNotADirectoryException
from qualibrate.config import get_settings

__all__ = ["NodeLocalStorage", "NodeLoadType"]


class NodeLocalStorage(NodeBase):
    def __init__(self, node_id: IdType):
        super().__init__()
        self._storage: Optional[DataFileStorage] = None
        self._snapshot = SnapshotLocalStorage(node_id)

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

    def load(self, load_type: NodeLoadType) -> None:
        if self._load_type == NodeLoadType.Full:
            return
        try:
            self._snapshot.load(SnapshotLoadType.Metadata)
        except FileNotFoundError:
            pass
        if load_type < NodeLoadType.Full:
            return
        self._fill_storage()

    @property
    def snapshot(self) -> Optional[SnapshotBase]:
        return self._snapshot

    @property
    def storage(self) -> Optional[DataFileStorage]:
        return self._storage

    def dump(self) -> Mapping[str, Any]:
        return {
            "snapshot": (
                None if self._snapshot is None else self._snapshot.content
            ),
            "storage": None if self._storage is None else self._storage.path,
        }