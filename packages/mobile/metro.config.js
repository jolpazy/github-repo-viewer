const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Watch the monorepo root
config.watchFolders = [path.resolve(__dirname, "..", "..")];

// Resolve React ONLY from mobile package
config.resolver.extraNodeModules = {
  react: path.resolve(__dirname, "node_modules/react"),
  "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
  "react-native": path.resolve(__dirname, "node_modules/react-native"),
};

// Exclude test files from bundle
config.resolver.blockList = [
  /.*\.test\.(js|jsx|ts|tsx)$/,
  /__tests__\/.*/,
  /.*\.spec\.(js|jsx|ts|tsx)$/,
];

module.exports = config;
