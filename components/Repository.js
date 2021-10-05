import { firestore, auth } from "@lib/firebase";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const LIMIT = 6;

export default function Repository({ sort = "date" }) {
  const [data, setData] = useState([]);
  const [first, setFirst] = useState();
  const [last, setLast] = useState();
  const [firstDocment, setFirstDocment] = useState();
  const [lastDocment, setLastDocment] = useState();
  const [loading, setLoading] = useState(true);

  const getData = async (next = true) => {
    setLoading(true);
    const ref = firestore.collection("challenges");
    let query;

    if (firstDocment || lastDocment) {
      if (next) {
        if (sort === "date") {
          query = ref
            .orderBy("createdAt", "desc")
            .startAfter(lastDocment.createdAt)
            .limit(LIMIT);
        } else {
          query = ref
            .orderBy("play", "desc")
            .startAfter(lastDocment.createdAt)
            .limit(LIMIT);
        }
      } else {
        if (sort === "date") {
          query = ref
            .orderBy("createdAt", "asc")
            .startAfter(firstDocment.createdAt)
            .limit(LIMIT);
        } else {
          query = ref
            .orderBy("play", "asc")
            .startAfter(firstDocment.createdAt)
            .limit(LIMIT);
        }
      }
    } else {
      if (sort === "date") {
        query = ref.orderBy("createdAt", "desc").limit(LIMIT);
      } else {
        query = ref.orderBy("play", "asc").limit(LIMIT);
      }
    }

    console.log(query);

    const firestoreData = (await query.get()).docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });

    //REVERS ASC TO DESC
    if (!next) firestoreData.reverse();

    setData(firestoreData);

    setFirstDocment(firestoreData[0]);
    setLastDocment(firestoreData[firestoreData.length - 1]);

    //FIRSTIME ONLY
    if (!first) setFirst(firestoreData[0]);
    if (!last) {
      const last = (
        await ref.orderBy("createdAt", "asc").limit(1).get()
      ).docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      setLast(last[0]);
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
    return () => {
      setData([]);
      console.log("DESTROY");
    };
  }, []);

  useEffect(() => {
    setFirst(undefined);
    setLast(undefined);
    getData();
    console.log(first, last);
  }, [sort]);

  return loading ? (
    <div>Loding. ...</div>
  ) : (
    <>
      {data.map((doc) => (
        <React.Fragment key={doc.id}>
          <Link href={`challenge/${doc.id}`} passHref key={doc.id}>
            <div className="container__right__content__card">
              <div className="container__right__content__card__show">
                <Image
                  src={doc.thumbnail || "/notfound.png"}
                  width={100}
                  height={100}
                  quality={100}
                  alt="thumbnail"
                />
                <div>
                  <p>{doc.name}</p>
                  <h4>{doc.question} Items</h4>
                  <span>{doc.category}</span>
                  <h4>{doc.level.toUpperCase()}</h4>
                </div>
              </div>
              <div className="container__right__content__card__float">
                {doc.played?.includes(auth.currentUser.uid) ? (
                  <div>ALR PLAY</div>
                ) : (
                  <div>
                    <Image src="/img/btn.png" layout="fill" alt="button" />
                  </div>
                )}
              </div>
            </div>
          </Link>
        </React.Fragment>
      ))}
      {firstDocment.id === first?.id ? null : (
        <button style={{ position: "absolute" }} onClick={() => getData(false)}>
          back
        </button>
      )}
      {lastDocment.id === last?.id ? null : (
        <button style={{ position: "absolute" }} onClick={() => getData(true)}>
          NEXT
        </button>
      )}
    </>
  );
}
