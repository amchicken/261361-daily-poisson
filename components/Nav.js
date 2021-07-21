import Link from "next/link";
import Image from "next/image";
import { useState, useContext } from "react";
import { UserContext } from "@lib/UserContext";
import { LogoutButton } from "@components/Auth";

export default function Nav() {
  const [usermenu, setUserMenu] = useState(false);
  const user = useContext(UserContext);
  console.log(user);

  return (
    <nav className="nav">
      <div className="nav__left-side">
        <Image
          onClick={() => setUserMenu(true)}
          src={"/img/dog.jpg"}
          width={50}
          height={50}
          alt="dog"
        />
        <button>+</button>
        <Link href="/explore">Explore</Link>
        <Link href="/discuss">Discuss</Link>
      </div>
      {usermenu ? (
        <div className="nav__float">
          <button onClick={() => setUserMenu(false)}>X</button>
          <h2>{JSON.stringify(user.displayName)}</h2>
          <LogoutButton />
        </div>
      ) : null}
      <div className="nav__middle">Logo</div>
    </nav>
  );
}
