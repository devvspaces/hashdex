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
import { BsGithub } from "react-icons/bs";

export default function Dashboard() {
  const [display, changeDisplay] = useState("hide");
  const [value, changeValue] = useState(1);
  return (
    <>
      <Heading fontWeight="normal" mb={4} letterSpacing="tight">
        Integrate{" "}
        <Flex display="inline-flex" fontWeight="bold">
          Github
        </Flex>
      </Heading>

      <Box textAlign={'center'} bg={'gray.200'} py={10} my={10}>
        <Heading mb={8}>Not Integrated Yet</Heading>
        <Button isDisabled leftIcon={<BsGithub />} colorScheme="purple" size="lg">
          Connect Github
        </Button>
      </Box>
    </>
  );
}
