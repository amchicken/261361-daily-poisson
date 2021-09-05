import Link from "next/link";
import Image from "next/image";
import { useState, useContext, useRef, useEffect } from "react";
import { UserContext } from "@lib/UserContext";
import { LogoutButton } from "@components/Auth";
import { FaBars, FaSearch } from "react-icons/fa";
import { useClickOutSide } from "@lib/useClickOutSide";
import { useMediaQuery } from "react-responsive";

export default function Nav() {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [usermenu, setUserMenu] = useState(false);
    const user = useContext(UserContext);
    const navRef = useClickOutSide(() => {
        setUserMenu(false);
    });

    if (isMobile) {
        return (
            <nav className="nav">
                {usermenu ? (
                    <></>
                ) : (
                    <div
                        className="nav__left-side"
                        onClick={() => setUserMenu(true)}
                    >
                        <FaBars />
                    </div>
                )}
                <div
                    className={
                        usermenu ? "nav__float show" : "nav__float hidden"
                    }
                    ref={navRef}
                >
                    <div className="nav__float__top">
                        <Image
                            src={user.photoURL}
                            width={100}
                            height={100}
                            alt="profile-image"
                        />
                        <span>@{user.displayName}</span>
                        <div className="nav__float__top line"></div>
                    </div>
                    <ul className="nav__float__list">
                        <Image src="/img/logo.png" width="90" height="64" />
                        <li>PROFILE</li>
                        <li>DAILY CHALLENGES</li>
                        <li>LEADERBOARD</li>
                        <li>REPOSITORY</li>
                        <li>PRIVATE SESSION</li>
                        <li>
                            <FaSearch style={{ color: "#48F36E" }} />
                        </li>
                        <span>CONTACT | ABOUT | HELP CENTER</span>
                    </ul>
                </div>
            </nav>
        );
    }

    return (
        <nav className="nav">
            <div className="nav__float show" ref={navRef}>
                <div className="nav__float__top">
                    <Image
                        src={user.photoURL}
                        width={100}
                        height={100}
                        alt="profile-image"
                    />
                    <span>{user.displayName}</span>
                    <div className="nav__float__top line"></div>
                </div>
                <ul className="nav__float__list">
                    <Image src="/img/logo.png" width="90" height="64" />
                    <li>PROFILE</li>
                    <li>DAILY CHALLENGES</li>
                    <li>LEADERBOARD</li>
                    <li>REPOSITORY</li>
                    <li>PRIVATE SESSION</li>
                    <li>
                        <FaSearch style={{ color: "#48F36E" }} />
                    </li>
                    <span>CONTACT | ABOUT | HELP CENTER</span>
                </ul>
            </div>
        </nav>
    );
}
