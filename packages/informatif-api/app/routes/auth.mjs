import Router from "koa-router";
import cors from "@koa/cors";

const auth = new Router();

const WHITELISTED_DOMAINS = ["https://informatif.netlify.com"];
auth.use(
  cors({
    origin(ctx) {
      const requestOrigin = ctx.header.origin;
      if (WHITELISTED_DOMAINS.includes(requestOrigin)) {
        return requestOrigin;
      }
    },
    allowMethods: "GET"
  })
);

export default auth;
