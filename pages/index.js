import { useContext, useState } from "react";
import ChallangeSelector from "@components/ChallangeSelector";
import Nav from "@components/Nav";
import ProfilePage from "@components/Profile";
import Leaderboard from "@components/Leaderboard";

export default function Home() {
  const [selected, setSelected] = useState("dailyChallenge");

  return (
    <>
      <div className="container">
        <Nav selected={selected} setSelected={setSelected} />
        {selected == "profile" ? <ProfilePage /> : <></>}
        {selected == "dailyChallenge" ? <ChallangeSelector /> : <></>}
        {selected == "leaderboard" ? <Leaderboard /> : <></>}
        <div className="container__footer">DAILYPOISSON 2021 | SITE</div>
      </div>
    </>
  );
}
