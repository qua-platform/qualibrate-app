from datetime import datetime
from typing import Any, Mapping, Optional, Sequence, Union, cast

from qualibrate.api.core.domain.bases.snapshot import (
    SnapshotBase,
    SnapshotLoadType,
)
from qualibrate.api.core.types import DocumentSequenceType, DocumentType, IdType
from qualibrate.api.core.utils.find_utils import get_subpath_value
from qualibrate.api.core.utils.request_utils import get_with_db
from qualibrate.api.core.utils.snapshots_compare import jsonpatch_to_mapping
from qualibrate.api.exceptions.classes.timeline_db import QJsonDbException

__all__ = ["SnapshotTimelineDb"]


class SnapshotTimelineDb(SnapshotBase):
    def __init__(
        self,
        id: IdType,
        content: Optional[DocumentType] = None,
    ):
        super().__init__(id, content)

    def load(self, load_type: SnapshotLoadType) -> None:
        if load_type <= self._load_type:
            return None
        fields: Optional[list[str]] = ["id", "_id", "parents", "created_at"]
        if fields is not None and load_type == SnapshotLoadType.Metadata:
            fields.append("metadata")
        elif load_type >= SnapshotLoadType.Data:
            fields = None
        params = None if fields is None else {"fields": fields}
        result = get_with_db(f"snapshot/{self.id}/", params=params)
        no_snapshot_ex = QJsonDbException("Snapshot data wasn't retrieved.")
        if result.status_code != 200:
            raise no_snapshot_ex
        content = result.json()
        if content is None:
            raise no_snapshot_ex
        if fields is None or "metadata" in fields:  # metadata was requested
            content["metadata"] = content.get("metadata", {})
            self._load_type = SnapshotLoadType.Metadata
        if fields is None:  # data was requested
            content["data"] = content.get("data", {})
            self._load_type = SnapshotLoadType.Full
        self.content.update(content)

    @property
    def load_type(self) -> SnapshotLoadType:
        return self._load_type

    @property
    def id(self) -> Optional[IdType]:
        return self._id

    @property
    def created_at(self) -> Optional[datetime]:
        if "created_at" not in self.content:
            return None
        return datetime.fromisoformat(str(self.content.get("created_at")))

    @property
    def parents(self) -> Optional[list[IdType]]:
        return self.content.get("parents")

    def search(
        self,
        search_path: Sequence[Union[str, int]],
        load: bool = False,
    ) -> Optional[DocumentSequenceType]:
        """Make search in current instance of Snapshot."""
        if self._load_type < SnapshotLoadType.Data and not load:
            return None
        self.load(SnapshotLoadType.Data)
        data = self.data
        if data is None:
            return None
        return get_subpath_value(data, search_path)

    def get_latest_snapshots(
        self, num_snapshots: int = 50
    ) -> Sequence[SnapshotBase]:
        result = get_with_db(
            f"snapshot/{self.id}/history",
            params={"num_snapshots": num_snapshots},
        )
        if result.status_code != 200:
            raise QJsonDbException("Snapshot history wasn't retrieved.")
        data = list(result.json())
        return [
            SnapshotTimelineDb(snapshot["id"], snapshot) for snapshot in data
        ]

    def compare_by_id(
        self, other_snapshot_int: int
    ) -> Mapping[str, Mapping[str, Any]]:
        if self.id == other_snapshot_int:
            return {}
        response = get_with_db(
            "action/compare",
            params={"left_id": self.id, "right_id": other_snapshot_int},
        )
        if response.status_code != 200:
            raise QJsonDbException("Difference wasn't retrieved.")
        result = dict(response.json())
        original = dict(result["original"])
        patch = result.get("patch")
        if patch is None:
            return {}
        return jsonpatch_to_mapping(
            original, cast(Sequence[Mapping[str, Any]], patch)
        )