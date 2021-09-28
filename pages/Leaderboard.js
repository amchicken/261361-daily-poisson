import { firestore } from "@lib/firebase";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import Nav from "@components/Nav";
import JSONPretty from "react-json-pretty";

export default function Leaderboard() {
  const [data, loading] = useCollectionDataOnce(
    firestore.collection("usernames").orderBy("points", "desc").limit(10)
  );

  if (loading) return <div>Loading...</div>;
  return (
    <div className="container">
      <Nav />
      <div style={{ backgroundColor: "white" }}>
        <JSONPretty id="json-pretty" data={data} />
      </div>
      <div className="container__footer">DAILYPOISSON 2021 | SITE</div>
    </div>
  );
}
