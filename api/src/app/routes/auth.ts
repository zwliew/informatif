import Router from "@koa/router";
import cors from "@koa/cors";
import type { Context } from "koa";

const auth = new Router();

const whitelistedOrigins = [
  "https://staging.informatif.zwliew.com",
  "https://informatif.zwliew.com",
];
auth.use(
  cors({
    origin(ctx: Context) {
      const requestOrigin = ctx.header.origin;
      if (requestOrigin && whitelistedOrigins.includes(requestOrigin)) {
        return requestOrigin;
      }
      return whitelistedOrigins[0];
    },
    allowMethods: "GET",
  })
);

export default auth;
