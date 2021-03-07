import LruCache from "./lru";

async function tryCatch<T>(fn: () => Promise<T>): Promise<any> {
  try {
    return await fn();
  } catch (err) {
    console.error(`Cache error: ${err}`);
  }
}

async function has(key: string): Promise<any> {
  return tryCatch(async () => LruCache.exists(key)) || false;
}

async function set(key: string, val: string): Promise<any> {
  tryCatch(async () => {
    LruCache.set(key, val);
  });
}

async function get(key: string): Promise<string> {
  return tryCatch(async () => LruCache.get(key));
}

export default {
  has,
  set,
  get,
};
