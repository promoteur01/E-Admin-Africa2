
import React from 'react';

export const COLORS = {
  royalBlue: '#0047AB',
  gold: '#D4AF37',
  beigeLight: '#F5F5DC',
};

export const COUNTRIES = [
  { 
    name: 'Côte d\'Ivoire', 
    cities: ['Abidjan', 'Yamoussoukro', 'Bouaké'],
    flag: '🇨🇮'
  },
  { 
    name: 'Sénégal', 
    cities: ['Dakar', 'Touba', 'Thiès'],
    flag: '🇸🇳'
  },
  { 
    name: 'Cameroun', 
    cities: ['Yaoundé', 'Douala', 'Garoua'],
    flag: '🇨🇲'
  }
];

export const ETAT_CIVIL_CONFIG = {
  subTypes: [
    'Acte de naissance',
    'Acte de mariage',
    'Acte de décès',
    'Certificat de résidence'
  ],
  options: [
    'Copie d’acte',
    'Extrait d’acte',
    'Copie à la souche'
  ]
};

export const HEBERGEMENT_CONFIG = {
  subTypes: [
    'Attestation d\'accueil (Visa)',
    'Certificat d\'hébergement (Logement)',
    'Engagement de prise en charge financière'
  ],
  options: [
    'Original uniquement',
    'Original + Copie certifiée'
  ]
};

export const SERVICES = [
  {
    id: 'legalisation',
    title: 'Légalisation de documents',
    description: 'Faites certifier vos diplômes, actes et contrats officiellement.',
    priceService: 15000,
    priceTaxes: 2500,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    id: 'etat-civil',
    title: 'Services d\'état civil',
    description: 'Actes de naissance, mariage, décès et certificats de résidence.',
    config: ETAT_CIVIL_CONFIG,
    priceService: 10000,
    priceTaxes: 1500,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    id: 'certificat-hebergement',
    title: 'Certificat d\'hébergement',
    description: 'Obtenez une attestation d\'accueil ou d\'hébergement pour vos proches.',
    config: HEBERGEMENT_CONFIG,
    priceService: 25000,
    priceTaxes: 10000,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    id: 'casier',
    title: 'Casier judiciaire',
    description: 'Demandez votre extrait de casier judiciaire en ligne rapidement.',
    priceService: 8000,
    priceTaxes: 2000,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    )
  },
  {
    id: 'dossiers-admin',
    title: 'Dossiers administratifs',
    description: 'Dépôt, suivi et retrait de vos dossiers (permis, passeport, etc.).',
    priceService: 20000,
    priceTaxes: 5000,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'creation-entreprise',
    title: 'Création d\'entreprise',
    description: 'Accompagnement complet pour lancer votre activité en Afrique.',
    priceService: 75000,
    priceTaxes: 25000,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  }
];

export const Logo = () => (
  <div className="flex items-center gap-2 group cursor-pointer">
    <div className="relative w-10 h-10 flex items-center justify-center bg-gold rounded-full shadow-lg transform transition-transform group-hover:scale-110 overflow-hidden">
       <svg className="w-8 h-8 text-royalBlue" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.8 2.2c-.2-.1-.5-.2-.8-.2s-.6.1-.8.2C6 5.5 2 12 2 13.5c0 4.1 3.4 7.5 7.5 7.5h.5v-3h2v3h.5c4.1 0 7.5-3.4 7.5-7.5 0-1.5-4-8-9.2-11.3z" />
          <rect x="10" y="8" width="4" height="7" rx="0.5" fill="white" />
       </svg>
    </div>
    <span className="font-bold text-xl tracking-tight text-white">E-admin.<span className="text-gold">Africa</span></span>
  </div>
);
