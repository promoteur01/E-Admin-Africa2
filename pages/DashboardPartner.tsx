
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface DashboardPartnerProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  currentUser: UserProfile | null;
}

const DashboardPartner: React.FC<DashboardPartnerProps> = ({ onNavigate, onLogout, currentUser }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#F5F5DC]/20 flex flex-col lg:flex-row">
      {/* SIDEBAR PARTENAIRE */}
      <aside className="w-full lg:w-72 bg-royalBlue text-white flex flex-col p-6 sticky top-0 h-auto lg:h-screen shadow-2xl z-50">
        <div className="mb-12 text-center" onClick={() => onNavigate('home')}>
          <h2 className="text-2xl font-black tracking-tighter cursor-pointer uppercase">PARTENAIRE.<span className="text-gold">PRO</span></h2>
          <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mt-1">Plateforme de Régie</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          {[
            { id: 'overview', label: 'Ma Visibilité', icon: '📊' },
            { id: 'campaigns', label: 'Mes Campagnes', icon: '🚀' },
            { id: 'billing', label: 'Facturation', icon: '🧾' },
            { id: 'profile', label: 'Entreprise', icon: '🏢' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-gold text-royalBlue shadow-lg scale-105' : 'hover:bg-blue-800 text-blue-100'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[11px] uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 lg:mt-auto space-y-2">
           <button 
             onClick={() => onNavigate('home')} 
             className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-white/10 text-white font-black text-[11px] uppercase tracking-widest transition-all hover:bg-white/20"
           >
              <span>🏠</span> Retour au site
           </button>
           <button 
             onClick={onLogout} 
             className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-red-900/40 text-red-200 font-black text-[11px] uppercase tracking-widest transition-all"
           >
              <span>🚪</span> Déconnexion
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="flex flex-wrap justify-between items-center mb-12 gap-8">
           <div>
              <h1 className="text-4xl font-black text-royalBlue uppercase tracking-tighter leading-none mb-2">Espace Annonceur</h1>
              <div className="flex items-center gap-4">
                 <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gold/20">Partenaire Certifié</span>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Régie Pub E-admin</p>
              </div>
           </div>

           <div className="flex items-center gap-6 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
              <div className="text-right">
                 <p className="font-black text-royalBlue uppercase truncate max-w-[150px]">{currentUser.fullName}</p>
                 <p className="text-[10px] font-black text-gold uppercase tracking-tighter">ID: {currentUser.id}</p>
              </div>
              <div className="w-14 h-14 bg-royalBlue/5 rounded-2xl overflow-hidden border-2 border-royalBlue/10 shadow-inner flex items-center justify-center text-2xl">
                 {currentUser.fullName.charAt(0)}
              </div>
           </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
             {/* Stats Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Impressions Total', val: '1.2M', icon: '👁️', color: 'blue' },
                  { label: 'Clics Générés', val: '45.8k', icon: '🖱️', color: 'gold' },
                  { label: 'CTR Moyen', val: '3.8%', icon: '📈', color: 'green' },
                ].map(s => (
                  <div key={s.label} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                     <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{s.icon}</div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                     <p className="text-3xl font-black text-royalBlue mt-1">{s.val}</p>
                  </div>
                ))}
             </div>

             {/* Active Campaigns */}
             <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-xl font-black text-royalBlue uppercase tracking-tighter">Campagnes en Cours de Diffusion</h3>
                   <button className="bg-gold text-royalBlue font-black px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all text-[10px] uppercase tracking-widest">
                     Lancer une Campagne 🚀
                   </button>
                </div>
                <div className="space-y-6">
                   {[
                     { name: "Promo Forfaits Mobile Money", pos: "Bannière Horizontale", status: "Actif", reach: "850k", clics: "12k" },
                     { name: "Campagne Institutionnelle", pos: "Encart Latéral", status: "Planifié", reach: "0", clics: "0" },
                   ].map((c, i) => (
                     <div key={i} className="flex flex-wrap items-center justify-between p-6 bg-gray-50 rounded-[32px] border border-gray-100 hover:border-gold/30 hover:bg-white hover:shadow-xl transition-all group">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-12 bg-royalBlue text-white rounded-2xl flex items-center justify-center font-black text-[9px] uppercase tracking-tighter shadow-lg group-hover:rotate-3 transition-transform">Visuel</div>
                           <div>
                              <h4 className="font-black text-royalBlue uppercase text-sm tracking-tight">{c.name}</h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{c.pos}</p>
                           </div>
                        </div>
                        <div className="flex gap-12 text-center">
                           <div>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Portée</p>
                              <p className="font-black text-royalBlue">{c.reach}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Clics</p>
                              <p className="font-black text-royalBlue">{c.clics}</p>
                           </div>
                           <div className="flex items-center">
                              <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${c.status === 'Actif' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{c.status}</span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPartner;
