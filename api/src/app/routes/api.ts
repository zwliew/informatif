import Router from "@koa/router";
import type { Context, Next } from "koa";
import {
  handleGitHub,
  handleGlobalNews,
  handleHackerNews,
  handleMedium,
  handleReddit,
  handleStackOverflow,
} from "../handlers";

const api = new Router({
  prefix: "/v1",
});

api.get("/hn", async (ctx: Context, _: Next) => {
  const { page = 1 } = ctx.query;
  if (page instanceof Array) {
    ctx.throw(400, "Invalid page");
  }
  ctx.body = await handleHackerNews(page);
});

api.get("/gh", async (ctx: Context, _: Next) => {
  ctx.body = await handleGitHub();
});

api.get("/so", async (ctx: Context, _: Next) => {
  const { page = 1 } = ctx.query;
  if (page instanceof Array) {
    ctx.throw(400, "Invalid page");
  }
  ctx.body = await handleStackOverflow(page);
});

api.get("/medium", async (ctx: Context, _: Next) => {
  ctx.body = await handleMedium();
});

api.get("/reddit", async (ctx: Context, _: Next) => {
  ctx.body = await handleReddit();
});

api.get("/global", async (ctx: Context, _: Next) => {
  const { page = 1 } = ctx.query;
  if (page instanceof Array) {
    ctx.throw(400, "Invalid page");
  }
  ctx.body = await handleGlobalNews(page);
});

export default api;
