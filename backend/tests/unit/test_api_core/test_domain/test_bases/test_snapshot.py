from collections.abc import Mapping, Sequence
from datetime import datetime
from typing import Any, Optional, Union
from unittest.mock import PropertyMock

import pytest
from pydantic import ValidationError

from qualibrate_app.api.core.domain.bases.snapshot import (
    SnapshotBase,
    SnapshotLoadType,
)
from qualibrate_app.api.core.models.snapshot import Snapshot
from qualibrate_app.api.core.types import DocumentSequenceType, IdType


class SnapshotBaseCustom(SnapshotBase):
    def load(self, load_type: SnapshotLoadType) -> None:
        raise NotImplementedError

    @property
    def created_at(self) -> Optional[datetime]:
        raise NotImplementedError

    @property
    def parents(self) -> Optional[list[IdType]]:
        raise NotImplementedError

    def search(
        self, search_path: Sequence[Union[str, int]], load: bool = False
    ) -> Optional[DocumentSequenceType]:
        raise NotImplementedError

    def get_latest_snapshots(
        self, page: int = 1, per_page: int = 50, reverse: bool = False
    ) -> Sequence[SnapshotBase]:
        raise NotImplementedError

    def compare_by_id(
        self, other_snapshot_int: int
    ) -> Mapping[str, Mapping[str, Any]]:
        raise NotImplementedError

    def update_entry(self, updates: Mapping[str, Any]) -> bool:
        raise NotImplementedError

    def extract_state_update_type(
        self,
        path: str,
        **kwargs: Mapping[str, Any],
    ) -> Optional[Mapping[str, Any]]:
        raise NotImplementedError

    def extract_state_update_types(
        self,
        paths: Sequence[str],
        **kwargs: Mapping[str, Any],
    ) -> Mapping[str, Optional[Mapping[str, Any]]]:
        raise NotImplementedError


def test__items_keys():
    assert SnapshotBase._items_keys == ("data", "metadata")


def test_init_no_content(settings):
    s = SnapshotBaseCustom(1, settings=settings)
    assert s._id == 1
    assert s._load_type == SnapshotLoadType.Empty
    assert s.content == {}


@pytest.mark.parametrize(
    "content, load_type",
    [
        ({}, SnapshotLoadType.Minified),
        ({"metadata": {}}, SnapshotLoadType.Metadata),
        ({"data": {}}, SnapshotLoadType.Data),
        ({"data": {}, "metadata": {}}, SnapshotLoadType.Full),
    ],
)
def test_init_with_content(content, load_type, settings):
    s = SnapshotBaseCustom(1, content, settings=settings)
    assert s._id == 1
    assert s._load_type == load_type
    assert s.content == content


def test_items_not_specified(settings):
    s = SnapshotBaseCustom(1, settings=settings)
    assert s.metadata is None
    assert s.data is None


def test_items_specified(settings):
    s = SnapshotBaseCustom(
        1, {"data": "data", "metadata": "meta"}, settings=settings
    )
    assert s.data == "data"
    assert s.metadata == "meta"


@pytest.mark.parametrize("load", (True, False))
def test_search_recursive_data_filled(mocker, load, settings):
    s = SnapshotBaseCustom(1, settings=settings)
    s._load_type = SnapshotLoadType.Data
    load_patched = mocker.patch.object(s, "load")
    data_patched = mocker.patch.object(
        s.__class__,
        "data",
        new_callable=PropertyMock,
        return_value={"quam": {"a": "b"}},
    )
    search_pathed = mocker.patch(
        (
            "qualibrate_app.api.core.domain.bases.snapshot"
            ".get_subpath_value_on_any_depth"
        ),
        return_value=[{}],
    )
    assert s.search_recursive("target_key", load) == [{}]

    load_patched.assert_called_once_with(SnapshotLoadType.Data)
    data_patched.assert_called_once()
    search_pathed.assert_called_once_with({"a": "b"}, "target_key")


def test_search_recursive_no_data_no_load(mocker, settings):
    s = SnapshotBaseCustom(1, settings=settings)
    s._load_type = SnapshotLoadType.Minified
    load_patched = mocker.patch.object(s, "load")
    assert s.search_recursive("target_key", False) is None
    load_patched.assert_not_called()


@pytest.mark.parametrize("load", (True, False))
def test_search_recursive_data_none(mocker, load, settings):
    s = SnapshotBaseCustom(1, settings=settings)
    s._load_type = SnapshotLoadType.Data
    load_patched = mocker.patch.object(s, "load")
    data_patched = mocker.patch.object(
        s.__class__,
        "data",
        new_callable=PropertyMock,
        return_value=None,
    )
    search_pathed = mocker.patch(
        "qualibrate_app.api.core.domain.bases.snapshot"
        ".get_subpath_value_on_any_depth",
    )
    assert s.search_recursive("target_key", load) is None

    load_patched.assert_called_once_with(SnapshotLoadType.Data)
    data_patched.assert_called_once()
    search_pathed.assert_not_called()


def test_dump_no_content(settings):
    s = SnapshotBaseCustom(1, settings=settings)
    with pytest.raises(ValidationError) as ex:
        s.dump()
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
            ("parents",),
        ]
    ]
    assert got_errors == expected_errors


@pytest.mark.parametrize(
    "content, expected",
    (
        (
            {
                "id": 1,
                "parents": [],
                "created_at": datetime(2024, 4, 15, 12).astimezone(),
                "a": "b",
            },
            Snapshot(
                id=1,
                parents=[],
                created_at=datetime(2024, 4, 15, 12).astimezone(),
            ),
        ),
        (
            {
                "id": 1,
                "data": {"d": 1},
                "metadata": {"m": 2},
                "parents": [],
                "created_at": datetime(2024, 4, 15, 12).astimezone(),
                "custom": "c",
            },
            Snapshot(
                id=1,
                data={"d": 1},
                metadata={"m": 2},
                parents=[],
                created_at=datetime(2024, 4, 15, 12).astimezone(),
            ),
        ),
    ),
)
def test_dump_with_content(content, expected, settings):
    s = SnapshotBaseCustom(1, content, settings=settings)
    assert s.dump() == expected
