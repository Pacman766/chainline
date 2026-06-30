import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Homepage } from '@/payload-types';

type CtaBlockData = Extract<
  NonNullable<Homepage['blocks']>[number],
  { blockType: 'cta' }
>;

export function CtaBlock({ block }: { block: CtaBlockData }) {
  if (!block.heading && !block.sub) return null;

  return (
    <section className="home-cta-block">
      <div className="home-cta-block__inner">
        {block.heading && <h2 className="home-cta-block__heading">{block.heading}</h2>}
        {block.sub && <p className="home-cta-block__sub">{block.sub}</p>}
        {block.buttonLabel && block.buttonHref && (
          <Link href={block.buttonHref} className="cta-primary">
            {block.buttonLabel}
            <ArrowRight size={18} />
          </Link>
        )}
      </div>
    </section>
  );
}
