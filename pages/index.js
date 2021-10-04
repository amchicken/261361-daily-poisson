import Nav from "@components/Nav";
import { IoReload } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { useChallangeData } from "@lib/useChallangeData";

export default function Home() {
    const [snapshot, loading] = useChallangeData();
    return (
        <>
            <div className="container">
                <Nav />
                <div className="container__right">
                    {loading ? (
                        <div>loading...</div>
                    ) : (
                        <>
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
                                    <Link
                                        href={`Challenge/${doc.id}`}
                                        passHref
                                        key={doc.id}
                                    >
                                        <div className="container__right__content__card">
                                            <div className="container__right__content__card__show">
                                                <Image
                                                    src={
                                                        doc.thumbnail ||
                                                        "/notfound.png"
                                                    }
                                                    width={100}
                                                    height={100}
                                                    quality={100}
                                                    alt="thumbnail"
                                                />
                                                <div>
                                                    <p>{doc.name}</p>
                                                    <h4>
                                                        {doc.question} Items
                                                    </h4>
                                                    <span>{doc.category}</span>
                                                    <h4>
                                                        {doc.level.toUpperCase()}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="container__right__content__card__float">
                                                <div>
                                                    <Image
                                                        src="/img/btn.png"
                                                        layout="fill"
                                                        alt="button"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="container__right__footer">
                                <Link href="/Challenge/create" passHref>
                                    <button>REQUEST YOUR {"Q&A"}</button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
                <div className="container__footer">
                    DAILYPOISSON 2021 | SITE
                </div>
            </div>
        </>
    );
}
