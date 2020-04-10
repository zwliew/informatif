import Router from "@koa/router";
import api from "./api.mjs";
import auth from "./auth.mjs";

const router = new Router();

router.use(async (ctx, next) => {
  await next();
  ctx.set("Cache-Control", "public,max-age=300");
});
router.use(auth.routes()).use(api.routes());

export default router;
