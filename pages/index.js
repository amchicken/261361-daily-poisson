import { useContext } from "react";
import { UserContext } from "@lib/UserContext";
import { LogoutButton } from "@components/Auth";
import ChallangeSelector from "@components/ChallangeSelector";
import Nav from "@components/Nav";

export default function Home() {
    const user = useContext(UserContext);

    return (
        <>
            <div className="container">
                <Nav />
                <ChallangeSelector />
                <div className="container__footer">
                    DAILYPOISSON 2021 | SITE
                </div>
            </div>
        </>
    );
}
