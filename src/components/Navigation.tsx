// src/components/Navigation.tsx

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import InstallZenaButton from "./InstallZenaButton";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "ZÉNA parle", href: "/zena-chat" },
  { label: "Espace RH", href: "/onboarding-company" },
  { label: "Wellness Hub", href: "/wellness-hub" },
];

export default function Navigation() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="mx-auto max-w-6xl px-4 pt-4 md:px-6">
        {/* Conteneur principal de la barre */}
        <nav
          className="
            pointer-events-auto
            flex items-center justify-between
            rounded-full
            border border-[#C3A878]/50
            bg-[radial-gradient(circle_at_0%_0%,#FFF8EA_0%,#2B2118_55%,#130F0C_100%)]
            px-4 py-2.5 md:px-6 md:py-3
            shadow-[0_18px_45px_rgba(0,0,0,0.45)]
            backdrop-blur-xl
          "
        >
          {/* LOGO / MARQUE */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full
                bg-gradient-to-br from-[#F6D38D] via-[#FBE6B5] to-[#D6B06F]
                shadow-[0_0_24px_rgba(246,211,141,0.9)]
              "
            >
              <span className="text-xs font-semibold tracking-[0.18em] text-[#3B2814]">
                Z
              </span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs uppercase tracking-[0.22em] text-[#FBE6B5]/80">
                QVT BOX
              </span>
              <span className="text-sm md:text-base font-medium text-[#FDF7EB]">
                ZÉNA IA émotionnelle
              </span>
            </div>
          </Link>

          {/* NAVIGATION DESKTOP */}
          <div className="hidden items-center gap-6 md:flex">
            <div className="flex items-center gap-4 text-xs md:text-sm">
              {navLinks.map((item) => {
                const active = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                      relative px-3 py-1.5 rounded-full transition
                      ${
                        active
                          ? "bg-[#F6D38D]/15 text-[#FBE6B5] border border-[#F6D38D]/60"
                          : "text-[#FBE6B5]/80 hover:text-[#FFFFFF] hover:bg-[#F6D38D]/8"
                      }
                    `}
                  >
                    {item.label}
                    {active && (
                      <span className="pointer-events-none absolute inset-0 rounded-full border border-[#FBE6B5]/50" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* BOUTON INSTALL PWA + CTA */}
            <div className="flex items-center gap-3">
              <InstallZenaButton />

              <Link
                to="/zena-chat"
                className="
                  inline-flex items-center gap-2
                  rounded-full
                  bg-[#F6D38D]
                  px-4 py-2
                  text-xs md:text-sm font-semibold
                  text-[#2B2118]
                  shadow-[0_12px_30px_rgba(246,211,141,0.7)]
                  hover:bg-[#FBE6B5]
                  transition
                "
              >
                Parler à ZÉNA
              </Link>
            </div>
          </div>

          {/* BOUTON MOBILE (BURGER) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="
              inline-flex items-center justify-center
              rounded-full border border-[#F6D38D]/50
              bg-black/40 text-[#FBE6B5]
              p-2.5 md:hidden
            "
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>
      </div>

      {/* OVERLAY MOBILE */}
      {open && (
        <div className="pointer-events-auto md:hidden">
          <div className="fixed inset-0 z-30 bg-black/55 backdrop-blur-sm" />
          <div
            className="
              fixed inset-x-4 top-20 z-40
              rounded-3xl
              border border-[#C3A878]/40
              bg-[radial-gradient(circle_at_0%_0%,#FFF8EA_0%,#2B2118_60%,#0B0907_100%)]
              px-5 py-5
              shadow-[0_18px_55px_rgba(0,0,0,0.65)]
            "
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#FBE6B5]/70">
                  ZÉNA • QVT BOX
                </span>
                <span className="text-sm font-medium text-[#FDF7EB]">
                  Votre bulle d’écoute émotionnelle
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[#F6D38D]/50 bg-black/40 p-1.5 text-[#FBE6B5]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((item) => {
                const active = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={`
                      flex items-center justify-between
                      rounded-2xl px-3 py-2.5 text-sm
                      ${
                        active
                          ? "bg-[#F6D38D]/18 text-[#FBE6B5] border border-[#F6D38D]/60"
                          : "text-[#FBE6B5]/85 hover:bg-[#F6D38D]/10"
                      }
                    `}
                  >
                    <span>{item.label}</span>
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F6D38D]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-5 border-t border-white/10 pt-4 flex flex-col gap-3">
              <InstallZenaButton />

              <Link
                to="/zena-chat"
                onClick={() => setOpen(false)}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-full
                  bg-[#F6D38D]
                  px-4 py-2.5
                  text-sm font-semibold
                  text-[#2B2118]
                  shadow-[0_12px_30px_rgba(246,211,141,0.8)]
                "
              >
                Parler à ZÉNA
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
