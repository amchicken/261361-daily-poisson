import { firestore, auth } from "@lib/firebase";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiFillPlayCircle, AiFillStop } from "react-icons/ai";
import { SiAdblock } from "react-icons/si";
import { get } from "lodash";
import { useRouter } from "next/router";
import {
  FaArrowCircleLeft,
  FaArrowCircleRight,
  FaWrench,
} from "react-icons/fa";

const LIMIT = 6;

export default function MyRepository({ sort = "date" }) {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [first, setFirst] = useState();
  const [last, setLast] = useState();
  const [firstDocment, setFirstDocment] = useState();
  const [lastDocment, setLastDocment] = useState();
  const [loading, setLoading] = useState(true);

  const getData = async (next = true) => {
    setLoading(true);
    const ref = firestore.collection("challenges");
    const query = ref
      .orderBy("createdAt", "desc")
      .where("createdBy", "==", auth.currentUser.uid)
      .limit(LIMIT);

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
      setFirst();
      setLast();
      setFirstDocment();
      setLastDocment();
      setData([]);
    };
  }, []);

  return loading ? (
    <div>Loding. ...</div>
  ) : (
    <>
      {data.map((doc) => (
        <React.Fragment key={doc.id}>
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
              <div>
                <Link href={`/Challenge/${doc.id}/general`} passHref>
                  <FaWrench />
                </Link>
              </div>
            </div>
          </div>
        </React.Fragment>
      ))}
      {!loading && (
        <>
          {firstDocment?.id === first?.id ? null : (
            <button className="back-btn" onClick={() => getData(false)}>
              <FaArrowCircleLeft />
            </button>
          )}
          {lastDocment?.id === last?.id ? null : (
            <button className="next-btn" onClick={() => getData(true)}>
              <FaArrowCircleRight />
            </button>
          )}
        </>
      )}
    </>
  );
}
