import Link from "next/link";
import Image from "next/image";
import { useState, useContext, useRef, useEffect } from "react";
import { UserContext } from "@lib/UserContext";
import { LogoutButton } from "@components/Auth";
import { FaBars, FaSearch } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import { auth } from "@lib/firebase";

export default function Nav() {
  const { user } = useContext(UserContext);
  const [showLogOut, setShowLogOut] = useState(false);

  return (
    <nav className="nav">
      <div className="nav__float show">
        <div className="nav__float__top">
          <Image
            src={user.photoURL}
            width={100}
            height={100}
            alt="profile-image"
          />
          {showLogOut ? (
            <div className="logout-box">
              <div>
                <div>@{user.username}</div>
                <span>{user.email}</span>
              </div>
              <button onClick={() => auth.signOut()}>SIGN OUT</button>
            </div>
          ) : (
            <span onClick={() => setShowLogOut(!showLogOut)}>
              @{user.username}
            </span>
          )}
          <div className="nav__float__top line"></div>
        </div>
        <ul className="nav__float__list" onClick={() => setShowLogOut(false)}>
          <Link href="/" passHref>
            <Image src="/img/logo.png" width="90" height="64" alt="logo" />
          </Link>

          <li>
            <Link href="/Profile" passHref>
              PROFILE
            </Link>
          </li>
          <li>DAILY CHALLENGES</li>
          <li>LEADERBOARD</li>
          <li>REPOSITORY</li>
          <li>PRIVATE SESSION</li>
          <li>
            <FaSearch />
          </li>
          <span>CONTACT | ABOUT | HELP CENTER |</span>
        </ul>
      </div>
    </nav>
  );
}
