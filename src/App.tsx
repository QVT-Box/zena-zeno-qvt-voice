import { useState } from "react";
import ZenaChatEngine from "@/components/ZenaChatEngine";
import AvatarGenderSelector from "@/components/AvatarGenderSelector";
import RoleSelector, { RoleType } from "@/components/RoleSelector";

const Index = () => {
  const [gender, setGender] = useState<"female" | "male">("female");
  const [role, setRole] = useState<RoleType>("coach");

  return (
    <div className="min-h-screen gradient-ambient text-foreground">
      <div className="container mx-auto px-4 py-10 space-y-10">
        {/* Header principal */}
        <header className="text-center animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 gradient-primary bg-clip-text text-transparent">
            ZENA Voice
          </h1>
          <p className="text-muted-foreground text-lg">
            L’IA émotionnelle de QVT Box qui vous écoute, vous parle et vous guide.
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

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground mt-12 opacity-80">
          <p>
            © {new Date().getFullYear()} QVT Box — “Le coup de pouce bien-être”.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
