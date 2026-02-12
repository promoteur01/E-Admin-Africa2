
import React, { useState } from 'react';
import { Logo, COLORS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const marketingMessages = [
    "🚀 VOS DÉMARCHES ADMINISTRATIVES DEPUIS VOTRE SALON",
    "💳 PAIEMENT SÉCURISÉ PAR MOBILE MONEY (ORANGE, MTN, WAVE)",
    "🌍 PLUS DE 15 PAYS COUVERTS EN AFRIQUE FRANCOPHONE",
    "📄 LÉGALISATION, ÉTAT CIVIL, CRÉATION D'ENTREPRISE SANS VOYAGER",
    "💬 SUPPORT RÉACTIF 24H/24 ET 7J/7",
    "⚡ DÉLAIS DE TRAITEMENT RÉDUITS DE 70%",
  ];

  const getDashboardPage = (role: string) => {
    if (role === 'CLIENT') return 'dashboard-client';
    if (role === 'AGENT') return 'dashboard-agent';
    if (role === 'PARTNER') return 'dashboard-partner';
    if (role.startsWith('ADMIN')) return 'dashboard-admin';
    return 'dashboard-client';
  };

  const navItems = [
    { label: 'Accueil', target: 'home' },
    { label: 'Services', target: 'services' },
    { label: 'À propos', target: 'about' },
    { label: 'Blog', target: 'blog' },
    { label: 'Contact', target: 'contact' },
  ];

  const handleMobileNavigate = (target: string) => {
    onNavigate(target);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-white overflow-x-hidden">
      {/* 1. Bandeau Défilant */}
      <div className="bg-gold py-1.5 overflow-hidden border-b border-royalBlue/5 z-40">
        <div className="infinite-scroll flex items-center gap-12">
          {[...marketingMessages, ...marketingMessages].map((msg, idx) => (
            <span 
              key={idx} 
              className="text-royalBlue font-black text-[9px] md:text-[10px] uppercase tracking-widest whitespace-nowrap flex items-center gap-4"
            >
              <span className="w-1 h-1 bg-royalBlue rounded-full"></span>
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Header de Navigation Opaque */}
      <header className="bg-royalBlue text-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div onClick={() => onNavigate('home')} className="cursor-pointer scale-90 origin-left">
            <Logo />
          </div>

          <nav className="hidden lg:flex items-center gap-10 font-medium">
            {navItems.map(item => (
              <button 
                key={item.target}
                onClick={() => onNavigate(item.target)} 
                className="hover:text-gold transition-all text-[11px] font-black uppercase tracking-widest relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            {userRole ? (
              <button 
                onClick={() => onNavigate(getDashboardPage(userRole))}
                className="bg-gold text-royalBlue hover:bg-yellow-500 px-6 py-2.5 rounded-full transition-all text-[11px] font-black shadow-lg uppercase tracking-wider"
              >
                Mon Espace 👤
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onNavigate('login')}
                  className="hidden sm:block border-2 border-white/20 hover:border-gold hover:text-gold px-5 py-2 rounded-full transition-all text-[11px] font-bold uppercase tracking-wider"
                >
                  Connexion
                </button>
                <button 
                  onClick={() => onNavigate('signup')}
                  className="bg-gold text-royalBlue hover:bg-yellow-500 px-6 py-2.5 rounded-full transition-all text-[11px] font-black shadow-lg uppercase tracking-wider"
                >
                  S'inscrire
                </button>
              </div>
            )}
            <button 
              className="lg:hidden p-2 text-white hover:text-gold transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[60] bg-royalBlue flex flex-col pt-24 animate-in slide-in-from-top duration-500">
            <div className="absolute top-6 right-6">
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col items-center gap-10 px-4">
              <Logo />
              {navItems.map(item => (
                <button 
                  key={item.target}
                  onClick={() => handleMobileNavigate(item.target)}
                  className="text-3xl font-black text-white hover:text-gold uppercase tracking-tighter"
                >
                  {item.label}
                </button>
              ))}
              <div className="w-full h-px bg-white/10 my-4 max-w-xs mx-auto"></div>
              {!userRole && (
                <div className="flex flex-col gap-5 w-full max-w-xs">
                  <button 
                    onClick={() => handleMobileNavigate('login')}
                    className="w-full py-4 border-2 border-white/30 text-white rounded-2xl font-bold uppercase tracking-widest text-sm"
                  >
                    Connexion
                  </button>
                  <button 
                    onClick={() => handleMobileNavigate('signup')}
                    className="w-full py-4 bg-gold text-royalBlue rounded-2xl font-black uppercase tracking-widest shadow-2xl text-sm"
                  >
                    S'inscrire
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Conteneur principal opaque */}
      <main className="flex-1 bg-white relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-royalBlue text-white pt-20 pb-10 relative z-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-8">
            <Logo />
            <p className="text-blue-100 text-sm leading-relaxed font-medium">
              E-admin.Africa révolutionne l'accès aux services administratifs en Afrique en supprimant les barrières géographiques.
            </p>
          </div>

          <div>
            <h4 className="text-gold font-black text-xs uppercase tracking-[0.3em] mb-8">Navigation</h4>
            <ul className="space-y-4 text-blue-100 text-sm font-bold">
              <li><button onClick={() => onNavigate('about')} className="hover:text-gold transition-colors uppercase">À propos de nous</button></li>
              <li><button onClick={() => onNavigate('services')} className="hover:text-gold transition-colors uppercase">Nos Guichets</button></li>
              <li><button onClick={() => onNavigate('blog')} className="hover:text-gold transition-colors uppercase">Actualités IA</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-gold transition-colors uppercase">Support Client</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold font-black text-xs uppercase tracking-[0.3em] mb-8">Légal</h4>
            <ul className="space-y-4 text-blue-100 text-sm font-bold">
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-gold transition-colors uppercase">Confidentialité</button></li>
              <li><button className="hover:text-gold transition-colors uppercase">Mentions Légales</button></li>
              <li><button className="hover:text-gold transition-colors uppercase">Conditions d'Utilisation</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold font-black text-xs uppercase tracking-[0.3em] mb-8">Réseaux</h4>
            <div className="flex gap-4">
              {['FB', 'TW', 'IN', 'LI'].map(soc => (
                <button key={soc} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-[10px] hover:bg-gold hover:text-royalBlue transition-all">
                  {soc}
                </button>
              ))}
            </div>
            <p className="mt-8 text-[9px] font-black text-blue-300 uppercase tracking-widest">
              Support WhatsApp : <br/>
              <span className="text-white text-xs">+237 652 410 152</span>
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">
            Copyright © 2025 E-admin.Africa • Panafrican Gov-Tech Leader
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
