
import React, { useState } from 'react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <button 
          onClick={() => onNavigate('home')}
          className="mb-12 flex items-center gap-2 text-royalBlue font-black uppercase text-xs tracking-widest hover:text-gold transition-colors bg-gray-50 px-6 py-3 rounded-full border border-gray-100 shadow-sm"
        >
          <span>←</span> Retour à l'accueil
        </button>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="inline-block bg-gold/10 px-4 py-2 rounded-full">
                  <span className="text-gold font-black uppercase text-xs tracking-widest">Contactez-nous</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-royalBlue leading-tight uppercase tracking-tighter">
                  Nous sommes à votre <span className="text-gold">écoute</span> 24h/24
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  Une question sur une démarche ? Un besoin d'accompagnement spécifique ? Nos agents relais et notre support technique vous répondent instantanément.
                </p>
              </div>

              <div className="space-y-6">
                <a href="https://wa.me/237652410152" target="_blank" className="flex items-center gap-6 p-6 bg-green-50 rounded-3xl border border-green-100 group hover:shadow-xl transition-all">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                    📱
                  </div>
                  <div>
                    <p className="text-xs font-black text-green-600 uppercase tracking-widest">WhatsApp Direct</p>
                    <p className="text-xl font-bold text-gray-800">+237 652 410 152</p>
                  </div>
                </a>

                <div className="flex items-center gap-6 p-6 bg-blue-50 rounded-3xl border border-blue-100 group hover:shadow-xl transition-all">
                  <div className="w-16 h-16 bg-royalBlue text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                    📧
                  </div>
                  <div>
                    <p className="text-xs font-black text-royalBlue uppercase tracking-widest">Email Support</p>
                    <p className="text-xl font-bold text-gray-800">contact@e-admin.africa</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 lg:p-12 rounded-[40px] shadow-2xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-16 translate-x-16"></div>
              
              {submitted ? (
                <div className="text-center py-20 space-y-6 animate-in fade-in zoom-in">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto">✓</div>
                  <h2 className="text-2xl font-black text-royalBlue uppercase">Message Envoyé !</h2>
                  <p className="text-gray-500 font-bold">Merci de nous avoir contacté. Un conseiller vous répondra sous peu.</p>
                  <button onClick={() => setSubmitted(false)} className="text-royalBlue font-black underline uppercase text-xs tracking-widest">Envoyer un autre message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <h3 className="text-2xl font-black text-royalBlue mb-8 uppercase tracking-tighter">Envoyez un message</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nom complet</label>
                      <input type="text" required placeholder="Ex: Jean Dupont" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-royalBlue outline-none font-medium shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Téléphone</label>
                      <input type="tel" required placeholder="+237 ..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-royalBlue outline-none font-medium shadow-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Objet de votre demande</label>
                    <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-royalBlue outline-none font-bold shadow-sm">
                      <option>Support sur une demande en cours</option>
                      <option>Devenir Agent Relais</option>
                      <option>Devenir Partenaire Commercial</option>
                      <option>Autre demande</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Votre message</label>
                    <textarea rows={5} required placeholder="Comment pouvons-nous vous aider ?" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-royalBlue outline-none resize-none font-medium shadow-sm"></textarea>
                  </div>

                  <button type="submit" className="w-full bg-royalBlue text-white py-4 rounded-2xl font-black shadow-xl hover:bg-gold hover:text-royalBlue transition-all transform hover:scale-[1.02] uppercase tracking-widest">
                    Envoyer le Message 🚀
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
