import { useRouter } from "next/router";
import Nav from "@components/Nav";
import { firestore, auth } from "@lib/firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaGooglePlay, FaShareAlt } from "react-icons/fa";
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

    const copyToClipBoard = () => {
        const el = document.createElement("input");
        el.value = window.location.href;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        toast("✔️ Successfully copy url to clipboard!");
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100vw",
                    height: "100vh",
                }}
            >
                {loading
                    ? "loading.."
                    : notFound
                    ? "NOT FOUND CHALLENGE"
                    : data && (
                          <div className="preview--card">
                              <span onClick={() => router.push(`/`)}>
                                  &#10006;
                              </span>
                              <div className="preview--card__header">
                                  {data.name}
                              </div>
                              <div className="preview--card__body">
                                  <div>About</div>
                                  <div>
                                      <div className="left">
                                          <div>
                                              <div>
                                                  <h1>LEVEL</h1>
                                                  <span>
                                                      {data.level.toUpperCase()}
                                                  </span>
                                                  <span>500 POINTS</span>
                                              </div>
                                              <div>
                                                  <h1>ITEMS</h1>
                                                  <span>{data.question}</span>
                                              </div>
                                              <div>
                                                  <h1>CATEGORY</h1>
                                                  <span
                                                      style={{
                                                          color: "#FF5555",
                                                          fontWeight: "600",
                                                      }}
                                                  >
                                                      {data.category.toUpperCase()}
                                                  </span>
                                              </div>
                                          </div>

                                          <section>
                                              <h1>Description</h1>
                                              <div>
                                                  <span>
                                                      {data.description}
                                                  </span>
                                              </div>
                                          </section>
                                          <footer>
                                              <i>
                                                  <FaShareAlt
                                                      onClick={() =>
                                                          copyToClipBoard()
                                                      }
                                                  />
                                              </i>
                                              <div>
                                                  {data.tags.map((tag, idx) => (
                                                      <span key={idx}>
                                                          {tag}
                                                      </span>
                                                  ))}
                                              </div>
                                          </footer>
                                      </div>
                                      <div className="right">
                                          <section>
                                              <header>The Creator</header>
                                              <div>
                                                  {owner && (
                                                      <>
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
                                                              Published Date{" "}
                                                              {data.createdAt
                                                                  ?.toDate()
                                                                  .toLocaleDateString()}
                                                          </h3>
                                                      </>
                                                  )}
                                              </div>
                                          </section>
                                          <footer>
                                              {owner && (
                                                  <div>
                                                      More From @
                                                      {owner.username}
                                                  </div>
                                              )}
                                              {data.played.includes(
                                                  auth.currentUser.uid
                                              ) ? (
                                                  "Already play this challenge"
                                              ) : (
                                                  <span>
                                                      <Image
                                                          onClick={() =>
                                                              router.push(
                                                                  `/Challenge/${cid}/play`
                                                              )
                                                          }
                                                          src="/submitBTN.png"
                                                          width={100}
                                                          height={100}
                                                          alt="button"
                                                      />
                                                  </span>
                                              )}
                                          </footer>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}
            </div>
            <div className="container__footer">DAILYPOISSON 2021 | SITE</div>
        </>
    );
}
