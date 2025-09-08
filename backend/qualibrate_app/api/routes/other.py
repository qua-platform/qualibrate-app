from importlib.metadata import version
from typing import Annotated, Union

from fastapi import APIRouter, Cookie, Depends
from qualibrate_config.models import QualibrateConfig

from qualibrate_app.api.core.schemas.state_updates import HealthCheck
from qualibrate_app.api.core.utils.runner import get_runner_status
from qualibrate_app.config import get_settings

other_router = APIRouter(tags=["other"])


@other_router.get("/")
def ping() -> str:
    return "pong"


@other_router.get("/health")
def health(
    frontend_version: str,
    settings: Annotated[QualibrateConfig, Depends(get_settings)],
    qualibrate_token: Annotated[
        Union[str, None], Cookie(alias="Qualibrate-Token")
    ] = None,
) -> HealthCheck:
    cookies = (
        {"Qualibrate-Token": qualibrate_token}
        if qualibrate_token is not None
        else {}
    )
    app_v = version("qualibrate_app")
    return HealthCheck(
        backend_version=app_v,
        frontend_version=frontend_version,
        runners_status=get_runner_status(app_v, settings, cookies=cookies),
    )
