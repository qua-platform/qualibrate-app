from packaging.version import Version

APP2RUNNER_VERSIONS: dict[Version, tuple[Version, Version]] = {
    Version("0.3.6"): (Version("0.3.6"), Version("0.4.0")),
    Version("0.4.0"): (Version("0.4.0"), Version("0.4.0")),
}
