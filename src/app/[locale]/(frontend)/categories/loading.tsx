export default function CategoriesLoading() {
  return (
    <div className="cat-page">
      <div className="sk-header">
        <div className="sk sk-header__eyebrow" />
        <div className="sk sk-header__title" />
      </div>

      <div className="cat-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="sk-cat-card" key={i}>
            <div className="sk sk-cat-card__index" />
            <div className="sk sk-cat-card__name" />
            <div className="sk sk-cat-card__count" />
          </div>
        ))}
      </div>
    </div>
  );
}
