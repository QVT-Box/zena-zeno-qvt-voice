import { useState } from "react";
import ZenaChatEngine from "@/components/ZenaChatEngine";
import AvatarGenderSelector from "@/components/AvatarGenderSelector";
import RoleSelector, { RoleType } from "@/components/RoleSelector";
import qvtboxLogo from "@/assets/qvtbox-logo.png"; // 🩵 chemin du logo

const Index = () => {
  const [gender, setGender] = useState<"female" | "male">("female");
  const [role, setRole] = useState<RoleType>("coach");

  return (
    <div className="min-h-screen gradient-ambient text-foreground flex flex-col">
      <div className="container mx-auto px-4 py-10 space-y-10 flex-1">
        {/* Header principal */}
        <header className="text-center animate-slide-up flex flex-col items-center gap-4 relative">
          {/* 💫 Halo doux derrière le logo */}
          <div className="absolute -z-10 w-48 h-48 rounded-full blur-3xl animate-breathe"
               style={{
                 background: "radial-gradient(circle, rgba(79,209,197,0.5), rgba(91,75,138,0.3), transparent 70%)",
                 boxShadow: "0 0 80px rgba(91,75,138,0.4)",
               }} />

          {/* 🔹 Logo QVT Box */}
          <img
            src={qvtboxLogo}
            alt="Logo QVT Box"
            className="w-24 h-24 md:w-28 md:h-28 mx-auto animate-breathe drop-shadow-2xl rounded-full border-2 border-white/10"
          />

          {/* 🔹 Titre principal */}
          <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
            ZENA Voice
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            L’IA émotionnelle de QVT Box — une voix humaine, une bulle de bien-être.
          </p>
        </header>

        {/* Sélecteurs */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 animate-slide-up">
          <AvatarGenderSelector gender={gender} onGenderChange={setGender} />
          <RoleSelector currentRole={role} onRoleChange={setRole} />
        </div>

        {/* Moteur principal */}
        <div className="max-w-5xl mx-auto">
          <ZenaChatEngine gender={gender} role={role} />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground py-6 border-t border-border bg-card/30 backdrop-blur-sm">
        <p className="opacity-80">
          © {new Date().getFullYear()} QVT Box —{" "}
          <span className="text-secondary font-medium">Le coup de pouce bien-être</span> 💡
        </p>
      </footer>
    </div>
  );
};

export default Index;
