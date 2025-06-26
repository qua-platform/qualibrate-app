from collections import defaultdict
from datetime import date
from itertools import chain
from pathlib import Path
from typing import Optional

from qualibrate_app.api.core.types import IdType, SearchFilter
from qualibrate_app.api.core.utils.path.node import NodePath

__all__ = ["NodesInfoStorage", "PROJECT2STORAGE", "get_storage_by_project"]


class NodesInfoStorage:
    def __init__(self, project_name: str, project_path: Path) -> None:
        self._project_name = project_name
        self._project_path = project_path
        self._date2id: defaultdict[date, list[IdType]] = defaultdict(list)
        self._name2id: defaultdict[str, list[IdType]] = defaultdict(list)
        self._size = 0
        self._fill_full()

    def _add_node(self, node_path: NodePath) -> None:
        node_id = node_path.id
        if node_id is None:
            return
        self._date2id[node_path.date].append(node_id)
        self._name2id[node_path.node_name].append(node_id)

    def _fill_full(self) -> None:
        for node_dir in self._project_path.glob("*/#*"):
            if not node_dir.is_dir():
                continue
            try:
                node_path = NodePath(node_dir)
            except ValueError:
                continue
            self._add_node(node_path)
        self._update_size()

    def _fill_date(self, dt: Optional[date] = None) -> None:
        if dt is None:
            dt = date.today()
        today_dir = self._project_path / dt.isoformat()
        if not today_dir.is_dir():
            return
        max_exists_node_id = max(self._date2id.get(dt, []), default=-1)
        today_nodes = []
        for node_dir in today_dir.glob("#*"):
            if not node_dir.is_dir():
                continue
            try:
                node_path = NodePath(node_dir)
            except ValueError:
                continue
            today_nodes.append(node_path)
        to_add: list[NodePath] = list(
            filter(
                lambda node: node.id and (node.id > max_exists_node_id),
                today_nodes,
            )
        )
        if len(to_add) == 0:
            return
        for node_path in to_add:
            self._add_node(node_path)
        self._update_size()

    def _update_size(self) -> None:
        self._size = sum(map(len, self._name2id.values()))

    def _get_suited_ids_by_name_part(self, name_part: str) -> set[IdType]:
        return set(
            chain.from_iterable(
                [
                    ids
                    for name, ids in self._name2id.items()
                    if name_part in name
                ]
            )
        )

    def _get_suited_ids_by_date(
        self,
        date_start: Optional[date] = None,
        date_end: Optional[date] = None,
    ) -> set[IdType]:
        date_start = date_start or date.min
        date_end = date_end or date.max
        if date_start > date_end:
            return set()
        return set(
            chain.from_iterable(
                [
                    ids
                    for dt, ids in self._date2id.items()
                    if date_start <= dt <= date_end
                ]
            )
        )

    def _get_suited_ids_by_id_range(
        self,
        min_id: Optional[int] = None,
        max_id: Optional[int] = None,
    ) -> set[IdType]:
        ids: chain[IdType] = chain.from_iterable(self._date2id.values())
        if min_id is None and max_id is None:
            return set(ids)
        if min_id is not None and max_id is not None:
            return set(filter(lambda id: min_id <= id <= max_id, ids))
        if min_id is not None:
            return set(filter(lambda id: min_id <= id, ids))
        if max_id is not None:
            return set(filter(lambda id: id <= max_id, ids))
        raise RuntimeError("Unexpected case")

    def get_ids(
        self,
        filters: Optional[SearchFilter] = None,
    ) -> set[IdType]:
        self._fill_date()
        if filters is None:
            return self._get_suited_ids_by_id_range()
        if (
            filters.min_node_id
            and filters.max_node_id
            and filters.min_node_id > filters.max_node_id
        ):
            return set()
        allowed_ids: Optional[set[IdType]] = None
        if filters.name_part:
            allowed_ids = self._get_suited_ids_by_name_part(filters.name_part)
        if allowed_ids is not None and len(allowed_ids) == 0:
            return set()
        if filters.min_date or filters.max_date:
            suited_ids_by_date = self._get_suited_ids_by_date(
                filters.min_date, filters.max_date
            )
            if allowed_ids is not None:
                allowed_ids &= suited_ids_by_date
            else:
                allowed_ids = suited_ids_by_date
        suited_ids_by_range = self._get_suited_ids_by_id_range(
            filters.min_node_id, filters.max_node_id
        )
        if allowed_ids is not None:
            allowed_ids &= suited_ids_by_range
        else:
            allowed_ids = suited_ids_by_range
        return allowed_ids

    def __len__(self) -> int:
        return self._size


PROJECT2STORAGE: dict[str, NodesInfoStorage] = {}


def get_storage_by_project(
    project_name: str, project_path: Path
) -> NodesInfoStorage:
    if project_name not in PROJECT2STORAGE:
        PROJECT2STORAGE[project_name] = NodesInfoStorage(
            project_name, project_path
        )
    return PROJECT2STORAGE[project_name]
