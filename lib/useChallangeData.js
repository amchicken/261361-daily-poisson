import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { firestore } from "@lib/firebase";

export function useChallangeData() {
    const ref = firestore.collection("challenges");
    const query = ref.limit(6);
    const [snapshot, loading] = useCollectionDataOnce(query, { idField: "id" });
    return [snapshot, loading];
}
