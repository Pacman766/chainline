export default function ProductLoading() {
  return (
    <div className="pdp-shell">
      <div className="pdp-gallery">
        <div className="pdp-gallery__main">
          <div className="sk sk-pdp-main" />
        </div>
        <div className="pdp-gallery__thumbs">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="pdp-thumb">
              <div className="sk sk-pdp-thumb" />
            </div>
          ))}
        </div>
      </div>

      <div className="pdp-info">
        <div className="sk sk-pdp-back" />
        <div className="sk sk-pdp-category" />
        <div className="sk sk-pdp-title" />
        <div className="sk sk-pdp-title sk-pdp-title--2" />
        <div className="sk sk-pdp-stock" />

        <div className="pdp-price-row">
          <div className="sk sk-pdp-price" />
          <div className="sk sk-pdp-btn" />
        </div>

        <div className="pdp-divider" />
        <div className="sk sk-pdp-label" />
        <div className="sk sk-pdp-desc" />
        <div className="sk sk-pdp-desc" />
        <div className="sk sk-pdp-desc sk-pdp-desc--last" />

        <div className="pdp-divider" />
        <div className="sk sk-pdp-label" />
        <div className="sk-pdp-specs">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="sk sk-pdp-spec" />
          ))}
        </div>
      </div>
    </div>
  );
}
