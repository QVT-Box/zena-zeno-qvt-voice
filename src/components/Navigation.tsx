// src/components/Navigation.tsx

import { Link, NavLink } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="mt-4 w-full max-w-6xl px-4 md:px-8 pointer-events-auto">
        <nav className="flex items-center justify-between rounded-full border border-white/60 bg-[#FAF6EE]/70 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.12)] px-4 py-2 md:px-6 md:py-3">
          {/* LOGO / MARQUE */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#C3A878] via-[#F5E3C3] to-[#B28FE8] shadow-md">
              <Sparkles className="h-4 w-4 text-[#1B1A18]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs uppercase tracking-[0.18em] text-[#9C8D77]">
                QVT Box
              </span>
              <span className="text-sm font-medium text-[#1B1A18]">
                ZÉNA · IA émotionnelle
              </span>
            </div>
          </Link>

          {/* LIENS */}
          <div className="hidden items-center gap-6 text-sm text-[#5B4A33] md:flex">
            <NavLink
              to="/zena-entreprise"
              className={({ isActive }) =>
                `transition hover:text-[#C3A878] ${
                  isActive ? "text-[#C3A878] font-medium" : ""
                }`
              }
            >
              Entreprise
            </NavLink>
            <NavLink
              to="/zena-family"
              className={({ isActive }) =>
                `transition hover:text-[#C3A878] ${
                  isActive ? "text-[#C3A878] font-medium" : ""
                }`
              }
            >
              Familles & Ados
            </NavLink>

            <Link
              to="/zena-chat"
              className="inline-flex items-center gap-1 rounded-full bg-[#1B1A18] px-4 py-1.5 text-xs font-medium text-[#FDF9F0] hover:bg-[#2b2620] transition"
            >
              Tester comment ZÉNA parle
            </Link>
          </div>

          {/* Bouton mobile */}
          <Link
            to="/zena-chat"
            className="flex items-center gap-1 rounded-full bg-[#1B1A18] px-3 py-1.5 text-xs font-medium text-[#FDF9F0] hover:bg-[#2b2620] md:hidden"
          >
            Tester ZÉNA
          </Link>
        </nav>
      </div>
    </header>
  );
}
