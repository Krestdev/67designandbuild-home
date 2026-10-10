import * as migration_20260806_164827_init from './20260806_164827_init';
import * as migration_20260817_091028_add_quote_request from './20260817_091028_add_quote_request';
import * as migration_20261007_105104_unique_slugs_join_fields from './20261007_105104_unique_slugs_join_fields';
import * as migration_20261007_142526_localize_footer_link_labels from './20261007_142526_localize_footer_link_labels';
import * as migration_20261010_080528_footer_link_urls from './20261010_080528_footer_link_urls';

export const migrations = [
  {
    up: migration_20260806_164827_init.up,
    down: migration_20260806_164827_init.down,
    name: '20260806_164827_init',
  },
  {
    up: migration_20260817_091028_add_quote_request.up,
    down: migration_20260817_091028_add_quote_request.down,
    name: '20260817_091028_add_quote_request',
  },
  {
    up: migration_20261007_105104_unique_slugs_join_fields.up,
    down: migration_20261007_105104_unique_slugs_join_fields.down,
    name: '20261007_105104_unique_slugs_join_fields',
  },
  {
    up: migration_20261007_142526_localize_footer_link_labels.up,
    down: migration_20261007_142526_localize_footer_link_labels.down,
    name: '20261007_142526_localize_footer_link_labels',
  },
  {
    up: migration_20261010_080528_footer_link_urls.up,
    down: migration_20261010_080528_footer_link_urls.down,
    name: '20261010_080528_footer_link_urls'
  },
];
