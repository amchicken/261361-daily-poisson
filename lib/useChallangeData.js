import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { firestore } from "@lib/firebase";

export function useChallangeData() {
  const ref = firestore.collection("challenges");
  const query = ref.limit(5);
  const [snapshot, loading] = useCollectionOnce(query);

  let data = [];
  if (!loading) {
    snapshot.forEach((doc) => {
      const ob = doc.data();
      data.push({ ...ob, id: doc.id });
    });
  }

  return [data, loading];
}
