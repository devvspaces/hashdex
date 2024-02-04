import {
  GoogleAuthProvider,
  getAuth,
  Auth,
  signInWithPopup,
} from "firebase/auth";
import init from "@/lib/firebase/config";
import { useState, useEffect } from "react";
import { login } from "@/lib/api";
import { LOGIN, useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/router";
import routes from "@/lib/routes";
import { useToast } from "@chakra-ui/react";

export const useGoogleSignIn = () => {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { dispatch } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
  provider.addScope("https://www.googleapis.com/auth/userinfo.email");

  useEffect(() => {
    init();
    setAuth(getAuth());
  }, []);

  function signInWithGoogle() {
    if (auth == null) return;
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;

        if (user) {
          user.getIdToken().then((tkn) => {
            // Use token to login
            login({ token: tkn })
              .then((response) => {
                if (response.status == 200) {
                  setLoading(false);
                  toast({
                    title: "Login successful.",
                    description: "You have been logged in.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                  });
                  dispatch({ type: LOGIN });
                  if (!response.data.pat) {
                    router.push(routes.connect);
                  } else {
                    router.push(routes.home);
                  }
                  return;
                }
              })
              .catch((e: unknown) => {
                console.error(e);
                setLoading(false);
                toast({
                  title: "An error occurred.",
                  description: "Unable to login with Google.",
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                });
              });
          });
        }
      })
      .catch((error: any) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  return { auth, signInWithGoogle, loading };
};
