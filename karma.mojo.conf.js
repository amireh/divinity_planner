// @file karma.mojo.conf.js

const config = loadKarmaConfig(require('./karma.conf.js'));
const path = require('path')
const mojoRunner = path.resolve(__dirname, '.mojo.js');

// 1. Register the "karma-mojo" plugin:
config.plugins.push('karma-mojo');

// 2. It is important to feed Karma with mojo's runner file. This file will
// be importing the test modules you're focusing.
//
// If your application needs some setup before the tests work, provide those
// files before the runner, but make sure you don't end up requiring all the
// test files!
//
config.files = [ 'test.js' ]

// 3. Register Mojo's reporter:
config.reporters = [
  'mojo',

  // You can use your regular reporters too like "progress" or "dot" or "spec":
  'progress'
];

// 4. Configure Mojo with the defaults then customize later if needed:
config.mojo = require('karma-mojo').defaults;

// [Optional]
//
// You can customize Mojo's defaults here:
config.mojo.pattern = [ 'packages/*/js/**/__tests__/*.test.js' ];

// This is an example of utilizing the environment variables that are exposed by
// the "mojo" binary to let the user override defaults through the command-line:
config.mojo.grepDir = process.env.MOJO_GREP_DIR || '{app,packages/*/src}';

config.mojo.runnerPath = mojoRunner

// [Optional]
//
// If you're using pre-processors, don't forget to run the runner file through
// that chain as well.
//
// For example, if we're using webpack & sourcemap to process our files, it
// would look like this:
config.preprocessors = {};
config.preprocessors['test.js'] = [ 'webpack', 'sourcemap' ];

// [Optional]
//
// Mojo will be invoking the executor manually, no need for autoWatch.
config.autoWatch = false;
config.autoWatchBatchDelay = 0;

module.exports = function(karma) {
  karma.set(config);
};

// We need some tricks to import karma's base config because it exports a
// function instead of a plain object so you can use this helper function to
// do that.
//
// A cleaner option would be to create a file that contains the "base" config
// which both karma.conf.js and karma.mojo.conf.js can end up using. That file
// would export a normal object in turn.
function loadKarmaConfig(karmaConfig) {
  var config;

  karmaConfig({
    set: function(baseConfig) {
      config = baseConfig;
    }
  });

  return config;
}