import * as migration_20260527_145421 from './20260527_145421';
import * as migration_20260622_092935_localization from './20260622_092935_localization';
import * as migration_20260629_083137 from './20260629_083137';
import * as migration_20260630_061057_homepage_blocks from './20260630_061057_homepage_blocks';

export const migrations = [
  {
    up: migration_20260527_145421.up,
    down: migration_20260527_145421.down,
    name: '20260527_145421',
  },
  {
    up: migration_20260622_092935_localization.up,
    down: migration_20260622_092935_localization.down,
    name: '20260622_092935_localization',
  },
  {
    up: migration_20260629_083137.up,
    down: migration_20260629_083137.down,
    name: '20260629_083137',
  },
  {
    up: migration_20260630_061057_homepage_blocks.up,
    down: migration_20260630_061057_homepage_blocks.down,
    name: '20260630_061057_homepage_blocks'
  },
];
