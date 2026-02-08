
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, ExternalLink, Sparkles, User, Info, Users, ChevronRight } from 'lucide-react';
import { Message, Sermon, Church, SmallGroup } from '../types';
import { MOCK_CHURCHES } from '../constants';

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
  selectedChurchId: string;
  selectedGroupId?: string;
  onToggleContext: () => void;
  customChurches?: Church[];
  joinedGroups?: SmallGroup[];
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  messages, 
  isTyping, 
  selectedChurchId, 
  selectedGroupId,
  onToggleContext, 
  customChurches = [],
  joinedGroups = []
}) => {
  const allChurches = [...MOCK_CHURCHES, ...customChurches];
  const selectedChurch = allChurches.find(c => c.id === selectedChurchId);
  const selectedGroup = joinedGroups.find(g => g.id === selectedGroupId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFAF9] relative overflow-hidden">
      {/* Desktop Header Only (Mobile has it in App.tsx) */}
      <div className="hidden lg:flex h-16 border-b border-[#E5E5E4] px-6 items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {selectedGroup ? (
            <>
              <div className="w-8 h-8 rounded-lg bg-[#8B9D83]/10 flex items-center justify-center text-[#8B9D83] shadow-sm border border-[#8B9D83]/20">
                <Users size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1A1A1A] leading-tight">{selectedGroup.name}</h2>
                <p className="text-[10px] text-[#BDBDBD] font-bold uppercase tracking-wider">Group Circle</p>
              </div>
            </>
          ) : selectedChurch ? (
            <>
              <img src={selectedChurch.logo} alt="" className="w-8 h-8 rounded shadow-sm border border-black/5" />
              <div>
                <h2 className="text-sm font-bold text-[#1A1A1A] leading-tight">{selectedChurch.name}</h2>
                <p className="text-[10px] text-[#BDBDBD] font-bold uppercase tracking-wider">Teaching Ground</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-lg bg-[#8B9D83] flex items-center justify-center text-white shadow-sm">
                <Sparkles size={16} />
              </div>
              <h2 className="text-sm font-bold text-[#1A1A1A]">Phil General</h2>
            </>
          )}
        </div>
        <button 
          onClick={onToggleContext}
          className="p-2 hover:bg-[#FAFAF9] rounded-lg transition-colors text-[#6B6B6B] hover:text-[#1A1A1A] flex items-center gap-2 text-xs font-bold"
        >
          <Info size={16} />
          <span>Details</span>
        </button>
      </div>

      {/* Messages Scroll View */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-10">
          {messages.length === 0 && (
            <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-[#E5E5E4] animate-pulse">
                  <Sparkles size={40} className="text-[#8B9D83]" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#8B9D83] rounded-full border-4 border-[#FAFAF9] flex items-center justify-center text-white text-[10px] font-black">
                  P
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
                  Hi, I'm Phil.
                </h3>
                <p className="text-[#6B6B6B] text-sm max-w-xs mt-1 font-medium leading-relaxed">
                  {selectedGroup 
                    ? `I'm here to support your growth in ${selectedGroup.name}. Ask me about today's scripture.`
                    : "Seek wisdom. Ask me anything about theology, scripture, or your church's teaching."}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {[
                  selectedGroup ? "Share a prayer" : "Who is C.S. Lewis?", 
                  "Explain grace vs mercy", 
                  "Sunday recap"
                ].map(q => (
                  <button key={q} className="px-5 py-2.5 bg-white border border-[#E5E5E4] rounded-2xl text-xs font-bold hover:border-[#8B9D83] hover:text-[#8B9D83] hover:shadow-md transition-all text-[#6B6B6B]">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[90%] md:max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 ml-1">
                    <div className="w-5 h-5 rounded-full bg-[#8B9D83] flex items-center justify-center text-[10px] text-white font-black shadow-sm">P</div>
                    <span className="text-[10px] font-black text-[#BDBDBD] uppercase tracking-widest">Phil</span>
                  </div>
                )}
                
                <div className={`
                  p-4 md:p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm transition-all
                  ${msg.role === 'user' 
                    ? 'bg-[#8B9D83] text-white rounded-tr-none shadow-[#8B9D83]/10' 
                    : 'bg-white text-[#1A1A1A] border border-[#E5E5E4] rounded-tl-none'}
                `}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-[#E5E5E4]/60 space-y-3">
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${msg.role === 'user' ? 'text-white/70' : 'text-[#BDBDBD]'}`}>
                        Relevant Teaching
                      </p>
                      {msg.citations.map((sermon) => (
                        <div key={sermon.id} className={`p-4 rounded-xl flex items-center gap-4 transition-all group cursor-pointer ${msg.role === 'user' ? 'bg-white/10 border border-white/20' : 'bg-[#FAFAF9] border border-[#E5E5E4] hover:shadow-md'}`}>
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-white text-[#8B9D83]' : 'bg-white border border-[#E5E5E4]'}`}>
                            <BookOpen size={18} className={msg.role === 'user' ? '' : 'text-[#8B9D83]'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${msg.role === 'user' ? 'text-white' : 'text-[#1A1A1A]'}`}>{sermon.title}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-tight mt-0.5 ${msg.role === 'user' ? 'text-white/60' : 'text-[#BDBDBD]'}`}>
                              {sermon.speaker} • {sermon.date}
                            </p>
                          </div>
                          <ChevronRight size={14} className={msg.role === 'user' ? 'text-white/40' : 'text-[#BDBDBD]'} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-[9px] font-bold text-[#BDBDBD] mt-2 px-1 uppercase tracking-widest">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white border border-[#E5E5E4] p-4 rounded-2xl rounded-tl-none flex gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-[#8B9D83]/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-[#8B9D83]/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-[#8B9D83]/60 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
