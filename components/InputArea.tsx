
import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, Sparkles, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_CHURCHES } from '../constants';
import { Church } from '../types';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  selectedChurchId: string;
  setSelectedChurchId: (id: string) => void;
  customChurches?: Church[];
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, selectedChurchId, setSelectedChurchId, customChurches = [] }) => {
  const [text, setText] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const allChurches = [...MOCK_CHURCHES, ...customChurches];
  const selectedChurch = allChurches.find(c => c.id === selectedChurchId);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="px-4 pb-6 pt-2 bg-[#FAFAF9] sticky bottom-0 z-20">
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-white border border-[#E5E5E4] rounded-[2rem] shadow-xl shadow-black/[0.03] focus-within:ring-2 focus-within:ring-[#8B9D83]/10 focus-within:border-[#8B9D83]/30 transition-all p-2 pr-3">
          <div className="flex flex-col">
            {/* Context Selector Toggle */}
            <div className="flex items-center justify-between px-3 py-1.5 mb-1">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1 rounded-full bg-[#FAFAF9] hover:bg-white border border-[#E5E5E4] transition-all text-[10px] font-black uppercase tracking-widest text-[#6B6B6B]"
                >
                  {selectedChurch ? (
                    <>
                      <img src={selectedChurch.logo} alt="" className="w-3 h-3 rounded-full" />
                      <span className="max-w-[120px] truncate">{selectedChurch.name}</span>
                    </>
                  ) : (
                    <>
                      <Hash size={12} className="text-[#BDBDBD]" />
                      <span>General Phil</span>
                    </>
                  )}
                  <ChevronDown size={12} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute bottom-full mb-3 left-0 w-64 bg-white border border-[#E5E5E4] rounded-2xl shadow-2xl z-50 p-2 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => { setSelectedChurchId('general'); setIsDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-[#FAFAF9] rounded-xl transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 border border-black/5">
                          <Hash size={14} className="text-gray-400" />
                        </div>
                        <span className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#8B9D83]">General Wisdom</span>
                      </button>
                      <div className="h-px bg-[#E5E5E4]/50 my-1 mx-2" />
                      <div className="max-h-64 overflow-y-auto custom-scrollbar p-1">
                        {allChurches.map((church) => (
                          <button
                            key={church.id}
                            type="button"
                            onClick={() => { setSelectedChurchId(church.id); setIsDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-[#FAFAF9] rounded-xl transition-colors group"
                          >
                            <img src={church.logo} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0 shadow-sm border border-black/5" />
                            <span className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#8B9D83] truncate">{church.name}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="hidden sm:flex text-[9px] font-black text-[#BDBDBD] items-center gap-1.5 uppercase tracking-widest">
                <Sparkles size={10} className="text-[#8B9D83]" />
                Guided Perspective
              </div>
            </div>

            {/* Input & Send */}
            <div className="flex items-end gap-2 pl-2">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Ask Phil about life, scripture..."
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2.5 px-2 text-sm placeholder:text-[#BDBDBD] min-h-[44px] max-h-48 custom-scrollbar text-[#1A1A1A] font-medium"
                rows={1}
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!text.trim()}
                className={`
                  p-2.5 rounded-full transition-all duration-300 mb-1 shrink-0
                  ${text.trim() 
                    ? 'bg-[#8B9D83] text-white shadow-lg shadow-[#8B9D83]/20 scale-100 hover:scale-105 active:scale-95' 
                    : 'bg-[#FAFAF9] text-[#BDBDBD] scale-95 cursor-not-allowed border border-[#E5E5E4]'}
                `}
              >
                <Send size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
        <p className="hidden sm:block text-[9px] text-center text-[#BDBDBD] mt-4 uppercase tracking-[0.2em] font-black opacity-60">
          Digital Sanctuary for Spiritual Growth
        </p>
      </div>
    </div>
  );
};

export default InputArea;
