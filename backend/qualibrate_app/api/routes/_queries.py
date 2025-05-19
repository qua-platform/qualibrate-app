from collections.abc import Sequence
from typing import Annotated, Optional, Union

from fastapi import Depends, Query
from pydantic import BaseModel

from qualibrate_app.api.core.types import PageSearchFilter
from qualibrate_app.api.dependencies.search import get_search_path


class SnapshotsDataQuery(BaseModel):
    # TODO: separate search nodes and search data
    data_path: Annotated[
        Optional[Sequence[Union[str, int]]], Depends(get_search_path)
    ] = None
    filter_no_change: Annotated[
        bool,
        Query(True, description="Show only changes. Used only for data path"),
    ]


class FilteredSnapshotsDataQuery(PageSearchFilter, SnapshotsDataQuery):
    pass
