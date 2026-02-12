
import React from 'react';

interface PrivacyPageProps {
  onNavigate: (page: string) => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-royalBlue">Politique de Confidentialité & Cookies</h1>
            <p className="text-gray-500 font-medium">Dernière mise à jour : 24 Mai 2024</p>
            <div className="w-20 h-1.5 bg-gold rounded-full"></div>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-royalBlue">1. Utilisation des Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              E-admin.Africa utilise des cookies essentiels pour assurer la sécurité de vos sessions et le bon fonctionnement de nos formulaires administratifs. Sans ces cookies, l'accès sécurisé à votre espace personnel ne peut être garanti.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Cookies de session :</strong> Pour vous maintenir connecté pendant vos démarches.</li>
              <li><strong>Cookies de sécurité :</strong> Pour prévenir les fraudes et protéger vos documents.</li>
              <li><strong>Cookies de performance :</strong> Pour analyser l'utilisation de la plateforme et améliorer nos services.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-royalBlue">2. Protection de vos Données</h2>
            <p className="text-gray-600 leading-relaxed">
              En tant que plateforme panafricaine, nous respectons les normes les plus strictes de protection des données personnelles (notamment la loi n°2013-450 en Côte d'Ivoire et le RGPD pour nos utilisateurs de la diaspora).
            </p>
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
              <p className="text-sm font-bold text-royalBlue mb-2">Chiffrement AES-256</p>
              <p className="text-sm text-gray-600">Tous vos documents (actes de naissance, CNI, diplômes) sont chiffrés dès leur téléchargement et ne sont accessibles qu'aux agents certifiés traitant votre dossier.</p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-royalBlue">3. Vos Droits</h2>
            <p className="text-gray-600 leading-relaxed">
              Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour toute demande, contactez notre Délégué à la Protection des Données (DPO) via la page <button onClick={() => onNavigate('contact')} className="text-royalBlue font-bold underline">Contact</button>.
            </p>
          </section>

          <div className="pt-8">
            <button 
              onClick={() => onNavigate('home')}
              className="bg-royalBlue text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
