import { API_METHODS } from "../../DEPRECATED_common/DEPRECATED_enum/Api";
import { Res } from "../../DEPRECATED_common/DEPRECATED_interfaces/Api";
import { FetchOptions, GETOptions, RequestEntry } from "./types";
import { makeTemporaryDownloadLink } from "../fileHelpers";

export const AUTH_HEADER = {
  Authorization: "Basic bWVhc3VyZW1lbnQ6ZW50YW5nbGU=",
};

export const BASIC_HEADERS = {
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*",
  ...AUTH_HEADER,
};

export const API_ADDRESS = "api/v0/";

export type ErrorObject = {
  error: string;
};

export default class Api {
  static get address(): string {
    return process.env.API_URL ?? "/";
  }

  static api(path: string): string {
    return this.address + API_ADDRESS + path;
  }

  private static async setupOkResponse(res: Response, message?: string) {
    let result = undefined;
    try {
      result = await res.json();
    } catch (e) {}

    return {
      isOk: true,
      result,
      message,
    };
  }

  private static async setupErrorResponse(res: Response, message?: string) {
    return {
      isOk: false,
      error: await res.json(),
      message,
    };
  }

  private static async getResult<P>(res: Response): Promise<Res<P>> {
    return res.ok ? this.setupOkResponse(res) : this.setupErrorResponse(res);
  }

  static divideProperties(props: GETOptions, extractArrays = false) {
    return Object.fromEntries(Object.entries(props).filter(([, value]) => (extractArrays ? Array.isArray(value) : !Array.isArray(value))));
  }

  static formQuery(options: GETOptions = {}) {
    if (!options || !Object.keys(options).length) {
      return "";
    }

    const arrayProperties = this.divideProperties(options, true) as {
      [key: string]: [any];
    };

    if (!Object.keys(arrayProperties).length) {
      return "?" + new URLSearchParams(options);
    }

    const plainProperties = this.divideProperties(options, false);

    const plainParams = new URLSearchParams(plainProperties);

    const arrayQuery = Object.keys(arrayProperties)
      .map((arrayName) => arrayProperties[arrayName].map((value) => `&${arrayName}=${value}`))
      .join("")
      .replace(/,/g, "");

    return `?${plainParams}${arrayQuery}`;
  }

  static async pingURL(url: string): Promise<Res> {
    try {
      const res = await fetch(url, {
        method: API_METHODS.GET,
        // headers: { ...BASIC_HEADERS },
        // credentials: "include",
      });

      return this.getResult(res);
    } catch (e) {
      return {
        isOk: false,
        error: "" + e,
      };
    }
  }

  static async _fetch<P>(path: string, method: API_METHODS, options?: FetchOptions): Promise<Res<P>> {
    const { queryParams, body, ...restOptions } = options || {};
    const urlQuery = this.formQuery(queryParams);

    try {
      const res = await fetch(`${path}${urlQuery}`, {
        method: method,
        headers: { ...BASIC_HEADERS, "Content-Type": "application/json" },
        body,
        credentials: "include",
        ...restOptions,
      });

      return this.getResult(res);
    } catch (e) {
      return {
        isOk: false,
        error: "" + e,
      };
    }
  }
  static async fetchData<P>(path: string, method: API_METHODS, options?: FetchOptions): Promise<P | ErrorObject> {
    const { queryParams, body, ...restOptions } = options || {};
    const urlQuery = this.formQuery(queryParams);

    try {
      const response = await fetch(`${path}${urlQuery}`, {
        method: method,
        headers: { ...BASIC_HEADERS, "Content-Type": "application/json" },
        body,
        credentials: "include",
        ...restOptions,
      });

      const data = await response.json();
      if (!response.ok) {
        //throw new Error(`Request failed with status ${response.status}`);
        return {
          error: `${data?.detail[0].msg}`,
        } as ErrorObject;
      }

      return data as P;
    } catch (e) {
      return {
        error: `${e}`,
      } as ErrorObject;
    }
  }

  static async fetch<P>([path, method]: RequestEntry, options?: FetchOptions): Promise<Res<P>> {
    const { queryParams, body, ...restOptions } = options || {};
    const urlQuery = this.formQuery(queryParams);

    try {
      const res = await fetch(this.api(`${path}${urlQuery}`), {
        method,
        headers: { ...BASIC_HEADERS, "Content-Type": "application/json" },
        body,
        credentials: "include",
        ...restOptions,
      });

      return this.getResult(res);
    } catch (e) {
      return {
        isOk: false,
        error: "" + e,
      };
    }
  }

  static async downloadFile(fullPath: string, defaultFileName: string, options: { [key: string]: any } = {}): Promise<Res> {
    return new Promise((resolve) => {
      let fileName = defaultFileName;
      fetch(fullPath, {
        method: API_METHODS.GET,
        headers: {
          ...BASIC_HEADERS,
        },
        ...options,
      })
        .then((response) => {
          try {
            const header = response.headers.get("Content-Disposition");
            const parts = header!.split(";");
            fileName = parts[1].split("=")[1].replaceAll('"', "");
          } catch (e) {}
          if (response.ok) {
            return response.blob();
          } else {
            return Promise.reject(response.statusText);
          }
        })
        .then((blob) => {
          const fileUrl = window.URL.createObjectURL(new Blob([blob]));
          makeTemporaryDownloadLink(fileUrl, fileName);
          resolve({ isOk: true });
        })
        .catch((err) => resolve({ isOk: false, error: err }));
    });
  }

  // static fetchFunc = <Data, Args>(req: (args: Args) => RequestEntry) => {
  //   return (args: Args): Promise<Res<Data>> => {
  //     return this.fetch(req(args));
  //   };
  // };
}
