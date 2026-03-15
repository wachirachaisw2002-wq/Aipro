import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* โลโก้ / ชื่อเว็บ */}
        <Link href="/" className="text-2xl font-bold tracking-wide hover:text-indigo-200 transition">
          🚀 CareerPath AI
        </Link>
        
        {/* เมนูต่างๆ */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 font-medium">
          <Link href="/" className="hover:text-indigo-200 transition">หน้าแรก</Link>
          <Link href="/assessment" className="hover:text-indigo-200 transition">ประเมินอาชีพ</Link>
          <Link href="/planning" className="hover:text-indigo-200 transition">วางแผนเส้นทาง</Link>
          <Link href="/chat" className="hover:text-indigo-200 transition">Chatbot</Link>
          
          {/* ลิงก์ออกไปเว็บ Portfolio */}
          <a 
            href="https://dekshowport.com/ตัวอย่าง-portfolio/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-yellow-300 hover:text-yellow-100 transition"
          >
            ดูตัวอย่าง Portfolio ↗
          </a>
        </div>
      </div>
    </nav>
  );
}