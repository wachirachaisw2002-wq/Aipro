import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; // 1. นำเข้า Navbar ที่เราเพิ่งสร้าง

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CareerPath AI",
  description: "แนะนำเส้นทางการเรียน แต่ละอาชีพด้วย AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <Navbar /> {/* 2. วาง Navbar ไว้ด้านบนสุด */}
        {children} {/* children คือเนื้อหาของแต่ละหน้า (page.js) */}
      </body>
    </html>
  );
}