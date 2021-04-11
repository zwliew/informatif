import { Box, Flex, Heading, Link, Text } from "@chakra-ui/layout";
import { useInfiniteQuery } from "react-query";
import { MdPersonOutline, MdChatBubbleOutline } from "react-icons/md";
import { BiUpvote } from "react-icons/bi";
import Icon from "@chakra-ui/icon";
import { Button } from "@chakra-ui/button";
import { CircularProgress } from "@chakra-ui/progress";

const { REACT_APP_API_URL } = process.env;

interface Story {
  id: number;
  title: string;
  author: string;
  link: string;
  origLink: string;
  points: number;
  responseCount: number;
}

function IconWithText({ as, text }: { as: React.FC; text: number | string }) {
  return (
    <Flex>
      <Icon marginRight={0.5} position="relative" top={1} as={as} />
      <Text marginRight={1}>{text}</Text>
    </Flex>
  );
}

function StoryListItem({ story }: { story: Story }) {
  const { title, author, link, origLink, points, responseCount } = story;
  let origUrl;
  try {
    origUrl = (
      <Link marginLeft={1} href={origLink}>
        [{new URL(origLink).hostname}]
      </Link>
    );
  } catch (_) {
    // Do nothing
  }
  return (
    <Flex direction="column" marginY={4}>
      <Box>
        <Heading size="md" display="inline-block">
          <Link href={link}>{title}</Link>
        </Heading>
        {origUrl}
      </Box>
      <Flex>
        <IconWithText as={MdPersonOutline} text={author} />
        <IconWithText as={BiUpvote} text={points} />
        <IconWithText as={MdChatBubbleOutline} text={responseCount} />
      </Flex>
    </Flex>
  );
}

async function fetchPage({
  pageParam = 1,
}): Promise<{ data: Story[]; nextPage: number }> {
  const result = await fetch(`${REACT_APP_API_URL}/v2/hn?page=${pageParam}`);
  return result.json();
}

function BrowsePage() {
  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
  } = useInfiniteQuery("top", fetchPage, {
    getNextPageParam: (lastPage, _) => lastPage.nextPage ?? undefined,
  });

  let display = <CircularProgress isIndeterminate />;
  if (isError) {
    display = <Text>Error!</Text>;
  } else if (data) {
    display = (
      <>
        {data.pages
          .flatMap((page) => page.data)
          .map((story: Story) => (
            <StoryListItem story={story} key={story.id} />
          ))}
      </>
    );
  }

  return (
    <Flex
      direction="column"
      paddingX={{ base: 2, md: 8, lg: 16, xl: 32, "2xl": 64 }}
      paddingY={2}
    >
      <Heading marginX="auto">Hacker News - top stories</Heading>
      <Box paddingY={4}>{display}</Box>
      {hasNextPage && (
        <Button
          isLoading={isFetchingNextPage}
          loadingText="Loading"
          onClick={() => fetchNextPage()}
        >
          Load more
        </Button>
      )}
    </Flex>
  );
}

export default BrowsePage;
