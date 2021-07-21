import { useContext } from "react";
import { UserContext } from "@lib/UserContext";
import { LogoutButton } from "@components/Auth";
import Nav from "@components/Nav";

export default function Home() {
  const user = useContext(UserContext);

  return (
    <>
      <Nav />
      <div>
        <h1>Welcome {user.displayName || "New user"} to dailyPoisson</h1>
        <LogoutButton />
      </div>
    </>
  );
}
