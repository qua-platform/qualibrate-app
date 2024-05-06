import Api, { BASIC_HEADERS } from "../../../utils/api";
import { Res } from "../../../DEPRECATED_common/DEPRECATED_interfaces/Api";
import { ALL_SNAPSHOTS, ONE_SNAPSHOT, SNAPSHOT_DIFF, SNAPSHOT_RESULT } from "../../../utils/api/apiRoutes";
import { API_METHODS } from "../../../DEPRECATED_common/DEPRECATED_enum/Api";
import { SnapshotDTO } from "../SnapshotDTO";

export class SnapshotsApi extends Api {
  constructor() {
    super();
  }

  static api(path: string): string {
    return this.address + path;
  }

  static fetchAllSnapshots(pageNumber: number): Promise<
    Res<{
      items: SnapshotDTO[];
      per_page: number;
      total_items: number;
      total_pages: number;
    }>
  > {
    return this._fetch(this.api(ALL_SNAPSHOTS({ pageNumber })), API_METHODS.GET, {
      headers: BASIC_HEADERS,
    });
  }
  static fetchSnapshot(id: string): Promise<Res<void>> {
    return this._fetch(this.api(ONE_SNAPSHOT(id)), API_METHODS.GET, {
      headers: BASIC_HEADERS,
    });
  }
  static fetchSnapshotResult(id: string): Promise<Res<void>> {
    return this._fetch(this.api(SNAPSHOT_RESULT(id)), API_METHODS.GET, {
      headers: BASIC_HEADERS,
    });
  }
  static fetchSnapshotUpdate(currentId: string, newId: string): Promise<Res<void>> {
    return this._fetch(this.api(SNAPSHOT_DIFF(currentId, newId)), API_METHODS.GET, {
      headers: BASIC_HEADERS,
    });
  }
}