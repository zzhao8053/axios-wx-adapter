export type IMethod =
  | "OPTIONS"
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "TRACE"
  | "CONNECT";

export interface IResponse<T = any> {
  data: T;
  status: number;
  statusText?: string;
  headers: any;
  config: RequestConfig;
  cookies?: string[]; // 小程序特有
  request?: any;
}

export interface RequestOptions
  extends IRequestExtendProperty,
    IRequestExtendMethod {
  headers?: any;
  timeout?: number;
  retry?: number;
  excludeUrl?: string[];
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
}

export interface RequestInterceptor<T = any> {
  (response: T): T | Promise<T>;
}

export interface ResponseInterceptor<T = any> {
  (response: T): T | Promise<T>;
}

export interface ResponseTransformer {
  (data: RequestResponse): any;
}

export interface ResolvedFn<T> {
  (val: T): T | Promise<T>;
}

export interface RejectedFn {
  (error: any): any;
}

export interface InterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number;

  eject(id: number): void;
}

export interface IBasicRequestOptions {
  url?: string;
  method?: IMethod;
  data?: any;
  headers?: any;
  timeout?: number;
}

export interface IRequestExtendProperty {
  baseURL?: string;
}

export interface IRequestExtendMethod {
  validateStatus?: (status: number, data: IResponse<any>) => boolean;
  errorMessages?: { [key: number]: string };
  transformResponse?: ResponseTransformer | ResponseTransformer[];
}

export type IRequestExtend = IRequestExtendProperty & IRequestExtendMethod;

export type RequestConfig = IBasicRequestOptions & IRequestExtend;

export interface RequestResponse<T = any> extends IResponse<T> {
  config: RequestConfig;
}

export interface RequestPromise<T = any> extends Promise<IResponse<T>> {}

export interface Request {
  defaults: RequestConfig;
  interceptors: {
    request: InterceptorManager<RequestConfig>;
    response: InterceptorManager<RequestResponse>;
  };

  request<T = any>(config: RequestConfig): RequestPromise<T>;

  get<T>(config?: RequestConfig): RequestPromise<T>;

  get<T>(url: string, config?: RequestConfig): RequestPromise<T>;

  post<T>(config?: RequestConfig): RequestPromise<T>;

  post<T>(url: string, data?: any, config?: RequestConfig): RequestPromise<T>;

  delete<T>(url: string, config?: RequestConfig): RequestPromise<T>;

  delete<T>(config?: RequestConfig): RequestPromise<T>;

  options<T>(url: string, config?: RequestConfig): RequestPromise<T>;

  put<T>(url: string, data?: any, config?: RequestConfig): RequestPromise<T>;

  put<T>(config?: RequestConfig): RequestPromise<T>;
}

export interface RequestInstance extends Request {
  <T>(config: RequestConfig): RequestPromise<T>;

  <T>(url: string, config?: RequestConfig): RequestPromise<T>;
}
