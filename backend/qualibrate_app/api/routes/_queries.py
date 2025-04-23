from typing import Annotated

from fastapi import Query

from qualibrate_app.api.core.types import PageSearchFilter


class SearchAllSnapshotsQuery(PageSearchFilter):
    data_path: Annotated[str, Query(description="Path to search")]
    filter_no_change: Annotated[
        bool, Query(True, description="Show only changes")
    ]
