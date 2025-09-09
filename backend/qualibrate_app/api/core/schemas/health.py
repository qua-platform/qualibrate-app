from typing import Optional

from packaging.version import InvalidVersion, Version
from pydantic import BaseModel, ConfigDict, Field, HttpUrl, computed_field


class RunnerVersionValid(BaseModel):
    """
    Status payload describing the Runner service that the app talks to.

    Use it to surface the runner URL we tried, what version it reported,
    and whether that version matches the app contract.
    """

    model_config = ConfigDict(
        title="RunnerVersionValid",
        json_schema_extra={
            "examples": [
                {
                    "url": "https://runner.example.com",
                    "version": "1.4.0",
                    "is_valid": True,
                },
                {
                    "url": "http://localhost:9000",
                    "version": None,
                    "is_valid": False,
                },
            ]
        },
    )

    url: Optional[HttpUrl] = Field(
        default=None,
        description="Base URL of the Runner service that was contacted.",
    )
    version: Optional[str] = Field(
        default=None,
        description="Semantic version string returned by Runner meta endpoint.",
        examples=["1.4.0", "v1.4.0"],
    )
    is_valid: bool = Field(
        description="True if Runner version is compatible with the app."
    )


class HealthCheck(BaseModel):
    """
    End to end health snapshot joining frontend, backend, and Runner status.

    The `is_valid` field confirms that the frontend and backend versions match
    after stripping a leading 'v' from the frontend string.
    """

    model_config = ConfigDict(
        title="HealthCheck",
        json_schema_extra={
            "examples": [
                {
                    "frontend_version": "v1.4.0",
                    "backend_version": "1.4.0",
                    "runner_status": {
                        "url": "https://runner.example.com",
                        "version": "1.4.0",
                        "is_valid": True,
                    },
                    "is_valid": True,
                },
                {
                    "frontend_version": "v1.5.0",
                    "backend_version": "1.4.0",
                    "runner_status": {
                        "url": "http://localhost:9000",
                        "version": None,
                        "is_valid": False,
                    },
                    "is_valid": False,
                },
            ]
        },
    )

    frontend_version: str = Field(
        description=(
            "Version string from the frontend client, often prefixed with 'v'."
        ),
        examples=["v1.4.0", "1.4.0"],
    )
    backend_version: str = Field(
        description="Installed backend package version.",
        examples=["1.4.0"],
    )
    runner_status: RunnerVersionValid
    "Status of the external Runner service."

    @computed_field
    def is_valid(self) -> bool:
        """
        True if the frontend and backend versions match, ignoring a leading 'v'.
        """
        try:
            Version(self.frontend_version)
        except InvalidVersion:
            return False
        return self.frontend_version.lstrip("v") == self.backend_version
