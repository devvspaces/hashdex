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
} from "@chakra-ui/react";
import {
  FiCalendar,
} from "react-icons/fi";
import { VscPreview } from "react-icons/vsc";
import { GrEdit } from "react-icons/gr";
import { MdPublish } from "react-icons/md";
import { BiTrash } from "react-icons/bi";

export default function Dashboard() {
  const [display, changeDisplay] = useState("hide");
  const [value, changeValue] = useState(1);
  return (
    <>
      <Heading fontWeight="normal" mb={4} letterSpacing="tight">
        See your published posts,{" "}
        <Flex display="inline-flex" fontWeight="bold">
          Calvin
        </Flex>
      </Heading>
      <Flex justifyContent="space-between" mt={8}>
        <Flex align="flex-end">
          <Heading as="h2" size="lg" letterSpacing="tight">
            Published Posts
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
                  <Text color="gray">Apr 24, 2021 at 1:40pm</Text>
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
                      <IconButton colorScheme="blue" aria-label="edit" icon={<VscPreview />} />
                    </Tooltip>
                    <Tooltip
                      bg="gray.300"
                      color={"black"}
                      hasArrow
                      label="Delete"
                      fontSize="sm"
                    >
                      <IconButton colorScheme="red" aria-label="delete" icon={<BiTrash />} />
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
