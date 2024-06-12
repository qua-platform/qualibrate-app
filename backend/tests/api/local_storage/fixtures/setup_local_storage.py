import json
from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path
from typing import Any, Generator

import pytest

from qualibrate_app.api.core.domain.local_storage._id_to_local_path import (
    IdToLocalPath,
)


def _setup_local_storage_project(project_path: Path) -> Path:
    project_path.mkdir(parents=True)
    for i, node_date in enumerate(
        (date(2024, 4, 25), date(2024, 4, 26), date(2024, 4, 27))
    ):
        node_date_str = node_date.isoformat()
        date_dir = project_path / node_date_str
        date_dir.mkdir()
        for j in range(3):
            node_id = i * 3 + j + 1
            node_time = time(12 + 3 * j, 9 * (j + 1))
            node_time_str = node_time.strftime("%H%M%S")
            node_name = f"name_{node_id}"
            node_dir_name = f"#{node_id}_{node_name}_{node_time_str}"
            node_dir = date_dir / node_dir_name
            node_dir.mkdir()
            node_file = node_dir / "node.json"
            created_at = (
                datetime(
                    node_date.year,
                    node_date.month,
                    node_date.day,
                    node_time.hour,
                    node_time.minute,
                    node_time.second,
                )
            ).replace(tzinfo=timezone(timedelta(seconds=10800)))  # 3 hours

            node_file.write_text(
                json.dumps(
                    {
                        "created_at": created_at.isoformat(timespec="seconds"),
                        "metadata": {
                            "name": node_name,
                            "data_path": str(
                                Path(node_date_str, node_dir_name)
                            ),
                        },
                        "data": {"quam": "./state.json"},
                        "parents": [node_id - 1] if node_id > 1 else [],
                        "id": node_id,
                    }
                )
            )
            snapshot_file = node_dir / "state.json"
            snapshot_file.write_text(
                json.dumps({"quam": {"node": node_id}, "info": "snapshot"})
            )
            out_file = node_dir / "data.json"
            out_file.write_text(
                json.dumps({"info": "out data", "result": f"node_{node_id}"})
            )
    return project_path


@pytest.fixture
def local_storage_path(tmp_path: Path) -> Generator[Path, None, None]:
    yield tmp_path / "local_storage"


@pytest.fixture
def default_local_storage_project(
    local_storage_path,
) -> Generator[Path, None, None]:
    project_path = local_storage_path / "project"
    yield _setup_local_storage_project(project_path)
    IdToLocalPath()._project_to_path.clear()


@pytest.fixture
def local_storage_project_with_name(
    tmp_path: Path, request: pytest.FixtureRequest
) -> Generator[Path, None, None]:
    project_path = tmp_path / "local_storage" / request.param
    yield _setup_local_storage_project(project_path)
    IdToLocalPath()._project_to_path.clear()


@pytest.fixture
def snapshots_history() -> Generator[list[dict[str, Any]], None, None]:
    yield [
        {
            "created_at": "2024-04-27T18:27:00+03:00",
            "id": 9,
            "parents": [8],
            "metadata": {
                "name": "name_9",
                "data_path": "2024-04-27/#9_name_9_182700",
            },
        },
        {
            "created_at": "2024-04-27T15:18:00+03:00",
            "id": 8,
            "parents": [7],
            "metadata": {
                "name": "name_8",
                "data_path": "2024-04-27/#8_name_8_151800",
            },
        },
        {
            "created_at": "2024-04-27T12:09:00+03:00",
            "id": 7,
            "parents": [6],
            "metadata": {
                "name": "name_7",
                "data_path": "2024-04-27/#7_name_7_120900",
            },
        },
        {
            "created_at": "2024-04-26T18:27:00+03:00",
            "id": 6,
            "parents": [5],
            "metadata": {
                "name": "name_6",
                "data_path": "2024-04-26/#6_name_6_182700",
            },
        },
        {
            "created_at": "2024-04-26T15:18:00+03:00",
            "id": 5,
            "parents": [4],
            "metadata": {
                "name": "name_5",
                "data_path": "2024-04-26/#5_name_5_151800",
            },
        },
        {
            "created_at": "2024-04-26T12:09:00+03:00",
            "id": 4,
            "parents": [3],
            "metadata": {
                "name": "name_4",
                "data_path": "2024-04-26/#4_name_4_120900",
            },
        },
        {
            "created_at": "2024-04-25T18:27:00+03:00",
            "id": 3,
            "parents": [2],
            "metadata": {
                "name": "name_3",
                "data_path": "2024-04-25/#3_name_3_182700",
            },
        },
        {
            "created_at": "2024-04-25T15:18:00+03:00",
            "id": 2,
            "parents": [1],
            "metadata": {
                "name": "name_2",
                "data_path": "2024-04-25/#2_name_2_151800",
            },
        },
        {
            "created_at": "2024-04-25T12:09:00+03:00",
            "id": 1,
            "parents": [],
            "metadata": {
                "name": "name_1",
                "data_path": "2024-04-25/#1_name_1_120900",
            },
        },
    ]


@pytest.fixture
def dfss_history() -> Generator[list[dict[str, Any]], None, None]:
    yield [
        {"path": "2024-04-27/#9_name_9_182700", "data": None},
        {"path": "2024-04-27/#8_name_8_151800", "data": None},
        {"path": "2024-04-27/#7_name_7_120900", "data": None},
        {"path": "2024-04-26/#6_name_6_182700", "data": None},
        {"path": "2024-04-26/#5_name_5_151800", "data": None},
        {"path": "2024-04-26/#4_name_4_120900", "data": None},
        {"path": "2024-04-25/#3_name_3_182700", "data": None},
        {"path": "2024-04-25/#2_name_2_151800", "data": None},
        {"path": "2024-04-25/#1_name_1_120900", "data": None},
    ]
