import { useState } from "react";
import ZenaChatEngine from "@/components/ZenaChatEngine";
import AvatarGenderSelector from "@/components/AvatarGenderSelector";
import RoleSelector, { RoleType } from "@/components/RoleSelector";
import ZenaAvatar from "@/components/ZenaAvatar";

export default function Index() {
  const [gender, setGender] = useState<"female" | "male">("female");
  const [role, setRole] = useState<RoleType>("coach");

  return (
    <div className="min-h-screen flex flex-col justify-between gradient-ambient text-foreground overflow-x-hidden">
      {/* ==== HEADER & AVATAR ==== */}
      <section className="flex flex-col items-center justify-center mt-12 md:mt-16 text-center px-4 space-y-6">
        {/* Avatar centré */}
        <div className="flex justify-center animate-slide-up">
          <ZenaAvatar isSpeaking={false} emotion="neutral" />
        </div>

        {/* Texte d’intro */}
        <div className="max-w-2xl mx-auto space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold gradient-primary bg-clip-text text-transparent">
            ZÉNA Voice
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            L’IA émotionnelle de <span className="font-semibold text-secondary">QVT Box</span> — 
            une voix humaine, une bulle de bien-être, un lien entre émotions et action.
          </p>
        </div>
      </section>

      {/* ==== CONTRÔLES ==== */}
      <section className="flex flex-col md:flex-row justify-center items-center gap-5 mt-6 px-4 animate-slide-up">
        <AvatarGenderSelector gender={gender} onGenderChange={setGender} />
        <RoleSelector currentRole={role} onRoleChange={setRole} />
      </section>

      {/* ==== CHAT ==== */}
      <section className="flex-1 w-full flex items-center justify-center px-4 mt-8">
        <div className="max-w-5xl w-full">
          <ZenaChatEngine gender={gender} role={role} />
        </div>
      </section>

      {/* ==== FOOTER ==== */}
      <footer className="mt-12 py-6 text-center text-sm text-muted-foreground border-t border-border bg-card/40 backdrop-blur-sm">
        <p>
          © {new Date().getFullYear()} QVT Box —{" "}
          <span className="text-secondary font-medium">Le coup de pouce bien-être</span> 💡
        </p>
        <p className="text-xs mt-1 opacity-80">Made with 💜 en Bretagne</p>
      </footer>
    </div>
  );
}
