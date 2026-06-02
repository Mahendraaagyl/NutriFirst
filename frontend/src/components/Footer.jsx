import logo from '../assets/nutrifirst-logo-only.png';

export default function Footer() {
  return (
    <footer className="mt-auto py-10 px-6 flex flex-col items-center gap-4">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="NutriFirst"
          className="w-14 h-14 object-contain"
        />
        <div>
          <p className="text-white font-bold text-lg leading-tight">NUTRI FIRST</p>
          <p className="text-tosca text-xs tracking-widest">SIMPLY HEALTHY</p>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 text-sm text-white/60">
        <span>Nutri First Team 2026</span>
        <span className="w-px h-4 bg-white/30" />
        <a href="mailto:nutrifirst@gmail.com" className="hover:text-tosca transition">
          nutrifirst@gmail.com
        </a>
      </div>
    </footer>
  );
}
