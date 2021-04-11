import Router from "@koa/router";
import { handleHackerNewsV2 } from "../../handlers";

const router = new Router();

router.get("/hn", async (ctx, _) => {
  const { page } = ctx.query;
  if (page === undefined || page instanceof Array) {
    ctx.throw(400, "Invalid page");
    return;
  }
  ctx.body = await handleHackerNewsV2(page);
});

export default router;
