import { useRouter } from "next/router";
import Nav from "@components/Nav";
import { firestore, auth } from "@lib/firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaGooglePlay } from "react-icons/fa";
import { toast } from "react-hot-toast";

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
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {loading
                    ? "loading.."
                    : notFound
                    ? "NOT FOUND CHALLENGE"
                    : data && (
                          <div className="preview--card">
                              <span>&#10006;</span>
                              <div className="preview--card__header">
                                  {data.name}
                              </div>
                              <div className="preview--card__body">
                                  <div>About</div>
                                  <div className="preview--card__body__left">
                                      <div>
                                          <h1>LEVEL</h1>
                                          <span>{data.level}</span>
                                          <span>500 POINTS</span>
                                      </div>
                                      <div>
                                          <h1>ITEMS</h1>
                                          <span>{data.question}</span>
                                      </div>
                                      <div>
                                          <h1>CATEGORY</h1>
                                          <span>{data.category}</span>
                                      </div>
                                      <section>
                                          <h1>Description</h1>
                                          <span>{data.description}</span>
                                      </section>
                                      <footer>
                                          tags :{" "}
                                          {data.tags.map((tag, idx) => (
                                              <i key={idx}>{tag}</i>
                                          ))}
                                      </footer>
                                  </div>
                                  <div className="preview--card__body__right">
                                      <section>
                                          <header>The Creator</header>
                                          <div>
                                              {owner && (
                                                  <>
                                                      <div>
                                                          <Image
                                                              src={
                                                                  owner.photoURL ||
                                                                  "/notfound.png"
                                                              }
                                                              width={100}
                                                              height={100}
                                                              alt="createorphoto"
                                                          />
                                                          <h1>
                                                              @{owner.username}
                                                          </h1>
                                                          <h3>
                                                              Publisthed Date
                                                              {data.createdAt
                                                                  ?.toDate()
                                                                  .toJSON()}
                                                          </h3>
                                                      </div>
                                                      <div>
                                                          More From @
                                                          {owner.username}
                                                      </div>
                                                  </>
                                              )}
                                          </div>
                                          <footer>
                                              {data.played.includes(
                                                  auth.currentUser.uid
                                              ) ? (
                                                  "Already play this challenge"
                                              ) : (
                                                  <button
                                                      onClick={() =>
                                                          router.push(
                                                              `/Challenge/${cid}/play`
                                                          )
                                                      }
                                                  >
                                                      <FaGooglePlay />
                                                  </button>
                                              )}
                                          </footer>
                                      </section>
                                  </div>
                              </div>
                          </div>
                      )}
            </div>
            <div className="container__footer">DAILYPOISSON 2021 | SITE</div>
        </div>
    );
}
