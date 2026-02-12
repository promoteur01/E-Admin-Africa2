
import React from 'react';
import { SERVICES, COLORS } from '../constants';
import AdSpace from '../components/AdSpace';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full">
      {/* Hero Section - Centralisée */}
      <section className="relative bg-royalBlue text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
             <defs>
               <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                 <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
               </pattern>
             </defs>
           </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tighter">
              Vos démarches en Afrique, <br />
              <span className="text-gold">sans distance ni frontière</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-medium">
              Sécurité, rapidité, interopérabilité. Accédez aux services publics et privés du Mali, Sénégal, Côte d'Ivoire, Cameroun et bien d'autres depuis chez vous.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <button 
                onClick={() => onNavigate('services')}
                className="bg-gold text-royalBlue hover:bg-yellow-500 text-lg font-black px-10 py-5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
              >
                Démarrer une Démarche
              </button>
              <button 
                onClick={() => onNavigate('about')}
                className="bg-transparent border-2 border-white/30 hover:border-white hover:bg-white/10 text-lg font-bold px-10 py-5 rounded-full transition-all uppercase tracking-widest"
              >
                Notre Mission
              </button>
            </div>
          </div>

          {/* Illustration centrée sous l'accroche */}
          <div className="mt-20 w-full max-w-5xl mx-auto animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="relative">
              <div className="bg-gradient-to-tr from-gold/20 to-blue-500/20 absolute inset-0 blur-3xl rounded-full scale-110"></div>
              <div className="relative bg-white/5 backdrop-blur-sm p-4 rounded-[40px] border border-white/10 shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/eadmin-hero/1200/600" 
                  alt="Interface E-admin" 
                  className="rounded-[32px] shadow-2xl border border-white/10 w-full object-cover h-[300px] md:h-[450px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Ad Space 1 */}
      <div className="bg-beigeLight/30 py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-[10px] font-black text-royalBlue/30 uppercase tracking-[0.3em] mb-6">Partenaire Officiel E-admin</h3>
          <AdSpace type="banner" />
        </div>
      </div>

      {/* Services Summary */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center mb-16">
            <h2 className="text-3xl font-black text-royalBlue uppercase">Nos Services Phares</h2>
            <div className="w-16 h-1.5 bg-gold mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.slice(0, 3).map(s => (
                <div key={s.id} className="p-10 bg-gray-50 rounded-[40px] border border-gray-100 hover:bg-white hover:shadow-2xl transition-all cursor-pointer group" onClick={() => onNavigate(`service-${s.id}`)}>
                    <div className="w-16 h-16 bg-royalBlue text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-royalBlue transition-all shadow-lg">
                        {s.icon}
                    </div>
                    <h3 className="text-xl font-bold text-royalBlue mb-3">{s.title}</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">{s.description}</p>
                </div>
            ))}
        </div>
        <div className="text-center mt-12">
            <button onClick={() => onNavigate('services')} className="font-black text-royalBlue underline hover:text-gold transition-colors uppercase tracking-widest text-sm">Voir tous les services →</button>
        </div>
      </section>

      {/* Inter-Section Ad Space */}
      <div className="container mx-auto px-4 mb-24 grid grid-cols-1 md:grid-cols-2 gap-8">
         <AdSpace type="inline" />
         <AdSpace type="inline" />
      </div>

      {/* Section À Propos détaillée */}
      <section id="about-section" className="py-24 bg-white scroll-mt-20 overflow-hidden border-t border-gray-50">
        <div className="container mx-auto px-4 text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-royalBlue uppercase tracking-tighter">Notre Impact & Vision</h2>
            <div className="w-24 h-2 bg-gold mx-auto rounded-full"></div>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium">L'administration à portée de main, partout en Afrique.</p>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
               <img src="https://picsum.photos/seed/mission/800/1000" className="rounded-[40px] shadow-2xl border border-gray-100 relative z-10" alt="Mission" />
               <div className="absolute -bottom-8 -left-8 bg-royalBlue text-white p-8 rounded-3xl shadow-2xl z-20 max-w-xs border border-white/10">
                  <p className="text-3xl font-black text-gold">🌍 Panafricain</p>
                  <p className="text-sm font-bold mt-2 leading-tight">Une solution unique pour 15 pays d'Afrique francophone.</p>
               </div>
            </div>
            
            <div className="space-y-8 text-left">
              <h3 className="text-3xl font-black text-royalBlue leading-tight">
                Connecter l'administration à <span className="text-gold">chaque client</span>.
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                E-admin.Africa est né d'un constat simple : la distance ne devrait jamais être un obstacle au droit administratif. Notre plateforme hybride combine la puissance du numérique avec un réseau d'agents de proximité certifiés.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                 <div className="p-6 bg-beigeLight/30 rounded-3xl border border-beigeLight hover:border-gold transition-colors group">
                    <h4 className="font-black text-royalBlue mb-2 flex items-center gap-3">
                       <span className="text-2xl group-hover:scale-125 transition-transform">🎯</span> Notre Mission
                    </h4>
                    <p className="text-sm text-gray-500 font-medium">Simplifier la vie des clients en dématérialisant les processus complexes et en réduisant les délais de traitement de 70%.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sidebar-style ad grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-royalBlue uppercase">Espace Partenaires Premium</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AdSpace type="sidebar" />
            <div className="flex flex-col gap-8">
               <AdSpace type="inline" />
               <AdSpace type="inline" />
            </div>
            <AdSpace type="sidebar" />
          </div>
        </div>
      </section>

      {/* Espaces Dédiés Portails */}
      <section id="portals-section" className="py-24 bg-beigeLight/20 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-royalBlue uppercase tracking-tighter">Accès Dédiés aux Portails</h2>
            <div className="w-24 h-1.5 bg-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 'CLIENT', label: 'Espace Client', desc: 'Gérez vos demandes personnelles.', icon: '👤' },
              { id: 'AGENT', label: 'Agent Relais', desc: 'Traitez les dossiers locaux.', icon: '🤝' },
              { id: 'PARTNER', label: 'Partenaire Pro', desc: 'Gérez vos publicités.', icon: '📢' },
              { id: 'ADMIN_SUPER', label: 'Administration', desc: 'Pilotage global du système.', icon: '🛡️' },
            ].map((portal) => (
              <div 
                key={portal.id}
                onClick={() => onNavigate('login')}
                className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group text-center"
              >
                <div className="text-4xl mb-4 group-hover:rotate-12 transition-transform">{portal.icon}</div>
                <h3 className="text-lg font-black text-royalBlue mb-2 uppercase">{portal.label}</h3>
                <p className="text-sm text-gray-500 mb-6 font-medium">{portal.desc}</p>
                <span className="text-xs font-bold text-royalBlue border-b-2 border-gold pb-1 group-hover:text-gold transition-colors">Se connecter →</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
