// src/components/Navigation.tsx

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Accueil", to: "/" },
  { label: "ZÉNA Entreprise", to: "/onboarding-company" },
  { label: "ZÉNA Chat", to: "/zena-chat" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path));

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      {/* Conteneur centré façon Pi.ai */}
      <div className="mt-4 w-full max-w-5xl px-4 pointer-events-auto">
        <header
          className="
            flex items-center justify-between
            rounded-3xl border border-white/70
            bg-[#FAF6EE]/80
            shadow-[0_18px_45px_rgba(164,135,90,0.22)]
            backdrop-blur-2xl
            px-4 md:px-6
            py-2.5 md:py-3
          "
        >
          {/* LOGO + TAGLINE */}
          <Link
            to="/"
            className="flex items-center gap-2 md:gap-3"
            onClick={() => setOpen(false)}
          >
            {/* Petit “médaillon” lumineux type Pi.ai */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FBEFD9] via-[#E9D0A0] to-[#C29A65] shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.8),transparent_55%)]" />
              <span className="relative text-[13px] font-semibold tracking-[0.12em] text-[#4A3822]">
                Z
              </span>
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm md:text-base font-medium tracking-[0.18em] uppercase text-[#7C6A4C]">
                ZÉNA
              </span>
              <span className="text-[10px] md:text-[11px] text-[#A18F73]">
                La voix qui veille sur vos émotions
              </span>
            </div>
          </Link>

          {/* LIENS DESKTOP */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs md:text-sm text-[#6B5B46]">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    relative px-3 py-1.5 rounded-full transition
                    ${
                      isActive(link.to)
                        ? "bg-[#F2E3C7] text-[#3D3021] shadow-sm"
                        : "hover:bg-[#F7EADB] hover:text-[#3D3021]"
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA “Essayer ZÉNA” */}
            <Link
              to="/zena-chat"
              className="
                inline-flex items-center gap-2
                rounded-full px-4 py-2
                text-xs md:text-sm font-medium
                bg-gradient-to-r from-[#D8B889] to-[#C29A65]
                text-[#1B1A18]
                shadow-[0_10px_25px_rgba(163,119,63,0.4)]
                hover:brightness-110
                transition
              "
            >
              Essayer ZÉNA
            </Link>
          </div>

          {/* BOUTON MOBILE */}
          <button
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-2xl border border-[#E3D3B8] bg-[#FAF6EE]/90 shadow-sm"
            onClick={() => setOpen((v) => !v)}
            aria-label="Ouvrir le menu"
          >
            {open ? (
              <X className="w-5 h-5 text-[#4A3822]" />
            ) : (
              <Menu className="w-5 h-5 text-[#4A3822]" />
            )}
          </button>
        </header>

        {/* MENU MOBILE DÉROULANT */}
        {open && (
          <div
            className="
              mt-2 rounded-3xl border border-white/70
              bg-[#FAF6EE]/95 backdrop-blur-2xl
              shadow-[0_16px_40px_rgba(153,122,76,0.28)]
              px-4 py-3 flex flex-col gap-2 md:hidden
            "
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`
                  w-full text-sm px-3 py-2 rounded-2xl text-left transition
                  ${
                    isActive(link.to)
                      ? "bg-[#F2E3C7] text-[#3D3021]"
                      : "text-[#6B5B46] hover:bg-[#F7EADB] hover:text-[#3D3021]"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/zena-chat"
              onClick={() => setOpen(false)}
              className="
                mt-1 inline-flex items-center justify-center
                rounded-2xl px-4 py-2.5
                text-sm font-medium
                bg-gradient-to-r from-[#D8B889] to-[#C29A65]
                text-[#1B1A18]
                shadow-[0_10px_25px_rgba(163,119,63,0.4)]
              "
            >
              Essayer ZÉNA
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
