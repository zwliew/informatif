import Router from "@koa/router";
import cors from "@koa/cors";
import type { Context } from "koa";

const { NODE_ENV } = process.env;

const auth = new Router();

const whitelistedOrigins = [
  "https://staging.informatif.zwliew.com",
  "https://informatif.zwliew.com",
];
auth.use(
  cors({
    origin(ctx: Context) {
      const requestOrigin = ctx.header.origin;
      if (
        requestOrigin &&
        (NODE_ENV !== "production" ||
          whitelistedOrigins.includes(requestOrigin))
      ) {
        return requestOrigin;
      }
      return whitelistedOrigins[0];
    },
    allowMethods: "GET",
  })
);

export default auth;
