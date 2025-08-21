from typing import Optional

from qualibrate_app.api.core.domain.bases.snapshot import SnapshotLoadTypeFlag
from qualibrate_app.api.core.types import IdType

LATEST_REQUESTED_DATA: Optional[IdType] = None


def update_latest_data_id_if_requested(
    id: Optional[IdType], load_type_flag: SnapshotLoadTypeFlag
) -> None:
    global LATEST_REQUESTED_DATA
    if load_type_flag.is_set(SnapshotLoadTypeFlag.DataWithoutRefs):
        LATEST_REQUESTED_DATA = id


def get_latest_requested_data() -> Optional[IdType]:
    global LATEST_REQUESTED_DATA
    return LATEST_REQUESTED_DATA
