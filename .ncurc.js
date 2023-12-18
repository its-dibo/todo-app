// npm-check-updates
module.exports = {
  // update package.json
  upgrade: true,
  // update workspaces recursively
  deep: true,
  // Include only packages that satisfy engines.node
  enginesNode: true,
  // Check peer dependencies of installed packages and filter updates to compatible versions
  peer: true,
  // update to the latest versions
  target: "latest",
  // peerDependencies are checked for conflicts, so they are safe to be updated?
  dep: "prod,dev,bundle,optional,peer",
  // merge the workspace's config with the root's one
  mergeConfig: true,
  reject: [
    // use angular migration guide to update Angular
    "@angular/**",
    // has issue with semantic-release-monorepo
    // https://github.com/semantic-release/npm/issues/492
    // https://github.com/pmowrer/semantic-release-monorepo/issues/121#issuecomment-1120554972
    "@semantic-release/npm",
  ],
};
