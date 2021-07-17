import { useContext } from "react";
import { UserContext } from "@lib/UserContext";
import { LogoutButton } from "@components/Auth";

export default function Home() {
  const user = useContext(UserContext);

  return (
    <div>
      <h1>Welcome {user.displayName || "New user"} to dailyPoisson</h1>
      <LogoutButton />
    </div>
  );
}
