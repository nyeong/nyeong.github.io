import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig } */
const nextConfig = {
    reactStrictMode: true,
    output: process.env.NODE_ENV === 'production' ? 'export' : 'standalone'
}

export default process.env.NODE_ENV === 'production' ? nextConfig : withContentlayer(nextConfig)
