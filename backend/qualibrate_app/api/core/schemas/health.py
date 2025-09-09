from typing import Optional

from packaging.version import InvalidVersion, Version
from pydantic import BaseModel, HttpUrl, computed_field


class RunnerVersionValid(BaseModel):
    url: Optional[HttpUrl]
    version: Optional[str]
    is_valid: bool


class HealthCheck(BaseModel):
    frontend_version: str
    backend_version: str
    runner_status: RunnerVersionValid

    @computed_field
    def is_valid(self) -> bool:
        try:
            Version(self.frontend_version)
        except InvalidVersion:
            return False
        return self.frontend_version.lstrip("v") == self.backend_version
