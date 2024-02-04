import React, { useState } from "react";
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
  Box,
  Button,
  Icon,
} from "@chakra-ui/react";
import {
  FiCalendar,
} from "react-icons/fi";
import { VscPreview } from "react-icons/vsc";
import { GrEdit } from "react-icons/gr";
import { MdPublish } from "react-icons/md";
import { BiCheckCircle, BiEdit, BiTrash } from "react-icons/bi";
import { RxNotionLogo } from "react-icons/rx";

export default function Dashboard() {
  const [display, changeDisplay] = useState("hide");
  const [value, changeValue] = useState(1);
  return (
    <>
      <Heading fontWeight="normal" mb={4} letterSpacing="tight">
        Integrate{" "}
        <Flex display="inline-flex" fontWeight="bold">
          Notion
        </Flex>
      </Heading>

      <Box textAlign={'center'} bg={'gray.200'} py={10} my={10}>
        <Heading mb={8}>No Pages Yet</Heading>
        <Button leftIcon={<RxNotionLogo />} colorScheme="purple" size="lg">
          Connect Notion
        </Button>
      </Box>

      <Flex justifyContent="space-between" mt={8}>
        <Flex align="flex-end">
          <Heading as="h2" size="lg" letterSpacing="tight">
            Notion Pages
          </Heading>
        </Flex>
      </Flex>
      <Flex flexDir="column">
        <Flex overflow="auto">
          <Table variant="unstyled" mt={4}>
            <Thead>
              <Tr color="gray">
                <Th>#</Th>
                <Th>Title</Th>
                <Th>Published</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>1</Td>
                <Td>
                  <Flex align="center">
                    <Flex flexDir="column">
                      <Heading size="md" letterSpacing="tight">
                        Eliminating the barrier to becoming a great developer
                      </Heading>
                    </Flex>
                  </Flex>
                </Td>
                <Td>
                  <Icon as={BiCheckCircle} />
                </Td>
                <Td>
                  <Flex gap={2}>
                    <Tooltip
                      bg="gray.300"
                      color={"black"}
                      hasArrow
                      label="View"
                      fontSize="sm"
                    >
                      <IconButton aria-label="view" icon={<VscPreview />} />
                    </Tooltip>
                    <Tooltip
                      bg="gray.300"
                      color={"black"}
                      hasArrow
                      label="Publish"
                      fontSize="sm"
                    >
                      <IconButton aria-label="publish" icon={<MdPublish />} />
                    </Tooltip>
                    <Tooltip
                      bg="gray.300"
                      color={"black"}
                      hasArrow
                      label="Edit Page in Notion"
                      fontSize="sm"
                    >
                      <IconButton aria-label="edit" icon={<BiEdit />} />
                    </Tooltip>
                  </Flex>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Flex>
      </Flex>
    </>
  );
}
