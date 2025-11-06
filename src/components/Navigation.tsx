import { Link } from "react-router-dom";
import qvtLogo from "@/assets/qvtbox-logo.png";

/**
 * 🧭 Navigation principale – QVT Box / Zéna
 * Affichée en haut de l’écran, compatible desktop & mobile.
 */
export default function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={qvtLogo}
            alt="QVT Box"
            className="w-10 h-10 rounded-full shadow-md"
          />
          <span className="font-semibold text-lg text-[#5B4B8A]">
            QVT Box
          </span>
        </Link>

        {/* Menu principal */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className="text-gray-700 hover:text-[#5B4B8A] transition"
          >
            Accueil
          </Link>
          <Link
            to="/saas"
            className="text-gray-700 hover:text-[#5B4B8A] transition"
          >
            Dashboard RH
          </Link>
          <Link
            to="/boutique"
            className="text-gray-700 hover:text-[#5B4B8A] transition"
          >
            Boutique
          </Link>
          <Link
            to="/zena-chat"
            className="text-[#5B4B8A] font-semibold hover:text-[#4FD1C5] transition"
          >
            🎙️ Parler à ZÉNA
          </Link>
        </nav>
      </div>
    </header>
  );
}
