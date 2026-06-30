import type { Homepage, SiteSetting } from '@/payload-types';
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
        switch (block.blockType) {
          case 'feature-grid':
            return <FeatureGridBlock key={key} block={block} />;
          case 'cta':
            return <CtaBlock key={key} block={block} />;
          case 'contacts':
            return <ContactsBlock key={key} block={block} settings={settings} />;
          default:
            return null;
        }
      })}
    </>
  );
}
