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
  /** Optional English locale content (name is a brand string, identical across locales). */
  en?: { description: string[] };
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
    en: {
      description: [
        'The Specialized S-Works Tarmac SL8 is the flagship road race bike, where engineers combined the aerodynamics of an aero frame with the low weight of a classic road bike. The FACT 12r carbon frame weighs around 685 grams, and the Speed Sniffer tube profiles cut air resistance without sacrificing stiffness.',
        'The build is centered on the wireless-shifting Shimano Dura-Ace Di2 electronic groupset — the choice of the professional peloton, the kind of frame that wins Grand Tour stages. Ideal for racing, fast group rides, and anyone chasing maximum return on every watt.',
      ],
    },
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
    en: {
      description: [
        'The Specialized S-Works Roubaix is the endurance benchmark, built for long distances and broken tarmac. The signature Future Shock cartridge in the head tube absorbs vibration while preserving race geometry and pedaling efficiency.',
        'The bike is equipped with a wireless SRAM AXS drivetrain and wide tires for extra comfort and grip. The name nods to the legendary Paris–Roubaix cobbles: the Roubaix is made for those who want to ride farther and more comfortably without giving up speed.',
      ],
    },
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
    en: {
      description: [
        'The Pinarello Dogma F is the Italian flagship and the weapon of choice of the INEOS Grenadiers team. Its asymmetric Torayca T1100 carbon frame and signature Onda fork offset the uneven loads of the drivetrain, delivering its recognizable stiffness and steering precision.',
        'Every detail of the Dogma F is the result of years of work in the wind tunnel and at professional races. This is a bike of Tour de France winners: uncompromising geometry, hand assembly in Italy, and a character prized by professionals and collectors alike.',
      ],
    },
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
    en: {
      description: [
        'The Canyon Grail CF SLX is a fast gravel bike honed for off-road racing. Its light, stiff carbon frame blends road-bike dynamics with gravel capability and clearance for wide tires.',
        'The Shimano GRX Di2 drivetrain is designed specifically for gravel riding: crisp electronic shifting and gearing optimized for off-road climbs. Canyon sells direct to the customer, so for this money you get a spec a tier above the competition.',
      ],
    },
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
    en: {
      description: [
        'The Canyon Grizl CF is an adventure gravel bike for long routes and bikepacking. Its more relaxed geometry compared to the racy Grail, increased tire clearance, and numerous mounts for bags, bottles, and fenders make it the perfect companion for multi-day trips.',
        'The carbon frame dampens vibration on rough roads, and the thoughtful riding position lets you spend all day in the saddle without fatigue. The Grizl is built for those who leave the tarmac in search of adventure and want to carry everything they need.',
      ],
    },
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
    en: {
      description: [
        'The Kona Sutra is a classic touring bike made from Reynolds 520 chromoly steel. The steel frame forgives rough roads, can be repaired anywhere in the world, and carries a serious load — exactly what you need for long journeys with luggage.',
        'The build covers every touring detail: disc brakes, mounts for front and rear racks and fenders, and a reliable drivetrain with plenty of low gears for loaded climbs. The Sutra is a proven choice for round-the-world trips and bike tours.',
      ],
    },
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
