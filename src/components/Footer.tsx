import { MessageCircle, Heart, Shield, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1F1309] text-[#FDF3E0] border-t border-[#C89A53]/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#F5D091]">QVT Box</h3>
            <p className="text-sm text-[#FDF3E0]/80 leading-relaxed">
              ZÉNA est l'IA émotionnelle qui veille sur vos équipes, détecte les signaux faibles et prévient le burn-out.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#F5D091]">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://qvtbox.com" className="text-[#FDF3E0]/80 hover:text-[#F5D091] transition-colors">
                  QVT Box
                </a>
              </li>
              <li>
                <a href="https://zena-family.qvtbox.com" className="text-[#FDF3E0]/80 hover:text-[#F5D091] transition-colors">
                  ZÉNA Famille & Ados
                </a>
              </li>
              <li>
                <a href="/zena-chat" className="text-[#FDF3E0]/80 hover:text-[#F5D091] transition-colors">
                  Parler à ZÉNA
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#F5D091]">Contact</h3>
            <ul className="space-y-2 text-sm text-[#FDF3E0]/80">
              <li>
                <a href="mailto:contact@qvtbox.com" className="hover:text-[#F5D091] transition-colors">
                  contact@qvtbox.com
                </a>
              </li>
              <li>
                <a href="tel:+33123456789" className="hover:text-[#F5D091] transition-colors">
                  +33 1 23 45 67 89
                </a>
              </li>
            </ul>
          </div>

          {/* Valeurs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#F5D091]">Nos valeurs</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-[#FDF3E0]/80">
                <Heart className="w-4 h-4 text-[#F5D091]" />
                <span>Empathie</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#FDF3E0]/80">
                <Shield className="w-4 h-4 text-[#F5D091]" />
                <span>Confidentialité</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#FDF3E0]/80">
                <Users className="w-4 h-4 text-[#F5D091]" />
                <span>Bien-être</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[#C89A53]/20 text-center text-sm text-[#FDF3E0]/60">
          <p>&copy; {new Date().getFullYear()} QVT Box. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
