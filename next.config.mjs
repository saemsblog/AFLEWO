/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["three", "gsap", "@react-three/fiber", "@react-three/drei"],
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            // Cloudinary CDN — for uploaded audition audio thumbnails, resource thumbnails
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/ji3d0vql/**",
            },
            // Supabase Storage — for avatar URLs from OAuth providers
            {
                protocol: "https",
                hostname: "rdovwkzopojjdupickri.supabase.co",
            },
            // Google user profile photos (from Google OAuth)
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
};

export default nextConfig;

