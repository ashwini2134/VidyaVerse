import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { authFetch } from '../authClient';
import { 
  Trophy, 
  Flame, 
  BookOpen, 
  Code, 
  Search,
  Users,
  Copy,
  Check,
  ChevronDown,
  Lightbulb,
  Megaphone,
  User,
  ArrowRight,
  X
} from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
  streak: number;
  longestStreak: number;
  problemsSolved: number;
  coursesCompleted: number;
  projectsCompleted: number;
  score: number;
  allTimeXp: number;
  rankTitle: string;
  rankMovement: string;
}

interface CurrentUserCard {
  rank: number;
  totalLearners: number;
  score: number;
  allTimeXp: number;
  streak: number;
  longestStreak: number;
  problemsSolved: number;
  coursesCompleted: number;
  projectsCompleted: number;
  rankTitle: string;
  currentTitle: string;
  nextTitle: string | null;
  nextThreshold: number;
  progressPercent: number;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  totalLearners: number;
  currentUser: CurrentUserCard | null;
}

function getInitials(name: string) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [totalLearners, setTotalLearners] = useState(0);
  const [currentUserCard, setCurrentUserCard] = useState<CurrentUserCard | null>(null);
  
  const [timeframe, setTimeframe] = useState<'all-time' | 'weekly' | 'monthly'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showRankingDetails, setShowRankingDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [myInviteCode, setMyInviteCode] = useState('');
  
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemCodeInput, setRedeemCodeInput] = useState('');
  const [redeemError, setRedeemError] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    
    authFetch<LeaderboardResponse>(`/progress/leaderboard?timeframe=${timeframe}`)
      .then(data => {
        if (!active) return;
        setEntries(data.leaderboard ?? []);
        setTotalLearners(data.totalLearners ?? 0);
        setCurrentUserCard(data.currentUser ?? null);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Failed to fetch leaderboard:', err);
        if (active) setLoading(false);
      });
      
    authFetch<{code: string}>(`/invites/code`)
      .then(data => {
        if (!active) return;
        setMyInviteCode(data.code);
      })
      .catch(err => console.warn('Failed to fetch invite code:', err));
      
    return () => {
      active = false;
    };
  }, [timeframe, user]);

  const filteredEntries = entries.filter(entry => 
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyCode = () => {
    if (!myInviteCode) return;
    navigator.clipboard.writeText(myInviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = async () => {
    if (!redeemCodeInput.trim()) return;
    setRedeeming(true);
    setRedeemError('');
    setRedeemSuccess('');
    try {
      await authFetch('/invites/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: redeemCodeInput.trim() })
      });
      setRedeemSuccess('Code successfully redeemed!');
      setTimeout(() => {
        setShowRedeemModal(false);
        setRedeemCodeInput('');
        setRedeemSuccess('');
      }, 2000);
    } catch (err: any) {
      setRedeemError(err.message || 'Failed to redeem code');
    } finally {
      setRedeeming(false);
    }
  };
  
  // Pad empty rows to ensure minimum of 5
  const displayEntries = [...filteredEntries];
  while (displayEntries.length < 5 && searchQuery === '') {
    displayEntries.push({ _isEmptySlot: true } as any);
  }

  return (
    <div className="min-h-screen bg-white text-[#111827] pb-16 font-sans">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 pt-8">
        
        {/* Breadcrumb */}
        <nav className="text-sm text-[#6b7280] mb-6">
          <button onClick={() => navigate('/dashboard')} className="hover:text-[#111827] transition-colors bg-transparent border-0 cursor-pointer">Dashboard</button> / Leaderboard
        </nav>
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-[12px] bg-[#eaf7f3] text-[#12564f]">
              <Trophy size={24} />
            </div>
            <div>
              <h1 className="text-[24px] font-bold text-[#111827] leading-none mb-1.5">Leaderboard</h1>
              <p className="text-[13.5px] text-[#6b7280]">Learn. Build. Compete. Improve every day.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-[#e8ebea] rounded-full px-3 py-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#22a06b]"></span>
              <span className="text-sm font-medium text-[#6b7280]">
                {totalLearners === 1 ? '1 active learner' : `${totalLearners} active learners`}
              </span>
            </div>
            <button onClick={() => setShowRedeemModal(true)} className="flex items-center gap-2 bg-white hover:bg-slate-50 text-[#111827] border border-[#e8ebea] rounded-[9px] px-4 py-2 text-sm font-medium transition-colors cursor-pointer">
              Redeem Code
            </button>
            <button onClick={handleCopyCode} className="flex items-center gap-2 bg-[#16a394] hover:bg-[#128a7d] text-white rounded-[9px] px-4 py-2 text-sm font-medium transition-colors cursor-pointer border-0">
              <Users size={16} /> Invite learners
            </button>
          </div>
        </div>

        {/* Invite Code Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-dashed border-[#d1d5db] rounded-[12px] p-4 mb-8 gap-4">
          <span className="text-sm text-[#4b5563] text-center sm:text-left">Share this code so classmates can join the board:</span>
          <button 
            onClick={handleCopyCode}
            disabled={!myInviteCode}
            className="flex items-center gap-2 bg-[#eaf7f3] hover:bg-[#d6f0e9] text-[#12564f] rounded-[8px] px-3 py-1.5 transition-colors group cursor-pointer border-0 disabled:opacity-50"
          >
            <span className="font-mono font-bold text-sm">{myInviteCode || 'Loading...'}</span>
            {copied ? <Check size={14} className="text-[#22a06b]" /> : <Copy size={14} className="opacity-70 group-hover:opacity-100" />}
          </button>
        </div>

        {/* Hero Card */}
        {currentUserCard ? (
          <div className="bg-white border border-[#e8ebea] rounded-[16px] shadow-sm mb-8 overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Side */}
              <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-5">
                <div className="w-16 h-16 rounded-full bg-[#eaf7f3] text-[#16a394] flex items-center justify-center text-2xl font-bold flex-shrink-0 overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(user?.name || 'User')
                  )}
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 mb-1.5 mt-2 md:mt-0">
                    <h2 className="text-xl font-bold text-[#111827]">{user?.name || 'Your Profile'}</h2>
                    <span className="bg-[#eaf7f3] text-[#16a394] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {currentUserCard.rankTitle}
                    </span>
                  </div>
                  <p className="text-sm text-[#6b7280]">
                    Rank #{currentUserCard.rank} &middot; {currentUserCard.rank === 1 ? 'First learner on the board' : `Top ${Math.max(1, Math.ceil((currentUserCard.rank / currentUserCard.totalLearners) * 100))}%`}
                  </p>
                </div>
              </div>

              {/* Right Side (XP Ring) */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-[#f3f4f6] stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                    <circle className="text-[#16a394] stroke-current" strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * currentUserCard.progressPercent) / 100}></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[15px] font-bold text-[#111827] leading-none">{currentUserCard.score}</span>
                    <span className="text-[10px] font-bold text-[#6b7280] leading-none mt-1">XP</span>
                    {timeframe !== 'all-time' && (
                      <span className="text-[8px] text-[#9ca3af] leading-none mt-0.5">{currentUserCard.allTimeXp} lifetime</span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-[#6b7280] mt-2">
                  {currentUserCard.progressPercent}% to {currentUserCard.nextTitle || 'Max Rank'}
                </span>
              </div>
            </div>
            
            <div className="border-t border-[#e8ebea] bg-white">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-6 text-center divide-x-0 md:divide-x divide-y md:divide-y-0 divide-[#e8ebea]">
                <div className="flex flex-col items-center p-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border border-[#e8ebea] mb-2 group hover:bg-[#16a394] hover:border-[#16a394] transition-colors duration-150 ease-in-out cursor-default">
                    <Flame size={16} className="text-[#6b7280] group-hover:text-white transition-colors duration-150 ease-in-out" strokeWidth={1.5} />
                  </div>
                  <span className="font-bold text-lg text-[#111827] leading-none mb-1">{currentUserCard.streak}</span>
                  <span className="text-xs text-[#6b7280]">Day streak</span>
                </div>
                <div className="flex flex-col items-center p-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border border-[#e8ebea] mb-2 group hover:bg-[#16a394] hover:border-[#16a394] transition-colors duration-150 ease-in-out cursor-default">
                    <Check size={16} className="text-[#6b7280] group-hover:text-white transition-colors duration-150 ease-in-out" strokeWidth={1.5} />
                  </div>
                  <span className="font-bold text-lg text-[#111827] leading-none mb-1">{currentUserCard.problemsSolved}</span>
                  <span className="text-xs text-[#6b7280]">Problems</span>
                </div>
                <div className="flex flex-col items-center p-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border border-[#e8ebea] mb-2 group hover:bg-[#16a394] hover:border-[#16a394] transition-colors duration-150 ease-in-out cursor-default">
                    <BookOpen size={16} className="text-[#6b7280] group-hover:text-white transition-colors duration-150 ease-in-out" strokeWidth={1.5} />
                  </div>
                  <span className="font-bold text-lg text-[#111827] leading-none mb-1">{currentUserCard.coursesCompleted}</span>
                  <span className="text-xs text-[#6b7280]">Courses</span>
                </div>
                <div className="flex flex-col items-center p-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border border-[#e8ebea] mb-2 group hover:bg-[#16a394] hover:border-[#16a394] transition-colors duration-150 ease-in-out cursor-default">
                    <Code size={16} className="text-[#6b7280] group-hover:text-white transition-colors duration-150 ease-in-out" strokeWidth={1.5} />
                  </div>
                  <span className="font-bold text-lg text-[#111827] leading-none mb-1">{currentUserCard.projectsCompleted}</span>
                  <span className="text-xs text-[#6b7280]">Projects</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          !loading && user && (
            <div className="mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-sm text-slate-500">
              Profile metrics loading...
            </div>
          )
        )}

        {/* Standings Card */}
        <div className="bg-white border border-[#e8ebea] rounded-[16px] shadow-sm mb-8 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 border-b border-[#e8ebea] gap-4">
            <div className="flex items-center gap-6 text-sm w-full md:w-auto overflow-x-auto">
              {(['all-time', 'weekly', 'monthly'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setTimeframe(tab)}
                  className={`capitalize pb-2 border-b-2 transition-colors font-bold border-0 bg-transparent cursor-pointer whitespace-nowrap ${
                    timeframe === tab ? 'border-[#16a394] text-[#12564f]' : 'border-transparent text-[#6b7280] hover:text-[#111827]'
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input 
                type="text" 
                placeholder="Search learners..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f9fafb] border border-[#e8ebea] text-sm text-[#111827] rounded-[9px] pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#16a394]/20 focus:border-[#16a394] transition-all"
              />
            </div>
          </div>
          
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-[#111827] font-bold text-xs uppercase tracking-wider bg-white">
                <tr>
                  <th className="px-6 py-4 w-24">Rank</th>
                  <th className="px-6 py-4">Learner</th>
                  <th className="px-6 py-4 text-right">XP</th>
                  <th className="px-6 py-4 text-right">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8ebea]">
                {loading ? (
                   [1, 2, 3, 4, 5].map(i => (
                    <tr key={i}>
                      <td className="px-6 py-4" colSpan={4}>
                        <div className="h-8 bg-slate-100 animate-pulse rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : displayEntries.map((entry: any, index) => {
                  if (entry._isEmptySlot) {
                    return (
                      <tr key={`empty-${index}`} className="hover:bg-[#f9fafb]/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-8 h-8 rounded-full bg-[#f3f4f6] text-[#9ca3af] flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#f3f4f6] text-[#9ca3af] flex items-center justify-center">
                              <User size={16} />
                            </div>
                            <span className="text-[#9ca3af] font-medium">Open slot</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-[#9ca3af]">--</td>
                        <td className="px-6 py-4 text-right text-[#9ca3af]">--</td>
                      </tr>
                    );
                  }

                  const isYou = entry.email === user?.email;
                  return (
                    <tr 
                      key={entry.id} 
                      onClick={() => navigate('/profile/' + entry.id)}
                      className={`cursor-pointer transition-colors ${isYou ? 'bg-[#eaf7f3]/50 hover:bg-[#eaf7f3]' : 'hover:bg-[#f9fafb]'}`}
                    >
                      <td className="px-6 py-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          entry.rank === 1 ? 'bg-[#e0a52c] text-white' : 'bg-[#f3f4f6] text-[#6b7280]'
                        }`}>
                          {entry.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white overflow-hidden ${
                            entry.avatarUrl ? '' : `bg-[#16a394]`
                          }`}>
                            {entry.avatarUrl ? (
                              <img src={entry.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              getInitials(entry.name)
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-bold text-[#111827]">{entry.name}</span>
                            {isYou && (
                              <span className="text-[10px] font-bold bg-[#eaf7f3] text-[#16a394] px-2 py-0.5 rounded-full inline-block">
                                {entry.rankTitle}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-[#6b7280] font-medium">{entry.score} XP</td>
                      <td className="px-6 py-4 text-right text-[#6b7280] font-medium">{entry.streak} days</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 md:p-6 border-t border-[#e8ebea]">
            <button className="w-full flex items-center justify-center gap-2 border border-[#e8ebea] hover:bg-[#f9fafb] text-[#111827] font-semibold text-sm rounded-[9px] py-3 transition-colors bg-white cursor-pointer">
              View full leaderboard <ArrowRight size={16} className="text-[#6b7280]" />
            </button>
          </div>
        </div>

        {/* Tip Card */}
        <div className="bg-[#eaf7f3] border border-[#16a394]/20 rounded-[16px] overflow-hidden mb-6 transition-all duration-300">
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-[#12564f]">
                <Lightbulb size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#12564f] text-sm">Want to know how rankings work?</h3>
                <p className="text-xs text-[#12564f]/70 mt-0.5">Click to see scoring, badges and tips.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowRankingDetails(!showRankingDetails)}
              className="flex-shrink-0 flex items-center justify-center gap-2 bg-white hover:bg-white/80 text-[#12564f] font-semibold text-sm px-4 py-2 rounded-[9px] border border-[#16a394]/20 transition-colors cursor-pointer w-full sm:w-auto"
            >
              Show me <ChevronDown size={16} className={`transition-transform ${showRankingDetails ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {showRankingDetails && (
            <div className="px-6 pb-6 pt-2 border-t border-[#16a394]/10">
               <p className="text-xs text-[#12564f]/80 mb-4 leading-relaxed">
                VIDYAVERSE rankings are computed dynamically using a strict hierarchy to reward consistent learning and capstone achievements.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "1. Timeframe or Overall XP", desc: "Highest XP earned within the selected period." },
                  { title: "2. Consistency / Current Streak", desc: "Higher learning consistency breaks XP ties." },
                  { title: "3. Coding Problems Solved", desc: "More coding exercises solved breaks streak ties." },
                  { title: "4. Courses Completed", desc: "More completed modules breaks problem ties." },
                  { title: "5. Projects Completed", desc: "More completed capstone projects breaks course ties." },
                  { title: "6. Join Date", desc: "Earlier registration date wins if all metrics are equal." }
                ].map((rule, idx) => (
                  <div key={idx} className="p-3 bg-white/60 rounded-xl border border-[#16a394]/5">
                    <p className="text-xs font-bold text-[#12564f]">{rule.title}</p>
                    <p className="text-[11px] text-[#12564f]/70 mt-1">{rule.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-white border border-[#e8ebea] rounded-[12px] p-4 mb-10 text-center sm:text-left">
          <Megaphone size={18} className="text-[#16a394] flex-shrink-0" />
          <p className="text-sm text-[#6b7280]">Keep learning consistently to earn XP and climb the leaderboard!</p>
        </div>

      </div>

      {/* Redeem Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-[#111827]/40 flex items-center justify-center z-50 p-4" onClick={() => setShowRedeemModal(false)}>
          <div className="bg-white rounded-[16px] w-full max-w-sm p-6 shadow-xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowRedeemModal(false)} className="absolute top-4 right-4 text-[#9ca3af] hover:text-[#4b5563] bg-transparent border-0 cursor-pointer">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Redeem Invite Code</h3>
            <p className="text-sm text-[#6b7280] mb-4">Enter a code from a classmate to join their network.</p>
            
            <input 
              type="text" 
              value={redeemCodeInput}
              onChange={e => setRedeemCodeInput(e.target.value.toUpperCase())}
              placeholder="FRAY-XXXX-XXXX"
              className="w-full bg-[#f9fafb] border border-[#e8ebea] text-[#111827] font-mono text-center rounded-[9px] px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#16a394]/20 focus:border-[#16a394] transition-all uppercase"
            />

            {redeemError && <p className="text-xs text-red-500 mb-4 text-center">{redeemError}</p>}
            {redeemSuccess && <p className="text-xs text-[#22a06b] mb-4 text-center font-medium">{redeemSuccess}</p>}

            <button 
              onClick={handleRedeem}
              disabled={redeeming || !redeemCodeInput.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#16a394] hover:bg-[#128a7d] text-white rounded-[9px] px-4 py-3 text-sm font-bold transition-colors cursor-pointer border-0 disabled:opacity-50"
            >
              {redeeming ? 'Redeeming...' : 'Redeem Code'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
