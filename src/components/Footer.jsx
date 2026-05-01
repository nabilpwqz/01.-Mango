export default function Footer() {
  return (
    <footer className="mt-12 border-t border-[#e5e7eb] bg-white">
      <div className="container-pro py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <p className="text-xl font-bold text-[#0f172a]">Mango</p>
          <p className="mt-3 text-[#64748b] max-w-xs">
            A modern digital borrowing platform for discovering your next favorite read.
          </p>
        </div>
        <div>
          <p className="font-semibold mb-3">Contact Us</p>
          <p className="text-[#64748b]">support@mangolibrary.dev</p>
          <p className="text-[#64748b] mt-1">Dhaka, Bangladesh</p>
        </div>
        <div>
          <p className="font-semibold mb-3">Follow</p>
          <div className="flex gap-4 text-[#64748b]">
            <a className="hover:text-[#059669] transition" href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a className="hover:text-[#059669] transition" href="https://x.com" target="_blank" rel="noreferrer">X</a>
            <a className="hover:text-[#059669] transition" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
