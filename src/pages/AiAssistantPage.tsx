import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Info, 
  ExternalLink,
  RotateCcw,
  Languages
} from 'lucide-react';
import { getProperties } from '../services/propertyService';
import type { Property, PropertyFilters } from '../types/database';
import { PropertyCard } from '../components/property/PropertyCard';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  language?: 'en' | 'roman-urdu' | 'urdu';
  matchedProperties?: Property[];
  filtersApplied?: PropertyFilters;
  timestamp: Date;
}

export const AiAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Salam! I am Property Dost AI. Aap mujh se English, Roman Urdu ya Urdu mein kisi bhi property ke bare mein pooch sakte hain.\n\nExample queries:\n• "Mujhe Jhelum Citi Housing mein 5 marla ka ghar chahiye, budget 1.5 crore ke around."\n• "Show me 10 Marla plots for sale in Jhelum Cantt."\n• "Civil Lines mein 2 bedroom flat for rent chahiye."\n• "Main G.T. Road par commercial shop dikhao."`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  /**
   * Multilingual NLP parser for real estate queries
   */
  const parseQuery = (text: string): { filters: PropertyFilters; detectedLang: 'en' | 'roman-urdu' | 'urdu' } => {
    const lower = text.toLowerCase();

    // Detect language style
    let detectedLang: 'en' | 'roman-urdu' | 'urdu' = 'en';
    const urduChars = /[\u0600-\u06FF]/;
    const romanUrduKeywords = ['mujhe', 'chahiye', 'mein', 'par', 'dikhao', 'karo', 'hai', 'ka', 'ki', 'ke', 'ghar', 'makaan', 'dukan', 'kiraya', 'zameen'];

    if (urduChars.test(text)) {
      detectedLang = 'urdu';
    } else if (romanUrduKeywords.some(kw => lower.includes(kw))) {
      detectedLang = 'roman-urdu';
    }

    const filters: PropertyFilters = {
      status: 'Available',
    };

    // 1. Detect Purpose
    if (lower.includes('rent') || lower.includes('kiraya') || lower.includes('kiraye') || lower.includes('کرایہ')) {
      filters.purpose = 'For Rent';
    } else if (lower.includes('buy') || lower.includes('sale') || lower.includes('khareed') || lower.includes('kharid') || lower.includes('فروخت')) {
      filters.purpose = 'For Sale';
    }

    // 2. Detect Property Type
    if (lower.includes('ghar') || lower.includes('makaan') || lower.includes('house') || lower.includes('kothi') || lower.includes('مکان') || lower.includes('گھر')) {
      filters.propertyType = 'House';
    } else if (lower.includes('plot') || lower.includes('zameen') || lower.includes('پلاٹ')) {
      filters.propertyType = 'Plot';
    } else if (lower.includes('flat') || lower.includes('apartment') || lower.includes('فلیٹ')) {
      filters.propertyType = 'Flat';
    } else if (lower.includes('shop') || lower.includes('dukan') || lower.includes('دکان')) {
      filters.propertyType = 'Shop';
    } else if (lower.includes('office') || lower.includes('daftar') || lower.includes('دفتر')) {
      filters.propertyType = 'Office';
    } else if (lower.includes('agri') || lower.includes('kheti') || lower.includes('fasal') || lower.includes('farmhouse') || lower.includes('زراعت')) {
      filters.propertyType = 'Agricultural Land';
    } else if (lower.includes('commercial') || lower.includes('plaza')) {
      filters.propertyType = 'Commercial Property';
    }

    // 3. Detect Location / Scheme
    if (lower.includes('citi housing') || lower.includes('citi')) {
      filters.searchTerm = 'Citi Housing';
    } else if (lower.includes('cantt') || lower.includes('cantonment')) {
      filters.searchTerm = 'Cantt';
    } else if (lower.includes('civil lines')) {
      filters.searchTerm = 'Civil Lines';
    } else if (lower.includes('g.t. road') || lower.includes('gt road') || lower.includes('g t road')) {
      filters.searchTerm = 'G.T. Road';
    } else if (lower.includes('kala gujran')) {
      filters.searchTerm = 'Kala Gujran';
    } else if (lower.includes('river view')) {
      filters.searchTerm = 'River View';
    }

    // 4. Detect Budget / Price
    // Pattern: 1.5 crore, 1 crore, 50 lakh, 45000, 45k
    const croreMatch = lower.match(/(\d+(\.\d+)?)\s*(crore|cr|karor|کروڑ)/);
    if (croreMatch) {
      const croreVal = parseFloat(croreMatch[1]) * 10000000;
      filters.maxPrice = croreVal * 1.15; // 15% flexible ceiling
    }

    const lakhMatch = lower.match(/(\d+(\.\d+)?)\s*(lakh|lac|lac|لاکھ)/);
    if (lakhMatch) {
      const lakhVal = parseFloat(lakhMatch[1]) * 100000;
      filters.maxPrice = lakhVal * 1.15;
    }

    const thousandMatch = lower.match(/(\d+)\s*(k|thousand|hazar)/);
    if (thousandMatch) {
      const val = parseInt(thousandMatch[1], 10) * 1000;
      filters.maxPrice = val * 1.15;
    }

    // 5. Detect Bedrooms
    const bedMatch = lower.match(/(\d+)\s*(bed|bedroom|kamray|kamre)/);
    if (bedMatch) {
      filters.bedrooms = parseInt(bedMatch[1], 10);
    }

    return { filters, detectedLang };
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userText = input.trim();
    setInput('');

    // Add user message to thread
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const { filters, detectedLang } = parseQuery(userText);

      // Query real Supabase database - NEVER invent listings
      const results = await getProperties(filters);

      let responseText = '';

      if (results.length > 0) {
        if (detectedLang === 'roman-urdu') {
          responseText = `Mujhe aapki inquiry ke mutabiq Supabase database mein ${results.length} matching listing${results.length > 1 ? 's' : ''} mili hain. Yeh certified records hain, aap direct in-person physical visit book kar sakte hain:`;
        } else if (detectedLang === 'urdu') {
          responseText = `آپ کی دی گئی ترجیحات کے مطابق ڈیٹا بیس میں ${results.length} پراپرٹی مل گئی ہیں۔ آپ ان کے لیے وزٹ بک کر سکتے ہیں:`;
        } else {
          responseText = `Based on your request, I found ${results.length} verified propert${results.length > 1 ? 'ies' : 'y'} in our Supabase database matching your criteria. You can view the details or schedule an in-person physical visit below:`;
        }
      } else {
        // Transparent empty match guarantee: The AI MUST NOT invent listings
        if (detectedLang === 'roman-urdu') {
          responseText = `I couldn't find an exact match in the current Property Dost listings for your criteria. Aap apna budget ya location thora broaden kar ke doobara search kar sakte hain ya hamare dealer se rabta kar sakte hain.`;
        } else if (detectedLang === 'urdu') {
          responseText = `معذرت، پراپرٹی دوست لسٹنگز میں آپ کے مطلوبہ معیار کی کوئی پراپرٹی فی الوقت دستیاب نہیں ہے۔`;
        } else {
          responseText = `I couldn't find an exact match in the current Property Dost listings. Try broadening your budget range, exploring nearby localities in Jhelum, or contact our dealer helpline directly.`;
        }
      }

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        language: detectedLang,
        matchedProperties: results,
        filtersApplied: filters,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `Error querying database: ${err.message || 'Unable to reach Supabase'}. Please check your connection.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreset = (preset: string) => {
    setInput(preset);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Real Estate Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
            Property Dost AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search genuine Supabase properties in English, Urdu, or Roman Urdu. Zero hallucinations guaranteed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-navy-100 text-navy-900 text-xs font-semibold flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-gold-600" />
            <span>English • اردو • Roman Urdu</span>
          </span>
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-navy-950 text-gold-400 flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl space-y-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`inline-block p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-navy-900 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                  }`}
                >
                  {msg.text}
                </div>

                {/* If assistant matched real properties from Supabase, render cards */}
                {msg.matchedProperties && msg.matchedProperties.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {msg.matchedProperties.map((prop) => (
                      <PropertyCard key={prop.id} property={prop} />
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-gold-500 text-navy-950 flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isProcessing && (
            <div className="flex gap-3 justify-start items-center text-xs text-slate-500">
              <div className="w-8 h-8 rounded-xl bg-navy-950 text-gold-400 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
                Searching real Supabase database for matching properties...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-medium shrink-0">Try asking:</span>
          <button
            onClick={() => handlePreset('Mujhe Jhelum Citi Housing mein 5 marla ka ghar chahiye, budget 1.5 crore ke around')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-gold-400 text-slate-700 transition"
          >
            "Citi Housing mein 5 marla ghar"
          </button>
          <button
            onClick={() => handlePreset('Jhelum Cantt mein 10 Marla residential plot dikhao')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-gold-400 text-slate-700 transition"
          >
            "Cantt mein 10 Marla plot"
          </button>
          <button
            onClick={() => handlePreset('Civil Lines mein 2 bedroom flat for rent')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-gold-400 text-slate-700 transition"
          >
            "Civil Lines flat for rent"
          </button>
          <button
            onClick={() => handlePreset('Main G.T. Road par commercial shop dikhao')}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-gold-400 text-slate-700 transition"
          >
            "G.T. Road commercial shop"
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type in English, Roman Urdu (e.g. Mujhe Jhelum mein 5 marla ghar chahiye)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            className="flex-1 py-3 px-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
          />

          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="py-3 px-5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>

      </div>

    </div>
  );
};
