import he from "he";
import fetch from "node-fetch";
import Parser from "rss-parser";
import cache from "./cache";

async function getElseSetWith(key: string, callback: () => any) {
  if (await cache.has(key)) {
    return await cache.get(key);
  }
  const res = await callback();
  cache.set(key, JSON.stringify(res));
  return res;
}

export async function handleStackOverflow(page: number | string) {
  return await getElseSetWith(`so-${page}`, async () => {
    const res = await fetch(
      `https://api.stackexchange.com/2.2/questions?page=${page}&order=desc&sort=hot&site=stackoverflow`
    );
    const json = (await res.json()).items;
    return json.map(
      ({ link, title, score, answer_count, question_id, owner }: any) => ({
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

export async function handleHackerNewsV2(pageStr: string) {
  const page = parseInt(pageStr);
  if (page < 1 || page > 10) {
    return { data: [], nextPage: null };
  }
  return await getElseSetWith(`hn-${page}`, async () => {
    const res = await fetch(`https://api.hnpwa.com/v0/news/${page}.json`);
    const json = await res.json();
    return {
      data: json.map(
        ({ title, points, comments_count, id, user, url }: any) => ({
          id,
          link: `https://news.ycombinator.com/item?id=${id}`,
          origLink: url,
          title,
          author: user,
          points,
          responseCount: comments_count,
        })
      ),
      nextPage: page < 10 ? page + 1 : null,
    };
  });
}

export async function handleHackerNewsV1(pageStr: string) {
  const page = parseInt(pageStr);
  return await getElseSetWith(`hn-${page}`, async () => {
    const res = await fetch(`https://api.hnpwa.com/v0/news/${page}.json`);
    const json = await res.json();
    return json.map(
      ({ title, points, comments_count, id, user, url }: any) => ({
        id,
        link: `https://news.ycombinator.com/item?id=${id}`,
        origLink: url,
        title,
        author: user,
        points,
        responseCount: comments_count,
      })
    );
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

export async function handleGlobalNews(page: number | string) {
  return await getElseSetWith(`global-${page}`, async () => {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?language=en&page=${page}`,
      {
        headers: {
          Authorization: GLOBAL_NEWS_API_KEY,
        } as any,
      }
    );
    const json = (await res.json()).articles;
    return json.map(({ title, comments_count, source, url }: any) => ({
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
    const res = await fetch("https://trendings.herokuapp.com/repo");
    const json = await res.json();
    return json.items.map(({ repo, repo_link, desc, stars }: any) => ({
      id: repo,
      link: repo_link,
      title: repo.substr(repo.indexOf("/") + 1),
      author: repo.substr(0, repo.indexOf("/")),
      description: desc,
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
