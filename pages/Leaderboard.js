import { firestore } from "@lib/firebase";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { useState, useEffect, useCallback } from "react";
import Nav from "@components/Nav";
import JSONPretty from "react-json-pretty";
import Image from "next/image";
import _ from "lodash";

export default function Leaderboard() {
  const [data, dataLoading] = useCollectionDataOnce(
    firestore.collection("usernames").orderBy("points", "desc").limit(3),
    { idField: "id" }
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(dataLoading);
  }, [dataLoading]);

  const debounceFn = useCallback(_.debounce(handleDB, 1000), []);

  function handleDB(input) {
    console.log(input);
  }

  function handleChange(e) {
    setSearch(e.target.value);
    debounceFn(e.target.value);
  }

  const [selected, setSelected] = useState("leaderboard");

  if (loading) return <div>Loading...</div>;
  return (
    <div className="container">
      <Nav setSelected={setSelected} />
      <div style={{ backgroundColor: "white" }}>
        <input type="text" onChange={handleChange} />
        <div>
          {data.map((doc, idx) => (
            <div key={doc.id}>
              <Image src={doc.photoURL} width={30} height={30} alt="photoURL" />
              {idx + 1} {doc.username}
              {doc.points}
            </div>
          ))}
        </div>
        <JSONPretty id="json-pretty" data={data} />
      </div>
      <div className="container__footer">DAILYPOISSON 2021 | SITE</div>
    </div>
  );
}
