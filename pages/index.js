import Nav from "@components/Nav";
import { IoReload } from "react-icons/io5";
import Link from "next/link";
import Repository from "@components/Repository";
import { useState } from "react";

export default function Home() {
  const [subMenu, setSubMenu] = useState("home");
  return (
    <>
      <div className="container">
        <Nav />
        <div className="container__right">
          <>
            <div className="container__right__header">
              <span
                className="pointer"
                style={subMenu === "home" ? { fontWeight: 600 } : null}
                onClick={() => setSubMenu("home")}
              >
                HOME
              </span>
              <span
                className="pointer"
                style={subMenu === "topplay" ? { fontWeight: 600 } : null}
                onClick={() => setSubMenu("topplay")}
              >
                TOP PLAY
              </span>
            </div>
            <div className="container__right__content">
              {subMenu === "home" ? <Repository /> : null}
              {subMenu === "topplay" ? <Repository sort="play" /> : null}
            </div>
            <div className="container__right__footer">
              <Link href="/challenge/create" passHref>
                <button>CREATE YOUR CHALLENGE</button>
              </Link>
            </div>
          </>
        </div>
        <div className="container__footer">DAILYPOISSON 2021 | SITE</div>
      </div>
    </>
  );
}
