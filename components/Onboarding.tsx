
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Check, ArrowRight, Sparkles, MapPin, User, ChevronRight, Users, Calendar, Filter } from 'lucide-react';
import { Church, SmallGroup } from '../types';
import { VICTORY_CHURCHES, SMALL_GROUPS_CATALOG } from '../constants';

interface OnboardingProps {
  onComplete: (followedChurches: Church[], joinedGroups: SmallGroup[]) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [joinedGroupIds, setJoinedGroupIds] = useState<Set<string>>(new Set());
  const [groupFilter, setGroupFilter] = useState<'all' | string>('all');

  const followedChurches = useMemo(() => VICTORY_CHURCHES.filter(c => followedIds.has(c.id)), [followedIds]);
  const joinedGroups = useMemo(() => SMALL_GROUPS_CATALOG.filter(g => joinedGroupIds.has(g.id)), [joinedGroupIds]);

  const toggleFollow = (id: string) => {
    const next = new Set(followedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFollowedIds(next);
  };

  const toggleJoinGroup = (id: string) => {
    const next = new Set(joinedGroupIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setJoinedGroupIds(next);
  };

  const filteredGroups = useMemo(() => {
    if (groupFilter === 'all') {
      return SMALL_GROUPS_CATALOG.filter(g => followedIds.has(g.churchId));
    }
    return SMALL_GROUPS_CATALOG.filter(g => g.churchId === groupFilter);
  }, [groupFilter, followedIds]);

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const currentProgress = (step / 4) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF9F6] flex flex-col">
      {/* Sticky Progress Bar */}
      <div className="sticky top-0 bg-[#FAF9F6] pt-10 pb-6 px-6 z-30 flex flex-col items-center border-b border-[#E5E5E4]">
        <div className="max-w-[700px] w-full flex flex-col items-center gap-3">
          <div className="w-full h-1.5 bg-[#E5E5E4] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${currentProgress}%` }}
              className="h-full bg-[#8B9D83] transition-all duration-500"
            />
          </div>
          <span className="text-[10px] font-bold text-[#BDBDBD] tracking-widest uppercase">Step {step} of 4</span>
        </div>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
        <div className="max-w-[700px] mx-auto w-full pb-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center pt-8"
              >
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-sm border border-[#E5E5E4] mx-auto mb-10">
                  <BookOpen size={48} className="text-[#8B9D83]" />
                </div>
                <h1 className="text-5xl font-bold tracking-tight mb-4 text-[#1A1A1A]">Ask. Learn. Grow.</h1>
                <p className="text-xl text-[#6B6B6B] leading-relaxed mb-4 max-w-md mx-auto">
                  Get answers to your faith questions and connect with community.
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full pt-4"
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-3 text-[#1A1A1A]">Follow churches you trust</h2>
                  <p className="text-[#6B6B6B]">We'll ground your answers in teaching from pastors you respect</p>
                </div>

                <div className="relative mb-8 sticky top-0 bg-[#FAF9F6] py-2 z-20">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#BDBDBD]" size={20} />
                  <input
                    type="text"
                    placeholder="Search for other churches..."
                    className="w-full bg-white border border-[#E5E5E4] rounded-2xl py-5 pl-14 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#8B9D83]/20 transition-all shadow-sm"
                    readOnly
                  />
                </div>

                <div className="space-y-4">
                  {VICTORY_CHURCHES.map((church) => (
                    <div
                      key={church.id}
                      className="bg-white border border-[#E5E5E4] p-5 rounded-3xl flex items-center justify-between hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <img src={church.logo} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: church.color }} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-[#1A1A1A]">{church.name}</h4>
                          <p className="text-sm text-[#BDBDBD] flex items-center gap-1.5 mt-0.5 font-medium">
                            <User size={14} className="text-[#6B6B6B]" /> {church.lastSermon}
                          </p>
                          {church.groupCount ? (
                            <button 
                              onClick={() => {
                                toggleFollow(church.id);
                                setGroupFilter(church.id);
                                setStep(3);
                              }}
                              className="text-[11px] font-bold mt-2 px-2 py-0.5 rounded-full bg-[#FAFAF9] text-[#8B9D83] border border-[#8B9D83]/10 hover:bg-[#8B9D83]/5 transition-colors flex items-center gap-1"
                            >
                              <Users size={12} />
                              {church.groupCount} small groups available
                            </button>
                          ) : null}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFollow(church.id)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                          followedIds.has(church.id)
                            ? 'bg-[#8B9D83] text-white'
                            : 'bg-white border border-[#E5E5E4] text-[#1A1A1A] hover:border-[#8B9D83]'
                        }`}
                      >
                        {followedIds.has(church.id) ? (
                          <span className="flex items-center gap-1.5"><Check size={16} strokeWidth={3} /> Following</span>
                        ) : (
                          'Follow'
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full pt-4"
              >
                <div className="text-center mb-10 sticky top-0 bg-[#FAF9F6] py-2 z-20">
                  <h2 className="text-3xl font-bold mb-3 text-[#1A1A1A]">Find your people</h2>
                  <p className="text-[#6B6B6B] mb-6">Join small groups from the churches you're following</p>
                  
                  {/* Filter Tabs - Sticky too */}
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar justify-center">
                    <button
                      onClick={() => setGroupFilter('all')}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                        groupFilter === 'all'
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-white text-[#6B6B6B] border-[#E5E5E4] hover:border-[#BDBDBD]'
                      }`}
                    >
                      All Groups
                    </button>
                    {followedChurches.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setGroupFilter(c.id)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                          groupFilter === c.id
                            ? 'text-white border-transparent shadow-md'
                            : 'bg-white text-[#6B6B6B] border-[#E5E5E4] hover:border-[#BDBDBD]'
                        }`}
                        style={{ backgroundColor: groupFilter === c.id ? c.color : undefined }}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => {
                      const church = VICTORY_CHURCHES.find(c => c.id === group.churchId)!;
                      return (
                        <motion.div
                          layout
                          key={group.id}
                          className="bg-white border border-[#E5E5E4] p-5 rounded-3xl flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
                        >
                          <div className="absolute top-4 right-4">
                            <div className="w-8 h-8 rounded-lg border-2 border-white shadow-sm flex items-center justify-center overflow-hidden" style={{ backgroundColor: church.color }}>
                              <img src={church.logo} className="w-full h-full object-cover opacity-50" />
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-bold text-base text-[#1A1A1A] pr-10 mb-2 leading-tight">{group.name}</h4>
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-[11px] font-semibold text-[#6B6B6B]">
                                <Calendar size={12} className="text-[#8B9D83]" />
                                {group.meetingTime}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] font-semibold text-[#6B6B6B]">
                                <MapPin size={12} className="text-[#8B9D83]" />
                                {group.location}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] font-semibold text-[#6B6B6B]">
                                <Users size={12} className="text-[#8B9D83]" />
                                {group.members} members
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-6">
                              {group.focus.map(f => (
                                <span key={f} className="px-2 py-0.5 rounded-md bg-[#FAFAF9] border border-[#E5E5E4] text-[9px] font-bold text-[#6B6B6B] uppercase tracking-wider">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => toggleJoinGroup(group.id)}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                              joinedGroupIds.has(group.id)
                                ? 'bg-gray-100 text-gray-500'
                                : 'bg-[#8B9D83] text-white shadow-lg shadow-[#8B9D83]/10 hover:shadow-[#8B9D83]/20'
                            }`}
                          >
                            {joinedGroupIds.has(group.id) ? (
                              <span className="flex items-center justify-center gap-1.5"><Check size={14} strokeWidth={3} /> Joined</span>
                            ) : (
                              'Join Group'
                            )}
                          </button>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-12 text-center bg-white border border-dashed border-[#E5E5E4] rounded-3xl">
                      <p className="text-[#BDBDBD] font-medium">No groups found for this filter.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center pt-8"
              >
                <div className="w-24 h-24 bg-[#8B9D83] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-[#8B9D83]/30 mx-auto mb-10 text-white">
                  <Check size={48} strokeWidth={3} />
                </div>
                <h2 className="text-4xl font-bold mb-3 text-[#1A1A1A]">You're all set!</h2>
                
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex -space-x-3">
                      {followedChurches.slice(0, 3).map(c => (
                        <img key={c.id} src={c.logo} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                      ))}
                      {followedChurches.length > 3 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-[#6B6B6B]">
                          +{followedChurches.length - 3}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">Following {followedChurches.length} churches</p>
                  </div>
                  
                  {joinedGroups.length > 0 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#8B9D83]/10 flex items-center justify-center text-[#8B9D83]">
                        <Users size={20} />
                      </div>
                      <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">Joined {joinedGroups.length} group{joinedGroups.length > 1 ? 's' : ''}</p>
                    </div>
                  )}
                </div>

                <p className="text-[#6B6B6B] font-medium mb-6">Try asking a question like:</p>

                <div className="grid gap-4">
                  {[
                    "What does Victory teach about anxiety?",
                    "How can I build better habits?",
                    "What does the Bible say about purpose?"
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onComplete(followedChurches, joinedGroups);
                      }}
                      className="p-5 bg-white border border-[#E5E5E4] rounded-2xl text-left text-sm font-bold text-[#1A1A1A] hover:border-[#8B9D83] hover:shadow-md transition-all flex items-center justify-between group"
                    >
                      <span>{q}</span>
                      <ChevronRight size={18} className="text-[#BDBDBD] group-hover:text-[#8B9D83] transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-0 bg-[#FAF9F6] pt-6 pb-12 px-6 z-30 border-t border-[#E5E5E4] shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-[700px] mx-auto w-full">
          <div className="flex flex-col items-center gap-4">
            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#8B9D83] text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-[#8B9D83]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight size={22} />
              </button>
            ) : step === 2 ? (
              <div className="w-full space-y-4">
                <button
                  onClick={() => setStep(3)}
                  disabled={followedIds.size === 0}
                  className={`w-full py-5 rounded-2xl font-bold text-lg transition-all ${
                    followedIds.size > 0
                      ? 'bg-[#8B9D83] text-white shadow-xl shadow-[#8B9D83]/20 hover:scale-[1.01]'
                      : 'bg-[#E5E5E4] text-[#BDBDBD] cursor-not-allowed'
                  }`}
                >
                  Continue ({followedIds.size} followed)
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-full text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
                >
                  I'll do this later
                </button>
              </div>
            ) : step === 3 ? (
              <div className="w-full space-y-4">
                <button
                  onClick={() => setStep(4)}
                  className="w-full bg-[#1A1A1A] text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-black/10 flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  Continue
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="text-sm font-bold text-[#8B9D83] hover:underline transition-all"
                >
                  Skip for now
                </button>
              </div>
            ) : (
              <button
                onClick={() => onComplete(followedChurches, joinedGroups)}
                className="w-full bg-[#8B9D83] text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-[#8B9D83]/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all"
              >
                <Sparkles size={22} />
                Start Asking Questions
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
