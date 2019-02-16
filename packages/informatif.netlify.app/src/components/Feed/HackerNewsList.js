import React from "react";
import List from "./List";
import LoadingSpinner from "../LoadingSpinner";
import { useApi } from "./hooks";

async function loadApi(page, abortController) {
  const res = await fetch(`https://api.hnpwa.com/v0/news/${page}.json`, {
    signal: abortController.signal
  });
  const items = await res.json();
  return items.map(({ title, points, comments_count, id, user }) => ({
    link: `https://news.ycombinator.com/item?id=${id}`,
    title,
    points,
    responseCount: comments_count,
    id,
    author: user
  }));
}

export default function HackerNewsList() {
  const { loading, items, refresh, loadMore } = useApi(loadApi);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <List
      title="Hacker News"
      items={items}
      onRefresh={refresh}
      onLoadMore={loadMore}
    />
  );
}
