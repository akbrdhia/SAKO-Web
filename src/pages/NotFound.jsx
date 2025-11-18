import { Link } from 'react-router-dom';
import { useState } from 'react';

// small hover-link component that uses inline colors so hover never makes
// the text blend into the background — avoids depending on Tailwind hover utilities
function ContactLink() {
  const [hover, setHover] = useState(false);
  const bg = hover ? '#005266' : '#ffffff';
  const color = hover ? '#ffffff' : '#005266';
  const border = hover ? '#005266' : '#a3ba0f';

  return (
    <Link
      to="/contact"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
      style={{ backgroundColor: bg, color, border: `1px solid ${border}` }}
    >
      Hubungi Kami
    </Link>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-kop-bg flex items-center justify-center p-6">
      <div className="w-full max-w-6xl relative">
        {/* Decorative brand symbol behind the card — put the PNG into public/assets/sako-symbol.png */}
              <img
                src="/assets/kemenkop/logo kemenkop head.png"
                alt=""
                aria-hidden
                className="pointer-events-none hidden md:block fixed left-6 bottom-6 md:left-8 md:bottom-8 w-44 md:w-96 mix-blend-multiply transform -rotate-12 z-10"
                style={{ opacity: 0.06 }}
              />
        <div className="relative bg-white z-10 rounded-2xl shadow-[0_24px_48px_rgba(10,10,10,0.06)] p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center overflow-hidden">
          {/* Left column (text + controls) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-6">
              {/* Hardcode the gradient inline — this avoids tailwind generation issues */}
              <h2
                aria-hidden
                className="text-[64px] md:text-[96px] font-black leading-none bg-clip-text text-transparent drop-shadow-[0_5px_14px_rgba(16,24,40,0.06)] gradientShift"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #005266 0%, #a3ba0f 55%, #eba51a 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                404
              </h2>
              <div>
                <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-sm md:text-base text-brand-black font-medium">This is not the web page you are looking for.</p>
                </div>
             
              </div>
            </div>

            <p className="text-gray-600 max-w-xl">Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia. Coba kembali ke beranda atau hubungi kami jika masalah berlanjut.</p>

            <div className="flex gap-3 mt-3">
              <Link to="/Dashboard" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-brand-yellow text-brand-black font-semibold shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40 group transform transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <span>Kembali ke Dashboard</span>
                <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13 6l6 6-6 6" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              {/* Hard-coded hover using small state to avoid disappearing text */}
              <ContactLink />
            </div>

           
          </div>

          {/* Right column (illustration) */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md rounded-xl overflow-hidden shadow-md group">
        <div className="absolute -left-6 top-6 w-12 h-12 rounded-full" style={{ background: 'linear-gradient(90deg,#005266,#a3ba0f)' }} />
        <div className="absolute right-6 -bottom-6 w-6 h-6 rounded-full" style={{ background: '#eba51a' }} />
              {/* stylized illustration (not GitHub artwork) */}
              <svg viewBox="0 0 600 360" className="w-full h-auto floaty transform transition-transform duration-300 group-hover:scale-105" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="g2" x1="0" x2="1">
                    <stop offset="0%" stopColor="#005266" />
                    <stop offset="60%" stopColor="#a3ba0f" />
                    <stop offset="100%" stopColor="#eba51a" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="600" height="360" fill="#f8faf8" />
                <rect x="40" y="70" width="520" height="200" rx="16" fill="#fff" stroke="#F0F0F0" />
                <circle cx="280" cy="170" r="64" fill="url(#g2)" opacity="0.95" className="pulse-slow" />
                <rect x="360" y="220" width="12" height="80" transform="rotate(-45 360 220)" fill="#a3ba0f" rx="3" />
                <rect x="120" y="110" width="160" height="12" rx="6" fill="#E6E6E8" />
                <rect x="120" y="140" width="100" height="10" rx="6" fill="#F3F4F6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
