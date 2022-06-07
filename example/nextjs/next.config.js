// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Read a local file as a string
    // TODO: figure a better way to do this
    tracker: fs.readFileSync('../../trackers/javascript/src/index.js').toString(),
  },
};

module.exports = nextConfig;
