import { useChallangeData } from "@lib/useChallangeData";
import Image from "next/image";

export default function ChallangeSelector() {
  const [snapshot, loading] = useChallangeData();

  console.log(snapshot);
  return (
    <div style={{ display: "flex" }}>
      {loading
        ? "loading .."
        : snapshot.map((doc) => (
            <div key={doc.id}>
              <Image
                src={doc.thumbnail}
                width={100}
                height={100}
                alt="thumbnail"
              />
              <h2>{doc.name}</h2>
              <span>{doc.category}</span>
            </div>
          ))}
    </div>
  );
}
