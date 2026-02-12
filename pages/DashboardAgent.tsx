
import React, { useState, useEffect } from 'react';
import { RequestStatus, UserRole, UserProfile, ServiceRequest } from '../types';
import { db } from '../services/database';

interface DashboardAgentProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  currentUser: UserProfile | null;
}

const DashboardAgent: React.FC<DashboardAgentProps> = ({ onNavigate, onLogout, currentUser }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  
  // États pour l'inscription client
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '', city: '', email: '' });

  const agentStats = {
    satisfaction: "4.9/5",
    commissions: "125 400 FCFA",
    availableBalance: "42 500 FCFA",
  };

  useEffect(() => {
    if (!currentUser) return;

    const allUsers = db.getUsers();
    // EXCLUSIVITÉ : Filtrer uniquement les clients enrôlés par cet agent
    const myClients = allUsers.filter(u => 
      u.role === UserRole.CLIENT && u.enrolledByAgentId === currentUser.id
    );
    setClients(myClients);

    // EXCLUSIVITÉ : Filtrer uniquement les demandes des clients de cet agent
    const allRequests = db.getRequests();
    const myClientsEmails = new Set(myClients.map(c => c.email.toLowerCase().trim()));
    const myRequests = allRequests.filter(req => myClientsEmails.has(req.clientEmail.toLowerCase().trim()));
    setRequests(myRequests);

  }, [activeTab, isAddClientModalOpen, currentUser]);

  if (!currentUser) return null;

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email) {
      alert("Le nom et l'email sont obligatoires pour l'inscription.");
      return;
    }

    const newUser: UserProfile = {
      id: `u-agent-${Date.now()}`,
      fullName: newClient.name.trim(),
      email: newClient.email.toLowerCase().trim(),
      password: 'welcome123',
      role: UserRole.CLIENT,
      status: 'PENDING',
      city: newClient.city || currentUser.city || 'Dakar',
      country: currentUser.country || 'Sénégal',
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      enrolledByAgentId: currentUser.id // Lien de parenté agent-client
    };

    const success = db.addUser(newUser);
    
    if (success) {
      alert(`Client ${newClient.name} enrôlé ! Il apparaît désormais dans votre portefeuille.`);
      setNewClient({ name: '', phone: '', city: '', email: '' });
      setIsAddClientModalOpen(false);
    } else {
      alert("Erreur : Un utilisateur existe déjà avec cet email.");
    }
  };

  const getStatusStyle = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200';
      case RequestStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700 border-blue-200';
      case RequestStatus.PENDING: return 'bg-orange-100 text-orange-700 border-orange-200';
      case RequestStatus.REJECTED: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Mon Portefeuille', val: clients.length, icon: '👥' },
                { label: 'Dossiers Suivis', val: requests.length, icon: '📄' },
                { label: 'Satisfaction', val: agentStats.satisfaction, icon: '⭐' },
                { label: 'Commissions', val: agentStats.commissions, icon: '💰' },
              ].map(s => (
                <div key={s.label} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="text-xl mb-2">{s.icon}</div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                  <p className="text-lg font-black text-royalBlue mt-1">{s.val}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-royalBlue text-white p-6 rounded-[32px] shadow-xl relative overflow-hidden flex flex-col justify-between">
                  <div className="relative z-10">
                    <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 text-gold">Action Rapide</h3>
                    <p className="text-xl font-black mb-4 leading-tight">Besoin d'inscrire un nouveau client de proximité ?</p>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('clients'); setIsAddClientModalOpen(true); }}
                    className="relative z-10 bg-gold text-royalBlue py-3 px-6 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-black/20 self-start hover:scale-105 transition-transform"
                  >
                    + Enrôler Client
                  </button>
                  <div className="absolute top-0 right-0 p-8 opacity-10 text-6xl rotate-12">🌍</div>
               </div>
               <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 text-royalBlue">Dernières Activités Clients</h3>
                  <div className="space-y-3">
                     {requests.slice(0, 3).map(req => (
                        <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-royalBlue/10 rounded-full flex items-center justify-center text-[10px] font-black text-royalBlue">📄</div>
                              <div>
                                 <p className="text-[10px] font-black text-royalBlue uppercase">{req.clientName}</p>
                                 <p className="text-[9px] text-gray-400 font-bold uppercase">{req.type} • {req.status}</p>
                              </div>
                           </div>
                        </div>
                     ))}
                     {requests.length === 0 && (
                       <p className="text-center py-4 text-[9px] font-black text-gray-400 uppercase">Aucun dossier en cours</p>
                     )}
                  </div>
               </div>
            </div>
          </div>
        );

      case 'requests':
        return (
          <div className="space-y-6 animate-in fade-in h-full flex flex-col">
            <h2 className="text-xl font-black text-royalBlue uppercase tracking-tighter">Suivi des Dossiers de mon Portefeuille</h2>
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Dossier / Réf</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Client</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Date</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Statut</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {requests.map(req => (
                          <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <p className="text-[11px] font-black text-royalBlue uppercase">{req.type}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase">{req.id}</p>
                            </td>
                            <td className="px-6 py-4 text-xs font-bold text-gray-600 uppercase">{req.clientName}</td>
                            <td className="px-6 py-4 text-[10px] font-bold text-gray-400">{req.submissionDate}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${getStatusStyle(req.status)}`}>
                                  {req.status}
                                </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {requests.length === 0 && (
                    <div className="py-20 text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aucun dossier trouvé</p>
                    </div>
                  )}
                </div>
            </div>
          </div>
        );

      case 'clients':
        return (
          <div className="space-y-6 h-full flex flex-col animate-in fade-in">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-black text-royalBlue uppercase tracking-tighter">Mes Clients Enrôlés</h2>
                <div className="flex gap-3 w-full sm:w-auto">
                   <div className="relative flex-1 sm:w-64">
                      <input 
                        type="text" 
                        placeholder="Chercher client..." 
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-royalBlue shadow-sm font-bold"
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
                   </div>
                   <button 
                    onClick={() => setIsAddClientModalOpen(true)}
                    className="bg-gold text-royalBlue px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-gold/20 hover:scale-105 transition-all"
                   >
                    + Enrôler
                   </button>
                </div>
             </div>
             <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Identité</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Email</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Ville</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Statut</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {clients.filter(c => c.fullName.toLowerCase().includes(searchTerm.toLowerCase())).map(client => (
                          <tr key={client.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-royalBlue/5 flex items-center justify-center font-black text-royalBlue text-xs group-hover:bg-royalBlue group-hover:text-white transition-all">
                                    {client.fullName.charAt(0)}
                                  </div>
                                  <div>
                                      <p className="text-xs font-black text-royalBlue uppercase">{client.fullName}</p>
                                  </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-xs font-bold text-gray-500">{client.email}</td>
                            <td className="px-6 py-4 text-xs font-bold text-gray-600 uppercase">{client.city || 'N/A'}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${client.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-gold/10 text-gold'}`}>
                                  {client.status}
                                </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {clients.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vous n'avez pas encore enrôlé de client</p>
                    </div>
                  )}
                </div>
             </div>
          </div>
        );

      default:
        return <div className="p-20 text-center opacity-30 font-black uppercase tracking-widest text-xs">Module en construction</div>;
    }
  };

  return (
    <div className="h-screen w-full bg-[#FDFDFD] flex flex-col lg:flex-row overflow-hidden font-sans">
      <aside className={`fixed inset-y-0 left-0 z-[60] w-72 bg-royalBlue text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col p-6 shadow-2xl`}>
        <div className="mb-10 text-center flex flex-col items-center gap-1">
          <h2 className="text-xl font-black tracking-tighter cursor-pointer" onClick={() => onNavigate('home')}>E-ADMIN.<span className="text-gold">AGENT</span></h2>
          <span className="text-[8px] font-black uppercase text-gold/60 tracking-[0.4em]">Guichet de Proximité</span>
        </div>
        
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
          {[
            { id: 'dashboard', label: 'Pilotage', icon: '📊' },
            { id: 'clients', label: 'Portefeuille', icon: '👥' },
            { id: 'requests', label: 'Suivi Dossiers', icon: '📁' },
            { id: 'messages', label: 'Messagerie', icon: '✉️' },
            { id: 'wallet', label: 'Porte-monnaie', icon: '💰' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all ${activeTab === item.id ? 'bg-gold text-royalBlue shadow-xl scale-[1.02]' : 'hover:bg-blue-800 text-blue-100'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] uppercase tracking-widest leading-none">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 space-y-2 pt-6 border-t border-white/10">
          <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-[10px] uppercase tracking-widest">
             <span>🏠</span> Accueil
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-red-900/40 text-red-200 font-black text-[10px] uppercase tracking-widest">
             <span>🚪</span> Sortie
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-gray-50/30">
        <header className="flex justify-between items-center px-8 py-6 bg-white border-b border-gray-100 shrink-0 z-40">
           <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 text-royalBlue" onClick={() => setIsMobileMenuOpen(true)}>
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div>
                <h1 className="text-2xl font-black text-royalBlue uppercase tracking-tighter leading-none">Espace Relais</h1>
                <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.3em] mt-2">ID: {currentUser.id} • Zone: {currentUser.city || 'Afrique'}</p>
              </div>
           </div>
           
           <div className="flex items-center gap-5">
              <div className="text-right hidden sm:block">
                 <p className="text-xs font-black text-royalBlue uppercase tracking-tighter">{currentUser.fullName}</p>
                 <span className="text-[9px] font-black text-gold uppercase tracking-widest">Agent Certifié Relais</span>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl overflow-hidden border-2 border-royalBlue/10 shadow-lg">
                 <img src={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.id}`} alt="Agent" className="w-full h-full object-cover" />
              </div>
           </div>
        </header>

        <div className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar">
           {renderContent()}
        </div>

        {isAddClientModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-royalBlue/90 backdrop-blur-md animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="bg-gray-50 p-10 border-b border-gray-100 text-center text-royalBlue">
                   <h3 className="text-2xl font-black uppercase tracking-tighter">Enrôlement de Proximité</h3>
                   <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-3">Lier un nouveau client à votre portefeuille agent</p>
                </div>
                <form onSubmit={handleAddClient} className="p-10 space-y-6">
                   <div className="space-y-4">
                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Nom & Prénom(s)</label>
                        <input 
                          type="text" 
                          required 
                          value={newClient.name}
                          onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-royalBlue font-bold text-sm"
                          placeholder="Ex: Amadou Fall"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Email (Identifiant de connexion)</label>
                        <input 
                          type="email" 
                          required
                          value={newClient.email}
                          onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-royalBlue font-bold text-sm"
                          placeholder="client@mail.com"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Téléphone</label>
                          <input type="tel" value={newClient.phone} onChange={(e) => setNewClient({...newClient, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-royalBlue font-bold text-sm" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Ville</label>
                          <input type="text" value={newClient.city} onChange={(e) => setNewClient({...newClient, city: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-royalBlue font-bold text-sm" />
                        </div>
                      </div>
                   </div>
                   <div className="flex gap-4 pt-6">
                      <button type="button" onClick={() => setIsAddClientModalOpen(false)} className="flex-1 p-5 rounded-2xl text-[10px] font-black uppercase text-gray-400 border border-gray-100">Annuler</button>
                      <button type="submit" className="flex-[2] bg-royalBlue text-white p-5 rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-gold hover:text-royalBlue transition-all">Enrôler maintenant</button>
                   </div>
                </form>
             </div>
          </div>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 71, 171, 0.08); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
      `}</style>
    </div>
  );
};

export default DashboardAgent;
