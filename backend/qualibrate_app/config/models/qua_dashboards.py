from typing import Optional

from qualibrate_config.models.base.config_base import BaseConfig

__all__ = [
    "QuaDashboardConfig",
    "QuaDashboardsConfig",
    "QuaDashboardsConfigTopLevelConfig",
]


class QuaDashboardConfig(BaseConfig):
    url: str


class QuaDashboardsConfig(BaseConfig):
    url: str
    data_visualizer: Optional[QuaDashboardConfig] = None


class QuaDashboardsConfigTopLevelConfig(BaseConfig):
    qua_dashboards: Optional[QuaDashboardsConfig] = None
