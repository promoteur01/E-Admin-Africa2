
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Use process.env.API_KEY directly as required by guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getChatbotResponse = async (userMessage: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: "Tu es l'assistant virtuel proactif de E-admin.Africa. Aide les clients africains (Côte d'Ivoire, Sénégal, Cameroun) dans leurs démarches administratives. Sois poli, concis et efficace. Si l'utilisateur a besoin d'un service spécifique, dirige-le vers les formulaires de légalisation, état civil, casier judiciaire, dossiers admin ou création d'entreprise.",
        temperature: 0.7,
      },
    });
    // Fix: Access .text as a property and provide a fallback string
    return response.text || "Désolé, je ne peux pas formuler de réponse pour le moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Désolé, je rencontre une petite difficulté technique. Veuillez réessayer plus tard.";
  }
};

export const getAIPoweredNews = async (category: string) => {
  const prompt = `Génère une liste des 5 dernières actualités administratives réelles et importantes pour la catégorie : "${category}" en Afrique (priorité Côte d'Ivoire, Sénégal, Cameroun). 
  Inclus : 
  1. Un titre percutant.
  2. Un résumé de 3 phrases.
  3. La date exacte.
  4. Le pays concerné.
  5. Une estimation du temps de lecture.
  
  Format de réponse : JSON uniquement.
  Structure : Array of { title: string, summary: string, date: string, country: string, readTime: string, source_hint: string }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              date: { type: Type.STRING },
              country: { type: Type.STRING },
              readTime: { type: Type.STRING },
              source_hint: { type: Type.STRING }
            },
            required: ["title", "summary", "date", "country", "readTime"]
          }
        },
        systemInstruction: "Tu es un journaliste administratif panafricain expert. Tu utilises Google Search pour trouver des réformes réelles, des décrets récents et des changements de procédures publiques en Afrique francophone. Tu ne simplifies jamais à l'excès les faits juridiques."
      }
    });

    // Fix: Access .text as a property
    const jsonStr = response.text || "[]";
    const news = JSON.parse(jsonStr);
    
    // Extract search sources if available
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web?.uri).filter(Boolean) || [];
    
    return { news, sources };
  } catch (error) {
    console.error("Error fetching AI news:", error);
    return { news: [], sources: [] };
  }
};
