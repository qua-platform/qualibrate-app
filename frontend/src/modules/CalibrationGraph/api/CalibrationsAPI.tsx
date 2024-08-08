import Api, { BASIC_HEADERS } from "../../../utils/api";
import { Res } from "../../../common/interfaces/Api";
import { ALL_GRAPHS, GET_WORKFLOW_GRAPH, SUBMIT_WORKFLOW_RUN } from "../../../utils/api/apiRoutes";
import { API_METHODS } from "../../../common/enums/Api";

export class CalibrationsApi extends Api {
  constructor() {
    super();
  }

  static api(path: string): string {
    return this.address + path;
  }

  static fetchAllGraphs(rescan: boolean = false): Promise<Res<void>> {
    return this._fetch(this.api(ALL_GRAPHS()), API_METHODS.GET, {
      headers: BASIC_HEADERS,
      queryParams: { rescan },
    });
  }

  static fetchGraph(name: string): Promise<Res<void>> {
    return this._fetch(this.api(GET_WORKFLOW_GRAPH()), API_METHODS.GET, {
      headers: BASIC_HEADERS,
      queryParams: { name },
    });
  }

  static submitWorkflow(name: string, workflow: unknown): Promise<Res<void>> {
    return this._fetch(this.api(SUBMIT_WORKFLOW_RUN()), API_METHODS.POST, {
      headers: BASIC_HEADERS,
      body: JSON.stringify(workflow),
      queryParams: { name },
    });
  }
}
