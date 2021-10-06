import { useForm } from "@lib/useForm";
import { useState } from "react";
import { auth, firestore, serverTimestamp } from "@lib/firebase";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ImageUploader from "@components/ImageUploader";
import Nav from "@components/Nav";
import { CATEGORY, LEVEL } from "@lib/constants";
import Swal from "sweetalert2";

export default function Create() {
  const router = useRouter();
  const [values, onChange] = useForm({
    name: "",
    category: "General",
    description: "",
    level: "Easy",
    question: 0,
  });

  const [tags, setTags] = useState([]);
  const [imgURL, setImgURL] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Want to continue?",
      text: "Please verify the information",
      showDenyButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#56a33e",
      preConfirm: async () => {
        if (
          values.name === "" ||
          values.category === "" ||
          values.level === ""
        ) {
          toast.error("Please fill in the blanks");
          return;
        }
        const createCollectionObject = {
          ...values,
          tags: tags,
          thumbnail: imgURL,
          createdBy: auth.currentUser.uid,
          createdAt: serverTimestamp(),
          play: 0,
          played: [],
          show: false,
        };
        const ref = firestore.collection("challenges").doc();
        const batch = firestore.batch();

        batch.set(ref, createCollectionObject);

        try {
          await batch.commit();
          toast.success(`Create ${values.name} successful`);
          router.push(`/Challenge/${ref.id}/admin`);
        } catch (err) {
          toast.error(err);
        }
      },
    });
  };

  const goBack = () => {
    router.push("/");
  };

  return (
    <>
      <div className="container2">
        <div className="container2__inside">
          <div className="container2__inside__header">
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
          <div className="container2__inside__content">
            <div className="container2__inside__content__1">About</div>
            <div className="container2__inside__content__2">
              <div className="container2__inside__content__2__left">
                <ImageUploader
                  placeholder={"Deck Thumbnail"}
                  setImgURL={setImgURL}
                />
                <div>
                  <select
                    name="category"
                    value={values.category}
                    onChange={onChange}
                  >
                    <option value="" disabled selected>
                      Select Category
                    </option>
                    {CATEGORY().map((doc) => (
                      <option key={doc}>{doc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select name="level" value={values.level} onChange={onChange}>
                    <option value="" disabled selected>
                      Select Level
                    </option>
                    {LEVEL().map((doc) => (
                      <option key={doc}>{doc}</option>
                    ))}
                  </select>
                </div>
                <span>Description</span>
                <textarea
                  onChange={onChange}
                  name="description"
                  value={values.description}
                  placeholder="Describes something..."
                />
              </div>
              <div className="container2__inside__content__2__right">
                <div className="container2__inside__content__2__right__top">
                  <div>The Creator</div>
                  <Image
                    height="150"
                    width="150"
                    alt="profilepic"
                    src={auth.currentUser.photoURL || "/notfound.png"}
                  />
                  <div>{auth.currentUser.displayName}</div>
                  <div>
                    publish date {new Date().toISOString().split("T")[0]}
                  </div>
                </div>
                <div className="container2__inside__content__2__right__bottom">
                  More from {auth.currentUser.displayName}
                </div>
              </div>
            </div>
          </div>
          <div className="container2__inside__footer">
            <TagsGroup tags={tags} setTags={setTags} />
            <button onClick={onSubmit}>Create Challenges {">>"}</button>
          </div>
        </div>
      </div>
    </>
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
    <div>
      <Image src="/img/tag.png" width="30" height="30" alt="" />
      {tags.map((doc, idx) => (
        <span key={idx}>
          {doc}
          <button onClick={() => removeTags(idx)}>
            <AiOutlineCloseCircle />
          </button>
        </span>
      ))}
      <input
        type="text"
        placeholder="Add Tag"
        onChange={(e) => setTag(e.target.value)}
        value={tag}
      />
      <button onClick={addTag}>+</button>
    </div>
  );
};
