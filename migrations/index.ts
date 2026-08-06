import * as migration_20260806_164827_init from './20260806_164827_init';

export const migrations = [
  {
    up: migration_20260806_164827_init.up,
    down: migration_20260806_164827_init.down,
    name: '20260806_164827_init'
  },
];
