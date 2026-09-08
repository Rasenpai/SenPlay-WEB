import "./ContentSection.css";

const CATEGORIES = [
  {
    number: "01",
    name: "Anime",
    description: "Watch and discover your favorite series.",
  },
  {
    number: "02",
    name: "Donghua",
    description: "Explore stories and animation from China.",
  },
  {
    number: "03",
    name: "Comics",
    description: "Read manga, manhwa, and manhua.",
  },
  {
    number: "04",
    name: "Movies",
    description: "Find movies and other entertainment to enjoy.",
  },
];

export default function ContentSection() {
  return (
    <section id="explore" className="cs">
      <div className="cs__container">
        <div className="cs__header">
          <p className="cs__eyebrow">EXPLORE</p>
          <h2 className="cs__heading">Something for every kind of mood.</h2>
          <p className="cs__description">
            Discover, watch, and enjoy a variety of entertainment in one place.
          </p>
        </div>

        <div className="cs__list">
          {CATEGORIES.map((category) => (
            <button key={category.number} type="button" className="cs__row">
              <span className="cs__row-number">{category.number}</span>
              <span className="cs__row-main">
                <span className="cs__row-name">{category.name}</span>
              </span>
              <span className="cs__row-desc">{category.description}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
