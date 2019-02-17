import Router from "koa-router";
import cors from "@koa/cors";

const auth = new Router();

const whitelistedOrigins = [
  "https://informatif.netlify.com",
  "http://localhost:3000"
];
auth.use(
  cors({
    origin(ctx) {
      const requestOrigin = ctx.header.origin;
      if (whitelistedOrigins.includes(requestOrigin)) {
        return requestOrigin;
      }
    },
    allowMethods: "GET"
  })
);

export default auth;
