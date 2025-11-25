function forEach(obj: any, fn: any, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i, l;
  if (typeof obj !== "object") {
    obj = [obj];
  }

  if (Array.isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys
      ? Object.getOwnPropertyNames(obj)
      : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

export function bind(fn: Function, ctx: any) {
  return function (this: any, ...args: any[]) {
    return fn.apply(ctx, args);
  };
}

export function extend(
  a: any,
  b: any,
  thisArg: any,
  { allOwnKeys }: { allOwnKeys?: boolean } = {},
) {
  forEach(
    b,
    (val: any, key: any) => {
      if (thisArg && typeof val === "function") {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    },
    { allOwnKeys },
  );
  return a;
}
