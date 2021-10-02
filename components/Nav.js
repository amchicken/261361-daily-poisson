import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useContext, useRef, useEffect } from "react";
import { UserContext } from "@lib/UserContext";
import { FaBars, FaSearch } from "react-icons/fa";
import { auth } from "@lib/firebase";

export default function Nav({ selected, setSelected }) {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const current = router.pathname.split("/")[1];
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
            <Image
              src="/img/logo.png"
              width="90"
              height="64"
              alt="logo"
              className="pointer"
            />
          </Link>

          <li
            style={
              current == "profile" ? { color: "#48f36e" } : { color: "white" }
            }
          >
            <Link href="/profile" passHref>
              PROFILE
            </Link>
          </li>
          <li style={current == "" ? { color: "#48f36e" } : { color: "white" }}>
            <Link href="/" passHref>
              DAILY CHALLENGES
            </Link>
          </li>
          <li
            style={
              current == "leaderboard"
                ? { color: "#48f36e" }
                : { color: "white" }
            }
          >
            <Link href="/leaderboard" passHref>
              LEADERBOARD
            </Link>
          </li>
          <li
            style={
              current == "repository"
                ? { color: "#48f36e" }
                : { color: "white" }
            }
          >
            <Link href="/" passHref>
              REPOSITORY
            </Link>
          </li>
          {/* <li
            onClick={() => setSelected("privateSession")}
            style={
              current == "privateSession"
                ? { color: "#48f36e" }
                : { color: "white" }
            }
          >
            PRIVATE SESSION
          </li> */}
          <li
            style={
              current == "search" ? { color: "#48f36e" } : { color: "white" }
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
