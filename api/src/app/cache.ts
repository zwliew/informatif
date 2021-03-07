import Redis from "ioredis";

const SEC_PER_HOUR = 3600;

const redis = new Redis({ host: "redis" });
redis.config("SET", "maxmemory", "50mb");
redis.config("SET", "maxmemory-policy", "allkeys-lfu");

async function tryCatch<T>(fn: () => Promise<T>): Promise<any> {
  try {
    return await fn();
  } catch (err) {
    console.error(`Cache error: ${err}`);
  }
}

async function has(key: string): Promise<any> {
  return tryCatch(async () => await redis.exists(key)) || false;
}

async function set(key: string, val: string): Promise<any> {
  tryCatch(async () => {
    await redis.setex(key, SEC_PER_HOUR, val);
  });
}

async function get(key: string): Promise<string> {
  return tryCatch(async () => await redis.get(key));
}

export default {
  has,
  set,
  get,
};
