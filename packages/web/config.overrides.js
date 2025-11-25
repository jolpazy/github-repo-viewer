const path = require("path");

module.exports = function override(config) {
  config.resolve.symlinks = true;

  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    "@repo-viewer/shared": path.resolve(__dirname, "..", "shared", "src"),
  };

  return config;
};
