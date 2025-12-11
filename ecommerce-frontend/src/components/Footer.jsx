export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 ">
      {/* Top light section */}
      <div className="bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand + Address */}
          <div>
            <div className="mb-4">
              <span className="px-6 py-2 border border-black inline-block tracking-[.3em]">BOUTIQUE</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span aria-hidden className="mt-0.5">🏠</span>
                <span>5701 Outlets at Tejon Pkwy, Tejon Ranch CA 93203 UK.</span>
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden className="mt-0.5">📞</span>
                <span>(+800) 6668 2268</span>
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden className="mt-[2px]">✉️</span>
                <span>info@demo.com</span>
              </li>
            </ul>
          </div>

          {/* Information links */}
          <div>
            <h4 className="font-semibold mb-4">INFORMATION</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:text-black">About us</a></li>
              <li><a href="#" className="hover:text-black">Search</a></li>
              <li><a href="#" className="hover:text-black">Privacy policy</a></li>
              <li><a href="#" className="hover:text-black">Terms of service</a></li>
              <li><a href="#" className="hover:text-black">Refund policy</a></li>
              <li><a href="#" className="hover:text-black">Contact us</a></li>
            </ul>
          </div>

          {/* Newsletter + Socials */}
          <div>
            <h4 className="font-semibold mb-2">NEWSLETTER</h4>
            <div className="flex items-center gap-2 mb-4">
              <input placeholder="Subscribe our newsletter" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
              <button className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-200">OK</button>
            </div>
            <h4 className="font-semibold mb-2">FOLLOW US</h4>
            <div className="flex items-center gap-2">
              {[
                { name: 'Facebook', path: 'M18 2h3a1 1 0 011 1v3h-4a4 4 0 00-4 4v4H10v-4a4 4 0 014-4h4V3a1 1 0 010-1z' },
                { name: 'Twitter', path: 'M22 5.92a8.15 8.15 0 01-2.35.64 4.1 4.1 0 001.8-2.27 8.21 8.21 0 01-2.6 1 4.09 4.09 0 00-7 3.73A11.62 11.62 0 013 4.8a4.09 4.09 0 001.27 5.46A4 4 0 012 9.63v.05a4.09 4.09 0 003.28 4A4.1 4.1 0 012 14.1a8.22 8.22 0 004.45 1.3A11.56 11.56 0 0018 6.9c0-.18 0-.35-.01-.53A8.18 8.18 0 0022 5.92z' },
                { name: 'Google', path: 'M21.35 11.1H12v2.9h5.35a4.66 4.66 0 01-2 3.06v2.53h3.23a9.31 9.31 0 003.11-7.18c0-.63-.06-1.24-.19-1.82z' },
                { name: 'Instagram', path: 'M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm11 3a1 1 0 110 2 1 1 0 010-2zm-6 2a5 5 0 105 5 5 5 0 00-5-5z' },
                { name: 'YouTube', path: 'M10 15l5.19-3L10 9v6z M21 7a3 3 0 00-3-3H6a3 3 0 00-3 3v10a3 3 0 003 3h12a3 3 0 003-3V7z' }
              ].map((icon, i) => (
                <button key={i} className="w-8 h-8 grid place-items-center border border-gray-300 rounded hover:bg-gray-200" aria-label={icon.name}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d={icon.path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="font-semibold mb-2">TAGS</h4>
            <div className="flex flex-wrap gap-2">
              {["COAT", "DRESS", "JEAN", "SHIRT", "TSHIRT"].map((t) => (
                <span key={t} className="px-3 py-1 text-xs border border-gray-300 rounded-full text-gray-700 hover:bg-gray-200">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom dark section */}
      <div className="bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <div className="uppercase text-xs tracking-wider">We accept</div>
            <div className="text-[11px]">Online Payment. Be secured</div>
          </div>
          <div className="flex items-center gap-6 text-white/80 text-sm">
            <span>VISA</span>
            <span>PayPal</span>
            <span>DISCOVER</span>
            <span>citibank</span>
          </div>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" className="p-2 bg-gray-800 hover:bg-gray-700 rounded shadow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>
          </button>
        </div>
        <div className="max-w-6xl mx-auto px-4 pb-6 text-center text-xs text-gray-400">© {year} Boutique — All Rights Reserved.</div>
      </div>
    </footer>
  );
}
