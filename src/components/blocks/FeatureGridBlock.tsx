import { Star, Check, Zap, Heart, ShieldCheck, Globe } from 'lucide-react';
import type { Homepage } from '@/payload-types';
import { Magnetic } from '@/components/motion/Magnetic';

type FeatureGridBlockData = Extract<
  NonNullable<Homepage['blocks']>[number],
  { blockType: 'feature-grid' }
>;

const ICON_MAP = {
  star: Star,
  check: Check,
  bolt: Zap,
  heart: Heart,
  shield: ShieldCheck,
  globe: Globe,
} as const;

type IconKey = keyof typeof ICON_MAP;

export function FeatureGridBlock({ block }: { block: FeatureGridBlockData }) {
  const items = block.items ?? [];
  if (items.length === 0) return null;

  return (
    <section className="home-features">
      {items.map((item, idx) => {
        const IconComp = item.icon ? (ICON_MAP[item.icon as IconKey] ?? null) : null;
        const num = String(idx + 1).padStart(2, '0');
        return (
          // Magnetic is a client wrapper; card content (children) stays server-rendered.
          // className="feat-card" on Magnetic so the grid cell IS the styled card element
          // (preserves :last-child border rule and grid layout).
          <Magnetic className="feat-card" key={item.id ?? idx}>
            <span className="feat-num">{num}</span>
            {IconComp && <IconComp size={26} className="feat-icon" />}
            {item.title && <h3>{item.title}</h3>}
            {item.desc && <p>{item.desc}</p>}
          </Magnetic>
        );
      })}
    </section>
  );
}
