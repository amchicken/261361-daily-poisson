import { useRouter } from "next/router";
import Nav from "@components/Nav";
import { firestore } from "@lib/firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ChallengeIndex() {
  const router = useRouter();
  const { cid } = router.query;

  const [data, setData] = useState();
  const [notFound, setNotFound] = useState(false);
  const [doc, loading] = useDocumentOnce(
    firestore.collection("challenges").doc(cid)
  );
  const [owner, setOwner] = useState();

  useEffect(() => {
    const prep = async () => {
      if (!loading) {
        if (doc.exists) {
          const target = doc.data();
          setData(target);
          if (target.createdBy) {
            setOwner(
              (
                await firestore
                  .collection("usernames")
                  .doc(target.createdBy)
                  .get()
              ).data()
            );
          }
        } else setNotFound(true);
      }
    };

    prep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div className="container">
      <Nav />
      <div style={{ backgroundColor: "#fff" }}>
        {loading
          ? "loading.."
          : notFound
          ? "NOT FOUND CHALLENGE"
          : data && (
              <>
                {data.name}
                <br />
                <Image
                  src={data.thumbnail || "/notfound.png"}
                  width={100}
                  height={100}
                  alt="challenge thumbnail"
                />
                <br />
                level {data.level}
                <br />
                estimatepoint <b>500</b>
                <br />
                item {data.question}
                <br />
                category {data.category}
                <br />
                description {data.description}
                <br />
                tags :{" "}
                {data.tags.map((tag, idx) => (
                  <i key={idx}>{tag}</i>
                ))}
                <br />
                <br />
                <br />
                The Creator:{" "}
                {owner && (
                  <>
                    @{owner.username} <br />
                    Publisthed Date:{data.createdAt?.toDate().toJSON()}
                    <br />
                    More Form @{owner.username}
                  </>
                )}
              </>
            )}
      </div>
      <div className="container__footer">DAILYPOISSON 2021 | SITE</div>
    </div>
  );
}
