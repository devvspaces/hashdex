import Head from "next/head";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaHashnode } from "react-icons/fa6";
import withAuth from "@/lib/withAuth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setHashnodePat } from "@/lib/api";
import { useRouter } from "next/router";
import routes from "@/lib/routes";
import { AxiosError } from "axios";
import { formErrorHandler } from "@/lib/handlers";
import { ErrorResponse } from "@/lib/api.types";
import client from "@/lib/hashnode";
import { GET_PUBLICATIONS } from "@/lib/queries";
import { useAuth } from "@/lib/AuthContext";
import secureCall from "@/lib/secureCall";

function Connect() {
  const router = useRouter();
  const { state, dispatch } = useAuth();
    const toast = useToast();
  const formik = useFormik({
    initialValues: {
      pat: "",
    },
    validationSchema: Yup.object({
      pat: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { setFieldError }) => {
      // Validate pat
      localStorage.setItem("pat", values.pat);
      try {
        const { data } = await client.query({
          query: GET_PUBLICATIONS,
        });
        const edges = data.me.publications.edges;
        if (edges.length == 0) {
          setFieldError("pat", "You have no publications on Hashnode.");
          return;
        }
      } catch (e) {
        console.log(e);
        setFieldError("pat", "Invalid PAT");
        return;
      }
      try {
        const response = await secureCall<Awaited<ReturnType<typeof setHashnodePat>>>(() => setHashnodePat(values.pat), dispatch, router);
        if (response?.status == 200) {
          router.push(routes.home);
          return;
        }
        setFieldError("pat", "Error saving PAT");
        return;
      } catch (e: unknown) {
        if (e instanceof AxiosError) {
          if (e.response?.status == 400) {
            formErrorHandler(
              e.response?.data as ErrorResponse,
              ["pat"],
              setFieldError,
              toast
            );
          }
        }
      }
    },
  });

  return (
    <>
      <Head>
        <title>Hashdex - Connect Hashnode account</title>
      </Head>
      <section>
        <Box>
          <Box py={"7rem"} bg={"ghostwhite"} textAlign={"center"}>
            <Heading mb={0} size={"3xl"}>
              Welcome to HashDex
            </Heading>
          </Box>
          <Container maxW={"container.md"} py={"4rem"}>
            <Box>
              <Box textAlign={"center"} mb={"4rem"}>
                <Heading mb={4}>Connect your Hashnode account</Heading>
                <Text>
                  To get started, please connect your Hashnode account.
                </Text>
              </Box>
              <Box>
                <form onSubmit={formik.handleSubmit}>
                  <FormControl
                    id="pat"
                    mb={5}
                    isInvalid={!!formik.errors.pat && formik.touched.pat}
                  >
                    <Input
                      type={"password"}
                      size={"lg"}
                      placeholder={"Enter your PAT"}
                      textAlign={"center"}
                      value={formik.values.pat}
                      onChange={formik.handleChange}
                    />
                    <FormErrorMessage>{formik.errors.pat}</FormErrorMessage>
                  </FormControl>
                  <Button
                    leftIcon={<FaHashnode />}
                    size={"lg"}
                    mx={"auto"}
                    display={"block"}
                    colorScheme="purple"
                    isLoading={formik.isSubmitting}
                    type="submit"
                  >
                    Connect Hashnode Account
                  </Button>
                </form>
              </Box>
            </Box>
          </Container>
        </Box>
      </section>
    </>
  );
}

export default withAuth(Connect);
