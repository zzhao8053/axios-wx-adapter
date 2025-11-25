import merge from "merge";
import defaultOptions from "./defaultOptions";
import Request from "./Request";
import { RequestInstance, RequestOptions } from "./types";
import { bind, extend } from "./utils";

function createInstance(options: RequestOptions): RequestInstance {
  const context = new Request(options);
  const instance = bind(Request.prototype.request, context);
  extend(instance, Request.prototype, context, { allOwnKeys: true });
  extend(instance, context, null, { allOwnKeys: true });
  return instance as RequestInstance;
}

export function create(config?: RequestOptions) {
  return createInstance(merge(defaultOptions, config));
}

const request = createInstance(defaultOptions);

export default request;
