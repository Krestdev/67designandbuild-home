import * as migration_20260806_164827_init from './20260806_164827_init';
import * as migration_20260817_091028_add_quote_request from './20260817_091028_add_quote_request';

export const migrations = [
  {
    up: migration_20260806_164827_init.up,
    down: migration_20260806_164827_init.down,
    name: '20260806_164827_init',
  },
  {
    up: migration_20260817_091028_add_quote_request.up,
    down: migration_20260817_091028_add_quote_request.down,
    name: '20260817_091028_add_quote_request'
  },
];
