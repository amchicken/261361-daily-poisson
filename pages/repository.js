import Repository from "@components/MyRepository";
import Nav from "@components/Nav";

export default function RepositoryPage() {
  return (
    <div className="container">
      <Nav />
      <div className="container__right">
        <>
          <div className="container__right__header">
            <span className="pointer" style={{ fontWeight: 600 }}>
              REPOSITORY
            </span>
          </div>
          <div className="container__right__content">
            <Repository />
          </div>
        </>
      </div>
      <div className="container__footer">DAILYPOISSON 2021 | SITE</div>
    </div>
  );
}
