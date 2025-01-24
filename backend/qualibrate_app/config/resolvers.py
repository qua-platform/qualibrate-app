import os
import warnings
from functools import lru_cache, partial
from pathlib import Path
from typing import Annotated, Optional

from fastapi import Depends
from qualibrate_config.models import (
    QualibrateConfig,
)
from qualibrate_config.resolvers import (
    get_config_model,
    get_qualibrate_config,
    get_qualibrate_config_path,
)

from qualibrate_app.config.models.qua_dashboards import (
    QuaDashboardsConfig,
    QuaDashboardsConfigTopLevelConfig,
)
from qualibrate_app.config.vars import (
    CONFIG_PATH_ENV_NAME,
)


@lru_cache
def get_config_path() -> Path:
    path = os.environ.get(CONFIG_PATH_ENV_NAME)
    if path is not None:
        return Path(path)
    return get_qualibrate_config_path()


@lru_cache
def get_settings(
    config_path: Annotated[Path, Depends(get_config_path)],
) -> QualibrateConfig:
    return get_qualibrate_config(config_path)


@lru_cache
def get_quam_state_path(
    settings: Annotated[QualibrateConfig, Depends(get_settings)],
) -> Optional[Path]:
    root = settings.__class__._root
    if root is None:
        return None
    quam_state_path = root._raw_dict.get("quam", {}).get("state_path")
    if quam_state_path is not None:
        return Path(quam_state_path)
    active_machine_path = root._raw_dict.get("active_machine", {}).get("path")
    if active_machine_path is None:
        return None
    warnings.warn(
        (
            'The config entry "active_machine.path" has been deprecated in '
            'favor of "quam.state_path". Please update the qualibrate config '
            "(~/.qualibrate/config.toml) accordingly."
        ),
        DeprecationWarning,
        stacklevel=2,
    )
    return Path(active_machine_path)


@lru_cache
def get_qua_dashboards_config(
    config_path: Annotated[Path, Depends(get_config_path)],
) -> Optional[QuaDashboardsConfig]:
    """Retrieve the Qua dashboards configuration.

    Args:
        config_path: Path to the configuration file.

    Returns:
        An instance of QuaDashboardsConfig with the loaded configuration if
        possible. Otherwise, None.

    Raises:
        RuntimeError: If the configuration file cannot be read or if the
            configuration state is invalid.
    """
    get_config_model_part = partial(
        get_config_model,
        config_path,
        config_key=None,
        config_class=QuaDashboardsConfigTopLevelConfig,
    )
    error_msg = (
        "Qualibrate app was unable to load the qua dashboards config. "
        "Please fill related config parts"
    )
    try:
        model = get_config_model_part()
    except (RuntimeError, ValueError) as ex:
        raise RuntimeError(error_msg) from ex
    return model.qua_dashboards
