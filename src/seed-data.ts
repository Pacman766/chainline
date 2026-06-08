// Shared seed data: product catalog + helpers.
// Imported by both src/seed.ts (initial seed) and
// src/scripts/update-descriptions.ts (backfill descriptions onto existing rows).

export type CategorySlug = 'road' | 'gravel' | 'touring';

export type SeedProduct = {
  name: string;
  price: number;
  category: CategorySlug;
  inStock: boolean;
  /** Plain-text paragraphs; converted to Lexical via buildDescription(). */
  description: string[];
  images: { url: string; alt: string }[];
};

export const categories: { slug: CategorySlug; name: string }[] = [
  { slug: 'road', name: 'Шоссейные' },
  { slug: 'gravel', name: 'Гравел' },
  { slug: 'touring', name: 'Туринг' },
];

export const products: SeedProduct[] = [
  {
    name: 'Specialized Tarmac SL8 SW Di2',
    price: 599900,
    category: 'road',
    inStock: true,
    description: [
      'Specialized S-Works Tarmac SL8 — флагманский шоссейный гоночный велосипед, в котором инженеры объединили аэродинамику аэрорамы и малый вес классического шоссейника. Рама из карбона FACT 12r весит порядка 685 граммов, а профиль труб Speed Sniffer снижает сопротивление воздуха без потери жёсткости.',
      'Комплектация построена вокруг электронной группы Shimano Dura-Ace Di2 с беспроводным переключением — выбор профессионального пелотона, на таких рамах выигрывают этапы гранд-туров. Идеален для гонок, быстрых групповых заездов и тех, кто ищет максимум отдачи на каждый ватт.',
    ],
    images: [
      { url: '/bikes/specialized/tarmac-1.webp', alt: 'Specialized Tarmac SL8 — hero' },
      { url: '/bikes/specialized/tarmac-2.webp', alt: 'Specialized Tarmac SL8 — side' },
      { url: '/bikes/specialized/tarmac-3.webp', alt: 'Specialized Tarmac SL8 — detail' },
      { url: '/bikes/specialized/tarmac-4.webp', alt: 'Specialized Tarmac SL8 — rear' },
    ],
  },
  {
    name: 'Specialized Roubaix SW AXS',
    price: 449900,
    category: 'road',
    inStock: true,
    description: [
      'Specialized S-Works Roubaix — эталон endurance-класса, созданный для длинных дистанций и разбитого асфальта. Фирменный картридж Future Shock в рулевой колонке гасит вибрации, сохраняя при этом гоночную геометрию и эффективность педалирования.',
      'Велосипед укомплектован беспроводной трансмиссией SRAM AXS и широкими покрышками для дополнительного комфорта и сцепления. Название отсылает к легендарной брусчатке Париж–Рубе: Roubaix создан для тех, кто хочет ехать дальше и комфортнее, не жертвуя скоростью.',
    ],
    images: [
      { url: '/bikes/specialized/roubaix-1.webp', alt: 'Specialized Roubaix — hero' },
      { url: '/bikes/specialized/roubaix-2.webp', alt: 'Specialized Roubaix — side' },
      { url: '/bikes/specialized/roubaix-3.webp', alt: 'Specialized Roubaix — detail' },
      { url: '/bikes/specialized/roubaix-4.webp', alt: 'Specialized Roubaix — cockpit' },
    ],
  },
  {
    name: 'Pinarello Dogma F',
    price: 899900,
    category: 'road',
    inStock: true,
    description: [
      'Pinarello Dogma F — итальянский флагман и боевой снаряд команды INEOS Grenadiers. Асимметричная рама из карбона Torayca T1100 и фирменная вилка Onda компенсируют разнонаправленные нагрузки на привод, обеспечивая узнаваемую жёсткость и точность управления.',
      'Каждая деталь Dogma F — результат многолетней работы в аэротрубе и на профессиональных гонках. Это велосипед победителей Тур де Франс: бескомпромиссная геометрия, ручная сборка в Италии и характер, который ценят и профессионалы, и коллекционеры.',
    ],
    images: [
      { url: '/bikes/pinarello/dogma-1.png', alt: 'Pinarello Dogma F — side' },
      { url: '/bikes/pinarello/dogma-2.png', alt: 'Pinarello Dogma F — detail' },
      { url: '/bikes/pinarello/dogma-3.png', alt: 'Pinarello Dogma F — front' },
    ],
  },
  {
    name: 'Canyon Grail CF SLX 8 Di2',
    price: 389900,
    category: 'gravel',
    inStock: true,
    description: [
      'Canyon Grail CF SLX — скоростной гравийный велосипед, заточенный под гонки на пересечённой местности. Лёгкая и жёсткая карбоновая рама сочетает шоссейную динамику с проходимостью гравела и просветом под широкие покрышки.',
      'Трансмиссия Shimano GRX Di2 разработана специально для гравийной езды: чёткое электронное переключение и оптимизированные передачи для подъёмов по бездорожью. Canyon продаёт напрямую покупателю, поэтому за эти деньги вы получаете комплектацию уровнем выше конкурентов.',
    ],
    images: [
      { url: '/bikes/canyon/grail-1.avif', alt: 'Canyon Grail — full view' },
      { url: '/bikes/canyon/grail-2.avif', alt: 'Canyon Grail — alternate angle' },
      { url: '/bikes/canyon/grail-3.avif', alt: 'Canyon Grail — cockpit detail' },
      { url: '/bikes/canyon/grail-4.avif', alt: 'Canyon Grail — storage' },
    ],
  },
  {
    name: 'Canyon Grizl CF 6',
    price: 249900,
    category: 'touring',
    inStock: true,
    description: [
      'Canyon Grizl CF — приключенческий гравел для долгих маршрутов и байкпакинга. Более расслабленная геометрия по сравнению с гоночным Grail, увеличенный просвет под покрышки и множество креплений под сумки, фляги и крылья делают его идеальным компаньоном для многодневных вылазок.',
      'Карбоновая рама гасит вибрации на разбитых дорогах, а продуманная посадка позволяет проводить в седле целый день без усталости. Grizl создан для тех, кто уходит с асфальта в поисках приключений и хочет везти с собой всё необходимое.',
    ],
    images: [
      { url: '/bikes/canyon/grizl-1.avif', alt: 'Canyon Grizl — full view' },
      { url: '/bikes/canyon/grizl-2.avif', alt: 'Canyon Grizl — alternate' },
      { url: '/bikes/canyon/grizl-3.avif', alt: 'Canyon Grizl — rack detail' },
    ],
  },
  {
    name: 'Kona Sutra',
    price: 149900,
    category: 'touring',
    inStock: false,
    description: [
      'Kona Sutra — классический туринговый велосипед из хром-молибденовой стали Reynolds 520. Стальная рама прощает неровности дороги, легко ремонтируется в любой точке мира и несёт серьёзную загрузку — то, что нужно для дальних путешествий с багажом.',
      'В комплектации продуманы все мелочи для туризма: дисковые тормоза, крепления под передние и задние багажники и крылья, надёжная трансмиссия с запасом низких передач для гружёных подъёмов. Sutra — проверенный выбор для кругосветок и велопоходов.',
    ],
    images: [
      { url: '/bikes/kona/sutra-1.webp', alt: 'Kona Sutra — hero' },
      { url: '/bikes/kona/sutra-2.webp', alt: 'Kona Sutra — side' },
      { url: '/bikes/kona/sutra-3.webp', alt: 'Kona Sutra — detail' },
      { url: '/bikes/kona/sutra-4.webp', alt: 'Kona Sutra — front' },
    ],
  },
];

/** Convert plain-text paragraphs into a Lexical richText value for the `description` field. */
export function buildDescription(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        version: 1,
        format: '' as const,
        indent: 0,
        direction: 'ltr' as const,
        textStyle: '',
        textFormat: 0,
        children: [
          {
            type: 'text',
            version: 1,
            text,
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0,
          },
        ],
      })),
    },
  };
}
