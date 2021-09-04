import { useContext } from "react";
import { UserContext } from "@lib/UserContext";
import { LogoutButton } from "@components/Auth";
import Nav from "@components/Nav";

export default function Home() {
    const user = useContext(UserContext);

    return (
        <>
            <Nav />
            <div></div>
        </>
    );
}
