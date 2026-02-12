
import React, { useState, useEffect } from 'react';
import { Logo } from '../constants';
import { getAIPoweredNews } from '../services/geminiService';
import AdSpace from '../components/AdSpace';

interface BlogPageProps {
  onNavigate: (page: string) => void;
}

interface NewsItem {
  title: string;
  summary: string;
  date: string;
  country: string;
  readTime: string;
  source_hint?: string;
}

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Tous', 'Actualités', 'Tutoriels', 'Sénégal', 'Côte d\'Ivoire', 'Cameroun'];

  const fetchNews = async (cat: string) => {
    setLoading(true);
    const result = await getAIPoweredNews(cat === 'Tous' ? 'Réformes administratives Afrique' : cat);
    setNews(result.news);
    setSources(result.sources);
    setLoading(false);
  };

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="bg-white min-h-screen">
       {/* Hero Blog */}
       <div className="bg-royalBlue py-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx="10" cy="10" r="40" fill="gold" />
              <circle cx="90" cy="80" r="30" fill="white" />
            </svg>
          </div>
          <div className="relative z-10 container mx-auto px-4">
            <button 
              onClick={() => onNavigate('home')}
              className="mb-8 inline-flex items-center gap-2 text-white font-black uppercase text-xs tracking-widest hover:text-gold transition-colors bg-white/10 px-6 py-2 rounded-full border border-white/20"
            >
              <span>←</span> Retour à l'accueil
            </button>
            <h1 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">Intelligence <span className="text-gold">Administrative</span></h1>
            <p className="text-blue-100 max-w-2xl mx-auto font-medium">
              Notre IA analyse en temps réel les journaux officiels et portails gouvernementaux pour vous informer des dernières réformes.
            </p>
          </div>
       </div>

       {/* Filters */}
       <div className="sticky top-40 bg-white z-20 border-b border-gray-100 shadow-sm">
          <div className="container mx-auto px-4 py-4 overflow-x-auto">
             <div className="flex gap-4 justify-center min-w-max">
                {categories.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setSelectedCategory(c)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === c ? 'bg-gold text-royalBlue shadow-lg scale-105' : 'bg-gray-50 text-gray-500 hover:bg-royalBlue/5 hover:text-royalBlue'}`}
                  >
                    {c}
                  </button>
                ))}
             </div>
          </div>
       </div>

       {/* Blog Content */}
       <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main List */}
          <div className="lg:col-span-3 space-y-12">
             {loading ? (
               <div className="space-y-12 py-10">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse grid grid-cols-1 md:grid-cols-5 gap-8">
                       <div className="md:col-span-2 h-48 bg-gray-100 rounded-3xl"></div>
                       <div className="md:col-span-3 space-y-4">
                          <div className="h-4 w-1/4 bg-gray-100 rounded"></div>
                          <div className="h-8 w-3/4 bg-gray-100 rounded"></div>
                          <div className="h-20 w-full bg-gray-100 rounded"></div>
                       </div>
                    </div>
                  ))}
                  <p className="text-center font-bold text-royalBlue animate-bounce uppercase text-xs tracking-widest">Connexion aux serveurs administratifs...</p>
               </div>
             ) : news.length > 0 ? (
               news.map((item, i) => (
                 <article key={i} className="group grid grid-cols-1 md:grid-cols-5 gap-8 items-start cursor-pointer animate-in fade-in slide-in-from-bottom-4">
                    <div className="md:col-span-2 aspect-video md:aspect-square rounded-3xl overflow-hidden shadow-xl relative">
                       <img 
                        src={`https://picsum.photos/seed/${item.country + i}/800/800`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={item.title} 
                       />
                       <div className="absolute top-4 left-4 bg-royalBlue text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase shadow-lg">
                          {item.country}
                       </div>
                    </div>
                    <div className="md:col-span-3 space-y-4 py-2">
                       <div className="flex gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <span>{item.date}</span>
                          <span className="text-gold">•</span>
                          <span>{item.readTime} min lecture</span>
                       </div>
                       <h2 className="text-2xl font-black text-royalBlue group-hover:text-gold transition-colors leading-tight uppercase">
                          {item.title}
                       </h2>
                       <p className="text-gray-600 leading-relaxed font-medium">
                          {item.summary}
                       </p>
                       <button className="inline-flex items-center gap-2 text-royalBlue font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all border-b-2 border-gold pb-1">
                          Lire la suite →
                       </button>
                    </div>
                 </article>
               ))
             ) : (
               <div className="text-center py-20 bg-gray-50 rounded-3xl">
                  <p className="text-gray-500 font-bold">Aucune actualité récente trouvée.</p>
                  <button onClick={() => fetchNews(selectedCategory)} className="mt-4 text-royalBlue font-black underline uppercase text-xs tracking-widest">Réessayer</button>
               </div>
             )}
          </div>

          {/* Sidebar Blog with Ads */}
          <div className="space-y-12">
             <div className="bg-beigeLight/30 p-8 rounded-3xl border border-beigeLight shadow-sm">
                <h3 className="text-xl font-black text-royalBlue mb-6 uppercase tracking-tighter">Recherche IA</h3>
                <div className="relative">
                   <input 
                    type="text" 
                    placeholder="Ex: Passeport Cameroun 2024..." 
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-royalBlue shadow-sm text-sm font-bold"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        setSelectedCategory((e.target as HTMLInputElement).value);
                      }
                    }}
                   />
                </div>
             </div>

             <AdSpace type="sidebar" className="h-[500px]" />

             <div className="space-y-6">
                <h3 className="text-xl font-black text-royalBlue uppercase tracking-tighter">Tendances Régionales</h3>
                {['Mali', 'Burkina Faso', 'Bénin'].map((country, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer" onClick={() => setSelectedCategory(country)}>
                     <div className="w-16 h-16 rounded-2xl bg-royalBlue/5 flex items-center justify-center text-2xl group-hover:bg-gold transition-all">
                        📍
                     </div>
                     <div>
                        <h4 className="font-bold text-royalBlue text-sm group-hover:text-gold transition-colors line-clamp-2 uppercase">Actualités du {country}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Mise à jour en direct</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

export default BlogPage;
