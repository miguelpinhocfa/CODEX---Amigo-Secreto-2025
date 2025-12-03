import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Send, Sparkles, AlertCircle, QrCode, MapPin, Briefcase, Clock } from 'lucide-react';
import { GameState, ChatMessage } from './types';
import { SECRET_NAME } from './constants';
import { initializeChat, sendMessageToOracle } from './services/geminiService';
import QRCodeGenerator from './components/QRCodeGenerator';
import TypewriterText from './components/TypewriterText';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOCKED);
  const [inputValue, setInputValue] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showQR, setShowQR] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat().catch(console.error);
    // Add initial AI greeting specific to the persona
    setMessages([{
      role: 'model',
      text: "Acesso remoto ao Servidor de Aveiro estabelecido. Protejo os dados de um Manager veterano com mais de 15 anos de legado. Quem é o alvo?"
    }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUnlockAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputValue.trim().toUpperCase();
    
    // Check strict equality or contains both parts
    if (cleanInput === SECRET_NAME || (cleanInput.includes("MIGUEL") && cleanInput.includes("PINHO"))) {
      setGameState(GameState.UNLOCKED);
      setErrorMsg('');
    } else {
      setErrorMsg('ACESSO NEGADO. Credenciais inválidas.');
      setInputValue('');
      
      // Trigger AI reaction to failed login
      handleAiReactionToFailure(cleanInput);
    }
  };

  const handleAiReactionToFailure = async (wrongGuess: string) => {
    const prompt = `O utilizador tentou desbloquear com o nome "${wrongGuess}" e falhou. O alvo é o Miguel Pinho (Manager, Aveiro, 15+ anos). Dê uma pista sarcástica comparando o erro com os factos reais (sem dizer o nome).`;
    setLoading(true);
    try {
      const response = await sendMessageToOracle(prompt);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userText = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const response = await sendMessageToOracle(userText);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Erro na matrix corporativa. Tente novamente." }]);
    } finally {
      setLoading(false);
    }
  };

  if (gameState === GameState.UNLOCKED) {
    return (
      <div className="min-h-screen bg-black text-green-500 flex flex-col items-center justify-center p-4 crt overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-10 blur-sm pointer-events-none"></div>
        
        <div className="z-10 text-center space-y-8 max-w-2xl animate-in fade-in duration-1000 zoom-in-95 border border-green-500/30 p-8 rounded-lg bg-black/80 backdrop-blur-md">
          <div className="mx-auto w-32 h-32 bg-green-900/20 rounded-full flex items-center justify-center border-4 border-green-500 shadow-[0_0_50px_rgba(50,205,50,0.6)] animate-pulse">
            <Unlock size={64} className="text-green-400" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl text-green-600 font-cinzel tracking-widest">MANAGER IDENTIFICADO</h2>
            <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200 glow-text">
              MIGUEL PINHO
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-green-300/70 border-t border-b border-green-900/50 py-4">
            <div className="flex flex-col items-center gap-1">
              <MapPin size={16} />
              <span>AVEIRO HQ</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Briefcase size={16} />
              <span>ADVISORY / CORPORATE</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Clock size={16} />
              <span>15+ ANOS DE LEGADO</span>
            </div>
          </div>

          <div className="space-y-4 text-xl font-light tracking-wide text-green-100">
            <TypewriterText 
              text="Protocolo de Natal autorizado. O presente foi desbloqueado." 
              speed={40}
            />
          </div>

          <div className="pt-8">
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-transparent border border-green-500/30 hover:bg-green-500/10 hover:border-green-400 text-green-500 transition-all uppercase tracking-widest text-xs"
            >
              Reiniciar Sistema
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-green-500 font-mono flex flex-col crt">
      
      {/* Header */}
      <header className="border-b border-green-900/50 p-4 flex justify-between items-center bg-black/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Lock size={18} className="animate-pulse" />
          <span className="font-bold tracking-widest uppercase glow-text hidden md:inline">Codex: Protocolo CFA Aveiro</span>
          <span className="font-bold tracking-widest uppercase glow-text md:hidden">Codex: CFA</span>
        </div>
        <button 
          onClick={() => setShowQR(true)}
          className="p-2 hover:bg-green-900/20 rounded-full transition-colors text-green-600 hover:text-green-400 flex items-center gap-2"
          title="Gerar convite"
        >
          <span className="text-xs uppercase font-bold hidden md:inline">Acesso Remoto</span>
          <QrCode size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 gap-6">
        
        {/* Left Column: Visual & Login */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-8 min-h-[50vh]">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-48 h-48 bg-black ring-1 ring-green-900/50 rounded-lg flex items-center justify-center">
              <span className="text-6xl flicker font-cinzel">?</span>
            </div>
            <div className="absolute -bottom-6 w-full text-center text-[10px] text-green-700 font-mono">
              STATUS: AGUARDANDO MANAGER
            </div>
          </div>

          <div className="w-full max-w-md space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-cinzel text-white">Autenticação</h2>
              <p className="text-xs text-green-600 uppercase tracking-widest">Identifique o Amigo Secreto</p>
            </div>

            <form onSubmit={handleUnlockAttempt} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="NOME E APELIDO"
                  className="w-full bg-black/50 border-2 border-green-900 focus:border-green-500 text-green-400 text-center p-4 text-xl outline-none transition-all placeholder:text-green-900/50 rounded uppercase font-bold tracking-widest"
                />
              </div>
              
              {errorMsg && (
                <div className="flex items-center justify-center gap-2 text-red-500 text-xs animate-bounce bg-red-900/10 p-2 rounded border border-red-900/50">
                  <AlertCircle size={12} />
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-900/20 border border-green-600/50 text-green-400 hover:bg-green-500 hover:text-black py-3 px-6 transition-all duration-300 uppercase tracking-widest font-bold flex items-center justify-center gap-2 group"
              >
                <Unlock size={16} className="group-hover:rotate-12 transition-transform" />
                Desbloquear Presente
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Chat Oracle */}
        <div className="flex-1 flex flex-col bg-black/40 border border-green-900/30 rounded-lg overflow-hidden h-[600px] md:h-auto shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="bg-green-900/10 p-3 border-b border-green-900/30 flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-500" />
              <span className="text-xs font-bold uppercase text-green-400">Consultor IA - Nível 44</span>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-green-500/30"></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-black">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 text-sm rounded border ${
                    msg.role === 'user'
                      ? 'bg-green-900/20 border-green-500/30 text-green-300'
                      : 'bg-zinc-900 border-green-900/50 text-green-400 shadow-[0_0_10px_rgba(50,205,50,0.1)]'
                  }`}
                >
                  {msg.role === 'model' ? (
                    <TypewriterText text={msg.text} speed={20} />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-green-900/50 p-3 rounded text-green-600 text-xs animate-pulse">
                  Acedendo à base de dados de RH...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleChatSubmit} className="p-4 border-t border-green-900/30 bg-black/60">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ex: Em que departamento ele trabalha?"
                className="flex-1 bg-transparent border-b border-green-800 focus:border-green-400 text-green-300 px-2 py-2 outline-none transition-colors text-sm placeholder:text-green-800"
              />
              <button
                type="submit"
                disabled={loading || !chatInput.trim()}
                className="p-2 text-green-500 hover:text-green-300 disabled:opacity-50 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-[10px] text-green-900 uppercase tracking-widest border-t border-green-900/20">
        &copy; {new Date().getFullYear()} CFA Systems | Aveiro Branch | Authorized Personnel Only
      </footer>

      {/* QR Code Modal */}
      {showQR && <QRCodeGenerator onClose={() => setShowQR(false)} />}
    </div>
  );
};

export default App;