import {
  IBasicRequestOptions,
  IRequestExtendMethod,
  RequestConfig,
  RequestResponse,
} from "./types";
import { combineURL, isAbsoluteURL } from "./url";
import xhr from "./xhr";
import transform from "./transform";

type IRequestConfigKeys = keyof RequestConfig & keyof IBasicRequestOptions;
type IRequestExtendKeys = keyof IRequestExtendMethod;

const RequestConfigKeys: IRequestConfigKeys[] = [
  "url",
  "method",
  "data",
  "headers",
  "timeout",
];
const RequestExtendKeys: IRequestExtendKeys[] = [
  "validateStatus",
  "errorMessages",
];

function processConfig(config: RequestConfig): void {
  config.url = transformURL(config);
}

function transformURL(config: RequestConfig): string {
  let { url, baseURL } = config;
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url);
  }
  return url!;
}

function transformResponseData(res: RequestResponse): RequestResponse {
  return transform(res, res.config?.transformResponse);
}

function omitMiniConfig(config: RequestConfig): IBasicRequestOptions {
  const obj: IBasicRequestOptions = {};
  RequestConfigKeys.forEach((k) => {
    if (config[k]) {
      obj[k] = config[k];
    }
  });
  return obj;
}

function omitRequestHandle(config: RequestConfig): IRequestExtendMethod {
  const obj: IRequestExtendMethod = {};
  RequestExtendKeys.forEach((k) => {
    if (config[k]) {
      // @ts-ignore
      obj[k] = config[k];
    }
  });
  return obj;
}

function separateConfigAndExtend(config: RequestConfig) {
  return {
    config: omitMiniConfig(config),
    handle: omitRequestHandle(config),
  };
}

async function dispatchRequest(config: RequestConfig) {
  processConfig(config);
  const configAndExtend = separateConfigAndExtend(config);
  const res = await xhr(configAndExtend.config, configAndExtend.handle);
  return transformResponseData(res as RequestResponse);
}

export default dispatchRequest;
