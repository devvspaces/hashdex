import { useRouter } from "next/router";
import { me } from "../lib/api";
import { LOGIN, useAuth } from "./AuthContext";
import { useEffect } from "react"
import secureCall from "./secureCall";
import routes from "./routes";


function withAuth(Component: any) {
  return function WithAuth(props: any) {
    const { state, dispatch } = useAuth();
    const router = useRouter();

    useEffect(() => {
      async function checkAuthenticated() {
        try {
          const response = await secureCall<Awaited<ReturnType<typeof me>>>(me, dispatch, router);
          if (response?.status == 200) {
            dispatch({ type: LOGIN, payload: response.data });
            if (!response?.data.pat && router.pathname != routes.connect) {
              router.push(routes.connect);
            }
            localStorage.setItem("pat", response.data.pat);
            return;
          }
        } catch (e) {}
      }
      checkAuthenticated();
    }, [dispatch, router]);

    if (state.isAuthenticated) {
      return <Component {...props} />;
    } else {
      return <p>You are not logged in.</p>;
    }
  };
}

export default withAuth;