import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { firestore } from "@lib/firebase";

export function useChallangeData() {
  const ref = firestore.collection("challenges");
  const query = ref.limit(5);
  const [snapshot, loading] = useCollectionOnce(query, { idField: "id" });
  return [snapshot, loading];
}
