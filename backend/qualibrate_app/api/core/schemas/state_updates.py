from collections.abc import Mapping
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, computed_field


class StateUpdate(BaseModel):
    model_config = ConfigDict(extra="ignore")

    key: str
    old: Any
    new: Any = None
    updated: bool = False


class StateUpdates(BaseModel):
    state_updates: Mapping[str, StateUpdate]


class StateUpdateRequestItem(BaseModel):
    data_path: str = Field(
        min_length=3, pattern="^#/.*", examples=["#/qubits/q0/frequency"]
    )
    value: Any


class StateUpdateRequestItems(BaseModel):
    items: list[StateUpdateRequestItem]


class RunnerVersionValid(BaseModel):
    url: HttpUrl
    version: str
    is_valid: bool


class HealthCheck(BaseModel):
    frontend_version: str
    backend_version: str
    runners_status: list[RunnerVersionValid]

    @computed_field
    def is_valid(self) -> bool:
        return self.frontend_version.lstrip("v") == self.backend_version
