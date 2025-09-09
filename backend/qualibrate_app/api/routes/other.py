from importlib.metadata import version
from typing import Annotated, Union

from fastapi import APIRouter, Cookie, Depends, Query
from qualibrate_config.models import QualibrateConfig

from qualibrate_app.api.core.schemas.health import HealthCheck
from qualibrate_app.api.core.utils.runner import get_runner_status
from qualibrate_app.config import get_settings

other_router = APIRouter(tags=["other"])


@other_router.get("/")
def ping() -> str:
    return "pong"


@other_router.get(
    "/health",
    summary="Health and version compatibility check",
    response_model=HealthCheck,
    responses={
        200: {
            "description": "Health snapshot",
            "content": {
                "application/json": {
                    "examples": {
                        "ok_all_match": {
                            "summary": (
                                "All services healthy and versions match"
                            ),
                            "value": {
                                "frontend_version": "v1.4.0",
                                "backend_version": "1.4.0",
                                "runner_status": {
                                    "url": "https://runner.example.com",
                                    "version": "1.4.0",
                                    "is_valid": True,
                                },
                                "is_valid": True,
                            },
                        },
                        "runner_down_or_mismatch": {
                            "summary": "Runner down or incompatible version",
                            "value": {
                                "frontend_version": "v1.5.0",
                                "backend_version": "1.4.0",
                                "runner_status": {
                                    "url": "http://localhost:9000",
                                    "version": None,
                                    "is_valid": False,
                                },
                                "is_valid": False,
                            },
                        },
                    }
                }
            },
        }
    },
)
def health(
    frontend_version: Annotated[
        str,
        Query(
            ...,
            description=(
                "Client supplied frontend version. A leading 'v' is allowed "
                "and will be ignored for the comparison. Should be extracted "
                "from `manifest.json`"
            ),
            examples=["v1.4.0", "1.4.0"],
        ),
    ],
    settings: Annotated[QualibrateConfig, Depends(get_settings)],
    qualibrate_token: Annotated[
        Union[str, None],
        Cookie(
            alias="Qualibrate-Token",
            description=(
                "Session token, forwarded to Runner for authenticated "
                "meta calls."
            ),
        ),
    ] = None,
) -> HealthCheck:
    """
    Returns backend version, compares it to the provided frontend version, and
    reports Runner reachability and version compatibility.
    """
    cookies = (
        {"Qualibrate-Token": qualibrate_token}
        if qualibrate_token is not None
        else {}
    )
    app_v = version("qualibrate_app")
    return HealthCheck(
        backend_version=app_v,
        frontend_version=frontend_version,
        runner_status=get_runner_status(app_v, settings, cookies=cookies),
    )
