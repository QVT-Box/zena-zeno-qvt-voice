// src/components/Navigation.tsx
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-40 transition-all 
        backdrop-blur-xl 
        ${scrolled ? "bg-white/60 shadow-md" : "bg-white/20"}
      `}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-wide text-[#005b5f]"
        >
          ZÉNA<span className="text-[#4fd1c5]">.</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8 text-[#1B1A18] font-medium">
          <Link to="/zena-chat" className="hover:text-[#4fd1c5]">Tester Zéna</Link>
          <Link to="/onboarding-company" className="hover:text-[#4fd1c5]">Entreprise</Link>
          <Link to="/contact" className="hover:text-[#4fd1c5]">Contact</Link>

          <Link
            to="/zena-chat"
            className="px-5 py-2 rounded-full bg-[#005b5f] text-white text-sm hover:bg-[#004c50] transition"
          >
            Essayer maintenant
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-[#005b5f] hover:bg-[#e0f2f2]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden bg-white/90 backdrop-blur-xl border-t p-6 flex flex-col gap-5 text-[#1B1A18]">
          <Link to="/zena-chat" className="hover:text-[#4fd1c5]">Tester Zéna</Link>
          <Link to="/onboarding-company" className="hover:text-[#4fd1c5]">Entreprise</Link>
          <Link to="/contact" className="hover:text-[#4fd1c5]">Contact</Link>
        </div>
      )}
    </header>
  );
}
