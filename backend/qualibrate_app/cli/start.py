import os
from pathlib import Path

import click
from qualibrate_config.vars import (
    DEFAULT_CONFIG_FILENAME,
    QUALIBRATE_PATH,
)

from qualibrate_app.config import CONFIG_PATH_ENV_NAME
from qualibrate_app.config.vars import CORS_ORIGINS_ENV_NAME


@click.command(name="start")
@click.option(
    "--config-path",
    type=click.Path(
        exists=True,
        file_okay=True,
        dir_okay=True,
        path_type=Path,
    ),
    default=QUALIBRATE_PATH / DEFAULT_CONFIG_FILENAME,
    help="Path to `config.toml` file",
    show_default=True,
)
@click.option(
    "--reload", is_flag=True, hidden=True
)  # env QUALIBRATE_START_RELOAD
@click.option(
    "--port",
    type=int,
    default=8001,
    show_default=True,
    help="Application will be started on the given port",
)  # env QUALIBRATE_START_PORT
@click.option(
    "--cors-origin",
    type=str,
    multiple=True,
    help="CORS origin to use. Can be passed multiple times.",
)
def start_command(
    config_path: Path,
    port: int,
    reload: bool,
    cors_origin: list[str],
) -> None:
    os.environ[CONFIG_PATH_ENV_NAME] = str(config_path)
    if len(cors_origin) != 0:
        os.environ[CORS_ORIGINS_ENV_NAME] = ",".join(cors_origin)

    from qualibrate_app.app import main as app_main

    app_main(port=port, reload=reload)
