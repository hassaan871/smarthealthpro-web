// config-overrides.js
module.exports = function override(config, env) {
  // Make sure devServer configuration exists
  if (!config.devServer) {
    config.devServer = {};
  }

  // Fix the allowedHosts configuration
  config.devServer.allowedHosts = ["localhost", ".localhost"];

  // Or alternatively, you can use 'all' to allow all hosts
  // config.devServer.allowedHosts = 'all';

  return config;
};
