import { useRouter } from "next/router";
import { firestore } from "@lib/firebase";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import JSONPretty from "react-json-pretty";

export default function PlayChallenge() {
  const router = useRouter();
  const { cid } = router.query;
  const [data, loading] = useCollectionDataOnce(
    firestore.collection("challenges").doc(cid).collection("questions")
  );

  if (loading) return <div>loaning...</div>;
  return (
    <div style={{ background: "#fff" }}>
      <JSONPretty id="json-pretty" data={data} />
    </div>
  );
}
