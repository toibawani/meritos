/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Emit a self-contained server bundle so the multi-stage Dockerfile
  // can ship a minimal runtime image. Harmless on Vercel (zero-config).
  output: "standalone",
};

export default nextConfig;
