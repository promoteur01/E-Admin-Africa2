
import React, { useState } from 'react';
import { Logo } from '../constants';
import { db } from '../services/database';
import { UserRole, UserProfile } from '../types';

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const [userType, setUserType] = useState<UserRole>(UserRole.CLIENT);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    // Définition du statut initial selon le rôle
    // Seuls les AGENTS et PARTENAIRES nécessitent une validation administrative
    const initialStatus = (userType === UserRole.AGENT || userType === UserRole.PARTNER) ? 'PENDING' : 'ACTIVE';

    const newUser: UserProfile = {
      id: `u-${Date.now()}`,
      fullName: formData.fullName.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      role: userType,
      status: initialStatus,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    };

    const success = db.addUser(newUser);
    if (!success) {
      setError("Cet email est déjà utilisé pour ce portail.");
      return;
    }

    if (initialStatus === 'PENDING') {
      alert("Demande d'inscription enregistrée ! Un administrateur doit valider votre profil avant que vous ne puissiez accéder à votre espace.");
    } else {
      alert("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
    }
    
    onNavigate('login');
  };

  return (
    <div className="min-h-screen bg-beigeLight/30 py-12 px-4 relative">
       <button onClick={() => onNavigate('home')} className="fixed top-8 left-8 z-50 flex items-center gap-2 text-royalBlue font-black uppercase text-xs tracking-widest bg-white px-6 py-4 rounded-full shadow-2xl border border-gray-100">
        <span>←</span> Retour
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-[48px] shadow-2xl border border-gray-100 overflow-hidden mt-20">
        <div className="bg-royalBlue p-10 md:p-14 text-center text-white">
          <div className="flex justify-center mb-8"><Logo /></div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Créer un Profil</h1>
          <p className="text-blue-100 mt-4 font-bold uppercase text-[10px] tracking-[0.3em] opacity-80">Accès aux services administratifs</p>
        </div>

        <div className="flex border-b border-gray-100 bg-gray-50/50 overflow-x-auto scrollbar-hide">
          {[UserRole.CLIENT, UserRole.AGENT, UserRole.PARTNER, UserRole.ADMIN_SUPER].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setUserType(type)}
              className={`flex-1 min-w-[120px] py-8 text-[10px] font-black uppercase tracking-widest transition-all ${
                userType === type ? 'text-royalBlue border-b-4 border-gold bg-white' : 'text-gray-400 hover:text-royalBlue hover:bg-white'
              }`}
            >
              {type === UserRole.CLIENT ? 'Client' : 
               type === UserRole.AGENT ? 'Agent Relais' : 
               type === UserRole.PARTNER ? 'Annonceur' : 'Administration'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          {error && <div className="md:col-span-2 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase text-center">{error}</div>}
          
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest ml-2">Nom Complet</label>
            <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-gold/20 font-bold text-sm" placeholder="Ex: Moussa Diop" />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest ml-2">Email Professionnel / Personnel</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-gold/20 font-bold text-sm" placeholder="votre@email.com" />
          </div>

          <div className="relative">
            <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest ml-2">Mot de passe</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-gold/20 font-bold text-sm pr-14" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-royalBlue transition-colors text-xl">
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest ml-2">Confirmer Mot de passe</label>
            <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-gold/20 font-bold text-sm" />
          </div>

          <div className="md:col-span-2 pt-10">
            <button type="submit" className="w-full bg-royalBlue text-white py-6 rounded-[24px] font-black shadow-2xl hover:bg-gold hover:text-royalBlue transition-all uppercase tracking-[0.2em] text-xs">
              {userType === UserRole.AGENT || userType === UserRole.PARTNER ? "Soumettre ma candidature" : "Créer mon compte"}
            </button>
            <p className="text-center mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Déjà inscrit ? <button type="button" onClick={() => onNavigate('login')} className="text-royalBlue underline">Connectez-vous</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
