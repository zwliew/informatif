import React from "react";
import Parser from "rss-parser";
import Feed from "./Feed";
import { useApi } from "../hooks";

const parser = new Parser();

async function loadApi(_, signal) {
  const res = await fetch(
    "https://cors-anywhere.herokuapp.com/https://www.reddit.com/top.rss",
    {
      signal
    }
  );
  const items = (await parser.parseString(await res.text())).items;
  return items.map(({ author, title, link, id }) => ({
    id,
    link,
    title,
    author
  }));
}

export default function RedditFeed() {
  const { loading, items, refresh } = useApi(loadApi);

  return (
    <Feed title="Reddit" items={items} onRefresh={refresh} loading={loading} />
  );
}
