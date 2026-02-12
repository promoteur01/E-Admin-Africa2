
import React, { useState, useRef, useEffect } from 'react';
import { Logo, COUNTRIES, SERVICES, ETAT_CIVIL_CONFIG, HEBERGEMENT_CONFIG } from '../constants';
import { db } from '../services/database';
import { RequestStatus, UserProfile, ServiceRequest } from '../types';

interface ServiceFormPageProps {
  serviceId: string;
  onNavigate: (page: string) => void;
  currentUser: UserProfile | null;
}

const ServiceFormPage: React.FC<ServiceFormPageProps> = ({ serviceId, onNavigate, currentUser }) => {
  const service = SERVICES.find(s => s.id === serviceId);
  const isEtatCivil = serviceId === 'etat-civil';
  const isHebergement = serviceId === 'certificat-hebergement';
  
  const [step, setStep] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState<{name: string, size: string, file: File}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    subType: '',
    serviceOption: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    docType: '',
    deliveryMode: 'agence',
    urgent: false,
    additionalInfo: '',
  });

  // Tarification extraite des constantes
  const serviceCost = service?.priceService || 10000;
  const taxesCost = service?.priceTaxes || 2500;
  const totalCost = serviceCost + taxesCost;

  useEffect(() => {
    if (currentUser) {
      const names = currentUser.fullName.split(' ');
      setFormData(prev => ({
        ...prev,
        lastName: names[names.length - 1] || '',
        firstName: names.slice(0, names.length - 1).join(' ') || '',
        email: currentUser.email
      }));
    }
  }, [currentUser]);

  if (!service) return <div>Service non trouvé</div>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((f: File) => ({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + ' KB',
        file: f
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitFinal = () => {
    const newRequest: ServiceRequest = {
      id: `EA-${Date.now().toString().slice(-6)}`,
      type: service.title,
      subType: (isEtatCivil || isHebergement) ? formData.subType : undefined,
      serviceOption: (isEtatCivil || isHebergement) ? formData.serviceOption : undefined,
      country: formData.country,
      city: formData.city,
      submissionDate: new Date().toLocaleDateString(),
      status: RequestStatus.PENDING,
      clientName: currentUser?.fullName || `${formData.firstName} ${formData.lastName}`,
      clientEmail: (currentUser?.email || formData.email).toLowerCase().trim(),
      additionalInfo: formData.additionalInfo,
      agentId: currentUser?.enrolledByAgentId
    };

    db.addRequest(newRequest);
    alert('Félicitations ! Votre demande et vos documents ont été enregistrés avec succès.');
    onNavigate('dashboard-client');
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (step === 1) {
      onNavigate('service-selection');
    } else {
      setStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const selectedCountry = COUNTRIES.find(c => c.name === formData.country);
  const isStep1Valid = formData.country && formData.city && (!(isEtatCivil || isHebergement) || (formData.subType && formData.serviceOption));

  return (
    <div className="min-h-screen bg-white py-12 px-4 relative">
      <button 
        onClick={() => onNavigate('service-selection')}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-royalBlue font-black uppercase text-xs tracking-widest hover:text-gold transition-all bg-white px-6 py-4 rounded-full shadow-2xl border border-gray-100"
      >
        <span>←</span> Annuler
      </button>

      <div className="max-w-4xl mx-auto mt-16 animate-in fade-in duration-500">
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black text-royalBlue uppercase tracking-tighter">{service.title}</h2>
            <span className="text-[10px] font-black text-gold bg-gold/5 px-4 py-2 rounded-full uppercase tracking-[0.2em] border border-gold/10">Étape {step} sur 4</span>
          </div>
          <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
             <div className="h-full bg-gold rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(212,175,55,0.4)]" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-beigeLight/20 p-8 md:p-14 rounded-[48px] border border-beigeLight shadow-2xl">
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-10">
              <h3 className="text-xl font-black text-royalBlue border-l-4 border-gold pl-4 uppercase">Localisation & Nature du dossier</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest ml-2">Pays concerné</label>
                  <select 
                    className="w-full p-5 bg-white border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-gold/20 shadow-sm font-bold text-sm"
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    value={formData.country}
                  >
                    <option value="">Sélectionnez un pays</option>
                    {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest ml-2">Ville de traitement</label>
                  <select 
                    className="w-full p-5 bg-white border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-gold/20 shadow-sm font-bold text-sm disabled:opacity-30"
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    value={formData.city}
                    disabled={!formData.country}
                  >
                    <option value="">Sélectionnez une ville</option>
                    {selectedCountry?.cities.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>

                {(isEtatCivil || isHebergement) && (
                  <>
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest ml-2">
                        {isEtatCivil ? "Type d'acte d'état civil" : "Nature du certificat"}
                      </label>
                      <select 
                        className="w-full p-5 bg-white border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-gold/20 shadow-sm font-bold text-sm"
                        onChange={(e) => setFormData({...formData, subType: e.target.value})}
                        value={formData.subType}
                      >
                        <option value="">Sélectionnez le type</option>
                        {isEtatCivil && ETAT_CIVIL_CONFIG.subTypes.map(st => <option key={st} value={st}>{st}</option>)}
                        {isHebergement && HEBERGEMENT_CONFIG.subTypes.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest ml-2">Format / Option</label>
                      <select 
                        className="w-full p-5 bg-white border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-gold/20 shadow-sm font-bold text-sm"
                        onChange={(e) => setFormData({...formData, serviceOption: e.target.value})}
                        value={formData.serviceOption}
                      >
                        <option value="">Sélectionnez l'option</option>
                        {isEtatCivil && ETAT_CIVIL_CONFIG.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {isHebergement && HEBERGEMENT_CONFIG.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex gap-4 pt-10">
                <button 
                  onClick={handlePrev}
                  className="flex-1 bg-white text-gray-400 py-5 rounded-[24px] font-black shadow-sm hover:text-royalBlue transition-all uppercase text-xs tracking-widest border border-gray-100"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={!isStep1Valid}
                  className="flex-[2] bg-royalBlue text-white py-5 rounded-[24px] font-black shadow-xl disabled:opacity-30 hover:bg-gold hover:text-royalBlue transition-all uppercase text-xs tracking-widest"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-10">
              <h3 className="text-xl font-black text-royalBlue border-l-4 border-gold pl-4 uppercase">Identité & Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest ml-2">Nom de famille</label>
                    <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full p-5 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-gold/20 outline-none font-bold text-sm" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest ml-2">Prénom(s)</label>
                    <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full p-5 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-gold/20 outline-none font-bold text-sm" />
                 </div>
                 
                 <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-500 mb-4 uppercase tracking-widest ml-2">Dossier à joindre (Documents obligatoires)</label>
                    <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" id="service-file-upload" />
                    <label htmlFor="service-file-upload" className="block border-2 border-dashed border-gray-200 rounded-[32px] p-12 text-center hover:border-gold hover:bg-white transition-all cursor-pointer group">
                       <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-500">📥</div>
                       <p className="text-sm font-black text-royalBlue uppercase tracking-tight">Cliquer pour uploader les pièces</p>
                       <p className="text-[10px] text-gray-400 mt-2 uppercase font-black tracking-widest">Format : PDF, JPG, PNG • Max 10 Mo par envoi</p>
                    </label>

                    {selectedFiles.length > 0 && (
                      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 shadow-sm animate-in slide-in-from-left-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">📄</span>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black text-royalBlue truncate w-32 uppercase">{file.name}</p>
                                <p className="text-[9px] text-gray-400 uppercase font-bold">{file.size}</p>
                              </div>
                            </div>
                            <button onClick={() => removeFile(idx)} className="text-red-400 hover:bg-red-50 p-2 rounded-xl transition-colors">✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                 </div>

                 <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest ml-2">Renseignements complémentaires (Notes pour l'agent)</label>
                    <textarea 
                      value={formData.additionalInfo} 
                      onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})} 
                      placeholder="Précisez ici toute information utile pour le traitement de votre dossier..." 
                      className="w-full p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm focus:ring-4 focus:ring-gold/20 outline-none font-medium text-sm min-h-[150px] resize-none" 
                    />
                 </div>
              </div>
              <div className="flex gap-4 pt-10">
                <button onClick={handlePrev} className="flex-1 bg-white text-gray-400 py-5 rounded-[24px] font-black uppercase text-xs tracking-widest border border-gray-100">Retour</button>
                <button onClick={handleNext} disabled={selectedFiles.length === 0} className="flex-1 bg-royalBlue text-white py-5 rounded-[24px] font-black shadow-xl disabled:opacity-30 uppercase text-xs tracking-widest">Suivant</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in slide-in-from-right-10">
              <div className="text-center">
                 <h3 className="text-2xl font-black text-royalBlue uppercase tracking-tighter">Récapitulatif de votre Demande</h3>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Veuillez vérifier les informations avant validation finale</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Carte Prestation */}
                 <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl relative group">
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gold rounded-full flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform">📋</div>
                    <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-6 border-b border-gray-50 pb-4">Nature de la demande</h4>
                    <div className="space-y-4">
                       <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Service</p>
                          <p className="text-sm font-black text-royalBlue uppercase">{service.title}</p>
                       </div>
                       {(isEtatCivil || isHebergement) && (
                         <>
                            <div>
                               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                 {isEtatCivil ? "Type d'acte" : "Type de certificat"}
                               </p>
                               <p className="text-sm font-black text-royalBlue uppercase">{formData.subType}</p>
                            </div>
                            <div>
                               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Format souhaité</p>
                               <p className="text-sm font-black text-royalBlue uppercase">{formData.serviceOption}</p>
                            </div>
                         </>
                       )}
                       <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Lieu de traitement</p>
                          <p className="text-sm font-black text-royalBlue uppercase">{formData.city}, {formData.country}</p>
                       </div>
                    </div>
                 </div>

                 {/* Carte Tarification (Nouvelle section ajoutée au récap) */}
                 <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl relative group">
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform">💰</div>
                    <h4 className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-6 border-b border-gray-50 pb-4">Structure du paiement</h4>
                    <div className="space-y-4">
                       <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Coût du service</p>
                          <p className="text-sm font-black text-royalBlue uppercase">{serviceCost.toLocaleString()} FCFA</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Timbres & Taxes réglementaires</p>
                          <p className="text-sm font-black text-royalBlue uppercase">{taxesCost.toLocaleString()} FCFA</p>
                       </div>
                       <div className="pt-2 border-t border-gray-100">
                          <p className="text-[9px] font-black text-gold uppercase tracking-widest">Total estimé</p>
                          <p className="text-lg font-black text-royalBlue uppercase">{totalCost.toLocaleString()} FCFA</p>
                       </div>
                    </div>
                 </div>

                 {/* Carte Dossier Numérique */}
                 <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl relative group md:col-span-2">
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform">📂</div>
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-6 border-b border-gray-50 pb-4">Dossier de pièces jointes ({selectedFiles.length})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                       {selectedFiles.map((file, i) => (
                         <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                           <span className="text-2xl">📄</span>
                           <div className="min-w-0">
                              <p className="text-[10px] font-black text-royalBlue truncate uppercase">{file.name}</p>
                              <p className="text-[8px] text-gray-400 font-bold uppercase">{file.size}</p>
                           </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button onClick={handlePrev} className="flex-1 bg-white text-gray-400 py-5 rounded-[24px] font-black uppercase text-xs tracking-widest border border-gray-100 shadow-md">Modifier mes informations</button>
                <button onClick={handleNext} className="flex-[2] bg-royalBlue text-white py-5 rounded-[24px] font-black shadow-xl uppercase text-xs tracking-widest hover:bg-gold hover:text-royalBlue transition-all">Confirmer et Payer</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in slide-in-from-right-10">
              <h3 className="text-xl font-black text-royalBlue border-l-4 border-gold pl-4 uppercase">Finalisation & Paiement Sécurisé</h3>
              
              <div className="bg-white border border-gray-100 rounded-[40px] shadow-2xl overflow-hidden">
                <div className="p-10 bg-royalBlue text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-5 text-8xl font-black">💸</div>
                   <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mb-8">Facture de la demande</h4>
                   
                   <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Partie 1</p>
                          <p className="text-sm font-black uppercase tracking-tight">Coût du service</p>
                        </div>
                        <span className="text-xl font-black">{serviceCost.toLocaleString()} FCFA</span>
                      </div>

                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Partie 2</p>
                          <p className="text-sm font-black uppercase tracking-tight">Timbres & taxes réglementaires</p>
                        </div>
                        <span className="text-xl font-black">{taxesCost.toLocaleString()} FCFA</span>
                      </div>

                      <div className="flex justify-between items-center pt-4">
                        <span className="text-lg font-black uppercase tracking-[0.2em] text-gold">Total à payer</span>
                        <div className="text-right">
                          <span className="text-4xl font-black text-gold drop-shadow-lg">{totalCost.toLocaleString()} FCFA</span>
                          <p className="text-[8px] font-bold text-blue-200 uppercase mt-1">Net à régler par mobile money</p>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="p-10 space-y-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Sélectionnez votre moyen de paiement</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['Orange', 'MTN', 'Wave'].map(m => (
                      <button key={m} className="p-6 border-2 border-gray-100 rounded-[28px] text-center transition-all hover:border-gold hover:bg-white shadow-sm focus:ring-4 focus:ring-gold/20 active:scale-95 group">
                         <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-xl shadow-inner ${m === 'Orange' ? 'bg-[#FF7900]/10 text-[#FF7900]' : m === 'MTN' ? 'bg-[#FFCC00]/10 text-[#FFCC00]' : 'bg-[#1DB9FC]/10 text-[#1DB9FC]'}`}>
                            {m === 'Orange' ? '🍊' : m === 'MTN' ? '📶' : '🌊'}
                         </div>
                         <p className="text-[10px] font-black uppercase text-royalBlue group-hover:text-gold">{m} Money</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={handlePrev} className="flex-1 bg-white text-gray-400 py-5 rounded-[24px] font-black uppercase text-xs tracking-widest border border-gray-100">Récapitulatif</button>
                <button 
                  onClick={handleSubmitFinal} 
                  className="flex-[2] bg-gold text-royalBlue py-5 rounded-[24px] font-black shadow-xl hover:scale-105 transition-all uppercase text-xs tracking-widest"
                >
                  Valider le Paiement & Soumettre
                </button>
              </div>
              <p className="text-center text-[8px] font-bold text-gray-400 uppercase tracking-[0.3em]">Certifié Panafrican Fintech • Cryptage SSL 256-bit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceFormPage;
