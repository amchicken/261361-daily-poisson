import { useRouter } from "next/router";
import { useForm } from "@lib/useForm";
import ImageUploader from "@components/ImageUploader";
import { useState, useEffect } from "react";
import Image from "next/image";
import { firestore, Increment } from "@lib/firebase";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { FiClock } from "react-icons/fi";
import toast from "react-hot-toast";
import JSONPretty from "react-json-pretty";

const CHOICES = 4;
const initData = {
    question: "",
    level: "Easy",
    time: 5,
    correct: "",
    choices: ["", "", "", ""],
    id: null,
    imgURL: null,
};

export default function AddQuestionToChallenge() {
    const router = useRouter();
    const { cid } = router.query;
    const ref = firestore
        .collection("challenges")
        .doc(cid)
        .collection("questions");

    const [questionObject, loading] = useCollectionDataOnce(ref, {
        idField: "id",
    });

    const [questionsList, setQuestionList] = useState([]);
    useEffect(() => {
        if (!loading) setQuestionList(questionObject);
    }, [questionObject, loading]);

    const [values, onChange, setForm] = useForm(initData);
    const [imgURL, setImgURL] = useState(null);

    useEffect(() => {
        setForm({
            ...values,
            imgURL,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imgURL]);

    const resetForm = () => {
        setForm(initData);
        setImgURL(null);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const ref = firestore.collection("challenges").doc(cid);
        const mod = { ...values };
        delete mod.id;

        const batch = firestore.batch();

        if (values.id !== null) {
            //MODIFY OLD QUESTION
            const questionRef = ref.collection("questions").doc(values.id);
            batch.update(questionRef, mod);
            batch.commit().then(() => {
                setQuestionList(
                    questionsList.map((doc) =>
                        doc.id === values.id ? values : doc
                    )
                );
                toast.success(`Moddd updatee to question ${values.question}`);
            });
        } else {
            //CREATE NEW QUESTION
            const questionRef = ref.collection("questions").doc();
            batch.update(ref, {
                question: Increment(1),
            });
            batch.set(questionRef, mod);
            batch.commit().then(() => {
                setQuestionList((old) => [
                    ...old,
                    { ...values, id: questionRef.id },
                ]);
                toast.success(`Create question ${values.question} done`);
            });
        }
    };

    const goBack = () => {
        router.push("/");
    };

    return (
        <div className="container4">
            <div className="container4__inside">
                <div className="container4__inside__header">
                    <div></div>
                    <input
                        autoComplete="off"
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={onChange}
                        placeholder="Name This Challenge"
                    />
                    <p onClick={goBack}>&#10006;</p>
                </div>
                <div className="container4__inside__content">
                    {loading ? (
                        "LOADING..."
                    ) : (
                        <div className="container4__inside__content__left">
                            <div>ALL LISTS</div>
                            <QuestionList
                                data={questionsList}
                                setQuestionList={setQuestionList}
                                setForm={setForm}
                                setImgURL={setImgURL}
                                cid={cid}
                            />
                            <span>
                                <button onClick={resetForm}>
                                    + <span>ADD LIST</span>
                                </button>
                            </span>
                        </div>
                    )}
                    <div className="container4__inside__content__right">
                        {/* <JSONPretty id="json-pretty" data={questionsList} /> */}
                        <form onSubmit={onSubmit}>
                            <div className="title">
                                <input
                                    type="text"
                                    placeholder="Start Typing Your Question"
                                    value={values.question}
                                    name="question"
                                    onChange={onChange}
                                />
                            </div>
                            <div className="content">
                                <div>
                                    <div>
                                        <label>
                                            <FiClock />
                                            Time Limit
                                        </label>
                                        <select
                                            value={values.time}
                                            name="time"
                                            onChange={onChange}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={15}>15</option>
                                        </select>
                                    </div>
                                    <div>
                                        {imgURL === null ? (
                                            <ImageUploader
                                                placeholder="Upload image"
                                                setImgURL={setImgURL}
                                            />
                                        ) : (
                                            <Image
                                                src={imgURL}
                                                width={300}
                                                height={300}
                                                alt="thumbnail"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="choice">
                                <InputGroup
                                    choices={values.choices}
                                    onChange={onChange}
                                />

                                <label>correct choices</label>
                                <select
                                    value={values.correct}
                                    name="correct"
                                    onChange={onChange}
                                >
                                    {values.choices.map((doc, idx) => (
                                        <option key={idx}>{doc}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="footer">
                                <button type="submit">save</button>
                            </div>
                        </form>
                        {/* <div>debug: {JSON.stringify(values)}</div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

const InputGroup = ({ choices, onChange }) => {
    let Input = [];
    for (let i = 0; i < CHOICES; i++) {
        Input.push(
            <input
                key={i}
                type="text"
                placeholder={`${i + 1}`}
                value={choices[i]}
                onChange={(e) => {
                    let data = [...choices];
                    data[i] = e.target.value;
                    onChange({
                        target: { name: "choices", value: data },
                    });
                }}
                required
            />
        );
    }
    return Input;
};

const QuestionList = ({ data, setForm, setImgURL, cid, setQuestionList }) => {
    const removeQuestion = async (id, question) => {
        const batch = firestore.batch();
        const root = firestore.collection("challenges").doc(cid);
        const ref = root.collection("questions").doc(id);

        batch.update(root, {
            question: Increment(-1),
        });
        batch.delete(ref);
        batch.commit().then(() => {
            toast.success(`remove question: ${question}`);
            setQuestionList(data.filter((doc) => doc.id !== id));
        });
    };

    return (
        <ul className="question-list">
            {data.map((doc) => (
                <li key={doc.id}>
                    <h2
                        onClick={() => {
                            setForm(doc);
                            setImgURL(doc.imgURL);
                        }}
                    >
                        {doc.question}
                    </h2>
                    <span onClick={() => removeQuestion(doc.id, doc.question)}>
                        X
                    </span>
                </li>
            ))}
        </ul>
    );
};
