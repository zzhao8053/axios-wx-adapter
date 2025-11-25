import { RequestResponse, ResponseTransformer } from "./types";

export default function transform(
  data: RequestResponse,
  fn?: ResponseTransformer | ResponseTransformer[]
) {
  if (!fn) {
    return data;
  }

  if (!Array.isArray(fn)) {
    fn = [fn];
  }

  fn.forEach((f) => {
    data = f(data);
  });

  return data;
}
