import Router from "koa-router";
import fetch from "node-fetch";
import Parser from "rss-parser";

const api = new Router({
  prefix: "/api/v1"
});

api.get("/hn", async (ctx, _) => {
  const { page = 1 } = ctx.query;
  const res = await fetch(`https://api.hnpwa.com/v0/news/${page}.json`);
  const json = await res.json();
  const items = json.map(({ title, points, comments_count, id, user }) => ({
    id,
    link: `https://news.ycombinator.com/item?id=${id}`,
    title,
    author: user,
    points,
    responseCount: comments_count
  }));
  ctx.body = items;
});

api.get("/gh", async (ctx, _) => {
  const res = await fetch(`https://github-trending-api.now.sh/repositories`);
  const json = await res.json();
  const items = json.map(({ url, author, name, stars, description }) => ({
    id: url,
    link: url,
    title: name,
    author,
    description,
    points: stars
  }));
  ctx.body = items;
});

api.get("/so", async (ctx, _) => {
  const { page = 1 } = ctx.query;
  const res = await fetch(
    `https://api.stackexchange.com/2.2/questions?page=${page}&order=desc&sort=hot&site=stackoverflow`
  );
  const json = (await res.json()).items;
  const items = json.map(
    ({ link, title, score, answer_count, question_id, owner }) => ({
      id: question_id,
      link,
      title,
      author: owner.display_name,
      points: score,
      responseCount: answer_count
    })
  );
  ctx.body = items;
});

const parser = new Parser();

api.get("/reddit", async (ctx, _) => {
  const res = await fetch("https://www.reddit.com/top.rss");
  const json = (await parser.parseString(await res.text())).items;
  const items = json.map(({ author, title, link, id }) => ({
    id,
    link,
    title,
    author
  }));
  ctx.body = items;
});

const { GLOBAL_NEWS_API_KEY } = process.env;

api.get("/global", async (ctx, _) => {
  const { page = 1 } = ctx.query;
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?language=en&page=${page}`,
    {
      headers: {
        Authorization: GLOBAL_NEWS_API_KEY
      }
    }
  );
  const json = (await res.json()).articles;
  const items = json.map(({ title, comments_count, source, url }) => ({
    id: `${source.name} - ${title}`,
    link: url,
    title,
    author: source.name,
    responseCount: comments_count
  }));
  ctx.body = items;
});

export default api;
