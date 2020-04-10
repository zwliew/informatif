import LRU from "lru-cache";

const hourInMsec = 60 * 60 * 1000;

const cache = new LRU({
  max: 450,
  maxAge: hourInMsec,
  length(n, _) {
    return n.length;
  },
});

function set(key, val) {
  cache.set(key, val);
}

function get(key) {
  return cache.get(key);
}

async function getElseSetWith(key, callback) {
  const cached = get(key);
  if (cached) return cached;
  const val = await callback();
  set(key, val);
  return val;
}

export default {
  set,
  get,
  getElseSetWith,
};
