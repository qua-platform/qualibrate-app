import operator
from datetime import datetime
from pathlib import Path

import tomli_w
from fastapi.testclient import TestClient

from qualibrate.config import QualibrateSettings, get_config_path


def test_project_list(
    client_custom_settings: TestClient, local_storage_path: Path
):
    other_project = local_storage_path / "other_project"
    other_project.mkdir()
    default_project_created_at = (
        datetime.fromtimestamp((local_storage_path / "project").stat().st_mtime)
        .astimezone()
        .isoformat(timespec="seconds")
    )
    other_project_created_at = (
        datetime.fromtimestamp(other_project.stat().st_mtime)
        .astimezone()
        .isoformat(timespec="seconds")
    )
    response = client_custom_settings.get("/api/projects/list")
    assert response.status_code == 200
    assert list(sorted(response.json(), key=operator.itemgetter("name"))) == [
        {
            "name": "other_project",
            "nodes_number": -1,
            "created_at": other_project_created_at,
            "last_modified_at": other_project_created_at,
        },
        {
            "name": "project",
            "nodes_number": 9,
            "created_at": default_project_created_at,
            "last_modified_at": "2024-04-27T18:27:00+03:00",
        },
    ]


def test_project_create(
    client_custom_settings: TestClient,
    local_storage_path: Path,
):
    assert list(local_storage_path.iterdir()) == [
        local_storage_path / "project"
    ]
    response = client_custom_settings.post(
        "/api/projects/create", params={"project_name": "new_project"}
    )
    assert response.status_code == 200
    assert response.json() == "new_project"
    assert list(sorted(local_storage_path.iterdir())) == [
        local_storage_path / "new_project",
        local_storage_path / "project",
    ]


def test_project_active_get(client_custom_settings: TestClient):
    response = client_custom_settings.get("/api/projects/active")
    assert response.status_code == 200
    assert response.json() == "project"


def test_project_active_set_same(
    tmp_path: Path,
    client_custom_settings: TestClient,
    settings: QualibrateSettings,
):
    config_path = tmp_path / "config.toml"
    client_custom_settings.app.dependency_overrides[get_config_path] = (
        lambda: config_path
    )
    with config_path.open("wb") as fin:
        tomli_w.dump({"qualibrate": settings.model_dump(mode="json")}, fin)
    assert settings.project == "project"
    response = client_custom_settings.post(
        "/api/projects/active", params={"active_project": "project"}
    )
    assert response.status_code == 200
    assert response.json() == "project"
    assert settings.project == "project"


def test_project_active_set_other(
    tmp_path: Path,
    local_storage_path: Path,
    client_custom_settings: TestClient,
    settings: QualibrateSettings,
):
    new_project = "new_project"
    config_path = tmp_path / "config.toml"
    client_custom_settings.app.dependency_overrides[get_config_path] = (
        lambda: config_path
    )
    (local_storage_path / new_project).mkdir()
    with config_path.open("wb") as fin:
        tomli_w.dump({"qualibrate": settings.model_dump(mode="json")}, fin)
    assert settings.project == "project"
    response = client_custom_settings.post(
        "/api/projects/active", params={"active_project": "new_project"}
    )
    assert response.status_code == 200
    assert response.json() == new_project
    assert settings.project == new_project