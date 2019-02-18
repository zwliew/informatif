import fetch from "node-fetch";
import Parser from "rss-parser";

async function handleStackOverflow(page) {
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
  return items;
}

async function handleHackerNews(page) {
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
  return items;
}

const parser = new Parser();

async function handleReddit() {
  const res = await fetch("https://www.reddit.com/top.rss");
  const json = (await parser.parseString(await res.text())).items;
  const items = json.map(({ author, title, link, id }) => ({
    id,
    link,
    title,
    author
  }));
  return items;
}

const { GLOBAL_NEWS_API_KEY } = process.env;

async function handleGlobalNews(page) {
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
  return items;
}

async function handleGitHub() {
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
  return items;
}

export default {
  handleStackOverflow,
  handleHackerNews,
  handleGitHub,
  handleReddit,
  handleGlobalNews
};
