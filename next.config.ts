import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  },
};
console.log("JWT_SECRET:", process.env.JWT_SECRET);


export default nextConfig;
