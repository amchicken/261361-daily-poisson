import { useRouter } from "next/router";

export default function AddQuestionToChallenge() {
  const router = useRouter();
  const { cid } = router.query;

  return <p>challenge ID: {cid}</p>;
}
