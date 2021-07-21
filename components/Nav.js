import Link from "next/link";
import Image from "next/image";
import { useState, useContext } from "react";
import { UserContext } from "@lib/UserContext";
import { LogoutButton } from "@components/Auth";

export default function Nav() {
  const [usermenu, setUserMenu] = useState(false);
  const user = useContext(UserContext);

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
      <div className={usermenu ? "nav__float show" : "nav__float hidden"}>
        <button onClick={() => setUserMenu(false)}>X</button>
        <div>
          <Image
            src={user.photoURL}
            width={50}
            height={50}
            alt="profile-image"
          />
          <h2>{user.displayName}</h2>
        </div>
        <ul>
          <li>Profile</li>
          <li>Daliy challenges</li>
          <li>Leaderboard</li>
        </ul>
        <LogoutButton />
      </div>

      <div className="nav__middle">Logo</div>
    </nav>
  );
}
