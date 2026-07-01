import type { Homepage, SiteSetting } from '@/payload-types';
import { Reveal } from '@/components/motion/Reveal';
import { FeatureGridBlock } from './FeatureGridBlock';
import { CtaBlock } from './CtaBlock';
import { ContactsBlock } from './ContactsBlock';

type Block = NonNullable<Homepage['blocks']>[number];

export function BlocksRenderer({
  blocks,
  settings,
}: {
  blocks: Block[];
  settings: SiteSetting;
}) {
  if (blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, idx) => {
        const key = block.id ?? `${block.blockType}-${idx}`;
        const delay = idx * 0.08;
        switch (block.blockType) {
          case 'feature-grid':
            return (
              <Reveal key={key} delay={delay}>
                <FeatureGridBlock block={block} />
              </Reveal>
            );
          case 'cta':
            return (
              <Reveal key={key} delay={delay}>
                <CtaBlock block={block} />
              </Reveal>
            );
          case 'contacts':
            return (
              <Reveal key={key} delay={delay}>
                <ContactsBlock block={block} settings={settings} />
              </Reveal>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
