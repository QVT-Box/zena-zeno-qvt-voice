import { useState } from "react";
import ZenaChatEngine from "@/components/ZenaChatEngine";
import AvatarGenderSelector from "@/components/AvatarGenderSelector";
import RoleSelector, { RoleType } from "@/components/RoleSelector";
import ZenaAvatar from "@/components/ZenaAvatar"; // 💫 Avatar animé ZÉNA

/**
 * 🌿 Page principale : ZÉNA Voice – IA émotionnelle de QVT Box
 * -------------------------------------------------------------
 * Interface complète : avatar animé, sélecteurs, moteur de dialogue et footer.
 */
const Index = () => {
  const [gender, setGender] = useState<"female" | "male">("female");
  const [role, setRole] = useState<RoleType>("coach");

  return (
    <div className="min-h-screen flex flex-col gradient-ambient text-foreground">
      {/* === Contenu principal === */}
      <main className="flex-1 container mx-auto px-4 py-10 space-y-10">
        {/* ==== HEADER ==== */}
        <header className="text-center animate-slide-up flex flex-col items-center gap-6 relative">
          {/* Halo doux arrière-plan */}
          <div
            className="absolute -z-10 w-72 h-72 rounded-full blur-3xl animate-breathe"
            style={{
              background:
                "radial-gradient(circle, rgba(79,209,197,0.4), rgba(91,75,138,0.25), transparent 70%)",
              boxShadow: "0 0 90px rgba(91,75,138,0.3)",
            }}
          />

          {/* === Avatar animé ZÉNA === */}
          <ZenaAvatar />

          {/* === Titre principal === */}
          <h1 className="text-4xl md:text-5xl font-bold gradient-primary bg-clip-text text-transparent mt-8">
            ZÉNA Voice
          </h1>

          {/* === Sous-texte === */}
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            L’IA émotionnelle de{" "}
            <span className="font-semibold text-secondary">QVT Box</span> — une voix humaine, une
            bulle de bien-être, un lien entre émotions et action.
          </p>
        </header>

        {/* ==== SÉLECTEURS ==== */}
        <section className="flex flex-col md:flex-row justify-center items-center gap-6 animate-slide-up">
          <AvatarGenderSelector gender={gender} onGenderChange={setGender} />
          <RoleSelector currentRole={role} onRoleChange={setRole} />
        </section>

        {/* ==== MOTEUR DE CHAT ==== */}
        <section className="max-w-5xl mx-auto">
          <ZenaChatEngine gender={gender} role={role} />
        </section>
      </main>

      {/* === FOOTER === */}
      <footer className="mt-12 text-center text-sm py-8 border-t border-border/40 bg-card/20 backdrop-blur-md relative overflow-hidden">
        {/* Halo d’ambiance discret */}
        <div
          className="absolute inset-0 -z-10 opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at center, rgba(79,209,197,0.25), rgba(91,75,138,0.15), transparent 70%)",
          }}
        />

        {/* Liens rapides */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
          <button
            onClick={() => (window.location.href = "/zena-chat")}
            className="px-5 py-2 rounded-full font-medium text-white bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] hover:opacity-90 transition-all duration-300"
          >
            💬 Parler avec ZÉNA
          </button>

          <a
            href="https://qvtbox.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary font-medium hover:underline"
          >
            🌐 qvtbox.com
          </a>

          <a
            href="mailto:contact@qvtbox.com"
            className="text-muted-foreground hover:text-secondary transition-colors"
          >
            ✉️ contact@qvtbox.com
          </a>
        </div>

        {/* Signature QVT Box */}
        <p className="opacity-80 text-muted-foreground text-xs tracking-wide">
          © {new Date().getFullYear()} QVT Box — Le coup de pouce bien-être 💡
        </p>
      </footer>
    </div>
  );
};

export default Index;
