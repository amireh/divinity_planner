exports.STARTING_ATTRIBUTE_POINTS = 5;
exports.STARTING_ABILITY_POINTS = 5;
exports.BASE_ATTRIBUTE_POINTS = 5;
exports.BASE_ABILITY_SKILL_COUNT = 3;
exports.MAX_ATTRIBUTE_POINTS = 15;
exports.MAX_ABILITY_POINTS = 5;
exports.MAX_LEVEL = 20;

exports.DOMAIN_URL_KEYS = {
  'level':      '0',
  'attributes': '1',
  'abilities':  '2',
  'skillbook':  '3',
};

exports.ATTRIBUTE_URL_KEYS = {
  'dex': 'D',
  'int': 'I',
  'con': 'C',
  'spe': 'S',
  'per': 'P',
};

exports.ABILITY_URL_KEYS = {
  'aerotheurge':    'A',
  'expertMarksman': 'E',
  'geomancer':      'G',
  'hydrosophist':   'H',
  'manAtArms':      'M',
  'pyrokinetic':    'P',
  'scoundrel':      'S',
  'witchcraft':     'W',
};

exports.SKILLBOOK_TAB_URL_KEY = 'V';

exports.STARTING_INDEX_CHAR_CODE = 97;
exports.K_UNLIMITED = Infinity;

exports.ERR_ABILITY_LEVEL_TOO_LOW = 'ERR_ABILITY_LEVEL_TOO_LOW';
exports.ERR_ABILITY_CAP_REACHED   = 'ERR_ABILITY_CAP_REACHED';
exports.ERR_CHAR_LEVEL_TOO_LOW    = 'ERR_CHAR_LEVEL_TOO_LOW';

exports.TIER_NOVICE = 1;
exports.TIER_ADEPT  = 2;
exports.TIER_MASTER = 3;

exports.TIER_NAMES = { 1: 'Novice', 2: 'Adept', 3: 'Master' };

exports.TIER_AP_REQUIREMENTS = {
  1: 1,
  2: 2,
  3: 4
};