import fetch from "node-fetch";
import Parser from "rss-parser";
import cache from "./cache";

export async function handleStackOverflow(page) {
  const cacheKey = `so-${page}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

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

  cache.set(cacheKey, items);

  return items;
}

export async function handleHackerNews(page) {
  const cacheKey = `hn-${page}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

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

  cache.set(cacheKey, items);
  return items;
}

const parser = new Parser();

export async function handleReddit() {
  const cacheKey = "reddit-1";
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const res = await fetch("https://www.reddit.com/top.rss");
  const json = (await parser.parseString(await res.text())).items;
  const items = json.map(({ author, title, link, id }) => ({
    id,
    link,
    title,
    author
  }));

  cache.set(cacheKey, items);

  return items;
}

const { GLOBAL_NEWS_API_KEY } = process.env;

export async function handleGlobalNews(page) {
  const cacheKey = `global-${page}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

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

  cache.set(cacheKey, items);

  return items;
}

export async function handleGitHub() {
  const cacheKey = "gh-1";
  const cached = cache.get(cacheKey);
  if (cached) return cached;

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

  cache.set(cacheKey, items);

  return items;
}
