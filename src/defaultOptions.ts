import { RequestOptions } from "./types";

export default {
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 12000,
  retry: 3,
  excludeUrl: [],
  errorMessages: {
    "400": "网络请求失败",
    "401": "没有访问权限",
    "403": "没有访问权限",
    "404": "资源不存在",
    "500": "服务不可用",
    "*": "服务不可用",
  },
  validateStatus: (status: number) => status >= 200 && status < 300,
} as RequestOptions;
