import fetch from "node-fetch";
import he from "he";
import Parser from "rss-parser";
import cache from "./cache";

export async function handleStackOverflow(page) {
  const items = await cache.getElseSetWith(`so-${page}`, async () => {
    const res = await fetch(
      `https://api.stackexchange.com/2.2/questions?page=${page}&order=desc&sort=hot&site=stackoverflow`
    );
    const json = (await res.json()).items;
    return json.map(
      ({ link, title, score, answer_count, question_id, owner }) => ({
        id: question_id,
        link,
        title: he.decode(title),
        author: owner.display_name,
        points: score,
        responseCount: answer_count
      })
    );
  });
  return items;
}

export async function handleHackerNews(page) {
  const items = await cache.getElseSetWith(`hn-${page}`, async () => {
    const res = await fetch(`https://api.hnpwa.com/v0/news/${page}.json`);
    const json = await res.json();
    return json.map(({ title, points, comments_count, id, user }) => ({
      id,
      link: `https://news.ycombinator.com/item?id=${id}`,
      title,
      author: user,
      points,
      responseCount: comments_count
    }));
  });
  return items;
}

const parser = new Parser();

export async function handleReddit() {
  const items = await cache.getElseSetWith("reddit-1", async () => {
    const res = await fetch("https://www.reddit.com/top.rss");
    const json = (await parser.parseString(await res.text())).items;
    return json.map(({ author, title, link, id }) => ({
      id,
      link,
      title,
      author
    }));
  });
  return items;
}

const { GLOBAL_NEWS_API_KEY } = process.env;

export async function handleGlobalNews(page) {
  const items = await cache.getElseSetWith(`global-${page}`, async () => {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?language=en&page=${page}`,
      {
        headers: {
          Authorization: GLOBAL_NEWS_API_KEY
        }
      }
    );
    const json = (await res.json()).articles;
    return json.map(({ title, comments_count, source, url }) => ({
      id: `${source.name} - ${title}`,
      link: url,
      title,
      author: source.name,
      responseCount: comments_count
    }));
  });
  return items;
}

export async function handleGitHub() {
  const items = await cache.getElseSetWith("gh-1", async () => {
    const res = await fetch(`https://github-trending-api.now.sh/repositories`);
    const json = await res.json();
    return json.map(({ url, author, name, stars, description }) => ({
      id: url,
      link: url,
      title: name,
      author,
      description,
      points: stars
    }));
  });
  return items;
}
