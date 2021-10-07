import { auth, firestore } from "@lib/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export function useUser() {
  const [userAuth, loading] = useAuthState(auth);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      if (userAuth) {
        const ref = firestore.collection("usernames").doc(userAuth.uid);
        const { exists } = await ref.get();
        if (!exists)
          await ref.set({
            name: userAuth.displayName || userAuth.email.split("@")[0],
            username: userAuth.displayName || userAuth.email,
            email: userAuth.email,
            photoURL: userAuth.photoURL,
            bio: "",
            dayStreak: 0,
            accepted: 0,
            points: 0,
            rewards: 0,
          });
        setUser((await ref.get()).data());
      } else setUser(null);
    }
    getUser();
  }, [userAuth]);

  return { user, loading, setUser };
}
