import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth';
import { getToken, authFetch, API_BASE } from '../authClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Sparkles,
  Search,
  Mic,
  MicOff,
  Send,
  BookOpen,
  Code2,
  Library,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  BookmarkCheck,
  Bot,
  User as UserIcon,
} from 'lucide-react';

interface SearchResult {
  content: string;
  metadata: {
    contentType: string;
    courseId?: string;
    lectureId?: string;
    sectionId?: string;
    sectionLabel?: string;
    title?: string;
    courseTitle?: string;
  };
  score: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: SearchResult[];
  statusText?: string;
  isError?: boolean;
}

export default function AiMentorPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I am your **AI Learning Assistant** at VIDYAVERSE.\n\nI can explain difficult concepts, create practice coding challenges, or find relevant lecture materials directly from your courses. What would you like to explore today?",
      timestamp: new Date(),
    },
  ]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assistant' | 'search'>('assistant');

  // Direct Semantic Search state
  const [directSearchQuery, setDirectSearchQuery] = useState('');
  const [directSearchResults, setDirectSearchResults] = useState<SearchResult[]>([]);
  const [directSearching, setDirectSearching] = useState(false);
  const [directSearchSubmitted, setDirectSearchSubmitted] = useState(false);
  const [directSearchError, setDirectSearchError] = useState<string | null>(null);

  // Health check state (honest, no fake green)
  const [healthStatus, setHealthStatus] = useState<{
    connected: boolean;
    checking: boolean;
    label: string;
  }>({
    connected: false,
    checking: true,
    label: 'Checking status...',
  });

  // Voice recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  // Copy state tracker
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Check service health on mount
  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_BASE}/ai-mentor/health`);
        if (!response.ok) throw new Error('Health endpoint returned status ' + response.status);
        const contentType = response.headers.get('content-type') || '';
        let data: any = {};
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          throw new Error('Health check returned non-JSON response');
        }
        if (isMounted) {
          const isQdrantOk = Boolean(data.qdrant?.connected);
          const isLyzrOk = Boolean(data.lyzr?.configured);
          if (isQdrantOk && isLyzrOk) {
            setHealthStatus({
              connected: true,
              checking: false,
              label: 'Assistant Online',
            });
          } else if (isQdrantOk || isLyzrOk) {
            setHealthStatus({
              connected: true,
              checking: false,
              label: 'Assistant Connected',
            });
          } else {
            setHealthStatus({
              connected: false,
              checking: false,
              label: 'Service Reconnecting',
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setHealthStatus({
            connected: false,
            checking: false,
            label: 'Service Connecting',
          });
        }
      }
    };

    checkHealth();
    return () => {
      isMounted = false;
    };
  }, []);

  // Voice Recognition setup
  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      return;
    }

    if (isRecording) {
      if (recognition) {
        recognition.stop();
        setRecognition(null);
      }
      setIsRecording(false);
      setInterimTranscript('');
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const newRecognition = new SpeechRecognitionClass();

    newRecognition.continuous = true;
    newRecognition.interimResults = true;
    newRecognition.lang = 'en-US';

    newRecognition.onstart = () => {
      setIsRecording(true);
      setError(null);
      setTranscript('');
      setInterimTranscript('');
    };

    newRecognition.onresult = (event: any) => {
      let finalTranscriptText = '';
      let interimTranscriptText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptText += result[0].transcript + ' ';
        } else {
          interimTranscriptText += result[0].transcript;
        }
      }

      if (finalTranscriptText) {
        setQuery((prev) => (prev ? prev + ' ' + finalTranscriptText.trim() : finalTranscriptText.trim()));
        setTranscript((prev) => prev + finalTranscriptText);
      }
      setInterimTranscript(interimTranscriptText);
    };

    newRecognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access in your browser settings.');
      } else if (event.error !== 'no-speech') {
        setError(`Microphone error: ${event.error}`);
      }
      setIsRecording(false);
      setInterimTranscript('');
    };

    newRecognition.onend = () => {
      setIsRecording(false);
      setInterimTranscript('');
    };

    setRecognition(newRecognition);
    try {
      newRecognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition', e);
      setIsRecording(false);
    }
  };

  // Handle Ask Action
  const handleAsk = async (questionText?: string) => {
    const textToSend = (questionText || query).trim();
    if (!textToSend || !user || loading) return;

    if (isRecording && recognition) {
      recognition.stop();
      setIsRecording(false);
    }

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assist-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        role: 'user',
        content: textToSend,
        timestamp: new Date(),
      },
    ]);

    setQuery('');
    setLoading(true);
    setError(null);
    setStatusMessage('Searching course materials & generating response...');

    try {
      const data = await authFetch<{
        success?: boolean;
        answer?: string;
        error?: string;
        context?: SearchResult[];
      }>('/ai-mentor/ask', {
        method: 'POST',
        body: JSON.stringify({
          query: textToSend,
        }),
      });

      if (data.success === false && !data.answer) {
        throw new Error(data.error || 'The AI assistant was unable to process this request.');
      }

      const answer = data.answer || 'I could not generate an answer at this moment. Please try asking again.';
      const sources: SearchResult[] = data.context || [];

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: answer,
          timestamp: new Date(),
          sources,
        },
      ]);
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: `I encountered an issue while generating an answer: **${errorMsg}**.\n\nPlease verify your connection or try rephrasing your question.`,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      setStatusMessage(null);
    }
  };

  // Direct Semantic Search
  const handleDirectSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = directSearchQuery.trim();
    if (!q || !user || directSearching) return;

    setDirectSearching(true);
    setDirectSearchError(null);
    setDirectSearchResults([]);
    setDirectSearchSubmitted(true);

    try {
      const data = await authFetch<{
        results?: SearchResult[];
        error?: string;
      }>('/ai-mentor/search', {
        method: 'POST',
        body: JSON.stringify({ query: q, limit: 6 }),
      });

      if (data.error) {
        throw new Error(data.error);
      }

      setDirectSearchResults(data.results || []);
    } catch (err: any) {
      setDirectSearchError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setDirectSearching(false);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          "Starting a fresh study session! What topic or course concept would you like to work on?",
        timestamp: new Date(),
      },
    ]);
    setError(null);
    setQuery('');
  };

  const toggleSources = (msgId: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  // Student Quick Action Suggestions
  const quickActions = [
    {
      icon: BookOpen,
      title: 'Learn a Concept',
      desc: 'Clear mental models & examples',
      prompt: 'Explain how while loops work in Python with an intuitive real-world analogy and syntax breakdown.',
    },
    {
      icon: Code2,
      title: 'Practise Coding',
      desc: 'Hands-on practice challenges',
      prompt: 'Give me a beginner-friendly Python coding exercise on conditional if-else statements with starter code.',
    },
    {
      icon: Library,
      title: 'Find Study Material',
      desc: 'Search course lectures & notes',
      action: () => {
        setActiveTab('search');
        setDirectSearchQuery('Python conditional statements');
      },
    },
    {
      icon: Volume2,
      title: 'Learn by Speaking',
      desc: 'Ask questions with your voice',
      action: () => {
        setActiveTab('assistant');
        if (!isRecording) {
          toggleRecording();
        }
      },
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAFBFC] text-[#16324F] flex flex-col">
      {/* Header Bar */}
      <header className="border-b border-[#E7EDF3] bg-white sticky top-0 z-20 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center text-white shadow-sm">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#16324F]">AI Learning Assistant</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      healthStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {healthStatus.label}
                </span>
              </div>
              <p className="text-xs text-[#5B6472]">Your personal study companion at VIDYAVERSE</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 bg-[#F0F3F7] rounded-lg border border-[#E7EDF3]">
              <button
                onClick={() => setActiveTab('assistant')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'assistant'
                    ? 'bg-white text-[#1E3A8A] shadow-xs'
                    : 'text-[#5B6472] hover:text-[#16324F]'
                }`}
              >
                <Sparkles size={14} />
                Study Assistant
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'search'
                    ? 'bg-white text-[#1E3A8A] shadow-xs'
                    : 'text-[#5B6472] hover:text-[#16324F]'
                }`}
              >
                <Search size={14} />
                Course Search
              </button>
            </div>

            {activeTab === 'assistant' && (
              <button
                onClick={handleResetChat}
                title="Start a new conversation session"
                className="p-2 text-[#5B6472] hover:text-[#16324F] hover:bg-[#F0F3F7] rounded-lg border border-[#E7EDF3] transition-colors text-xs font-medium flex items-center gap-1"
              >
                <RotateCcw size={15} />
                <span className="hidden sm:inline">New Session</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        {/* Error Alert Bar */}
        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-start gap-2.5 text-sm animate-shake">
            <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-xs text-red-900">Notice</p>
              <p className="text-xs">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-0.5"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: Conversational AI Assistant */}
        {activeTab === 'assistant' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Quick Actions Starter Grid */}
            {messages.length <= 1 && (
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8C96A6] mb-3">
                  Quick Study Actions
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {quickActions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (action.action) {
                            action.action();
                          } else if (action.prompt) {
                            handleAsk(action.prompt);
                          }
                        }}
                        className="p-3.5 bg-white border border-[#E7EDF3] hover:border-[#3B82F6] hover:shadow-md rounded-xl text-left transition-all group flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E3A8A] group-hover:bg-[#1E3A8A] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                            <Icon size={16} />
                          </div>
                          <span className="text-xs font-bold text-[#16324F] group-hover:text-[#1E3A8A] transition-colors">
                            {action.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5B6472] leading-tight">{action.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Conversation Flow */}
            <div className="flex-1 space-y-4 mb-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                      <Bot size={18} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 ${
                      msg.role === 'user'
                        ? 'bg-[#1E3A8A] text-white shadow-xs ml-auto'
                        : msg.isError
                        ? 'bg-red-50 border border-red-200 text-[#16324F]'
                        : 'bg-white border border-[#E7EDF3] shadow-xs text-[#16324F]'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-slate">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ node, inline, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              const codeString = String(children).replace(/\n$/, '');
                              const codeBlockId = `code-${Math.random().toString(36).substring(2, 9)}`;

                              return !inline && match ? (
                                <div className="my-3 rounded-xl overflow-hidden border border-[#E7EDF3] shadow-xs">
                                  <div className="bg-[#F0F3F7] px-3.5 py-1.5 flex items-center justify-between text-xs font-mono text-[#5B6472] border-b border-[#E7EDF3]">
                                    <span className="font-semibold uppercase tracking-wider text-[11px] text-[#1E3A8A]">
                                      {match[1]}
                                    </span>
                                    <button
                                      onClick={() => handleCopyCode(codeString, codeBlockId)}
                                      className="flex items-center gap-1 hover:text-[#16324F] transition-colors py-0.5 px-1.5 rounded"
                                    >
                                      {copiedCodeId === codeBlockId ? (
                                        <>
                                          <Check size={13} className="text-emerald-600" />
                                          <span className="text-[11px] text-emerald-600 font-sans">Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy size={13} />
                                          <span className="text-[11px] font-sans">Copy</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <SyntaxHighlighter
                                    style={oneLight}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{
                                      margin: 0,
                                      padding: '1rem',
                                      backgroundColor: '#FFFFFF',
                                      fontSize: '0.8125rem',
                                      lineHeight: '1.5',
                                    }}
                                    {...props}
                                  >
                                    {codeString}
                                  </SyntaxHighlighter>
                                </div>
                              ) : (
                                <code
                                  className="px-1.5 py-0.5 rounded-md bg-blue-50 text-[#1E3A8A] font-mono text-xs border border-blue-100"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>

                        {/* Grounded Course References Citation Box */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-[#E7EDF3]">
                            <button
                              onClick={() => toggleSources(msg.id)}
                              className="w-full flex items-center justify-between text-xs font-semibold text-[#1E3A8A] hover:text-[#1E40AF] transition-colors py-1"
                            >
                              <span className="flex items-center gap-1.5">
                                <BookmarkCheck size={15} className="text-emerald-600" />
                                Referenced Course Materials ({msg.sources.length})
                              </span>
                              {expandedSources[msg.id] ? (
                                <ChevronUp size={15} />
                              ) : (
                                <ChevronDown size={15} />
                              )}
                            </button>

                            {expandedSources[msg.id] && (
                              <div className="mt-2.5 space-y-2">
                                {msg.sources.map((source, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="p-2.5 bg-[#F7F9FC] border border-[#E7EDF3] rounded-lg text-xs"
                                  >
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                      <span className="font-bold text-[#16324F] truncate">
                                        {source.metadata?.title || source.metadata?.courseTitle || 'Course Lecture'}
                                      </span>
                                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 shrink-0">
                                        {Math.round(source.score * 100)}% match
                                      </span>
                                    </div>
                                    <p className="text-[#5B6472] text-[11px] line-clamp-2 leading-relaxed">
                                      {source.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#1E3A8A] flex items-center justify-center shrink-0 shadow-xs mt-1">
                      <UserIcon size={18} />
                    </div>
                  )}
                </div>
              ))}

              {/* Active Loading Thinking Indicator */}
              {loading && (
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot size={18} />
                  </div>
                  <div className="p-4 bg-white border border-[#E7EDF3] rounded-2xl shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1E3A8A]">
                      <div className="w-3.5 h-3.5 border-2 border-[#1E3A8A] border-t-transparent rounded-full animate-spin" />
                      <span>{statusMessage || 'Thinking...'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar & Mic Integration */}
            <div className="sticky bottom-4 z-10 bg-white rounded-2xl border border-[#D0D7E2] shadow-md p-2 focus-within:border-[#3B82F6] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              {/* Interim voice feedback display */}
              {isRecording && (
                <div className="px-3 py-1.5 mb-2 bg-red-50 border border-red-100 rounded-lg flex items-center justify-between text-xs text-red-700 animate-pulse">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping shrink-0" />
                    <span className="font-semibold">Listening:</span>
                    <span className="italic truncate">{interimTranscript || 'Speak your question...'}</span>
                  </div>
                  <button
                    onClick={toggleRecording}
                    className="text-[11px] font-bold text-red-600 hover:text-red-800 ml-2 shrink-0 underline"
                  >
                    Done
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleRecording}
                  title={isRecording ? 'Stop recording' : 'Speak your question'}
                  className={`p-2.5 rounded-xl transition-all ${
                    isRecording
                      ? 'bg-red-600 text-white shadow-xs animate-pulse'
                      : 'text-[#5B6472] hover:text-[#1E3A8A] hover:bg-[#F0F3F7]'
                  }`}
                >
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                  placeholder={
                    isRecording
                      ? 'Listening to your speech...'
                      : 'Ask a question about Python, loops, AI algorithms...'
                  }
                  rows={1}
                  disabled={loading}
                  className="flex-1 bg-transparent border-none text-sm text-[#16324F] placeholder-[#8C96A6] focus:outline-none resize-none max-h-32 py-1.5"
                />

                <button
                  onClick={() => handleAsk()}
                  disabled={loading || !query.trim()}
                  className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#1E40AF] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Ask</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Direct Semantic Course Search */}
        {activeTab === 'search' && (
          <div className="flex-1 flex flex-col">
            <div className="bg-white rounded-2xl border border-[#E7EDF3] p-6 shadow-xs mb-6">
              <h2 className="text-base font-bold text-[#16324F] mb-1">Search Course Materials</h2>
              <p className="text-xs text-[#5B6472] mb-4">
                Semantic retrieval finds lectures and code blocks by concept meaning, even if exact keywords differ.
              </p>

              <form onSubmit={handleDirectSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-3 text-[#8C96A6]" />
                  <input
                    type="text"
                    value={directSearchQuery}
                    onChange={(e) => setDirectSearchQuery(e.target.value)}
                    placeholder="e.g., How do functions return values, or how does depth-first search work?"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9FC] border border-[#E7EDF3] rounded-xl text-sm text-[#16324F] placeholder-[#8C96A6] focus:outline-none focus:border-[#3B82F6] focus:bg-white transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={directSearching || !directSearchQuery.trim()}
                  className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#1E40AF] disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
                >
                  {directSearching ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Search'
                  )}
                </button>
              </form>
            </div>

            {/* Direct Search Error State */}
            {directSearchError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs mb-6 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{directSearchError}</span>
              </div>
            )}

            {/* Direct Search Results */}
            {directSearching ? (
              <div className="py-12 flex flex-col items-center justify-center text-xs text-[#5B6472]">
                <div className="w-6 h-6 border-2 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mb-3" />
                <span>Searching indexed course lectures...</span>
              </div>
            ) : directSearchResults.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#5B6472] px-1">
                  <span>Found {directSearchResults.length} matching learning materials</span>
                  <span className="text-[11px]">Ranked by relevance</span>
                </div>

                {directSearchResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white border border-[#E7EDF3] rounded-xl hover:border-[#3B82F6] hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 truncate">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#1E3A8A] border border-blue-100">
                          {result.metadata?.courseId || 'course'}
                        </span>
                        <h3 className="text-sm font-bold text-[#16324F] truncate">
                          {result.metadata?.title || 'Lecture Material'}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        {Math.round(result.score * 100)}% match
                      </span>
                    </div>

                    <p className="text-xs text-[#5B6472] whitespace-pre-wrap leading-relaxed line-clamp-4">
                      {result.content}
                    </p>

                    <div className="mt-3 pt-2 border-t border-[#F0F3F7] flex items-center justify-between">
                      <span className="text-[11px] text-[#8C96A6]">
                        {result.metadata?.contentType ? `Type: ${result.metadata.contentType}` : ''}
                      </span>
                      <button
                        onClick={() => {
                          setActiveTab('assistant');
                          handleAsk(`Tell me more about what is covered in "${result.metadata?.title || 'this section'}".`);
                        }}
                        className="text-xs font-semibold text-[#1E3A8A] hover:underline flex items-center gap-1"
                      >
                        Ask Assistant about this
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : directSearchSubmitted ? (
              <div className="py-12 bg-white rounded-2xl border border-[#E7EDF3] text-center px-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center mx-auto mb-3">
                  <Search size={18} />
                </div>
                <h3 className="text-sm font-bold text-[#16324F] mb-1">
                  No matching indexed learning material found
                </h3>
                <p className="text-xs text-[#5B6472] max-w-sm mx-auto mb-4">
                  We couldn't find material closely matching "{directSearchQuery}". Try rephrasing or searching with broader keywords like "Python loops" or "functions".
                </p>
                <button
                  onClick={() => {
                    setDirectSearchQuery('Python');
                  }}
                  className="px-3.5 py-1.5 bg-[#F0F3F7] hover:bg-[#E7EDF3] rounded-lg text-xs font-semibold text-[#16324F] transition-colors"
                >
                  Search "Python"
                </button>
              </div>
            ) : (
              <div className="py-12 bg-white rounded-2xl border border-[#E7EDF3] text-center px-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center mx-auto mb-3">
                  <BookOpen size={18} />
                </div>
                <h3 className="text-sm font-bold text-[#16324F] mb-1">Ready to Search Course Content</h3>
                <p className="text-xs text-[#5B6472] max-w-sm mx-auto">
                  Type a concept or topic above to find all lectures, code examples, and notes across your enrolled courses.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
