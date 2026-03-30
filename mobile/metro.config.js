const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Parallel transform workers (Node worker_threads) — faster bundling on multi-core CPUs
config.transformer = {
  ...config.transformer,
  unstable_workerThreads: true,
};

const prevGetTransformOptions = config.transformer.getTransformOptions;
config.transformer.getTransformOptions = async () => {
  const opts = prevGetTransformOptions
    ? await prevGetTransformOptions()
    : { transform: {} };
  return {
    ...opts,
    transform: {
      ...opts.transform,
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  };
};

config.resolver = {
  ...config.resolver,
  // Metro + @babel/runtime "exports" map can fail to resolve helpers; use classic node_modules layout
  unstable_enablePackageExports: false,
  extraNodeModules: {
    ...config.resolver?.extraNodeModules,
    "@babel/runtime": path.resolve(__dirname, "node_modules/@babel/runtime"),
  },
};

config.watcher = {
  ...config.watcher,
  unstable_workerThreads: true,
};

module.exports = config;
