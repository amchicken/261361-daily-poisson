import Link from "next/link";
import Image from "next/image";
import { useState, useContext, useRef, useEffect } from "react";
import { UserContext } from "@lib/UserContext";
import { FaBars, FaSearch } from "react-icons/fa";
import { auth } from "@lib/firebase";

export default function Nav({ selected, setSelected }) {
  const { user } = useContext(UserContext);
  const [showLogOut, setShowLogOut] = useState(false);

  return (
    <nav className="nav">
      <div className="nav__float show">
        <div className="nav__float__top">
          <Image
            src={user.photoURL || "/notfound.png"}
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

          <li
            onClick={() => setSelected("profile")}
            style={
              selected == "profile" ? { color: "#48f36e" } : { color: "white" }
            }
          >
            PROFILE
          </li>
          <li
            onClick={() => setSelected("dailyChallenge")}
            style={
              selected == "dailyChallenge"
                ? { color: "#48f36e" }
                : { color: "white" }
            }
          >
            DAILY CHALLENGES
          </li>
          <li
            onClick={() => setSelected("leaderboard")}
            style={
              selected == "leaderboard"
                ? { color: "#48f36e" }
                : { color: "white" }
            }
          >
            LEADERBOARD
          </li>
          <li
            onClick={() => setSelected("repository")}
            style={
              selected == "repository"
                ? { color: "#48f36e" }
                : { color: "white" }
            }
          >
            REPOSITORY
          </li>
          <li
            onClick={() => setSelected("privateSession")}
            style={
              selected == "privateSession"
                ? { color: "#48f36e" }
                : { color: "white" }
            }
          >
            PRIVATE SESSION
          </li>
          <li
            onClick={() => setSelected("search")}
            style={
              selected == "search" ? { color: "#48f36e" } : { color: "white" }
            }
          >
            <FaSearch />
          </li>
          <span>CONTACT | ABOUT | HELP CENTER |</span>
        </ul>
      </div>
    </nav>
  );
}
