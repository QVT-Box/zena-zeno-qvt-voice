import { useState } from "react";
import ZenaChatEngine from "@/components/ZenaChatEngine";
import AvatarGenderSelector from "@/components/AvatarGenderSelector";
import RoleSelector, { RoleType } from "@/components/RoleSelector";
import ZenaAvatar from "@/components/ZenaAvatar";

export default function Index() {
  const [gender, setGender] = useState<"female" | "male">("female");
  const [role, setRole] = useState<RoleType>("coach");

  return (
    <div className="min-h-screen flex flex-col gradient-ambient text-foreground">
      {/* ======== HEADER ======== */}
      <header className="text-center flex flex-col items-center justify-center mt-12 md:mt-16 gap-4 relative">
        <ZenaAvatar isSpeaking={false} emotion="neutral" />
        <h1 className="text-4xl md:text-5xl font-bold gradient-primary bg-clip-text text-transparent mt-4">
          ZÉNA Voice
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          L’IA émotionnelle de <span className="text-secondary font-semibold">QVT Box</span> — 
          une voix humaine, une bulle de bien-être, un lien entre émotions et action.
        </p>
      </header>

      {/* ======== CONTROLES ======== */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
        <AvatarGenderSelector gender={gender} onGenderChange={setGender} />
        <RoleSelector currentRole={role} onRoleChange={setRole} />
      </div>

      {/* ======== CHAT ENGINE ======== */}
      <main className="flex-1 flex justify-center items-start mt-10 px-4">
        <div className="max-w-5xl w-full">
          <ZenaChatEngine gender={gender} role={role} />
        </div>
      </main>

      {/* ======== FOOTER ======== */}
      <footer className="text-center text-sm text-muted-foreground py-6 border-t border-border bg-card/20 backdrop-blur-sm">
        <p>
          © {new Date().getFullYear()} QVT Box —{" "}
          <span className="text-secondary font-medium">Le coup de pouce bien-être</span> 💡
        </p>
        <p className="text-xs opacity-75 mt-1">Made with 💜 en Bretagne</p>
      </footer>
    </div>
  );
}
