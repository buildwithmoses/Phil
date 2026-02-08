
import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, Plus, Check, Users, MapPin, Calendar, Church as ChurchIcon, ArrowLeft, Filter, Sparkles } from 'lucide-react';
import { Church, SmallGroup } from '../types';
import { VICTORY_CHURCHES, SMALL_GROUPS_CATALOG } from '../constants';

interface DiscoverProps {
  followedIds: Set<string>;
  joinedGroupIds: Set<string>;
  onToggleFollow: (id: string) => void;
  onToggleJoinGroup: (id: string) => void;
  onBack: () => void;
}

const Discover: React.FC<DiscoverProps> = ({ 
  followedIds, 
  joinedGroupIds, 
  onToggleFollow, 
  onToggleJoinGroup, 
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'churches' | 'groups'>('churches');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Track scroll for collapsing header effect
  const { scrollY } = useScroll({
    container: scrollRef
  });

  // Transform values for the collapsing hero
  const heroOpacity = useTransform(scrollY, [0, 150], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 150], [1, 0.8]);
  const heroHeight = useTransform(scrollY, [0, 150], ["auto", "0px"]);
  const heroPadding = useTransform(scrollY, [0, 150], ["40px", "0px"]);
  const searchBarY = useTransform(scrollY, [0, 150], [0, -20]);

  const filteredChurches = useMemo(() => {
    return VICTORY_CHURCHES.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredGroups = useMemo(() => {
    return SMALL_GROUPS_CATALOG.filter(g => 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.focus.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col h-full bg-[#FAFAF9] overflow-hidden"
    >
      {/* Fixed Navigation Header */}
      <div className="h-16 border-b border-[#E5E5E4] px-4 md:px-6 flex items-center justify-between bg-white z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-[#FAFAF9] rounded-full transition-colors text-[#6B6B6B]"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A] hidden sm:block">Discovery</h2>
        </div>
        
        <div className="flex bg-[#FAFAF9] p-1 rounded-full border border-[#E5E5E4] shadow-inner">
          <button
            onClick={() => setActiveTab('churches')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
              activeTab === 'churches' 
                ? 'bg-white shadow-sm text-[#1A1A1A] border border-[#E5E5E4]' 
                : 'text-[#BDBDBD] hover:text-[#1A1A1A]'
            }`}
          >
            Churches
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
              activeTab === 'groups' 
                ? 'bg-white shadow-sm text-[#1A1A1A] border border-[#E5E5E4]' 
                : 'text-[#BDBDBD] hover:text-[#1A1A1A]'
            }`}
          >
            Groups
          </button>
        </div>
      </div>

      {/* Main Content Area with scroll listener */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar bg-[#FAFAF9] relative"
      >
        {/* Collapsing Hero Section */}
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, height: heroHeight, paddingTop: heroPadding, paddingBottom: heroPadding }}
          className="px-6 bg-white overflow-hidden flex flex-col items-center justify-center text-center"
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 bg-[#8B9D83]/10 rounded-2xl flex items-center justify-center text-[#8B9D83] mx-auto mb-2 shadow-sm">
              <Sparkles size={24} />
            </div>
            <h1 className="text-4xl font-black text-[#1A1A1A] tracking-tighter">Find your tribe.</h1>
            <p className="text-[#6B6B6B] text-sm font-medium max-w-sm mx-auto">
              Follow teaching from churches or join a focused community group.
            </p>
          </div>
        </motion.div>

        {/* Sticky Search Bar Container */}
        <div className="sticky top-0 z-20 px-4 md:px-6 py-4 bg-[#FAFAF9]/80 backdrop-blur-md border-b border-[#E5E5E4]/50">
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BDBDBD] group-focus-within:text-[#8B9D83] transition-colors" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'churches' ? 'churches' : 'interests'}...`}
              className="w-full bg-white border border-[#E5E5E4] rounded-[1.25rem] py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#8B9D83]/5 focus:border-[#8B9D83]/30 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Results List */}
        <div className="px-4 md:px-6 py-6 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'churches' ? (
                <motion.div 
                  key="churches"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {filteredChurches.map((church) => (
                    <div
                      key={church.id}
                      className="bg-white border border-[#E5E5E4] p-5 rounded-[2rem] flex items-center justify-between hover:shadow-xl hover:shadow-[#8B9D83]/5 transition-all group"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="relative shrink-0">
                          <img src={church.logo} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-sm ring-1 ring-black/5" />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: church.color }} />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-[#1A1A1A] truncate">{church.name}</h4>
                          <p className="text-[9px] text-[#BDBDBD] font-black uppercase tracking-widest mt-0.5 truncate">
                            {church.lastSermon || 'Community'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onToggleFollow(church.id)}
                        className={`shrink-0 p-3 rounded-full transition-all border ${
                          followedIds.has(church.id)
                            ? 'bg-[#8B9D83] text-white border-transparent shadow-lg shadow-[#8B9D83]/20'
                            : 'bg-white border-[#E5E5E4] text-[#BDBDBD] hover:text-[#8B9D83] hover:border-[#8B9D83]'
                        }`}
                      >
                        {followedIds.has(church.id) ? <Check size={18} strokeWidth={3} /> : <Plus size={18} />}
                      </button>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="groups"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {filteredGroups.map((group) => {
                    const church = VICTORY_CHURCHES.find(c => c.id === group.churchId)!;
                    const isFollowingChurch = followedIds.has(group.churchId);
                    
                    return (
                      <div
                        key={group.id}
                        className={`
                          bg-white border border-[#E5E5E4] p-6 rounded-[2rem] flex flex-col justify-between hover:shadow-xl transition-all relative overflow-hidden group
                          ${!isFollowingChurch ? 'opacity-60 bg-gray-50' : ''}
                        `}
                      >
                        <div className="absolute top-6 right-6">
                          <img src={church.logo} className="w-8 h-8 rounded-lg object-cover ring-2 ring-white shadow-sm" alt="" />
                        </div>
                        
                        <div className="mb-6">
                          <h4 className="font-black text-[15px] text-[#1A1A1A] pr-10 mb-3 leading-tight tracking-tight">{group.name}</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">
                              <Calendar size={14} className="text-[#8B9D83]" />
                              {group.meetingTime}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">
                              <MapPin size={14} className="text-[#8B9D83]" />
                              {group.location}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onToggleJoinGroup(group.id)}
                          disabled={!isFollowingChurch}
                          className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                            joinedGroupIds.has(group.id)
                              ? 'bg-[#FAFAF9] text-[#BDBDBD] border border-[#E5E5E4]'
                              : isFollowingChurch 
                                ? 'bg-[#8B9D83] text-white shadow-lg shadow-[#8B9D83]/20 hover:scale-[1.02] active:scale-95'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {joinedGroupIds.has(group.id) ? (
                            <span className="flex items-center justify-center gap-2"><Check size={14} strokeWidth={4} /> Joined</span>
                          ) : !isFollowingChurch ? (
                            'Follow church first'
                          ) : (
                            'Join Community'
                          )}
                        </button>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {(activeTab === 'churches' ? filteredChurches : filteredGroups).length === 0 && (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#E5E5E4] mx-auto mb-4 text-[#BDBDBD]">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A]">No results found</h3>
                <p className="text-sm text-[#6B6B6B] max-w-xs mx-auto mt-1">
                  We couldn't find anything matching your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Discover;
