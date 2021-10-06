import "../styles/globals.scss";
import { LoginRegister } from "@components/Auth";
import { useUser } from "@lib/useUser";
import { UserContext } from "@lib/UserContext";
import { Toaster } from "react-hot-toast";
import { auth } from "@lib/firebase";

function MyApp({ Component, pageProps }) {
    const { user, loading } = useUser();
    if (loading) return <div>..Loading...</div>;
    else {
        if (!auth)
            return (
                <>
                    <Toaster />
                    <LoginRegister />
                </>
            );
        if (!user)
            return (
                <>
                    <Toaster />
                    <LoginRegister />
                </>
            );
        return (
            <UserContext.Provider value={{ user: user, loading: loading }}>
                <Toaster />
                <Component {...pageProps} />
            </UserContext.Provider>
        );
    }
}

export default MyApp;
