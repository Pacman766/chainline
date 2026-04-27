const shimmerSvg = `<svg width="700" height="525" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0"><stop stop-color="#e8e4de" offset="0%"/><stop stop-color="#f0ece6" offset="50%"/><stop stop-color="#e8e4de" offset="100%"/><animateTransform attributeName="gradientTransform" type="translate" values="-1 0;2 0;-1 0" dur="1.6s" repeatCount="indefinite"/></linearGradient></defs><rect width="700" height="525" fill="url(#g)"/></svg>`;

function toBase64(str: string): string {
  if (typeof window === 'undefined') {
    return Buffer.from(str).toString('base64');
  }
  return btoa(str);
}

export const shimmerDataURL = `data:image/svg+xml;base64,${toBase64(shimmerSvg)}`;
