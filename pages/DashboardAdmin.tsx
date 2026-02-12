
import React, { useState, useEffect } from 'react';
import { RequestStatus, UserRole, UserProfile, ServiceRequest } from '../types';
import { db } from '../services/database';

interface DashboardAdminProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  currentUser: UserProfile | null;
}

const DashboardAdmin: React.FC<DashboardAdminProps> = ({ onNavigate, onLogout, currentUser }) => {
  const [currentSection, setCurrentSection] = useState('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  
  useEffect(() => {
    refreshData();
  }, [currentSection]);

  const refreshData = () => {
    setUsers(db.getUsers());
    setRequests(db.getRequests());
  };

  if (!currentUser) return null;

  const handleToggleStatus = (userId: string) => {
    db.toggleUserStatus(userId);
    refreshData();
  };

  const handleValidateUser = (userId: string) => {
    const success = db.updateUserStatus(userId, 'ACTIVE');
    if (success) {
      refreshData();
      alert("Inscription validée avec succès ! L'utilisateur peut désormais se connecter.");
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("ACTION CRITIQUE : Cette suppression est permanente. Confirmer ?")) {
      db.deleteUser(userId);
      refreshData();
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.COMPLETED: return 'bg-green-500/20 text-green-500 border-green-500/30';
      case RequestStatus.IN_PROGRESS: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case RequestStatus.PENDING: return 'bg-gold/20 text-gold border-gold/30';
      case RequestStatus.VALIDATING: return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case RequestStatus.REJECTED: return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const pendingUsers = users.filter(u => u.status === 'PENDING');
  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderContent = () => {
    switch (currentSection) {
      case 'overview':
        return (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Utilisateurs', val: users.length, change: '+12%', icon: '👥' },
                { label: 'Dossiers Actifs', val: requests.length, change: 'Temps réel', icon: '📑' },
                { label: 'Inscr. en attente', val: pendingUsers.length, change: 'Urgent', icon: '⏳' },
                { label: 'Satisfaction', val: '4.8/5', change: 'Stable', icon: '⭐' },
              ].map(kpi => (
                <div key={kpi.label} className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xl">{kpi.icon}</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${kpi.label === 'Inscr. en attente' && pendingUsers.length > 0 ? 'bg-gold/20 text-gold' : kpi.change.startsWith('+') ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                      {kpi.change}
                    </span>
                  </div>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{kpi.label}</p>
                  <p className="text-xl font-black text-white mt-0.5">{kpi.val}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'supervision':
        return (
          <div className="space-y-6 animate-in fade-in h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Supervision des Dossiers</h2>
                <p className="text-[9px] text-gold font-black uppercase tracking-widest mt-1">Coordination et suivi des demandes de services en temps réel</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <select 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] text-white font-black uppercase outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value={RequestStatus.PENDING}>En attente</option>
                  <option value={RequestStatus.IN_PROGRESS}>En cours</option>
                  <option value={RequestStatus.COMPLETED}>Terminé</option>
                  <option value={RequestStatus.REJECTED}>Rejeté</option>
                </select>
                <div className="relative flex-1 md:w-64">
                  <input 
                    type="text" 
                    placeholder="Chercher dossier ou client..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white outline-none focus:ring-1 focus:ring-gold"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 text-xs">🔍</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-black/40 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500">Service / Réf.</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500">Demandeur</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500">Localisation</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500">Statut</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRequests.length > 0 ? filteredRequests.map(req => (
                      <tr key={req.id} className="hover:bg-white/[0.04] transition-colors group">
                        <td className="px-6 py-5">
                          <div>
                            <p className="text-[11px] font-black text-white uppercase">{req.type}</p>
                            <p className="text-[9px] text-gold font-bold">{req.id} • {req.submissionDate}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div>
                            <p className="text-[11px] font-black text-gray-300 uppercase">{req.clientName}</p>
                            <p className="text-[9px] text-gray-500 font-bold">{req.clientEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-[10px] text-gray-400 font-bold">
                          {req.city}, {req.country}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusBadge(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button className="px-4 py-2 bg-white/5 text-gold border border-gold/20 rounded-xl text-[9px] font-black uppercase hover:bg-gold hover:text-royalBlue transition-all">
                            Superviser
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <div className="text-4xl mb-4 opacity-20">📂</div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Aucun dossier trouvé dans cette sélection</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'approvals':
        return (
          <div className="space-y-6 animate-in fade-in h-full flex flex-col">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Validation des Inscriptions</h2>
              <p className="text-[9px] text-gold font-black uppercase tracking-widest mt-1">Approuver les nouveaux comptes Clients, Agents et Partenaires</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-black/40 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500">Profil</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500">Rôle souhaité</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500">Localisation</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {pendingUsers.length > 0 ? pendingUsers.map(user => (
                      <tr key={user.id} className="hover:bg-white/[0.04] transition-colors group animate-in slide-in-from-left-2">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-xs font-black text-gold border border-gold/20">
                              {user.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-[11px] font-black text-white uppercase">{user.fullName}</p>
                              <p className="text-[9px] text-gray-500 font-bold">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[8px] font-black bg-royalBlue/20 text-blue-300 px-2 py-1 rounded uppercase tracking-widest border border-blue-500/20">
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-[10px] text-gray-400 font-bold">
                          {user.city || 'N/A'}, {user.country || 'Afrique'}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleValidateUser(user.id)}
                              className="px-4 py-2 bg-gold text-royalBlue rounded-xl text-[9px] font-black uppercase hover:scale-105 transition-all shadow-lg shadow-gold/10"
                            >
                              Valider ✓
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="px-4 py-2 bg-white/5 text-red-500 rounded-xl text-[9px] font-black uppercase hover:bg-red-500 hover:text-white transition-all"
                            >
                              Rejeter
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center">
                          <div className="text-4xl mb-4 opacity-20">✅</div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Aucune inscription en attente de validation</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6 animate-in fade-in h-full flex flex-col">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Contrôle de Sécurité & Comptes</h2>
                <p className="text-[9px] text-gold font-black uppercase tracking-widest mt-1">Gestion globale de la base utilisateurs</p>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Filtrer..." 
                  className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white outline-none focus:ring-1 focus:ring-gold min-w-[250px]"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 text-xs">🔍</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-black/40 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500">Utilisateur</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500">Rôle</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500">Statut</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.filter(u => u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-royalBlue/20 flex items-center justify-center text-xs font-black text-gold">
                              {user.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-[11px] font-black text-white uppercase">{user.fullName}</p>
                              <p className="text-[9px] text-gray-500 font-bold">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[8px] font-black bg-white/5 text-gray-400 px-2 py-1 rounded uppercase tracking-widest border border-white/5">
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${user.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : user.status === 'PENDING' ? 'bg-gold/10 text-gold' : 'bg-red-500/10 text-red-500'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            {user.status === 'PENDING' && (
                              <button 
                                onClick={() => handleValidateUser(user.id)}
                                className="p-2 bg-gold/20 text-gold rounded-lg text-[8px] font-black uppercase hover:bg-gold hover:text-royalBlue transition-all"
                              >
                                Valider
                              </button>
                            )}
                            <button 
                              onClick={() => handleToggleStatus(user.id)}
                              className={`p-2 rounded-lg text-[8px] font-black uppercase transition-all ${user.status === 'ACTIVE' ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-black' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'}`}
                            >
                              {user.status === 'ACTIVE' ? 'Suspendre' : 'Activer'}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 bg-red-500/10 text-red-500 rounded-lg text-[8px] font-black uppercase hover:bg-red-500 hover:text-white transition-all"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="p-20 text-center text-gray-600 font-black uppercase tracking-widest text-xs">Section en maintenance technique</div>;
    }
  };

  return (
    <div className="h-screen bg-[#080808] flex text-gray-300 overflow-hidden font-sans">
      <aside className={`bg-black border-r border-white/5 flex flex-col p-5 h-full z-50 transition-all duration-300 shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="mb-8 p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
           {isSidebarOpen ? (
              <>
                 <div className="w-12 h-12 bg-royalBlue rounded-xl mx-auto mb-3 flex items-center justify-center text-xl shadow-2xl border border-white/10">🛡️</div>
                 <p className="font-black text-white text-[11px] uppercase tracking-tighter">E-ADMIN.<span className="text-gold">GLOBAL</span></p>
              </>
           ) : (
              <div className="text-xl">🛡️</div>
           )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar-admin pr-1">
          {[
            { id: 'overview', label: 'Pilotage', icon: '📊' },
            { id: 'supervision', label: 'Suivi Dossiers', icon: '📑' },
            { id: 'approvals', label: 'Validation Inscr.', icon: '⏳' },
            { id: 'security', label: 'Sécurité & Comptes', icon: '🔐' },
            { id: 'finance', label: 'Flux Finance', icon: '💰' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setCurrentSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all relative ${currentSection === item.id ? 'bg-royalBlue text-white shadow-xl' : 'text-gray-500 hover:bg-white/5'}`}
            >
              <span className="text-lg">{item.icon}</span>
              {isSidebarOpen && <span className="text-[10px] uppercase tracking-widest truncate">{item.label}</span>}
              {item.id === 'approvals' && pendingUsers.length > 0 && (
                <span className="absolute right-2 top-2 w-2 h-2 bg-gold rounded-full animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-8 space-y-2">
           <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gold text-royalBlue font-black text-[10px] uppercase transition-all hover:scale-105 active:scale-95">
              <span>⬅</span> {isSidebarOpen && "Site Public"}
           </button>
           <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 font-black text-[10px] uppercase hover:bg-red-500/10 transition-all hover:scale-105 active:scale-95">
              <span>🚪</span> {isSidebarOpen && "Sortie"}
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="flex justify-between items-center p-6 border-b border-white/5 shrink-0 bg-black/20">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-gold bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                {isSidebarOpen ? '◀' : '▶'}
             </button>
             <div>
                <div className="flex items-center gap-3 mb-1">
                   <span className="text-[8px] font-black uppercase text-gold tracking-widest border-b border-gold/40">ADMINSTRATION CENTRALE</span>
                   <span className="text-[8px] bg-royalBlue/20 text-royalBlue px-2 py-0.5 rounded-full font-black uppercase">ROOT_ACCESS_GRANTED</span>
                </div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Console de Contrôle</h1>
             </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
             <div className="text-right">
                <p className="text-[10px] font-black text-white uppercase">{currentUser.fullName}</p>
                <p className="text-[8px] font-black text-gold uppercase tracking-widest opacity-60">Session {currentUser.role}</p>
             </div>
             <div className="w-10 h-10 bg-royalBlue rounded-xl flex items-center justify-center font-black text-white border border-white/10 shadow-lg">
                {currentUser.fullName.charAt(0)}
             </div>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10 overflow-y-auto overflow-x-hidden custom-scrollbar-admin">
           {renderContent()}
        </div>

        <footer className="p-4 border-t border-white/5 flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] shrink-0 bg-black/40">
           <span>Host: EA-CLUSTER-GLOBAL-01</span>
           <span className="text-gold/40">E-ADMIN AFRICA © 2025 • MASTER SECURITY PORTAL</span>
        </footer>
      </main>

      <style>{`
        .custom-scrollbar-admin::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar-admin::-webkit-scrollbar-track { background: rgba(255,255,255,0.01); }
        .custom-scrollbar-admin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar-admin::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
      `}</style>
    </div>
  );
};

export default DashboardAdmin;
