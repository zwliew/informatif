import Router from "@koa/router";
import cors from "@koa/cors";

const auth = new Router();

const whitelistedOrigins = [
  "https://informatif.netlify.com",
  "https://informatif.netlify.app",
  "https://informatif.now.sh",
  "http://localhost:3000",
];
auth.use(
  cors({
    origin(ctx) {
      const requestOrigin = ctx.header.origin;
      if (whitelistedOrigins.includes(requestOrigin)) {
        return requestOrigin;
      }
    },
    allowMethods: "GET",
  })
);

export default auth;
