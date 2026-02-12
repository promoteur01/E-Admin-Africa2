
import React, { useState, useRef, useEffect } from 'react';
import { RequestStatus, UserProfile, ServiceRequest } from '../types';
import AdSpace from '../components/AdSpace';
import { db } from '../services/database';

interface Message {
  id: string;
  sender: 'user' | 'other';
  text: string;
  time: string;
  status: 'read' | 'delivered';
}

interface Thread {
  id: number;
  type: 'ADMIN' | 'AGENT';
  sender: string;
  lastMsg: string;
  time: string;
  unread: number;
  avatar: string;
  history: Message[];
}

interface DashboardClientProps {
  onNavigate: (page: string) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

const DashboardClient: React.FC<DashboardClientProps> = ({ onNavigate, currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploading, setUploading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{name: string, date: string, size: string}[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<number>(0);
  const [inputMessage, setInputMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize messaging state
  const [threads, setThreads] = useState<Thread[]>([
    { 
      id: 0, 
      type: 'ADMIN',
      sender: "Support Central E-admin", 
      lastMsg: "Votre document a été validé.", 
      time: "10:45", 
      unread: 1, 
      avatar: "🛡️",
      history: [
        { id: '1', sender: 'other', text: `Bonjour ${currentUser?.fullName || 'Client'}, je suis le responsable du Support Central. Comment puis-je vous aider ?`, time: '09:00', status: 'read' },
        { id: '2', sender: 'user', text: "Bonjour, j'ai une question sur ma légalisation de diplôme.", time: '09:05', status: 'read' },
        { id: '3', sender: 'other', text: "Votre document a été validé par l'administration centrale. L'agent local va finaliser le retrait.", time: '10:45', status: 'read' }
      ]
    },
    { 
      id: 1, 
      type: 'AGENT',
      sender: "Agent Moussa D.", 
      lastMsg: "En attente du verso de la CNI.", 
      time: "Hier", 
      unread: 0, 
      avatar: "👤",
      history: [
        { id: '1', sender: 'other', text: "Bonjour, je suis l'agent Moussa en charge de votre dossier à Dakar.", time: 'Hier 14:00', status: 'read' },
        { id: '2', sender: 'other', text: "Pouvez-vous uploader le verso de votre CNI s'il vous plaît ? Le fichier précédent est flou.", time: 'Hier 14:05', status: 'read' }
      ]
    },
  ]);

  useEffect(() => {
    if (currentUser) {
      const allRequests = db.getRequests();
      const myRequests = allRequests.filter(r => r.clientEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim());
      setRequests(myRequests);
    }
  }, [currentUser, activeTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threads, selectedThreadId, activeTab]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered'
    };

    setThreads(prev => prev.map(t => {
      if (t.id === selectedThreadId) {
        return {
          ...t,
          lastMsg: inputMessage,
          time: "À l'instant",
          history: [...t.history, newMessage]
        };
      }
      return t;
    }));

    setInputMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploading(true);
      const newFiles = Array.from(files).map((f: File) => ({
        name: f.name,
        date: new Date().toLocaleDateString(),
        size: (f.size / 1024).toFixed(1) + ' KB'
      }));
      
      setTimeout(() => {
        setAttachedFiles(prev => [...newFiles, ...prev]);
        setUploading(false);
        if(fileInputRef.current) fileInputRef.current.value = "";
      }, 1000);
    }
  };

  const getStatusStyle = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200';
      case RequestStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700 border-blue-200';
      case RequestStatus.PENDING: return 'bg-orange-100 text-orange-700 border-orange-200';
      case RequestStatus.VALIDATING: return 'bg-purple-100 text-purple-700 border-purple-200';
      case RequestStatus.REJECTED: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getProgress = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.COMPLETED: return 100;
      case RequestStatus.VALIDATING: return 85;
      case RequestStatus.IN_PROGRESS: return 50;
      case RequestStatus.PENDING: return 15;
      default: return 0;
    }
  };

  if (!currentUser) return null;

  const currentThread = threads.find(t => t.id === selectedThreadId)!;

  return (
    <div className="min-h-screen bg-beigeLight/20 flex flex-col lg:flex-row">
      <aside className="lg:w-64 bg-royalBlue text-white flex flex-col p-5 sticky top-0 h-auto lg:h-screen shadow-2xl z-50">
        <div className="mb-8 text-center cursor-pointer" onClick={() => onNavigate('home')}>
          <h2 className="text-lg font-black tracking-tighter">CLIENT.<span className="text-gold">ESPACE</span></h2>
        </div>
        
        <nav className="flex-1 space-y-1">
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: '🏠' },
            { id: 'requests', label: 'Mes demandes', icon: '📄' },
            { id: 'messages', label: 'Messagerie', icon: '✉️' },
            { id: 'docs', label: 'Documents', icon: '📁' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-gold text-royalBlue shadow-lg' : 'hover:bg-blue-800 text-blue-100'}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] uppercase tracking-widest leading-none">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-5 border-t border-white/10 space-y-2">
          <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all text-[9px] uppercase tracking-widest">
            <span>🏠</span> Accueil
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl hover:bg-red-900/40 text-red-200 font-bold transition-all text-[9px] uppercase tracking-widest">
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gray-50/30">
        <header className="bg-white px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40 h-16">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-royalBlue rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                 <img src={currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.id}`} className="w-full h-full object-cover" alt="Profile" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-black text-royalBlue uppercase tracking-tight">{currentUser.fullName}</h1>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{currentUser.email}</p>
              </div>
           </div>
           <button onClick={() => onNavigate('service-selection')} className="bg-gold text-royalBlue font-black px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition-all text-[9px] uppercase tracking-widest">
              ➕ Nouvelle Demande
           </button>
        </header>

        <div className="p-6 lg:p-8 space-y-8 h-full flex flex-col">
          {(activeTab === 'dashboard' || activeTab === 'requests') && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 min-h-[400px]">
                   <h3 className="text-[10px] font-black text-royalBlue mb-6 uppercase tracking-widest flex items-center gap-3">
                     <span className="w-1.5 h-1.5 bg-gold rounded-full"></span> {activeTab === 'dashboard' ? 'Suivi de mes dossiers' : 'Historique complet'}
                   </h3>
                   <div className="space-y-3">
                      {requests.length > 0 ? requests.map(req => (
                        <div key={req.id} className="p-4 rounded-2xl border border-gray-50 hover:border-gold/30 hover:shadow-md transition-all bg-gray-50/50">
                           <div className="flex flex-wrap justify-between items-center gap-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-royalBlue text-white rounded-xl flex items-center justify-center text-xl shadow-md">📄</div>
                                 <div>
                                    <h4 className="font-black text-royalBlue text-[11px] uppercase">{req.type}</h4>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{req.id} • {req.submissionDate}</p>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end gap-1.5">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black border uppercase tracking-widest ${getStatusStyle(req.status)}`}>
                                   {req.status}
                                </span>
                                <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                                   <div className="h-full bg-royalBlue" style={{ width: `${getProgress(req.status)}%` }}></div>
                                </div>
                              </div>
                           </div>
                        </div>
                      )) : (
                        <div className="py-20 text-center space-y-4">
                           <div className="text-4xl opacity-20">📭</div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Aucune demande active.</p>
                           <button onClick={() => onNavigate('service-selection')} className="text-royalBlue font-black underline text-[9px] uppercase">Démarrer</button>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <h4 className="font-black text-royalBlue uppercase text-[9px] mb-4 tracking-[0.2em] border-b border-gray-50 pb-3">
                      Ajouter au dossier
                    </h4>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.jpg,.jpeg,.png" id="dashboard-file-upload" />
                    <label htmlFor="dashboard-file-upload" className={`block w-full border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${uploading ? 'bg-royalBlue/5 border-royalBlue animate-pulse' : 'border-gray-200 hover:border-gold hover:bg-gold/5'}`}>
                       {uploading ? <p className="text-[9px] font-black text-royalBlue uppercase">Envoi...</p> : <div className="space-y-2"><div className="text-3xl">📥</div><p className="text-[10px] font-black uppercase">Uploader</p></div>}
                    </label>

                    {attachedFiles.length > 0 && (
                      <div className="mt-4 space-y-1.5">
                        {attachedFiles.map((file, i) => (
                          <div key={i} className="flex items-center gap-2 text-[8px] font-black text-gray-500 uppercase truncate">
                            <span className="text-gold">●</span> {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                 </div>
                 <AdSpace type="sidebar" className="h-48 rounded-[32px]" />
              </div>
            </div>
          )}

          {/* ... suite du contenu messages et docs inchangée mais headers optimisés ... */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in flex h-[600px]">
               {/* Inbox List */}
               <div className="w-72 border-r border-gray-100 flex flex-col bg-gray-50/30">
                  <div className="p-5 border-b border-gray-100">
                     <h2 className="text-sm font-black text-royalBlue uppercase tracking-tight">Messagerie</h2>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                     {threads.map(thread => (
                       <button 
                        key={thread.id}
                        onClick={() => setSelectedThreadId(thread.id)}
                        className={`w-full p-5 text-left border-b border-gray-50 transition-all hover:bg-white flex items-center gap-3 ${selectedThreadId === thread.id ? 'bg-white border-l-4 border-gold shadow-sm' : ''}`}
                       >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner ${thread.type === 'ADMIN' ? 'bg-royalBlue/10' : 'bg-gold/10'}`}>
                            {thread.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-center mb-0.5">
                                <span className={`text-[10px] font-black uppercase truncate ${thread.type === 'ADMIN' ? 'text-royalBlue' : 'text-gray-700'}`}>
                                  {thread.sender}
                                </span>
                             </div>
                             <p className="text-[9px] text-gray-500 font-medium truncate">{thread.lastMsg}</p>
                          </div>
                       </button>
                     ))}
                  </div>
               </div>

               {/* Chat Window */}
               <div className="flex-1 flex flex-col bg-white relative">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                     <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm ${currentThread.type === 'ADMIN' ? 'bg-royalBlue' : 'bg-gold text-royalBlue'}`}>
                          {currentThread.avatar}
                        </div>
                        <div>
                           <h3 className="text-xs font-black text-royalBlue uppercase">{currentThread.sender}</h3>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/20 custom-scrollbar">
                     {currentThread.history.map(msg => (
                       <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                          <div className={`max-w-[75%] p-3.5 rounded-2xl shadow-sm border ${msg.sender === 'user' ? 'bg-royalBlue text-white rounded-br-none border-royalBlue' : 'bg-white text-gray-700 rounded-bl-none border-gray-100'}`}>
                             <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
                          </div>
                       </div>
                     ))}
                     <div ref={chatEndRef} />
                  </div>

                  <div className="p-4 border-t border-gray-100 bg-white">
                     <div className="flex gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
                        <input 
                          type="text" 
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Écrire..." 
                          className="flex-1 bg-transparent px-4 py-2 text-xs font-bold outline-none" 
                        />
                        <button 
                          onClick={handleSendMessage}
                          className="bg-royalBlue text-white p-3 rounded-xl hover:bg-gold hover:text-royalBlue transition-all shadow-md active:scale-95"
                        >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                           </svg>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 71, 171, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
      `}</style>
    </div>
  );
};

export default DashboardClient;
