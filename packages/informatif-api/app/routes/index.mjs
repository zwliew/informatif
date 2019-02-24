import Router from "koa-router";
import api from "./api";
import auth from "./auth";

const router = new Router();

router.use(async (ctx, next) => {
  await next();
  ctx.set("Cache-Control", "public,max-age=1800");
});
router.use(auth.routes()).use(api.routes());

export default router;
