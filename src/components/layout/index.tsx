import routes from "@/lib/routes";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Avatar,
  Text,
  Icon,
  Link,
  Select,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { FiHome, FiPieChart, FiDollarSign, FiBox } from "react-icons/fi";
import { MdArrowDropDown, MdPublish } from "react-icons/md";
import { SiNotion } from "react-icons/si";
import { FaGithub } from "react-icons/fa6";
import { VscPreview } from "react-icons/vsc";
import client from "@/lib/hashnode";
import { GET_PUBLICATIONS } from "@/lib/queries";
import { useAuth } from "@/lib/AuthContext";

export default function Layout({ children }: any) {
  const router = useRouter();
  const [nodes, setNodes] = useState<any>(null);
  const { dispatch, state } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await client.query({
        query: GET_PUBLICATIONS,
      });
      const nodes = data.me.publications.edges.map((obj: any) => obj.node);
      setNodes(nodes);
    };
    fetchData();
  }, []);

  function isActive(route: string) {
    const group = {
      [routes.home]: [routes.home, routes.drafts],
      [routes.published]: [routes.published],
      [routes.notion]: [routes.notion],
      [routes.github]: [routes.github],
    };

    if (group[route].includes(router.pathname)) {
      return "active";
    }
    return "";
  }

  return (
    <main>
      <Flex
        h={[null, null, "100vh"]}
        maxW="2000px"
        flexDir={["column", "column", "row"]}
        overflow="hidden"
      >
        <Flex
          w={["100%", "100%", "20%", "20%", "20%"]}
          flexDir="column"
          alignItems="center"
          backgroundColor="#020202"
          color="#fff"
        >
          <Flex
            flexDir="column"
            h={[null, null, "100vh"]}
            justifyContent="space-between"
          >
            <Flex flexDir="column" as="nav">
              <Heading
                mt={50}
                mb={25}
                fontSize={["4xl", "4xl", "2xl", "3xl", "4xl"]}
                alignSelf="center"
                letterSpacing="tight"
              >
                HashDex.
              </Heading>

              <Stack mb={[25, 50, 100]}>
                <Select onChange={(v) => {
                  dispatch({ type: "UPDATE_PUBLICATION", payload: { selectedBlog: nodes[v.target.value] } })
                }} color={'gray.300'} colorScheme="black" icon={<MdArrowDropDown />} placeholder="Select blog...">
                  {nodes?.map((node: any, index: number) => (
                    <option key={index} value={index}>
                      {node.title}
                    </option>
                  ))}
                </Select>
              </Stack>

              <Flex
                flexDir={["row", "row", "column", "column", "column"]}
                align={[
                  "center",
                  "center",
                  "center",
                  "flex-start",
                  "flex-start",
                ]}
                wrap={["wrap", "wrap", "nowrap", "nowrap", "nowrap"]}
                justifyContent="center"
              >
                <Flex
                  onClick={() => router.push(routes.home)}
                  className="sidebar-items"
                  mr={[2, 6, 0, 0, 0]}
                >
                  <Link display={["none", "none", "flex", "flex", "flex"]}>
                    <Icon
                      as={FiHome}
                      fontSize="2xl"
                      className={`${isActive(routes.home)}-icon`}
                    />
                  </Link>
                  <Link
                    _hover={{ textDecor: "none" }}
                    display={["flex", "flex", "none", "flex", "flex"]}
                  >
                    <Text className={isActive(routes.home)}>Home</Text>
                  </Link>
                </Flex>

                <Flex
                  onClick={() => router.push(routes.published)}
                  className="sidebar-items"
                  mr={[2, 6, 0, 0, 0]}
                >
                  <Link display={["none", "none", "flex", "flex", "flex"]}>
                    <Icon
                      as={VscPreview}
                      fontSize="2xl"
                      className={`${isActive(routes.published)}-icon`}
                    />
                  </Link>
                  <Link
                    _hover={{ textDecor: "none" }}
                    display={["flex", "flex", "none", "flex", "flex"]}
                  >
                    <Text className={isActive(routes.published)}>
                      Published
                    </Text>
                  </Link>
                </Flex>

                <Flex
                  onClick={() => router.push(routes.notion)}
                  className="sidebar-items"
                  mr={[2, 6, 0, 0, 0]}
                >
                  <Link display={["none", "none", "flex", "flex", "flex"]}>
                    <Icon
                      as={SiNotion}
                      fontSize="2xl"
                      className={`${isActive(routes.notion)}-icon`}
                    />
                  </Link>
                  <Link
                    _hover={{ textDecor: "none" }}
                    display={["flex", "flex", "none", "flex", "flex"]}
                  >
                    <Text className={isActive(routes.notion)}>Notion</Text>
                  </Link>
                </Flex>

                <Flex
                  onClick={() => router.push(routes.github)}
                  className="sidebar-items"
                  mr={[2, 6, 0, 0, 0]}
                >
                  <Link display={["none", "none", "flex", "flex", "flex"]}>
                    <Icon
                      as={FaGithub}
                      fontSize="2xl"
                      className={`${isActive(routes.github)}-icon`}
                    />
                  </Link>
                  <Link
                    _hover={{ textDecor: "none" }}
                    display={["flex", "flex", "none", "flex", "flex"]}
                  >
                    <Text className={isActive(routes.github)}>Github</Text>
                  </Link>
                </Flex>
              </Flex>
            </Flex>

            <Flex flexDir="column" alignItems="center" mb={10} mt={5}>
              <Avatar my={2} src={state.user?.photo} />
              <Text textAlign="center">{state.user?.name}</Text>
            </Flex>
          </Flex>
        </Flex>

        <Flex
          w={["100%", "100%", "80%", "80%", "80%"]}
          p="3%"
          flexDir="column"
          overflow="auto"
          minH="100vh"
        >
          {children}
        </Flex>
      </Flex>
    </main>
  );
}

