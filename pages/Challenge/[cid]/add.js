import { useRouter } from "next/router";
import { useForm } from "@lib/useForm";
import ImageUploader from "@components/ImageUploader";
import { useState } from "react";
import Image from "next/image";
import { firestore, Increment } from "@lib/firebase";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";

const CHOICES = 4;
const initData = {
  question: "",
  level: "Easy",
  time: 5,
  correct: "",
  choices: ["", "", "", ""],
  id: null,
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

  const [values, onChange, setForm] = useForm(initData);
  const [imgURL, setImgURL] = useState(null);

  const resetForm = () => {
    setForm(initData);
    setImgURL(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const batch = firestore.batch();

    const ref = firestore.collection("challenges").doc(cid);
    batch.update(ref, {
      question: Increment(1),
    });

    if (values.id !== null)
      questionRef = ref.collection("questions").doc(values.id);
    else questionRef = ref.collection("questions").doc();

    batch.set(questionRef, {
      ...values,
      time: parseInt(values.time) * 1000,
      imgURL,
    });

    try {
      batch.commit();
      toast.success(`Question "${values.question}" save success`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      challenge ID: {cid}
      {loading ? (
        "LOAINGD..."
      ) : (
        <QuestionList data={questionObject} setForm={setForm} />
      )}
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
      <button onClick={resetForm}>lo</button>
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

const QuestionList = ({ data, setForm }) => {
  return (
    <ul>
      {data.map((doc) => (
        <li key={doc.id} onClick={() => setForm(doc)}>
          {doc.question}
        </li>
      ))}
    </ul>
  );
};
