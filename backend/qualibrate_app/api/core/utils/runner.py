from collections.abc import MutableMapping
from typing import Any, Optional
from urllib.parse import urljoin

import requests
from packaging.version import Version
from qualibrate_config.models import QualibrateConfig

from qualibrate_app.api.core.schemas.state_updates import RunnerVersionValid
from qualibrate_app.api.core.utils.request_utils import get_runner_config

APP2RUNNER_VERSIONS: dict[Version, tuple[Version, Version]] = {
    Version("0.3.6"): (Version("0.3.6"), Version("0.4.0")),
}


def validate_runner_version(
    app_version: str, runner_version: Optional[str]
) -> bool:
    if runner_version is None:
        return False
    app_v = Version(app_version)
    runner_range = APP2RUNNER_VERSIONS.get(app_v)
    if runner_range is None:
        runner_range = APP2RUNNER_VERSIONS.get(Version(app_v.base_version))
    if runner_range is None:
        return False
    runner_v = Version(runner_version)
    return runner_range[0] <= runner_v <= runner_range[1]


def get_runner_statuses(
    app_version: str,
    settings: QualibrateConfig,
    cookies: MutableMapping[str, Any],
) -> list[RunnerVersionValid]:
    try:
        runner_config = get_runner_config(settings)
    except RuntimeError:
        return []
    response = requests.get(
        urljoin(runner_config.address_with_root, "meta"),
        cookies=cookies,
        timeout=runner_config.timeout,
    )
    if response.status_code != requests.codes.ok:
        return []
    try:
        data = response.json()
        runner_v = data.get("version")
        return [
            RunnerVersionValid(
                version=runner_v,
                url=runner_config.address,  # type: ignore[arg-type] # TODO
                is_valid=validate_runner_version(app_version, runner_v),
            )
        ]
    except requests.exceptions.JSONDecodeError:
        return []
