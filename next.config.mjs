/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ใส่ ** เพื่ออนุญาตให้ดึงรูปจากทุกเว็บได้เลย (สะดวกมากตอนทำโปรเจกต์ส่ง)
      },
    ],
  },
};

export default nextConfig;
