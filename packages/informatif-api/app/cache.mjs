import LRU from "lru-cache";

const hourInMsec = 60 * 60 * 1000;

const cache = new LRU({
  max: 300,
  maxAge: hourInMsec,
  length(n, _) {
    return n.length;
  }
});

function set(key, val) {
  cache.set(key, val);
}

function get(key) {
  return cache.get(key);
}

export default {
  set,
  get
};
