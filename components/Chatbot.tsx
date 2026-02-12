
import React, { useState, useEffect, useRef } from 'react';
import { getChatbotResponse } from '../services/geminiService';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Bonjour ! Je suis votre assistant virtuel E-admin.Africa. Comment puis-je vous aider aujourd’hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const botMsg = await getChatbotResponse(userMsg);
    setMessages(prev => [...prev, { role: 'bot', text: botMsg }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-[32px] shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-300">
          <div className="bg-royalBlue p-5 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-inner">
                 <svg className="w-6 h-6 text-royalBlue" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0 1 1 0 002 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
              </div>
              <div>
                <span className="font-black text-sm block uppercase tracking-tight">Assistant Virtuel</span>
                <span className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">En ligne 🟢</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-royalBlue text-white rounded-br-none shadow-md' : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-3xl rounded-bl-none border border-gray-100 shadow-sm">
                  <span className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce delay-200"></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-5 bg-white border-t border-gray-100">
            <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Votre message ici..."
                className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none font-medium"
              />
              <button 
                onClick={handleSend}
                className="bg-royalBlue text-white p-3 rounded-xl hover:bg-gold hover:text-royalBlue transition-all shadow-md group"
              >
                <svg className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group flex items-center justify-end">
          <button 
            onClick={() => setIsOpen(true)}
            className="absolute -top-14 right-0 bg-white text-royalBlue text-[10px] font-black py-2 px-4 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap border border-gray-100 flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0"
          >
            Besoin d'aide ? 24/7 💬
          </button>
          
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-royalBlue text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all animate-bounce hover:animate-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
