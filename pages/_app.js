import "../styles/globals.scss";
import { LoginRegister } from "@components/Auth";
import { useUser } from "@lib/useUser";
import { UserContext } from "@lib/UserContext";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  const { user, loading } = useUser();

  if (loading) return <div>..Loading...</div>;
  else {
    if (!user) return <LoginRegister />;
    return (
      <UserContext.Provider value={user}>
        <Toaster />
        <Component {...pageProps} />
      </UserContext.Provider>
    );
  }
}

export default MyApp;
