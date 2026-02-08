
import React, { useState } from 'react';
import { Church, MessageSquare, Plus, Settings, ChevronLeft, ChevronRight, Hash, Users, Church as ChurchIcon, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_CHURCHES } from '../constants';
import { Church as ChurchType, SmallGroup } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedChurchId: string;
  selectedGroupId?: string;
  onSelectChurch: (id: string) => void;
  onSelectGroup: (id: string) => void;
  onOpenDiscover: () => void;
  customChurches?: ChurchType[];
  joinedGroups?: SmallGroup[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  selectedChurchId, 
  selectedGroupId,
  onSelectChurch, 
  onSelectGroup,
  onOpenDiscover,
  customChurches = [], 
  joinedGroups = [] 
}) => {
  const [viewMode, setViewMode] = useState<'churches' | 'groups'>('churches');
  const allChurches = [...MOCK_CHURCHES, ...customChurches];

  return (
    <motion.div
      initial={false}
      animate={isOpen ? { x: 0, width: 280 } : { x: '-100%', width: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`
        fixed left-0 top-0 bottom-0 z-50 lg:relative lg:z-20
        bg-white border-r border-[#E5E5E4] h-full overflow-hidden flex flex-col shadow-xl lg:shadow-none
      `}
    >
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#8B9D83] flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <h1 className="font-semibold text-xl tracking-tight text-[#1A1A1A]">Phil</h1>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-[#BDBDBD] hover:text-[#1A1A1A]">
          <X size={20} />
        </button>
      </div>

      {/* Discovery / Action Section */}
      <div className="px-4 mb-4">
        <button 
          onClick={onOpenDiscover}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#8B9D83]/5 border border-[#8B9D83]/10 hover:bg-[#8B9D83]/10 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#8B9D83] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Sparkles size={14} />
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-[11px] font-bold text-[#1A1A1A] truncate">Explore Community</p>
            <p className="text-[9px] text-[#8B9D83] font-bold uppercase tracking-wider">Find more</p>
          </div>
        </button>
      </div>

      {/* Navigation Toggle */}
      <div className="px-4 mb-6">
        <div className="bg-[#FAFAF9] p-1 rounded-xl flex border border-[#E5E5E4]">
          <button
            onClick={() => setViewMode('churches')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'churches' 
                ? 'bg-white shadow-sm text-[#1A1A1A] border border-[#E5E5E4]' 
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            <ChurchIcon size={14} />
            <span className="truncate">Churches</span>
          </button>
          <button
            onClick={() => setViewMode('groups')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'groups' 
                ? 'bg-white shadow-sm text-[#1A1A1A] border border-[#E5E5E4]' 
                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            <Users size={14} />
            <span className="truncate">Groups</span>
          </button>
        </div>
      </div>

      {/* Scrollable List Area */}
      <div className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar pb-8">
        <div>
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="text-[10px] font-bold text-[#BDBDBD] uppercase tracking-[0.1em]">
              {viewMode === 'churches' ? 'Following' : 'My Groups'}
            </h3>
            <button onClick={onOpenDiscover} className="text-[#BDBDBD] hover:text-[#8B9D83] transition-colors">
              <Plus size={14} />
            </button>
          </div>
          
          <div className="space-y-0.5">
            <AnimatePresence mode="wait">
              {viewMode === 'churches' ? (
                <motion.div
                  key="churches-list"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-0.5"
                >
                  {allChurches.map((church) => (
                    <button
                      key={church.id}
                      onClick={() => onSelectChurch(church.id)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                        selectedChurchId === church.id && !selectedGroupId 
                          ? 'bg-[#8B9D83]/5 ring-1 ring-[#8B9D83]/10 shadow-sm' 
                          : 'hover:bg-[#FAFAF9]'
                      }`}
                    >
                      <img src={church.logo} alt="" className="w-8 h-8 rounded-lg object-cover shadow-sm border border-black/5" />
                      <div className="flex-1 text-left overflow-hidden">
                        <p className={`text-sm font-bold truncate ${selectedChurchId === church.id && !selectedGroupId ? 'text-[#8B9D83]' : 'text-[#1A1A1A]'}`}>
                          {church.name}
                        </p>
                        <p className="text-[9px] text-[#BDBDBD] truncate font-bold uppercase tracking-wider">{church.lastSermon || 'Community'}</p>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => onSelectChurch('general')}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                      selectedChurchId === 'general' && !selectedGroupId ? 'bg-white shadow-sm ring-1 ring-[#E5E5E4]' : 'hover:bg-[#FAFAF9]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Hash size={14} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-bold text-[#1A1A1A]">General Phil</p>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="groups-list"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-0.5"
                >
                  {joinedGroups.length > 0 ? (
                    joinedGroups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => onSelectGroup(group.id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                          selectedGroupId === group.id ? 'bg-[#8B9D83]/5 ring-1 ring-[#8B9D83]/10 shadow-sm' : 'hover:bg-[#FAFAF9]'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#8B9D83]/10 flex items-center justify-center text-[#8B9D83] shrink-0 shadow-sm">
                          <Users size={14} />
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                          <p className={`text-sm font-bold truncate ${selectedGroupId === group.id ? 'text-[#8B9D83]' : 'text-[#1A1A1A]'}`}>
                            {group.name}
                          </p>
                          <p className="text-[9px] text-[#BDBDBD] truncate font-bold uppercase tracking-wider">{group.meetingTime}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center bg-[#FAFAF9] rounded-2xl border border-dashed border-[#E5E5E4]">
                      <p className="text-[11px] text-[#BDBDBD] font-bold uppercase tracking-wider">No Groups Joined</p>
                      <button 
                        onClick={onOpenDiscover}
                        className="text-[10px] font-bold text-[#8B9D83] mt-2 underline decoration-2 underline-offset-4"
                      >
                        Browse All
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* History Area */}
        <div>
          <h3 className="text-[10px] font-bold text-[#BDBDBD] uppercase tracking-[0.1em] mb-3 px-2">History</h3>
          <div className="space-y-0.5">
            {['Theology of Art', 'The Problem of Evil', 'Hope in Suffering'].map((title, i) => (
              <button key={i} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAFAF9] text-[#6B6B6B] hover:text-[#1A1A1A] transition-all group overflow-hidden">
                <MessageSquare size={14} className="shrink-0 text-[#BDBDBD] group-hover:text-[#8B9D83]" />
                <span className="text-[13px] font-medium truncate">{title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-[#E5E5E4] bg-white sticky bottom-0">
        <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAFAF9] transition-all group">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs ring-2 ring-white shadow-sm">
            JD
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-sm font-bold text-[#1A1A1A] truncate group-hover:text-[#8B9D83] transition-colors">John Doe</p>
            <p className="text-[9px] text-[#BDBDBD] font-bold uppercase tracking-widest">Seeker Plan</p>
          </div>
          <Settings size={14} className="text-[#BDBDBD] group-hover:text-[#1A1A1A] transition-colors" />
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
