import os
import click
import tomli_w
from pathlib import Path

from pydantic_core import Url

from qualibrate.config import QualibrateSettingsSetup


__all__ = ["config_command"]


@click.command(name="config")
@click.option(
    "--config-file",
    type=click.Path(
        exists=False,
        path_type=Path,
    ),
    default=Path().home().joinpath(".qualibrate", "config.toml"),
    show_default=True,
)
@click.option(
    "--static-site-files",
    type=click.Path(
        exists=True,
        file_okay=False,
        dir_okay=True,
        resolve_path=True,
        path_type=Path,
    ),
    default=Path(__file__).parents[2] / "qualibrate_static",
)
@click.option(
    "--user-storage",
    type=click.Path(
        exists=False,
        resolve_path=True,
        path_type=Path,
    ),
    default=Path().home() / ".qualibrate" / "user_storage",
    help="Path to user storage directory with qualibrate data.",
    show_default=True,
)
@click.option(
    "--timeline-db-address",
    type=str,  # TODO: add type check for addr
    default="http://localhost:8000/",
    show_default=True,
)
@click.option(
    "--timeline-db-timeout",
    type=float,
    default=1.0,
    show_default=True,
)
# TODO: remove this when multi db will work
@click.option(
    "--timeline-db-name",
    type=str,
    default="new_db",
    show_default=True,
)
@click.option(
    "--timeline-db-metadata-out-path",
    type=str,
    default="data_path",
    show_default=True,
)
def config_command(
    config_file: Path,
    static_site_files: Path,
    user_storage: Path,
    timeline_db_address: str,
    timeline_db_timeout: float,
    timeline_db_name: str,
    timeline_db_metadata_out_path: str,
) -> None:
    # TODO: read from config file if exists
    #   get source of value
    #       (ParameterSource.COMMANDLINE, ParameterSource.DEFAULT, ...)
    #   {k: ctx.get_parameter_source(k) for k in ctx.params.keys()}
    qs = QualibrateSettingsSetup(
        static_site_files=static_site_files,
        user_storage=user_storage,
        timeline_db_address=Url(timeline_db_address),
        timeline_db_timeout=timeline_db_timeout,
        timeline_db_name=timeline_db_name,
        timeline_db_metadata_out_path=timeline_db_metadata_out_path,
    )
    exported_data = qs.model_dump()
    click.echo(f"Config file path: {config_file}")
    click.echo(click.style("Generated config:", bold=True))
    max_key_len = max(map(len, map(str, exported_data.keys())))
    click.echo(
        os.linesep.join(
            str(f"{k:<{max_key_len}} : {v}") for k, v in exported_data.items()
        )
    )
    confirmed = click.confirm("Do you confirm config?", default=True)
    if not confirmed:
        click.echo(
            click.style(
                (
                    "The configuration has not been confirmed. "
                    "Rerun config script."
                ),
                fg="yellow",
            )
        )
        exit(1)
    qs.user_storage.mkdir(parents=True, exist_ok=True)
    if not config_file.parent.exists():
        config_file.parent.mkdir(parents=True)
    with config_file.open("wb") as fin:
        tomli_w.dump(exported_data, fin)
