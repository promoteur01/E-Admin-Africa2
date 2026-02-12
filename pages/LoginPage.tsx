
import React, { useState } from 'react';
import { Logo } from '../constants';
import { db } from '../services/database';
import { UserProfile, UserRole } from '../types';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLogin: (user: UserProfile) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const normalizedEmail = email.toLowerCase().trim();
    const foundUser = db.getUserByEmailAndRole(normalizedEmail, role);

    if (foundUser) {
      if (foundUser.password === password) {
        if (foundUser.status === 'SUSPENDED') {
          setError("Ce compte a été suspendu par l'administration.");
          return;
        }
        if (foundUser.status === 'PENDING') {
          setError("Votre compte est en attente de validation par l'administration. Vous recevrez un email dès qu'il sera activé.");
          return;
        }
        onLogin(foundUser);
      } else {
        setError("Mot de passe incorrect.");
      }
    } else {
      setError(`Aucun compte ${getRoleLabel(role).toLowerCase()} n'existe avec cet email. Vérifiez le portail sélectionné.`);
    }
  };

  const getRoleLabel = (r: UserRole) => {
    switch(r) {
      case UserRole.CLIENT: return 'Client';
      case UserRole.AGENT: return 'Agent';
      case UserRole.PARTNER: return 'Annonceur';
      case UserRole.ADMIN_SUPER: return 'Administrateur';
      default: return r.replace('_', ' ');
    }
  };

  return (
    <div className="min-h-screen bg-beigeLight/30 flex items-center justify-center p-4 py-12 relative">
      <button 
        onClick={() => onNavigate('home')}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-royalBlue font-black uppercase text-xs tracking-widest hover:text-gold transition-all bg-white px-6 py-4 rounded-full shadow-2xl border border-gray-100"
      >
        <span className="text-xl">←</span> Retour
      </button>

      <div className="max-w-md w-full bg-white rounded-[48px] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-royalBlue p-10 text-center space-y-4">
          <div className="flex justify-center" onClick={() => onNavigate('home')}>
            <Logo />
          </div>
          <h2 className="text-white text-2xl font-extrabold mt-4 uppercase tracking-tighter">Connexion Portail</h2>
          <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest opacity-60">Session sécurisée par E-admin</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase text-center animate-shake">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Choisir votre Portail</label>
            <div className="grid grid-cols-2 gap-2">
              {[UserRole.CLIENT, UserRole.AGENT, UserRole.PARTNER, UserRole.ADMIN_SUPER].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-3 rounded-2xl text-[9px] font-black uppercase border-2 transition-all ${
                    role === r ? 'border-gold bg-gold/5 text-royalBlue shadow-md' : 'border-gray-50 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  {getRoleLabel(r)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Email {getRoleLabel(role)}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-royalBlue focus:bg-white outline-none font-bold text-sm"
                placeholder="votre@email.com"
              />
            </div>

            <div className="relative">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-royalBlue focus:bg-white outline-none font-bold text-sm pr-14"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-royalBlue transition-colors p-1"
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gold text-royalBlue py-5 rounded-[24px] font-black shadow-xl hover:scale-[1.02] transition-all uppercase tracking-[0.2em] text-xs"
          >
            Se Connecter au Portail
          </button>

          <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mt-6">
            Pas de compte ? <button type="button" onClick={() => onNavigate('signup')} className="text-royalBlue underline font-black">Créer un profil</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
