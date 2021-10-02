import { firestore } from "@lib/firebase";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { useState, useEffect, useCallback } from "react";
import Nav from "@components/Nav";
import JSONPretty from "react-json-pretty";
import Image from "next/image";
import _ from "lodash";
import toast from "react-hot-toast";

const LIMIT = 5;

export default function Leaderboard() {
  const [firestoreData, dataLoading] = useCollectionDataOnce(
    firestore.collection("usernames").orderBy("points", "desc").limit(LIMIT),
    { idField: "id" }
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [serchData, setSerchData] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(dataLoading);
  }, [dataLoading]);

  useEffect(() => {
    if (firestoreData)
      setData(
        firestoreData.map((doc, index) => {
          return { ...doc, index: index + 1 };
        })
      );
  }, [firestoreData]);

  const debounceFn = useCallback(_.debounce(handleDB, 1000), [data]);

  async function handleDB(input) {
    setLoading(true);
    let target = data.filter(
      (doc, index) =>
        doc.name.toLowerCase().split(" ").includes(input.toLowerCase()) ||
        doc.username.toLowerCase().split(" ").includes(input.toLowerCase()) ===
          input
    );

    if (target.length === 0) {
      console.log("FIRESOTRE");
      const ref = firestore
        .collection("usernames")
        .where("name", "==", input)
        .where("username", "==", input);
      target = (await ref.get()).docs.map((doc) => {
        return { ...doc.data(), index: `${LIMIT}++` };
      });
    }

    if (search === "" && target.length === 0) {
      toast.error("NOT FOUND");
    }

    setLoading(false);
    setSerchData(target);
  }

  function handleChange(e) {
    setSearch(e.target.value);
    debounceFn(e.target.value);
  }

  if (loading) return <div>Loading...</div>;
  return (
    <div className="container">
      <div style={{ backgroundColor: "white" }}>
        <input type="text" value={search} onChange={handleChange} />
        <button onClick={() => setSearch("")}>Clear seach</button>
        <div>
          {serchData.length > 0
            ? serchData.map((doc) => (
                <div key={doc.id}>
                  <Image
                    src={doc.photoURL}
                    width={30}
                    height={30}
                    alt="photoURL"
                  />
                  #{doc.index} {doc.username}
                  {doc.points}
                </div>
              ))
            : data.map((doc) => (
                <div key={doc.id}>
                  <Image
                    src={doc.photoURL}
                    width={30}
                    height={30}
                    alt="photoURL"
                  />
                  #{doc.index} {doc.username}
                  {doc.points}
                </div>
              ))}
        </div>
      </div>
      <div className="container__footer">DAILYPOISSON 2021 | SITE</div>
    </div>
  );
}
