import {
  IBasicRequestOptions,
  IRequestExtendMethod,
  RequestResponse,
} from "./types";

export default function xhr(
  config: IBasicRequestOptions,
  handle: IRequestExtendMethod
): Promise<RequestResponse> {
  return new Promise((resolve, reject) => {
    // @ts-ignore: 忽略 wx 未定义的报错，因为这是在小程序环境运行
    const requestTask = wx.request({
      ...config,
      url: config.url || "",
      method: (config.method || "GET") as any,
      header: config.headers, // 映射 headers 到 header
      success: (res: any) => {
        const response: RequestResponse = {
          data: res.data,
          status: res.statusCode,
          statusText: res.errMsg || "OK",
          headers: res.header,
          config: config as any,
          cookies: res.cookies,
        };

        // 处理 validateStatus
        const validateStatus =
          handle.validateStatus || ((status) => status >= 200 && status < 300);

        if (!validateStatus(res.statusCode, response)) {
          // 这里可以根据需要自定义错误对象
          reject({
            message:
              handle.errorMessages?.[res.statusCode] ||
              `Request failed with status code ${res.statusCode}`,
            response,
            config,
            isAxiosError: true, // 模仿 axios 格式
          });
        } else {
          resolve(response);
        }
      },
      fail: (err: any) => {
        reject({
          message: err.errMsg || "Network Error",
          config,
          request: requestTask,
        });
      },
    });
  });
}
