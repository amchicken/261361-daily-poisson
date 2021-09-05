import { useRouter } from "next/router";
import { useForm } from "@lib/useForm";
import ImageUploader from "@components/ImageUploader";
import { useState, useEffect } from "react";
import Image from "next/image";
import { firestore, Increment } from "@lib/firebase";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
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
          questionsList.map((doc) => (doc.id === values.id ? values : doc))
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
        setQuestionList((old) => [...old, { ...values, id: questionRef.id }]);
        toast.success(`Create question ${values.question} done`);
      });
    }
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      challenge ID: {cid} <br />
      {loading ? (
        "LOAINGD..."
      ) : questionsList.length === 0 ? (
        "no questions"
      ) : (
        <QuestionList
          data={questionsList}
          setQuestionList={setQuestionList}
          setForm={setForm}
          setImgURL={setImgURL}
          cid={cid}
        />
      )}
      {/* <JSONPretty id="json-pretty" data={questionsList} /> */}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Start Typing Your Question"
          value={values.question}
          name="question"
          onChange={onChange}
        />
        {imgURL === null ? (
          <ImageUploader placeholder="thumbnail" setImgURL={setImgURL} />
        ) : (
          <Image src={imgURL} width={300} height={300} alt="thumbnail" />
        )}
        <br />
        <label>level</label>
        <select value={values.level} name="level" onChange={onChange}>
          <option value="Easy">Easy</option>
          <option value="Med">Med</option>
          <option value="Hard">Hard</option>
        </select>
        <br />
        <label>Time</label>
        <select value={values.time} name="time" onChange={onChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
        <br />
        <InputGroup choices={values.choices} onChange={onChange} />
        <br />
        <label>correct choices</label>
        <select value={values.correct} name="correct" onChange={onChange}>
          {values.choices.map((doc, idx) => (
            <option key={idx}>{doc}</option>
          ))}
        </select>
        <button type="submit">save</button>
      </form>
      <button onClick={resetForm}>ResetForm</button>
      {/* <div>debug: {JSON.stringify(values)}</div> */}
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
    <ul>
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
          <button onClick={() => removeQuestion(doc.id, doc.question)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};
