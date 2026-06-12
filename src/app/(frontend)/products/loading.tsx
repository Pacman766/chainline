export default function ProductsLoading() {
  return (
    <>
      <div className="sk-header">
        <div className="sk sk-header__eyebrow" />
        <div className="sk sk-header__title" />
      </div>

      <div className="sk-searchbar">
        <div className="sk sk-searchbar__input" />
      </div>

      <div className="product-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="sk-card" key={i}>
            <div className="sk sk-card__img" />
            <div className="sk-card__body">
              <div className="sk sk-line sk-line--sm" />
              <div className="sk sk-line sk-line--lg" />
              <div className="sk sk-line sk-line--price" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
