import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Text,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  Button,
  Box,
  Divider,
  Stack,
  HStack,
  Switch,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { FiCalendar, FiUploadCloud } from "react-icons/fi";
import { VscPreview } from "react-icons/vsc";
import { GrEdit } from "react-icons/gr";
import { MdPublish } from "react-icons/md";
import withAuth from "@/lib/withAuth";
import { GET_ALL_DRAFTS } from "@/lib/queries";
import client from "@/lib/hashnode";
import { useAuth } from "@/lib/AuthContext";
import moment from "moment";
import { useRouter } from "next/router";
import { HASHNODE } from "@/lib/constants";
import { useInView } from "react-intersection-observer";

function Dashboard({ drafts }: { drafts: any[] }) {
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState("");
  const [data, setData] = useState<any>(null);
  const [draft, setDraft] = useState<any>(null);
  const { state } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { ref, inView } = useInView();
  const [initialFetch, setInitialFetch] = useState(false);

  useEffect(() => {
    function fetchNextPage() {
      setIsLoadingNextPage(true);
      client
        .query({
          query: GET_ALL_DRAFTS,
          variables: {
            host: state.selectedBlog?.url
              .replace("https://", "")
              .replace("http://", ""),
            after: endCursor,
          },
        })
        .then(({ data: newData }) => {
          const nodes = newData.publication.drafts.edges.map(
            (obj: any) => obj.node
          );
          setData([...data, ...nodes]);
          setTimeout(() => {
            setIsLoadingNextPage(false);
          }, 3000);
        });
    }
    if (inView && hasNextPage && !isLoadingNextPage) {
      fetchNextPage();
    }
  }, [
    inView,
    hasNextPage,
    state.selectedBlog?.url,
    data,
    endCursor,
    isLoadingNextPage,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await client.query({
        query: GET_ALL_DRAFTS,
        variables: {
          host: state.selectedBlog?.url
            .replace("https://", "")
            .replace("http://", ""),
        },
      });
      const nodes = data.publication.drafts.edges.map((obj: any) => obj.node);
      setInitialFetch(true);
      setHasNextPage(data.publication.drafts.pageInfo.hasNextPage);
      setEndCursor(data.publication.drafts.pageInfo.endCursor);
      setData(nodes);
    };
    if (state.selectedBlog && !initialFetch) fetchData();
  }, [state, data, initialFetch]);

  return (
    <>
      <Heading fontWeight="normal" mb={4} letterSpacing="tight">
        Welcome back,{" "}
        <Flex display="inline-flex" fontWeight="bold">
          {state.user?.name}
        </Flex>
      </Heading>
      <Flex justifyContent="space-between" mt={8}>
        <Flex align="flex-end">
          <Heading as="h2" size="lg" letterSpacing="tight">
            My Drafts
          </Heading>
        </Flex>
      </Flex>
      <Flex flexDir="column">
        <Flex overflow="auto">
          {!state.selectedBlog && (
            <Flex w="100%" h="100%" pt={10}>
              <Text fontSize={"xl"} color="gray">
                Select a blog to get started.
              </Text>
            </Flex>
          )}
          {data !== null && (
            <Table variant="unstyled" mt={4}>
              <Thead>
                <Tr color="gray">
                  <Th>#</Th>
                  <Th>Title</Th>
                  <Th>Last Updated</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((draft: any, index: number) => (
                  <Tr key={index} ref={index === data.length - 1 ? ref : null}>
                    <Td>{index + 1}</Td>
                    <Td>
                      <Flex align="center">
                        <Flex flexDir="column">
                          <Heading size="md" letterSpacing="tight">
                            {draft.title}
                          </Heading>
                        </Flex>
                      </Flex>
                    </Td>
                    <Td>
                      <Text color="gray">
                        {moment(draft.updatedAt).format("lll")}
                      </Text>
                    </Td>
                    <Td>
                      <Flex gap={2}>
                        <Tooltip
                          bg="gray.300"
                          color={"black"}
                          hasArrow
                          label="Preview"
                          fontSize="xs"
                        >
                          <IconButton
                            onClick={() => {
                              console.log(state.selectedBlog?.url);
                              const url = `${state.selectedBlog?.url}/preview/${draft.id}`;
                              window.open(url, "_blank");
                            }}
                            aria-label="edit"
                            icon={<VscPreview />}
                          />
                        </Tooltip>
                        <Tooltip
                          bg="gray.300"
                          color={"black"}
                          hasArrow
                          label="Edit"
                          fontSize="xs"
                        >
                          <IconButton
                            onClick={() => {
                              const url = `${HASHNODE}/draft/${draft.id}`;
                              window.open(url, "_blank");
                            }}
                            aria-label="edit"
                            icon={<GrEdit />}
                          />
                        </Tooltip>
                        <Tooltip
                          bg="gray.300"
                          color={"black"}
                          hasArrow
                          label="Publish"
                          fontSize="xs"
                        >
                          <IconButton
                            onClick={() => {
                              setDraft(draft);
                              onOpen();
                            }}
                            aria-label="edit"
                            icon={<MdPublish />}
                          />
                        </Tooltip>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
          {data && data.length == 0 && (
            <Flex w="100%" h="100%" pt={10}>
              <Text color="gray">You have no drafts yet.</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Draft Settings</DrawerHeader>

          {draft && (
            <DrawerBody>
              <Stack gap={5}>
                <Box>
                  <Text mb={2} color="gray" fontWeight={"500"}>
                    Selected Blog
                  </Text>
                  <Text>{state.selectedBlog?.title}</Text>
                </Box>
                <Box bg={"gray.200"} p={2} rounded={"md"}>
                  <Text mb={1} color="gray" fontWeight={"500"} fontSize={"sm"}>
                    Read Time
                  </Text>
                  <Text>{draft?.readTimeInMinutes} mins</Text>
                </Box>
              </Stack>
              <Divider my={10} />
              <Stack gap={5}>
                <Box>
                  <HStack justify={"space-between"}>
                    <Box>
                      <FormLabel
                        htmlFor="generate-toc"
                        mb={2}
                        color="gray"
                        fontWeight={"500"}
                      >
                        Table of contents
                      </FormLabel>
                      <Text>Generate table of contents for your article</Text>
                    </Box>
                    <Switch
                      isChecked={draft.features.tableOfContents.isEnabled}
                      id="generate-toc"
                    />
                  </HStack>
                </Box>
                <Box>
                  <FormLabel
                    htmlFor="article-slug"
                    mb={2}
                    color="gray"
                    fontWeight={"500"}
                  >
                    Article slug
                  </FormLabel>
                  <Input
                    id="article-slug"
                    value={draft.slug}
                    placeholder="Type here..."
                  />
                </Box>
                <Box>
                  <FormLabel
                    htmlFor="tags"
                    mb={2}
                    color="gray"
                    fontWeight={"500"}
                  >
                    Select tags
                  </FormLabel>
                  <Input id="tags" placeholder="Type here to search..." />
                </Box>
              </Stack>
              <Divider my={10} />
              <Stack gap={5}>
                <Box>
                  <FormLabel
                    htmlFor="article-slug"
                    mb={2}
                    color="gray"
                    fontWeight={"500"}
                  >
                    SEO title
                  </FormLabel>
                  <Input
                    value={draft.seo?.title}
                    id="article-slu"
                    placeholder="Enter the meta title"
                  />
                </Box>
                <Box>
                  <FormLabel
                    htmlFor="tags"
                    mb={2}
                    color="gray"
                    fontWeight={"500"}
                  >
                    SEO description
                  </FormLabel>
                  <Textarea
                    value={draft.seo?.description}
                    id="tags"
                    placeholder="Enter the meta description"
                  />
                </Box>
                <Box>
                  <FormLabel
                    htmlFor="og-image"
                    mb={2}
                    color="gray"
                    fontWeight={"500"}
                  >
                    Are you republishing this article?
                  </FormLabel>
                  <Text mb={2}>
                    Change the canonical URL of this article to the original
                    article
                  </Text>
                  <Input value={draft.canonicalUrl} id="tags" placeholder="Paste the original URL here" />
                </Box>
              </Stack>
              <Divider my={10} />
              <Stack gap={5}>
                <Box>
                  <HStack justify={"space-between"}>
                    <Box>
                      <FormLabel
                        htmlFor="generate-toc"
                        mb={2}
                        color="gray"
                        fontWeight={"500"}
                      >
                        Disable comments
                      </FormLabel>
                      <Text>
                        This will hide the comments section below your article
                      </Text>
                    </Box>
                    <Switch isChecked={draft.settings?.disableComments} id="generate-toc" />
                  </HStack>
                </Box>
                <Box>
                  <HStack justify={"space-between"}>
                    <Box>
                      <FormLabel
                        htmlFor="generate-toc"
                        mb={2}
                        color="gray"
                        fontWeight={"500"}
                      >
                        Hide article from Hashnode feed
                      </FormLabel>
                      <Text>
                        Hide this article from Hashnode feed and display it only
                        on my blog
                      </Text>
                    </Box>
                    <Switch isChecked={!draft.settings?.isDelisted} id="generate-toc" />
                  </HStack>
                </Box>
              </Stack>
            </DrawerBody>
          )}

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Publish</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default withAuth(Dashboard);
