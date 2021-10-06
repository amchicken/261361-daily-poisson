import { firestore, auth } from "@lib/firebase";
import { useRouter } from "next/router";
import { useForm } from "@lib/useForm";
import { useState, useEffect } from "react";
import ImageUploader from "@components/ImageUploader";
import { CATEGORY, LEVEL } from "@lib/constants";
import Image from "next/image";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { AiOutlineCloseCircle } from "react-icons/ai";

export default function General() {
  const router = useRouter();
  const { cid } = router.query;

  const [data, loading] = useDocumentDataOnce(
    firestore.collection("challenges").doc(cid)
  );
  const [values, onChange, , setForm] = useForm(
    data || {
      name: "",
      category: "General",
      description: "",
      level: "Easy",
      question: 0,
    }
  );

  useEffect(() => {
    console.log(values);
  }, [values]);

  useEffect(() => {
    if (!loading) setForm(data);
  }, [loading]);

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
        if (values.name === "" || values.description === "") {
          toast.error("Please fill in the blanks");
          return;
        }
        const ref = firestore.collection("challenges").doc();
        const batch = firestore.batch();

        batch.upadate(ref, {
          name: values.name,
          description: values.description,
        });

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

  return loading ? (
    <div>Loading ...</div>
  ) : (
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
              <div
                className="container2__inside__content__2__left"
                style={{ color: "white" }}
              >
                <div>
                  <Image
                    src={values.image || "/notfound.png"}
                    width={80}
                    height={80}
                    alt=""
                  />
                </div>
                <div>Category:{values.category}</div>
                <div>Level:{values.level}</div>
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
            <TagsGroup tags={values.tags} setTags={setTags} />
            <button onClick={onSubmit}>Save changes {">>"}</button>
          </div>
        </div>
      </div>
    </>
  );
}

const TagsGroup = ({ tags, setTags }) => {
  return (
    <div>
      <Image src="/img/tag.png" width="30" height="30" alt="" />
      {tags && tags.map((doc, idx) => <span key={idx}>{doc}</span>)}
    </div>
  );
};
