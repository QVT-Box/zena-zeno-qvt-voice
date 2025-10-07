// src/pages/Index.tsx
import { useState } from "react";
import ZenaChatEngine from "@/components/ZenaChatEngine";
import AvatarGenderSelector from "@/components/AvatarGenderSelector";
import RoleSelector, { RoleType } from "@/components/RoleSelector";
import ZenaAvatar from "@/components/ZenaAvatar";

export default function Index() {
  const [gender, setGender] = useState<"female" | "male">("female");
  const [role, setRole] = useState<RoleType>("coach");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-ambient text-foreground">
      {/* === AVATAR ZÉNA === */}
      <div className="mt-10 animate-slide-up">
        <ZenaAvatar isSpeaking={false} emotion="neutral" />
      </div>

      {/* === INTRO === */}
      <section className="text-center max-w-2xl mt-8 space-y-2 animate-slide-up">
        <p className="text-lg text-muted-foreground">
          L’IA émotionnelle de <span className="font-semibold text-secondary">QVT Box</span> —
          une voix humaine, une bulle de bien-être, un lien entre émotions et action.
        </p>
      </section>

      {/* === SÉLECTEURS === */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8 animate-slide-up">
        <AvatarGenderSelector gender={gender} onGenderChange={setGender} />
        <RoleSelector currentRole={role} onRoleChange={setRole} />
      </div>

      {/* === MOTEUR DE CHAT === */}
      <div className="max-w-5xl mx-auto mt-10 w-full px-4">
        <ZenaChatEngine gender={gender} role={role} />
      </div>

      {/* === FOOTER === */}
      <footer className="mt-10 text-sm text-muted-foreground pb-6 opacity-80">
        © {new Date().getFullYear()} QVT Box —{" "}
        <span className="text-secondary font-medium">Le coup de pouce bien-être</span> 💡
      </footer>
    </div>
  );
}
