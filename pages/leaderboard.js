import { firestore } from "@lib/firebase";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { useState, useEffect, useCallback } from "react";
import Nav from "@components/Nav";
import JSONPretty from "react-json-pretty";
import Image from "next/image";
import _ from "lodash";
import toast from "react-hot-toast";

const LIMIT = 10;

export default function Leaderboard() {
  const [firestoreData, dataLoading] = useCollectionDataOnce(
    firestore.collection("usernames").orderBy("points", "desc").limit(LIMIT),
    { idField: "id" }
  );
  // console.log(firestoreData);

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
    let target = data?.filter(
      (doc, index) =>
        doc.name.toLowerCase().split(" ").includes(input.toLowerCase()) ||
        doc.username.toLowerCase().split(" ").includes(input.toLowerCase()) ===
          input
    );

    if (target?.length === 0) {
      console.log("FIRESOTRE");
      const ref = firestore
        .collection("usernames")
        .where("name", "==", input)
        .where("username", "==", input);
      target = (await ref?.get()).docs?.map((doc) => {
        return { ...doc.data(), index: `${LIMIT}++` };
      });
    }

    if (search === "" && target?.length === 0) {
      toast.error("NOT FOUND");
    }

    setLoading(false);
    setSerchData(target);
  }

  function handleChange(e) {
    setSearch(e.target.value);
    debounceFn(e.target.value);
  }

  const resetFilter = () => {
    setSearch("");
    setSerchData(firestoreData);
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div className="container">
      <Nav />
      <div className="leaderboard">
        <header>
          <h1>LEADERBOARD</h1>
        </header>
        <section>
          <div>
            <h4>SEARCH</h4>
            <input
              type="text"
              value={search}
              onChange={handleChange}
              placeholder="TYPE HERE"
            />
            <button onClick={() => resetFilter()}>RESET FILTER</button>
          </div>
          <div>
            <div>
              <div>P L A Y E R S</div>
              <div></div>
              <div>P O I N T S</div>
            </div>
            {serchData?.length > 0
              ? serchData?.map((doc) => (
                  <div key={doc.id}>
                    <div>#{doc.index}</div>
                    <div>
                      <Image
                        src={doc.photoURL || "/notfound.png"}
                        width={30}
                        height={30}
                        alt="photoURL"
                      />
                      {doc.username}
                    </div>
                    <div>{doc.points}</div>
                  </div>
                ))
              : data?.map((doc) => (
                  <div key={doc.id}>
                    <div>#{doc.index}</div>
                    <div>
                      <Image
                        src={doc.photoURL || "/notfound.png"}
                        width={30}
                        height={30}
                        alt="photoURL"
                      />
                      {doc.username}
                    </div>
                    <div>{doc.points}</div>
                  </div>
                ))}
          </div>
        </section>
      </div>
      <div className="container__footer">DAILYPOISSON 2021 | SITE</div>
    </div>
  );
}
