import Link from "next/link";
import Image from "next/image";
import { useState, useContext, useRef, useEffect } from "react";
import { UserContext } from "@lib/UserContext";
import { LogoutButton } from "@components/Auth";
import { FaBars } from 'react-icons/fa'

export default function Nav() {
  const [usermenu, setUserMenu] = useState(false);
  const user = useContext(UserContext);
  const navRef = useRef(null);

  function clickOutsideNav(ref) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setUserMenu(false)
            }
        }
  
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
  }

  clickOutsideNav(navRef)

  return (
    <nav className="nav">
      <div className="nav__left-side"
       onClick={() => setUserMenu(true)}
      >
        <FaBars />
      </div>
      <div className={usermenu ? "nav__float show" : "nav__float hidden"} ref={navRef}>
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
    </nav>
  );
}
