from collections.abc import Mapping, Sequence
from datetime import datetime
from typing import Any, Optional, Union

import pytest
from pydantic import ValidationError

from qualibrate_app.api.core.domain.bases.branch import (
    BranchBase,
    BranchLoadType,
)
from qualibrate_app.api.core.domain.bases.node import NodeBase
from qualibrate_app.api.core.domain.bases.snapshot import SnapshotBase
from qualibrate_app.api.core.types import IdType, PageSearchFilter


class CustomBranchBase(BranchBase):
    @property
    def created_at(self) -> Optional[datetime]:
        raise NotImplementedError

    def load(self, load_type: BranchLoadType) -> None:
        raise NotImplementedError

    def get_snapshot(self, id: Optional[IdType] = None) -> SnapshotBase:
        raise NotImplementedError

    def get_node(self, id: Optional[IdType] = None) -> NodeBase:
        raise NotImplementedError

    def get_latest_snapshots(
        self,
        filters: PageSearchFilter,
        reverse: bool = False,
    ) -> Sequence[SnapshotBase]:
        raise NotImplementedError

    def get_latest_nodes(
        self,
        filters: PageSearchFilter,
        reverse: bool = False,
    ) -> Sequence[NodeBase]:
        raise NotImplementedError

    def search_snapshots_data(
        self,
        filters: PageSearchFilter,
        data_path: Sequence[Union[str, int]],
        filter_no_change: bool,
    ) -> Mapping[IdType, Any]:
        raise NotImplementedError


def test_creation_no_content(settings):
    branch = CustomBranchBase("name1", settings=settings)
    assert branch._name == "name1"
    assert branch.content == {}
    assert branch._load_type == BranchLoadType.Empty


def test_creation_with_content(settings):
    branch = CustomBranchBase("name2", {"key": "value"}, settings=settings)
    assert branch._name == "name2"
    assert branch.content == {"key": "value"}
    assert branch._load_type == BranchLoadType.Full


def test_name(settings):
    assert CustomBranchBase("name1", settings=settings).name == "name1"
    assert CustomBranchBase("name2", settings=settings).name == "name2"


def test_load_type(settings):
    branch = CustomBranchBase("name1", settings=settings)
    branch._load_type = BranchLoadType.Empty
    assert branch.load_type == BranchLoadType.Empty
    branch._load_type = BranchLoadType.Full
    assert branch.load_type == BranchLoadType.Full


def test_branch_dump_not_filled(settings):
    branch = CustomBranchBase("name", settings=settings)
    with pytest.raises(ValidationError) as ex:
        branch.dump()
    assert ex.type == ValidationError
    got_errors = [
        {"type": error["type"], "loc": error["loc"], "msg": error["msg"]}
        for error in sorted(ex.value.errors(), key=lambda e: e["loc"])
    ]
    expected_errors = [
        {
            "type": "missing",
            "loc": loc,
            "msg": "Field required",
        }
        for loc in [
            ("created_at",),
            ("id",),
            ("snapshot_id",),
        ]
    ]
    assert got_errors == expected_errors
