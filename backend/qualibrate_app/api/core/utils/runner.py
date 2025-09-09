from collections.abc import MutableMapping
from typing import Any, Optional
from urllib.parse import urljoin

import requests
from packaging.version import Version
from qualibrate_config.models import QualibrateConfig

from qualibrate_app.api.core.schemas.health import RunnerVersionValid
from qualibrate_app.api.core.utils.request_utils import get_runner_config
from qualibrate_app.versions_matching import APP2RUNNER_VERSIONS


def validate_runner_version(
    app_version: str, runner_version: Optional[str]
) -> bool:
    """Validate that a Runner version is compatible with the app version.

    The validation is based on the mapping defined in
    ``APP2RUNNER_VERSIONS``. Each app version corresponds to a minimum
    and maximum supported Runner version. Pre-release Runner versions
    are handled specially: they are allowed only if they are not below
    the minimum required app base version and not above the maximum
    supported Runner version.

    Args:
        app_version (str): The backend app version string, e.g. "1.4.0".
        runner_version (Optional[str]): The version string reported by
            the Runner service. If ``None``, the function immediately
            returns ``False``.

    Returns:
        bool: True if the Runner version is valid for the given app
        version, otherwise False.

    Examples:
        >>> validate_runner_version("1.4.0", "1.4.0")
        True
        >>> validate_runner_version("1.4.0", None)
        False
        >>> validate_runner_version("1.4.0", "2.0.0")
        False
    """
    if runner_version is None:
        return False
    app_v = Version(app_version)
    runner_range = APP2RUNNER_VERSIONS.get(app_v)
    if runner_range is None:
        runner_range = APP2RUNNER_VERSIONS.get(Version(app_v.base_version))
    if runner_range is None:
        return False
    runner_v = Version(runner_version)
    if not runner_v.is_prerelease:
        return runner_range[0] <= runner_v <= runner_range[1]
    return (
        runner_range[0] <= Version(app_v.base_version)
        and runner_v <= runner_range[1]
    )


def get_runner_status(
    app_version: str,
    settings: QualibrateConfig,
    cookies: MutableMapping[str, Any],
) -> RunnerVersionValid:
    """
    Query the Runner meta endpoint and validate its version against the app.

    Args:
        app_version: Backend application version used as the contract reference.
        settings: App configuration that includes Runner address and timeout.
        cookies: Auth cookies to forward to the Runner call.

    Returns:
        Runner base URL, reported version, and compatibility flag.

    Notes:
        If the Runner is unreachable or returns a non OK status,
        the result will carry `is_valid=False` and `version=None`.
    """
    try:
        runner_config = get_runner_config(settings)
    except RuntimeError:
        return RunnerVersionValid(
            version=None,
            url=None,
            is_valid=False,
        )
    invalid_runner = RunnerVersionValid(
        version=None,
        url=runner_config.address,
        is_valid=False,
    )
    try:
        response = requests.get(
            urljoin(runner_config.address_with_root, "meta"),
            cookies=cookies,
            timeout=runner_config.timeout,
        )
    except requests.exceptions.RequestException:
        return invalid_runner
    if response.status_code != requests.codes.ok:
        return invalid_runner
    try:
        data = response.json()
        runner_v = data.get("version")
        return RunnerVersionValid(
            version=runner_v,
            url=runner_config.address,
            is_valid=validate_runner_version(app_version, runner_v),
        )

    except requests.exceptions.JSONDecodeError:
        return invalid_runner
