import Router from "koa-router";
import {
  handleGitHub,
  handleGlobalNews,
  handleHackerNews,
  handleMedium,
  handleReddit,
  handleStackOverflow,
} from "../handlers";

const api = new Router({
  prefix: "/api/v1",
});

api.get("/hn", async (ctx, _) => {
  const { page = 1 } = ctx.query;
  ctx.body = await handleHackerNews(page);
});

api.get("/gh", async (ctx, _) => {
  ctx.body = await handleGitHub();
});

api.get("/so", async (ctx, _) => {
  const { page = 1 } = ctx.query;
  ctx.body = await handleStackOverflow(page);
});

api.get("/medium", async (ctx, _) => {
  ctx.body = await handleMedium();
});

api.get("/reddit", async (ctx, _) => {
  ctx.body = await handleReddit();
});

api.get("/global", async (ctx, _) => {
  const { page = 1 } = ctx.query;
  ctx.body = await handleGlobalNews(page);
});

export default api;
