/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: "dist",
  output: "export",
  exportPathMap: function () {
    return {
      "/": { page: "/" },
    };
  },
};

module.exports = nextConfig;
