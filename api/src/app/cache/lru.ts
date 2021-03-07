import LRU from "lru-cache";

const MSEC_PER_HOUR = 60 * 60 * 1000;

const cache = new LRU({
  max: 450,
  maxAge: MSEC_PER_HOUR,
  length: (item: string) => item.length,
});

function exists(key: string) {
  return cache.has(key);
}

function set(key: string, val: string) {
  cache.set(key, val);
}

function get(key: string) {
  return cache.get(key);
}

export default {
  exists,
  set,
  get,
};
