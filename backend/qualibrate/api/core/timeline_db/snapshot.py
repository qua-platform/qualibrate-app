from urllib.parse import urljoin

from datetime import datetime
from typing import Optional, Union, Any, Mapping, cast, Sequence

from qualibrate.api.core.types import IdType, DocumentType, DocumentSequenceType
from qualibrate.api.core.bases.snapshot import SnapshotLoadType, SnapshotBase
from qualibrate.api.core.utils.find_utils import get_subpath_value
from qualibrate.api.core.utils.request_utils import get_with_db
from qualibrate.api.core.utils.snapshots_compare import jsonpatch_to_mapping
from qualibrate.api.exceptions.classes.timeline_db import QJsonDbException
from qualibrate.config import get_settings


__all__ = ["SnapshotTimelineDb", "SnapshotLoadType"]


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
        settings = get_settings()
        fields: Optional[list[str]] = ["id", "_id", "parents", "created_at"]
        if fields is not None and load_type == SnapshotLoadType.Metadata:
            fields.append("metadata")
        elif load_type >= SnapshotLoadType.Data:
            fields = None
        params = None if fields is None else {"fields": fields}
        req_url = urljoin(
            str(settings.timeline_db.address), f"snapshot/{self.id}/"
        )
        result = get_with_db(req_url, params=params)
        no_snapshot_ex = QJsonDbException("Snapshot data wasn't retrieved.")
        if result.status_code != 200:
            raise no_snapshot_ex
        content = result.json()
        if content is None:
            raise no_snapshot_ex
        if fields is None or "metadata" in fields:  # metadata was requested
            content["metadata"] = content.get("metadata", {})
        if fields is None:  # data was requested
            content["data"] = content.get("data", {})
        if self.content is None:
            self.content = content
        else:
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
        search_path: list[Union[str, int]],
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
    ) -> DocumentSequenceType:
        settings = get_settings()
        req_url = urljoin(
            str(settings.timeline_db.address), f"snapshot/{self.id}/history"
        )
        result = get_with_db(req_url, params={"num_snapshots": num_snapshots})
        if result.status_code != 200:
            raise QJsonDbException("Snapshot history wasn't retrieved.")
        return list(result.json())

    def compare_by_id(
        self, other_snapshot_int: int
    ) -> Mapping[str, Mapping[str, Any]]:
        if self.id == other_snapshot_int:
            return {}
        settings = get_settings()
        req_url = urljoin(str(settings.timeline_db.address), "action/compare")
        response = get_with_db(
            req_url, params={"left_id": self.id, "right_id": other_snapshot_int}
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