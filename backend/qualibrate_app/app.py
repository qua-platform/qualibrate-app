import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware

from qualibrate_app.api.__main__ import api_router
from qualibrate_app.api.exceptions.middleware import (
    QualibrateCatchExcMiddleware,
)
from qualibrate_app.config.resolvers import get_config_path, get_settings

try:
    from json_timeline_database.app import app as json_timeline_db_app
except ImportError:
    json_timeline_db_app = None
try:
    from qualibrate_runner.app import app as runner_app
except ImportError:
    runner_app = None


app = FastAPI(
    title="Qualibrate",
    openapi_url="/qm_app_openapi.json",
    docs_url="/qm_app_docs",
)
_settings = get_settings(get_config_path())

origins = [
    "http://localhost:8002",
    "http://localhost:8001",
    "http://127.0.0.1:8002",
    "http://127.0.0.1:8001",
]

app.add_middleware(QualibrateCatchExcMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

# Directory should exist
app.mount(
    "/",
    StaticFiles(directory=_settings.static_site_files, html=True),
    name="static",
)


def main(port: int, reload: bool) -> None:
    uvicorn.run("qualibrate_app.app:app", port=port, reload=reload)


if __name__ == "__main__":
    main(port=8001, reload=False)
