
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import DashboardClient from './pages/DashboardClient';
import DashboardAgent from './pages/DashboardAgent';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardPartner from './pages/DashboardPartner';
import ServiceFormPage from './pages/ServiceFormPage';
import BlogPage from './pages/BlogPage';
import Chatbot from './components/Chatbot';
import { UserProfile, UserRole } from './types';
import { db } from './services/database';

type Page = 
  | 'home' 
  | 'login' 
  | 'signup' 
  | 'services' 
  | 'how-it-works' 
  | 'blog' 
  | 'contact' 
  | 'privacy'
  | 'portals'
  | 'about'
  | 'dashboard-client' 
  | 'dashboard-agent' 
  | 'dashboard-admin'
  | 'dashboard-partner'
  | 'service-legalisation'
  | 'service-etat-civil'
  | 'service-certificat-hebergement'
  | 'service-casier'
  | 'service-dossiers-admin'
  | 'service-creation-entreprise'
  | 'service-selection';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('e-admin-cookie-consent');
    if (!consent) {
      setShowCookieBanner(true);
    }
    
    const savedUserStr = localStorage.getItem('eadmin_session');
    if (savedUserStr) {
      try {
        const savedUser: UserProfile = JSON.parse(savedUserStr);
        const userInDb = db.getUserByEmailAndRole(savedUser.email, savedUser.role);
        if (userInDb && userInDb.status === 'ACTIVE') {
          setCurrentUser(userInDb);
        } else {
          localStorage.removeItem('eadmin_session');
          setCurrentUser(null);
        }
      } catch (e) {
        localStorage.removeItem('eadmin_session');
      }
    }
  }, []);

  const handleCookieAction = (action: 'accepted' | 'declined') => {
    localStorage.setItem('e-admin-cookie-consent', action);
    setShowCookieBanner(false);
  };

  const navigate = (page: string) => {
    // Immédiatement scroller en haut avant le changement d'état
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (page === 'portals') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('portals-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    if (page === 'about') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('about-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    
    setCurrentPage(page as Page);
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('eadmin_session', JSON.stringify(user));
    
    if (user.role === UserRole.CLIENT) navigate('dashboard-client');
    else if (user.role === UserRole.AGENT) navigate('dashboard-agent');
    else if (user.role === UserRole.PARTNER) navigate('dashboard-partner');
    else if (user.role.startsWith('ADMIN')) navigate('dashboard-admin');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eadmin_session');
    navigate('home');
  };

  const renderContent = () => {
    if (currentPage.startsWith('service-') && currentPage !== 'service-selection') {
      const serviceId = currentPage.replace('service-', '');
      return <ServiceFormPage serviceId={serviceId} onNavigate={navigate} currentUser={currentUser} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'login':
        return <LoginPage onNavigate={navigate} onLogin={handleLogin} />;
      case 'signup':
        return <SignupPage onNavigate={navigate} />;
      case 'contact':
        return <ContactPage onNavigate={navigate} />;
      case 'privacy':
        return <PrivacyPage onNavigate={navigate} />;
      case 'dashboard-client':
        return <DashboardClient onNavigate={navigate} currentUser={currentUser} onLogout={handleLogout} />;
      case 'dashboard-agent':
        return <DashboardAgent onNavigate={navigate} onLogout={handleLogout} currentUser={currentUser} />;
      case 'dashboard-admin':
        return <DashboardAdmin onNavigate={navigate} onLogout={handleLogout} currentUser={currentUser} />;
      case 'dashboard-partner':
        return <DashboardPartner onNavigate={navigate} onLogout={handleLogout} currentUser={currentUser} />;
      case 'blog':
        return <BlogPage onNavigate={navigate} />;
      case 'services':
      case 'service-selection':
        return (
          <div className="py-20 bg-gray-50 min-h-screen animate-in fade-in duration-500 relative z-10">
             <div className="container mx-auto px-4">
                <button 
                  onClick={() => navigate('home')}
                  className="mb-12 flex items-center gap-3 text-royalBlue font-black uppercase text-xs tracking-widest hover:bg-royalBlue hover:text-white transition-all bg-white px-8 py-4 rounded-full shadow-lg border border-gray-100"
                >
                  <span className="text-xl">←</span> Retour à l'accueil
                </button>
                <div className="text-center max-w-6xl mx-auto">
                  <div className="mb-20">
                    <h1 className="text-5xl md:text-6xl font-black text-royalBlue mb-6 uppercase tracking-tighter">Nos Guichets Numériques</h1>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.4em]">Sélectionnez la nature de votre démarche administrative</p>
                    <div className="w-24 h-2.5 bg-gold mx-auto mt-10 rounded-full shadow-lg"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[
                      { id: 'legalisation', title: 'Légalisation', icon: '📜', desc: 'Diplômes, actes, contrats' },
                      { id: 'etat-civil', title: 'État Civil', icon: '👶', desc: 'Naissance, mariage, décès' },
                      { id: 'certificat-hebergement', title: 'Hébergement', icon: '🏠', desc: 'Accueil et logement' },
                      { id: 'casier', title: 'Casier Judiciaire', icon: '⚖️', desc: 'Extraits de casier' },
                      { id: 'dossiers-admin', title: 'Dossiers Admin', icon: '📁', desc: 'Passeports, permis, cartes' },
                      { id: 'creation-entreprise', title: 'Création Entreprise', icon: '🏢', desc: 'SARL, SA, Auto-entrepreneur' },
                    ].map(s => (
                      <button 
                        key={s.id}
                        onClick={() => navigate(`service-${s.id}`)}
                        className="bg-white p-12 rounded-[50px] shadow-sm hover:shadow-2xl transition-all border border-gray-100 hover:border-gold group flex flex-col items-center text-center relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl group-hover:scale-125 transition-transform duration-700">{s.icon}</div>
                        <div className="w-24 h-24 bg-royalBlue/5 rounded-3xl flex items-center justify-center text-5xl mb-8 group-hover:bg-gold transition-colors duration-500 shadow-inner">
                          {s.icon}
                        </div>
                        <h3 className="text-2xl font-black text-royalBlue uppercase tracking-tight mb-3 group-hover:text-gold transition-colors">{s.title}</h3>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-8 opacity-60 leading-relaxed">{s.desc}</p>
                        <div className="bg-royalBlue text-white text-[10px] font-black px-8 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 uppercase tracking-widest shadow-xl">
                          Ouvrir le guichet
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 p-8 text-center bg-white">
            <div className="text-8xl animate-bounce">🏗️</div>
            <h2 className="text-4xl font-black text-royalBlue uppercase tracking-tighter">Page en Maintenance</h2>
            <button onClick={() => navigate('home')} className="bg-royalBlue text-white px-10 py-4 rounded-full font-black uppercase tracking-widest shadow-2xl hover:bg-gold hover:text-royalBlue transition-all">Retour à l'accueil</button>
          </div>
        );
    }
  };

  const isDashboard = currentPage.startsWith('dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-gold selection:text-royalBlue">
      {!isDashboard && <Layout onNavigate={navigate} userRole={currentUser?.role}>{renderContent()}</Layout>}
      {isDashboard && <div className="animate-in fade-in duration-700">{renderContent()}</div>}
      
      <Chatbot />

      {showCookieBanner && (
        <div className="fixed bottom-6 left-6 z-[100] max-w-sm bg-white p-8 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 animate-in slide-in-from-left-full duration-700">
           <div className="flex items-start gap-5 mb-6">
              <div className="text-4xl">🍪</div>
              <div className="space-y-2">
                <p className="text-xs text-gray-700 leading-relaxed font-bold uppercase tracking-tight">
                  Respect de la vie privée
                </p>
                <p className="text-[10px] text-gray-400 leading-relaxed font-medium uppercase tracking-widest">
                  Nous utilisons des cookies pour sécuriser vos démarches administratives. 
                  <button onClick={() => navigate('privacy')} className="text-royalBlue font-black underline ml-1">Lire la charte</button>
                </p>
              </div>
           </div>
           <div className="flex gap-4">
             <button 
              onClick={() => handleCookieAction('accepted')}
              className="flex-1 bg-royalBlue text-white py-4 rounded-2xl text-[10px] font-black shadow-xl hover:bg-gold hover:text-royalBlue transition-all uppercase tracking-widest"
             >
               Accepter
             </button>
             <button 
              onClick={() => handleCookieAction('declined')}
              className="flex-1 bg-gray-50 text-gray-400 py-4 rounded-2xl text-[10px] font-black hover:bg-gray-100 transition-all uppercase tracking-widest"
             >
               Refuser
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
