import { useEffect, useState } from "react";
import Image from "next/image";
import _ from "lodash";
import { POINTS } from "@lib/constants";
import { useRouter } from "next/router";
import {
    auth,
    firestore,
    serverTimestamp,
    arrayUnion,
    Increment,
} from "@lib/firebase";
import {
    useCollectionDataOnce,
    useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
// kPxbkD5hWipVYVlkUyFY

export default function Submitx() {
    const router = useRouter();
    const { cid } = router.query;
    const [timer, setTimer] = useState();
    const [index, setIndex] = useState();
    const [current, setCurrent] = useState();
    //   const [loading, setLoading] = useState(true);
    const [document, loading] = useCollectionDataOnce(
        firestore.collection("challenges").doc(cid).collection("questions")
    );
    const [challengeDetail, detailLoading] = useDocumentDataOnce(
        firestore.collection("challenges").doc(cid)
    );

    const [data, setData] = useState([]);
    const [answer, setAnswer] = useState("");
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (!loading && timer > 0) setTimer((time) => time - 1);
        }, 1000);

        return () => {
            clearInterval(myInterval);
        };
    });

    useEffect(() => {
        if (!loading) {
            setIndex(-1);
            setTimer(4);
            setFinished(false);
            setData(_.shuffle(document));
        }
    }, [loading]);

    useEffect(() => {
        if (timer === 0 && index < data.length) setIndex((idx) => idx + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer]);

    useEffect(() => {
        if (index > -1) {
            if (index < data.length) {
                setCurrent(data[index]);
                setTimer(data[index].time);
            } else {
                setCurrent();
                setTimer();
            }
        }
        if (index === data.length) {
            setFinished(true);
            updateScore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    useEffect(() => {
        if (
            typeof current !== "undefined" &&
            answer !== "" &&
            answer === current.correct
        )
            setScore((old) => old + POINTS(current.level));

        if (index < data.length) setIndex((idx) => idx + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answer]);

    async function updateScore() {
        const batch = firestore.batch();
        const userRef = firestore
            .collection("usernames")
            .doc(auth.currentUser.uid);
        const historyRef = userRef.collection("history").doc(cid);
        const challengeRef = firestore.collection("challenges").doc(cid);

        if (challengeDetail.played.includes(auth.currentUser.uid)) {
            console.log("ALRE PLAY");
        } else {
            if (typeof challengeDetail.played !== "undefined")
                batch.update(challengeRef, {
                    played: arrayUnion(auth.currentUser.uid),
                    play: Increment(1),
                });
            else
                batch.update(challengeRef, {
                    played: [auth.currentUser.uid],
                    play: Increment(1),
                });

            batch.update(userRef, {
                points: Increment(score),
                lastSeen: serverTimestamp(),
            });

            batch.set(historyRef, {
                name: challengeDetail.name,
                points: score,
                createdAt: serverTimestamp(),
            });

            batch.commit();
        }
    }

    return (
        <div className="App">
            {/* <div>
        <span>Debug</span>
        <br />
        <span>timer : {timer}</span>
        <br />
        <span>index : {index}</span>
        <br />
        <span>data.lenght : {data.length}</span>
        <br />
        <span>current : {JSON.stringify(current)}</span>
        <br />
      </div> */}
            <div className="playCard">
                <span onClick={() => router.push(`/`)}>&#10006;</span>
                <div className="playCard__header">
                    <h1>{detailLoading ? null : challengeDetail.name}</h1>
                </div>
                <div className="playCard__body">
                    {loading ? (
                        <div className="question--list">
                            <div></div>
                            <span>Loadinssg...</span>
                        </div>
                    ) : (
                        <div>
                            {index === -1 ? (
                                <div className="question--list">
                                    {timer === 4 ? (
                                        <>
                                            <div> </div>
                                            <span>READY?</span>
                                        </>
                                    ) : (
                                        <>
                                            <div> </div>
                                            <span>{timer}</span>
                                        </>
                                    )}
                                </div>
                            ) : null}
                            {!finished ? (
                                current && (
                                    <>
                                        <div className="question--list">
                                            <div>
                                                Question {index + 1} out of{" "}
                                                {data.length} time left :{" "}
                                                {timer}
                                            </div>
                                            <span>{current.question}</span>
                                        </div>
                                        <div className="question--image">
                                            <Image
                                                src={
                                                    current.imgURL ||
                                                    "/notfound.png"
                                                }
                                                width={300}
                                                height={300}
                                                alt={current.question}
                                            />
                                        </div>
                                        <div className="question--choice">
                                            <QustionList
                                                data={current.choices}
                                                setAnswer={setAnswer}
                                            />
                                        </div>
                                    </>
                                )
                            ) : (
                                <div className="question--finish">
                                    <div>
                                        <Image
                                            src="/trophy.png"
                                            alt="trophy"
                                            layout="fill"
                                        />
                                    </div>
                                    <h1>Well Done, Username !</h1>
                                    <h2>Correct answer: ...</h2>
                                    <h3>Point Gained: {score}</h3>
                                    <h4>Rank: ...</h4>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function QustionList({ data, setAnswer }) {
    return data.map((doc, idx) => (
        <div key={idx} onClick={() => setAnswer(doc)}>
            <div>{doc}</div>
        </div>
    ));
}
