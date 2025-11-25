import dispatchRequest from "./dispatchRequest";
import InterceptorManager from "./InterceptorManager";
import {
  RejectedFn,
  RequestConfig,
  RequestOptions,
  RequestPromise,
  RequestResponse,
  ResolvedFn,
} from "./types";

interface Interceptors {
  request: InterceptorManager<RequestConfig>;
  response: InterceptorManager<RequestResponse>;
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: RequestConfig) => RequestPromise);
  rejected?: RejectedFn;
}

class Request {
  defaults: RequestOptions;
  interceptors: Interceptors;

  constructor(options: RequestOptions) {
    this.defaults = options;
    this.interceptors = {
      request: new InterceptorManager<RequestConfig>(),
      response: new InterceptorManager<RequestResponse>(),
    };
    if (options.requestInterceptors?.length) {
      options.requestInterceptors.map((i) => this.interceptors.request.use(i));
    }
    if (options.responseInterceptors?.length) {
      options.responseInterceptors.map((i) =>
        this.interceptors.response.use(i),
      );
    }
  }

  request(url: any, config?: any): RequestPromise {
    if (typeof url === "string") {
      config = config || {};
      config.url = url;
    } else {
      config = url || {};
    }
    config = Object.assign({}, this.defaults, config);
    if (typeof config?.header === "function") {
      config.headers = config.header();
    }

    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined,
      },
    ];

    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor);
    });

    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor);
    });

    let promise = Promise.resolve(config);

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!;
      promise = promise.then(resolved, rejected);
    }
    return promise;
  }

  public get(url: RequestConfig): RequestPromise;
  public get(url: string, config?: RequestConfig): RequestPromise;
  public get(url: any, config?: RequestConfig): RequestPromise {
    config = this.defaultUrl(config);
    if (typeof url === "string") {
      config.url = url;
    } else {
      config = url;
    }
    if (!config?.url) {
      return Promise.reject(new Error("url is required"));
    }
    return this._requestMethodWithoutData("GET", config.url, config);
  }

  public post(url: RequestConfig): RequestPromise;
  public post(url: string, data?: any, config?: RequestConfig): RequestPromise;
  public post(url: any, data?: any, config?: RequestConfig): RequestPromise {
    config = this.defaultUrl(config);
    if (typeof url === "string") {
      config.url = url;
      if (data) {
        config.data = data;
      }
    } else {
      config = url;
    }
    if (!config?.url) {
      return Promise.reject(new Error("url is required"));
    }
    return this._requestMethodWithData("POST", config.url, config.data, config);
  }

  public delete(url: RequestConfig): RequestPromise;
  public delete(url: string, config?: RequestConfig): RequestPromise;
  public delete(url: any, config?: RequestConfig): RequestPromise {
    config = this.defaultUrl(config);
    if (typeof url === "string") {
      config.url = url;
    } else {
      config = url;
    }
    if (!config?.url) {
      return Promise.reject(new Error("url is required"));
    }
    return this._requestMethodWithoutData("DELETE", config.url, config);
  }

  public options(url: string, config?: RequestConfig): RequestPromise {
    return this._requestMethodWithoutData("OPTIONS", url, config);
  }

  public put(url: RequestConfig): RequestPromise;
  public put(url: string, data?: any, config?: RequestConfig): RequestPromise;
  public put(url: any, data?: any, config?: RequestConfig): RequestPromise {
    config = this.defaultUrl(config);
    if (typeof url === "string") {
      config.url = url;
      if (data) {
        config.data = data;
      }
    } else {
      config = url;
    }
    if (!config?.url) {
      return Promise.reject(new Error("url is required"));
    }
    return this._requestMethodWithData("PUT", config.url, config.data, config);
  }

  private defaultUrl(config?: RequestConfig) {
    if (config) return config;
    return { url: "/" };
  }

  private _requestMethodWithoutData(
    method: IMethod,
    url: string,
    config?: RequestConfig,
  ): RequestPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
      }),
    );
  }

  private _requestMethodWithData(
    method: IMethod,
    url: string,
    data?: any,
    config?: RequestConfig,
  ): RequestPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data,
      }),
    );
  }
}

[
  "request",
  "get",
  "post",
  "delete",
  "options",
  "put",
  "defaultUrl",
  "_requestMethodWithoutData",
  "_requestMethodWithData",
].forEach((method) => {
  Object.defineProperty(Request.prototype, method, { enumerable: true });
});

export default Request;
