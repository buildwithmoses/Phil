
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import Onboarding from './components/Onboarding';
import Discover from './components/Discover';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_MESSAGES, MOCK_CHURCHES, MOCK_SERMONS, VICTORY_CHURCHES, SMALL_GROUPS_CATALOG } from './constants';
import { Message, Sermon, Church, SmallGroup } from './types';
import { Menu, X, BookOpen, Users, Info, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [selectedChurchId, setSelectedChurchId] = useState('general');
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>();
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [view, setView] = useState<'chat' | 'discover'>('chat');
  
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [joinedGroupIds, setJoinedGroupIds] = useState<Set<string>>(new Set());

  const followedChurches = Array.from(followedIds).map(id => VICTORY_CHURCHES.find(c => c.id === id)).filter(Boolean) as Church[];
  const joinedGroups = Array.from(joinedGroupIds).map(id => SMALL_GROUPS_CATALOG.find(g => g.id === id)).filter(Boolean) as SmallGroup[];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      churchId: selectedGroupId ? undefined : (selectedChurchId !== 'general' ? selectedChurchId : undefined),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview';
      
      let contextInfo = 'general theological context';
      if (selectedGroupId) {
        const group = joinedGroups.find(g => g.id === selectedGroupId);
        contextInfo = `Small Group: ${group?.name}`;
      } else {
        const currentChurch = [...MOCK_CHURCHES, ...followedChurches].find(c => c.id === selectedChurchId);
        if (currentChurch) contextInfo = `Church: ${currentChurch.name}`;
      }

      const prompt = `You are Phil, a friendly and wise theological assistant. Context: ${contextInfo}. User: ${text}. Provide a thoughtful, faith-based response. Ground it in scripture. Tonality: peaceful, encouraging.`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.text || "I'm reflecting on that.",
          timestamp: new Date(),
          citations: text.toLowerCase().includes('glory') ? [MOCK_SERMONS[0]] : undefined
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
      }, 1000);

    } catch (error) {
      console.error("AI Error:", error);
      setIsTyping(false);
    }
  };

  const handleOnboardingComplete = (churches: Church[], groups: SmallGroup[]) => {
    setFollowedIds(new Set(churches.map(c => c.id)));
    setJoinedGroupIds(new Set(groups.map(g => g.id)));
    if (churches.length > 0) setSelectedChurchId(churches[0].id);
    setShowOnboarding(false);
  };

  const toggleFollow = (id: string) => {
    setFollowedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleJoinGroup = (id: string) => {
    setJoinedGroupIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      </AnimatePresence>
      
      <div className="flex h-screen overflow-hidden bg-[#FAFAF9] text-[#1A1A1A]">
        {/* Sidebar Overlay for Mobile */}
        <AnimatePresence>
          {isMobile && isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          selectedChurchId={selectedChurchId}
          selectedGroupId={selectedGroupId}
          onSelectChurch={(id) => {
            setSelectedChurchId(id);
            setSelectedGroupId(undefined);
            setView('chat');
            if (isMobile) setIsSidebarOpen(false);
          }}
          onSelectGroup={(id) => {
            setSelectedGroupId(id);
            setView('chat');
            if (isMobile) setIsSidebarOpen(false);
          }}
          onOpenDiscover={() => {
            setView('discover');
            if (isMobile) setIsSidebarOpen(false);
          }}
          customChurches={followedChurches}
          joinedGroups={joinedGroups}
        />

        <div className="flex-1 flex flex-col relative h-full w-full">
          {/* Top Mobile Header (Claude style) */}
          <div className="lg:hidden h-14 border-b border-[#E5E5E4] px-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-30">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-[#6B6B6B]">
              <Menu size={20} />
            </button>
            <div className="flex-1 text-center font-bold text-sm truncate px-2">
              {view === 'chat' ? (selectedGroupId ? joinedGroups.find(g => g.id === selectedGroupId)?.name : (followedChurches.find(c => c.id === selectedChurchId)?.name || 'Phil')) : 'Discover'}
            </div>
            <button onClick={() => setIsContextOpen(!isContextOpen)} className="p-2 -mr-2 text-[#6B6B6B]">
              <Info size={20} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {view === 'chat' ? (
              <motion.div 
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col overflow-hidden relative"
              >
                <ChatArea 
                  messages={messages} 
                  isTyping={isTyping} 
                  selectedChurchId={selectedChurchId}
                  selectedGroupId={selectedGroupId}
                  onToggleContext={() => setIsContextOpen(!isContextOpen)}
                  customChurches={followedChurches}
                  joinedGroups={joinedGroups}
                />
                <InputArea 
                  onSendMessage={handleSendMessage} 
                  selectedChurchId={selectedChurchId}
                  setSelectedChurchId={setSelectedChurchId}
                  customChurches={followedChurches}
                />
              </motion.div>
            ) : (
              <Discover 
                key="discover"
                followedIds={followedIds}
                joinedGroupIds={joinedGroupIds}
                onToggleFollow={toggleFollow}
                onToggleJoinGroup={toggleJoinGroup}
                onBack={() => setView('chat')}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Info Panel Overlay for Mobile */}
        <AnimatePresence>
          {isContextOpen && (
            <>
              {isMobile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsContextOpen(false)}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                />
              )}
              <motion.div 
                initial={isMobile ? { x: '100%' } : { width: 0 }}
                animate={isMobile ? { x: 0 } : { width: 320 }}
                exit={isMobile ? { x: '100%' } : { width: 0 }}
                className={`
                  fixed right-0 top-0 bottom-0 lg:relative lg:top-auto lg:bottom-auto
                  bg-white border-l border-[#E5E5E4] z-50 lg:z-10 h-full overflow-hidden flex flex-col shadow-2xl lg:shadow-none
                `}
              >
                <div className="p-6 h-full overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-[#6B6B6B]">
                      <BookOpen size={14} className="text-[#8B9D83]" />
                      Details
                    </h3>
                    <button onClick={() => setIsContextOpen(false)} className="lg:hidden text-[#BDBDBD]">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-8">
                    {selectedGroupId && (
                      <section>
                        <h4 className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-3">Community</h4>
                        <div className="p-4 bg-[#8B9D83]/5 rounded-2xl border border-[#8B9D83]/20">
                          <p className="text-sm font-bold text-[#1A1A1A]">{joinedGroups.find(g => g.id === selectedGroupId)?.name}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex -space-x-1.5">
                              {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 rounded-full border border-white bg-gray-200" />)}
                            </div>
                            <p className="text-[10px] text-[#6B6B6B] font-medium">Joined with 12 others</p>
                          </div>
                        </div>
                      </section>
                    )}

                    <section>
                      <h4 className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-3">Daily Verse</h4>
                      <div className="p-5 bg-[#FAFAF9] rounded-2xl border border-[#E5E5E4] shadow-sm">
                        <p className="text-[13px] font-medium italic leading-relaxed text-[#1A1A1A]">
                          "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures."
                        </p>
                        <p className="text-[11px] text-[#8B9D83] mt-3 font-bold">— Psalm 23:1-2</p>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-3">Topic Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Provision', 'Guidance', 'Peace', 'Scripture'].map(tag => (
                          <span key={tag} className="px-3 py-1.5 bg-white border border-[#E5E5E4] rounded-full text-[10px] font-bold text-[#6B6B6B] hover:border-[#8B9D83] cursor-pointer transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-3">Past Messages</h4>
                      <div className="space-y-4">
                        {MOCK_SERMONS.map(s => (
                          <div key={s.id} className="group cursor-pointer">
                            <p className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#8B9D83] transition-colors leading-snug">{s.title}</p>
                            <p className="text-[10px] text-[#BDBDBD] font-medium mt-1 uppercase tracking-tight">{s.date} • {s.churchName}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default App;
