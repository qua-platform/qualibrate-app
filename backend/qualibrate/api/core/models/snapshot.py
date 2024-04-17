from typing import Any, Optional

from pydantic import Field

from qualibrate.api.core.models.base import ModelWithIdCreatedAt
from qualibrate.api.core.types import IdType


class SimplifiedSnapshot(ModelWithIdCreatedAt):
    parents: list[IdType]


class SimplifiedSnapshotWithMetadata(SimplifiedSnapshot):
    metadata: dict[str, Any]


class Snapshot(SimplifiedSnapshot):
    metadata: dict[str, Any] = Field(default_factory=dict)
    data: Optional[dict[str, Any]] = None