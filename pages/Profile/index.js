import { useState, useContext } from "react";
import { UserContext } from "@lib/UserContext";
import Nav from "@components/Nav";
import { useForm } from "@lib/useForm";

export default function ProfilePage() {
  const { user } = useContext(UserContext);
  const [values, onChange] = useForm({
    bio: user.bio,
    name: user.name,
    username: user.username,
    photoURL: user.photoURL,
  });

  const [left, setLeft] = useState(true);

  return (
    <div className="container">
      <Nav />
      <div style={{ backgroundColor: "#f0f0f0" }}>
        @{user.username} <br />
        ranking: 69696969 <br />
        <form>
          <input
            type="text"
            name="bio"
            value={values.bio}
            onChange={onChange}
            placeholder="bio"
          />
          <button onClick={() => setLeft(true)}>Activities</button>
          <button onClick={() => setLeft(false)}>Accout setting</button>
          {left ? <div>left</div> : <div>Right</div>}
        </form>
      </div>
      <div className="container__footer">DAILYPOISSON 2021 | SITE</div>
    </div>
  );
}
