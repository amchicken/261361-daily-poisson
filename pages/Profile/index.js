import { useState, useContext } from "react";
import { UserContext } from "@lib/UserContext";
import Nav from "@components/Nav";
import { useForm } from "@lib/useForm";
import { auth, firestore } from "@lib/firebase";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useContext(UserContext);
  const [values, onChange] = useForm({
    bio: user.bio,
    name: user.name,
    username: user.username,
    photoURL: user.photoURL,
  });

  const [left, setLeft] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    const ref = firestore.collection("usernames").doc(auth.currentUser.uid);
    const batch = firestore.batch();
    batch.update(ref, {
      name: values.name,
      bio: values.bio,
      username: values.username,
      photoURL: values.photoURL,
    });
    batch.commit().then(() => {
      toast.success("update profile success");
    });
  };

  return (
    <div className="container">
      <Nav />
      <div style={{ backgroundColor: "#f0f0f0" }}>
        @{user.username} <br />
        ranking: 69696969 <br />
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="bio"
            value={values.bio}
            onChange={onChange}
            placeholder="bio"
          />
          <b onClick={() => setLeft(true)}>Activities</b>
          {"  "}
          <b onClick={() => setLeft(false)}>Accout setting</b>
          {left ? (
            <div>
              accepted: {user.accepted} <br />
              day streak: {user.dayStreak} <br />
              points: {user.points} <br />
              rewards: {user.rewards} <br />
            </div>
          ) : (
            <div>
              name:
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={onChange}
                placeholder="name"
              />
              <br />
              email:{user.email} <br />
              username:
              <input
                type="text"
                name="username"
                value={values.username}
                onChange={onChange}
                placeholder="username"
              />
              <br />
            </div>
          )}

          <button type="submit">save change</button>
        </form>
      </div>
      <div className="container__footer">DAILYPOISSON 2021 | SITE</div>
    </div>
  );
}
