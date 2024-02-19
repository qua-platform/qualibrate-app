from typing import Optional, Mapping, Any, Callable

import requests
from functools import partial
from fastapi import HTTPException

from qualibrate.config import get_settings


HTTPException422 = partial(HTTPException, status_code=422)


def get_with_db(
    url: str,
    *,
    params: Optional[Mapping[str, Any]] = None,
    db_name: Optional[str] = None,
    timeout: Optional[float] = None,
    method: Callable[..., requests.Response] = requests.get,
    **kwargs: Any,
) -> requests.Response:
    settings = get_settings()
    db_name = db_name if db_name is not None else settings.timeline_db_name
    timeout = timeout if timeout is not None else settings.timeline_db_timeout
    if params is None:
        params = {"db_name": db_name}
    else:
        params = dict(params)
        params["db_name"] = db_name
    result = method(
        url,
        params=params,
        timeout=timeout,
        **kwargs,
    )
    return result