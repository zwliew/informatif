import he from "he";
import fetch from "node-fetch";
import Parser from "rss-parser";
import cache from "./cache.mjs";

async function getElseSetWith(key, callback) {
  if (await cache.has(key)) {
    return await cache.get(key);
  }
  const res = await callback();
  cache.set(key, JSON.stringify(res));
  return res;
}

export async function handleStackOverflow(page) {
  return await getElseSetWith(`so-${page}`, async () => {
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
        responseCount: answer_count,
      })
    );
  });
}

export async function handleHackerNews(page) {
  return await getElseSetWith(`hn-${page}`, async () => {
    const res = await fetch(`https://api.hnpwa.com/v0/news/${page}.json`);
    const json = await res.json();
    return json.map(({ title, points, comments_count, id, user, url }) => ({
      id,
      link: `https://news.ycombinator.com/item?id=${id}`,
      origLink: url,
      title,
      author: user,
      points,
      responseCount: comments_count,
    }));
  });
}

const parser = new Parser();

export async function handleReddit() {
  return await getElseSetWith("reddit-1", async () => {
    const res = await fetch("https://www.reddit.com/top.rss");
    const json = (await parser.parseString(await res.text())).items;
    return json.map(({ author, title, link, id }) => ({
      id,
      link,
      title,
      author,
    }));
  });
}

const { GLOBAL_NEWS_API_KEY } = process.env;

export async function handleGlobalNews(page) {
  return await getElseSetWith(`global-${page}`, async () => {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?language=en&page=${page}`,
      {
        headers: {
          Authorization: GLOBAL_NEWS_API_KEY,
        },
      }
    );
    const json = (await res.json()).articles;
    return json.map(({ title, comments_count, source, url }) => ({
      id: `${source.name} - ${title}`,
      link: url,
      title,
      author: source.name,
      responseCount: comments_count,
    }));
  });
}

export async function handleGitHub() {
  return await getElseSetWith("gh-1", async () => {
    const res = await fetch("https://github-trending-api.now.sh/repositories");
    const json = await res.json();
    return json.map(({ url, author, name, stars, description }) => ({
      id: url,
      link: url,
      title: name,
      author,
      description,
      points: stars,
    }));
  });
}

export async function handleMedium() {
  return await getElseSetWith("medium-1", async () => {
    const res = await fetch("https://medium.com/feed/topic/popular");
    const json = (await parser.parseString(await res.text())).items;
    return json.map(({ guid, link, creator, title }) => ({
      id: guid,
      link,
      altLink: `https://outline.com/${link}`,
      altLinkName: "Outline",
      title,
      author: creator,
    }));
  });
}
