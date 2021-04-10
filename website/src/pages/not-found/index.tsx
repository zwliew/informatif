import { Link as RouterLink } from "react-router-dom";
import { Text, Icon, Heading, Box, Flex, Link } from "@chakra-ui/react";
import { FaRegSadTear } from "react-icons/fa";

function NotFoundPage() {
  return (
    <Flex height="100vh" direction="column" align="center" justify="center">
      <Heading>Page not found!</Heading>
      <Box marginTop={4}>
        Sorry, we couldn't find what you were looking for.
        <Icon as={FaRegSadTear} marginLeft={1} />
      </Box>
      <Text>
        Why not check out{" "}
        <Link as={RouterLink} to="/browse" display="inline">
          another page
        </Link>{" "}
        instead?
      </Text>
    </Flex>
  );
}

export default NotFoundPage;
