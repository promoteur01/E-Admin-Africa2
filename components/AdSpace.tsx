
import React, { useState, useEffect } from 'react';
import { db, AdCampaign } from '../services/database';

interface AdSpaceProps {
  type: 'banner' | 'sidebar' | 'inline';
  className?: string;
  forceAdId?: string;
}

const AdSpace: React.FC<AdSpaceProps> = ({ type, className = "", forceAdId }) => {
  const [ad, setAd] = useState<AdCampaign | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const availableAds = db.getAds(type);
    if (availableAds.length > 0) {
      const selected = forceAdId 
        ? availableAds.find(a => a.id === forceAdId) || availableAds[0]
        : availableAds[Math.floor(Math.random() * availableAds.length)];
      
      setAd(selected);
      db.recordAdImpression(selected.id);
    }
  }, [type, forceAdId]);

  if (!ad) return null;

  const containerStyles = {
    banner: "w-full h-48 md:h-64 rounded-[40px] border-4 border-gold/10",
    sidebar: "w-full h-[500px] rounded-[32px] border-2 border-gray-100",
    inline: "w-full h-56 rounded-[32px] border-2 border-gray-50"
  };

  return (
    <div 
      onClick={() => window.open(ad.link, '_blank')}
      className={`relative group overflow-hidden cursor-pointer shadow-2xl hover:scale-[1.01] transition-all bg-white ${containerStyles[type]} ${className}`}
    >
      {/* Visual Content: Image or Styled Fallback */}
      {!imgError ? (
        <img 
          src={ad.imageUrl} 
          alt={ad.partnerName}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div 
          className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
          style={{ backgroundColor: ad.brandColor + '20' }}
        >
          <div className="w-20 h-20 rounded-full mb-4 flex items-center justify-center text-4xl shadow-lg bg-white" style={{ color: ad.brandColor }}>
             📢
          </div>
          <h4 className="text-2xl font-black uppercase tracking-tighter mb-2" style={{ color: ad.brandColor }}>
            {ad.partnerName}
          </h4>
          <p className="text-sm font-bold opacity-60">Partenaire Officiel E-admin.Africa</p>
        </div>
      )}

      {/* Badges & Labels */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <span className="bg-royalBlue text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl">
          Annonce Partenaire
        </span>
        <span className="bg-gold text-royalBlue px-3 py-1.5 rounded-lg text-xs font-black uppercase shadow-lg border border-white/50">
          {ad.partnerName}
        </span>
      </div>

      {/* Hover Call to Action */}
      <div className="absolute inset-0 bg-gradient-to-t from-royalBlue/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
         <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <p className="font-black text-xl mb-1">Profitez des offres de {ad.partnerName}</p>
            <p className="text-xs font-bold text-gold uppercase tracking-widest">En savoir plus sur le site officiel ➔</p>
         </div>
      </div>

      {/* Decorative pulse for attention */}
      <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-gold/20 rounded-full animate-ping"></div>
    </div>
  );
};

export default AdSpace;
