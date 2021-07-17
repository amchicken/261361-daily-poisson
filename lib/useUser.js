import { auth } from "@lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export function useUser() {
  const [user, loading, error] = useAuthState(auth);
  return { user, loading };
}
