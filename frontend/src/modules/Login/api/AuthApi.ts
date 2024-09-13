import { LOGIN } from "./AuthApiRoutes";
import Api, { BASIC_HEADERS } from "../../../utils/api";
import { Res } from "../../../common/interfaces/Api";
import { API_METHODS } from "../../../common/enums/Api";

export class AuthApi extends Api {
  constructor() {
    super();
  }

  static api(path: string): string {
    return this.address + path;
  }

  static login(password: string): Promise<Res<void | string>> {
    return this._fetch(this.api(LOGIN), API_METHODS.POST, {
      headers: BASIC_HEADERS,
      body: JSON.stringify(password),
    });
  }
}
