import { useChallangeData } from "@lib/useChallangeData";
import { IoReload } from "react-icons/io5";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

export default function ChallangeSelector() {
  const router = useRouter();
  const [snapshot, loading] = useChallangeData();

  if (loading) {
    return <div style={{ display: "flex" }}>loading...</div>;
  }

  const createChallenge = () => {
    router.push("/Challenge/create");
  };

  return (
    <div className="container__right">
      <div className="container__right__header">
        <span style={{ fontWeight: 600 }}>HOME</span>
        <span>TOP PLAY</span>
        <div>
          LOAD NEW CHALLENGES{"  "}
          <IoReload style={{ color: "#48f36e" }} />
        </div>
      </div>
      <div className="container__right__content">
        {snapshot.map((doc) => (
          <Link href={`Challenge/${doc.id}`} passHref key={doc.id}>
            <div className="container__right__content__card">
              <div className="container__right__content__card__show">
                <Image
                  src={doc.thumbnail || "/notfound.png"}
                  width={100}
                  height={100}
                  quality={100}
                  alt="thumbnail"
                />
                <div>
                  <p>{doc.name}</p>
                  <p>{doc.level.toUpperCase()}</p>
                  <h4>
                    {doc.question} Question {doc.question > 1 ? s : ""}
                  </h4>
                  <span>{doc.category}</span>
                </div>
              </div>
              <div className="container__right__content__card__float">
                <Image src="/img/btn.png" layout="fill" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="container__right__footer">
        <button onClick={createChallenge}>REQUEST YOUR {"Q&A"}</button>
      </div>
    </div>
  );
}
