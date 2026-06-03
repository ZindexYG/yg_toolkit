/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard/generator",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "/dashboard/generator",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
