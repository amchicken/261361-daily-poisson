import { useForm } from "@lib/useForm";
import { useState } from "react";
import { auth, firestore } from "@lib/firebase";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import ImageUploader from "@components/ImageUploader";

export default function Create() {
  const router = useRouter();
  const [values, onChange] = useForm({
    name: "",
    category: "",
    description: "",
    level: "",
  });

  const [tags, setTags] = useState([]);
  const [imgURL, setImgURL] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const createCollectionObject = { ...values, tags: tags, thumbnail: imgURL };
    const ref = firestore.collection("challenges").doc();
    const batch = firestore.batch();

    batch.set(ref, createCollectionObject);

    try {
      await batch.commit();
      toast.success(`Create ${values.name} successful`);
      router.push(`/Challenge/${ref.id}/add`);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={onChange}
          placeholder="name this challenge"
        />
        {imgURL === null ? (
          <ImageUploader placeholder="thumbnail" setImgURL={setImgURL} />
        ) : (
          <Image src={imgURL} width={300} height={300} alt="thumnail" />
        )}
        <input
          type="text"
          name="category"
          value={values.category}
          onChange={onChange}
          placeholder="category"
        />
        <input
          type="text"
          name="level"
          value={values.level}
          onChange={onChange}
          placeholder="level"
        />
        descriptions
        <textarea
          onChange={onChange}
          name="description"
          value={values.description}
        />
        <div></div>
        <button type="submit">create</button>
      </form>
      <TagsGroup tags={tags} setTags={setTags} />
      <div>
        The Creator
        <Image
          height="80"
          width="80"
          alt="profilepic"
          src={auth.currentUser.photoURL}
        />
        <br />@{auth.currentUser.displayName}
        <br />
        publish date {new Date().toISOString().split("T")[0]}
        <br />
        More from @{auth.currentUser.displayName}
        <br />
      </div>
    </div>
  );
}

const TagsGroup = ({ tags, setTags }) => {
  const [tag, setTag] = useState("");

  const addTag = () => {
    setTags((old) => [...old, tag]);
    setTag("");
  };

  const removeTags = (idx) => {
    const cp = [...tags];
    cp.splice(idx, 1);
    setTags(cp);
  };

  return (
    <>
      {" "}
      tags:{" "}
      {tags.map((doc, idx) => (
        <span key={idx}>
          {doc}
          <button onClick={() => removeTags(idx)}>x</button>
        </span>
      ))}
      <input type="text" onChange={(e) => setTag(e.target.value)} value={tag} />
      <button onClick={addTag}>addtags</button>
    </>
  );
};
