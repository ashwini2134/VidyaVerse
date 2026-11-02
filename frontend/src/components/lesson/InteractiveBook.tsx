import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BookSpread } from '../../types/lesson';

const FLIP_MS = 700;
const PAPER = '#faf6f0';
const PAPER_ALT = '#f5f0e8';
const INK = '#1a0e06';
const INK_LIGHT = '#3a2a1a';
const MUTED = '#7a6a5a';
const ACCENT = '#c8b89a';
const SPINE = 'linear-gradient(to right, #2d1a10 0%, #5c3820 40%, #4a2c18 60%, #2d1a10 100%)';

const STYLES = `
  @keyframes ib-blink { 0%,100%{opacity:1} 50%{opacity:0} }
  .ib-cursor { animation: ib-blink 1.1s step-end infinite; }
  @keyframes ib-drop { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  .ib-drop { animation: ib-drop 0.25s ease-out both; }
  @keyframes ib-fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .ib-fadein { animation: ib-fadein 0.5s ease-out both; }
  .ib-nav:hover { background: rgba(0,0,0,0.06) !important; transform: scale(1.1); }
  .ib-nav { transition: background 200ms, transform 200ms; }
  .ib-close:hover { background: rgba(0,0,0,0.06) !important; }
  .ib-close { transition: background 200ms; }
  @keyframes ib-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .ib-float { animation: ib-float 4s ease-in-out infinite; }
  @keyframes ib-drift { 0%{transform:translate(0,0) scale(1);opacity:0} 10%{opacity:0.6} 90%{opacity:0.3} 100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0} }
  .ib-particle { animation: ib-drift 8s ease-out infinite; }
`;

// ── Left-page visuals (data-driven from spread.left) ────────────────────

function LeftPageContent({ spread }: { spread: BookSpread }) {
  const left = spread.left;
  if (!left) return null;

  const lc = (left.image ?? '').toLowerCase();
  const paragraphs = left.paragraphs ?? [];

  // ── Chapter header ──
  if (lc.startsWith('chapter')) {
    const num = left.image?.slice(7) || '01';
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:'10px', padding:'28px' }}>
        <div style={{ width:'28px', height:'1.5px', background:ACCENT }} />
        <p style={{ fontFamily:'Georgia,serif', fontSize:'10px', letterSpacing:'4px', color:'#9a8070', textTransform:'uppercase', margin:0 }}>{left.title ?? 'Chapter'}</p>
        <p style={{ fontFamily:'Georgia,serif', fontSize:'76px', fontWeight:700, color:'#e8ddd0', lineHeight:0.9, margin:0 }}>{num}</p>
        <p style={{ fontFamily:'Georgia,serif', fontSize:'14px', color:MUTED, fontStyle:'italic', margin:0, textAlign:'center' }}>{paragraphs[0] || ''}</p>
        <div style={{ width:'28px', height:'1.5px', background:ACCENT }} />
        <p style={{ marginTop:'20px', fontFamily:'Georgia,serif', fontSize:'9px', letterSpacing:'3px', color:'#b0a090', textTransform:'uppercase' }}>VIDYAVERSE</p>
      </div>
    );
  }

  // ── Big stat page ──
  if (lc.startsWith('stat')) {
    const stat = paragraphs[0] || '';
    const unit = paragraphs[1] || '';
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', padding:'20px 24px', gap:'6px' }}>
        <p style={{ fontFamily:'Georgia,serif', fontSize:'34px', fontWeight:700, color:INK, letterSpacing:'-1px', lineHeight:1, margin:0 }}>{stat}</p>
        <p style={{ fontFamily:'Georgia,serif', fontSize:'10px', color:MUTED, letterSpacing:'1px', margin:0 }}>{unit}</p>
      </div>
    );
  }

  // ── Comparison (human vs machine) ──
  if (lc.startsWith('compare')) {
    const [leftLabel, leftEmoji, leftStat, rightLabel, rightEmoji, rightStat] = paragraphs;
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', padding:'24px', gap:'10px' }}>
        <p style={{ fontFamily:'Georgia,serif', fontSize:'10px', color:'#9a8070', letterSpacing:'3px', textTransform:'uppercase', margin:0 }}>{left.title || 'The problem'}</p>
        <div style={{ display:'flex', gap:'18px', alignItems:'center', padding:'10px 0' }}>
          <div style={{ textAlign:'center', display:'flex', flexDirection:'column', gap:'5px', flex:1 }}>
            <span style={{ fontSize:'44px', lineHeight:1 }}>{leftEmoji || '😵'}</span>
            <span style={{ fontSize:'9px', fontFamily:'system-ui', fontWeight:700, color:'#cc4444', letterSpacing:'1px', textTransform:'uppercase' }}>{leftLabel || 'Human'}</span>
            <span style={{ fontSize:'9px', fontFamily:'system-ui', color:'#aaa', lineHeight:1.4 }}>{leftStat || ''}</span>
          </div>
          <span style={{ fontFamily:'Georgia,serif', fontSize:'18px', color:ACCENT, flexShrink:0 }}>vs</span>
          <div style={{ textAlign:'center', display:'flex', flexDirection:'column', gap:'5px', flex:1 }}>
            <span style={{ fontSize:'44px', lineHeight:1 }}>{rightEmoji || '🖥️'}</span>
            <span style={{ fontSize:'9px', fontFamily:'system-ui', fontWeight:700, color:'#44aa44', letterSpacing:'1px', textTransform:'uppercase' }}>{rightLabel || 'Machine'}</span>
            <span style={{ fontSize:'9px', fontFamily:'system-ui', color:'#aaa', lineHeight:1.4 }}>{rightStat || ''}</span>
          </div>
        </div>
        <div style={{ width:'24px', height:'1px', background:ACCENT }} />
        <p style={{ fontFamily:'Georgia,serif', fontSize:'11px', color:MUTED, textAlign:'center', fontStyle:'italic', margin:0, lineHeight:1.6 }}>{paragraphs[6] || ''}</p>
      </div>
    );
  }

  // ── Big reveal (two letters / short text) ──
  if (lc.startsWith('reveal')) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', padding:'24px', gap:'8px' }}>
        {left.title && <p style={{ fontFamily:'Georgia,serif', fontSize:'10px', color:'#9a8070', letterSpacing:'3px', textTransform:'uppercase', margin:0 }}>{left.title}</p>}
        <p style={{ fontFamily:'Georgia,serif', fontSize:'72px', fontWeight:700, letterSpacing:'-2px', lineHeight:0.9, margin:0, background:'linear-gradient(135deg,#2a1a0a 0%,#6a4a2a 50%,#2a1a0a 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{paragraphs[0] || ''}</p>
        <p style={{ fontFamily:'Georgia,serif', fontSize:'11px', color:MUTED, fontStyle:'italic', textAlign:'center', lineHeight:1.6, margin:0 }}>{paragraphs[1] || ''}</p>
      </div>
    );
  }

  // ── Emoji tile (example) ──
  if (lc.startsWith('tile')) {
    const emoji = left.image?.slice(4) || '📧';
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', padding:'24px', gap:'10px' }}>
        <span style={{ fontSize:'52px', lineHeight:1 }}>{emoji}</span>
        <p style={{ fontFamily:'Georgia,serif', fontSize:'16px', fontWeight:700, color:INK, margin:0 }}>{left.title || ''}</p>
        <div style={{ width:'22px', height:'1px', background:ACCENT }} />
        <p style={{ fontFamily:'Georgia,serif', fontSize:'11px', color:MUTED, textAlign:'center', lineHeight:1.7, fontStyle:'italic', margin:0 }}>{paragraphs[0] || ''}</p>
      </div>
    );
  }

  // ── Completed ──
  if (lc.startsWith('done')) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', padding:'24px', gap:'10px' }}>
        <div style={{ width:'44px', height:'44px', borderRadius:'50%', border:`2px solid ${ACCENT}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <p style={{ fontFamily:'Georgia,serif', fontSize:'13px', color:MUTED, textAlign:'center', lineHeight:1.7, margin:0 }}>You've completed<br/><strong style={{ color:INK }}>{left.title || 'Chapter'}</strong></p>
        <div style={{ width:'22px', height:'1px', background:ACCENT }} />
        <p style={{ fontFamily:'Georgia,serif', fontSize:'9px', color:'#b0a090', letterSpacing:'3px', textTransform:'uppercase', margin:0 }}>VIDYAVERSE</p>
      </div>
    );
  }

  return null;
}

// ── Typewriter ──────────────────────────────────────────────────────────

function Typewriter({
  text, speed = 28, delay = 0, onDone, style,
}: { text: string; speed?: number; delay?: number; onDone?: () => void; style?: React.CSSProperties }) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setShown('');
    setDone(false);
    if (!text) { onDone?.(); return; }
    let i = 0;
    const start = setTimeout(() => {
      const tick = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(tick);
          setDone(true);
          onDone?.();
        }
      }, speed);
      return () => clearInterval(tick);
    }, delay);
    return () => clearTimeout(start);
  }, [text, speed, delay]);

  return (
    <span style={style}>
      {shown}
      {!done && <span className="ib-cursor" style={{ display:'inline-block', width:'2px', height:'1.1em', background:'currentColor', marginLeft:'2px', verticalAlign:'middle' }} />}
    </span>
  );
}

// ── Right-page content ──────────────────────────────────────────────────

interface RightPageProps {
  spread: BookSpread;
  idx: number;
  total: number;
  isLast: boolean;
  onTypingDone: () => void;
  typingDone: boolean;
  onNext: () => void;
  onClose: () => void;
  noType?: boolean;
}

function RightPageContent({ spread, idx, total, isLast, onTypingDone, typingDone, onNext, onClose, noType }: RightPageProps) {
  const [titleDone, setTitleDone] = useState(noType ?? false);
  const right = spread.right;
  if (!right) return null;

  const title = right.title ?? '';
  const body = (right.paragraphs ?? []).join('\n');
  const hasBody = body.trim().length > 0;
  const isDefinition = idx === 3;

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', padding:'32px 36px 28px 30px', position:'relative', boxSizing:'border-box' }}>

      <span style={{ position:'absolute', top:'14px', right:'18px', fontFamily:'Georgia,serif', fontSize:'10px', color:'#c0b0a0', letterSpacing:'0.5px' }}>
        {idx + 1} / {total}
      </span>

      <h2 style={{
        fontFamily: 'Georgia, serif',
        fontSize: isDefinition ? '15px' : '21px',
        fontWeight: 700,
        color: INK,
        lineHeight: 1.25,
        marginBottom: '18px',
        flex: 'none',
        paddingRight: '32px',
      }}>
        {noType
          ? title
          : <Typewriter text={title} speed={38} onDone={() => { if (!hasBody) onTypingDone(); setTitleDone(true); }} />
        }
      </h2>

      {(noType || titleDone) && hasBody && (
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: isDefinition ? '16px' : '13px',
          color: INK_LIGHT,
          lineHeight: isDefinition ? 2.4 : 1.85,
          flex: 1,
          whiteSpace: 'pre-line',
          overflow: 'hidden',
        }}>
          {noType
            ? body
            : <Typewriter text={body} speed={isDefinition ? 90 : 22} delay={300} onDone={onTypingDone} />
          }
        </div>
      )}

      {typingDone && (
        <div className="ib-fadein" style={{ position:'absolute', bottom:'22px', right:'22px' }}>
          {isLast ? (
            <button
              onClick={onClose}
              className="ib-close"
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '11px',
                color: '#5a3a1a',
                background: 'transparent',
                border: `1px solid ${ACCENT}`,
                borderRadius: '20px',
                padding: '6px 18px',
                cursor: 'pointer',
                letterSpacing: '1px',
              }}
            >
              Close Book
            </button>
          ) : (
            <button
              onClick={onNext}
              className="ib-nav"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                border: `1px solid ${ACCENT}`,
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#5a3a1a',
              }}
              aria-label="Next page"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Ambient Particles ───────────────────────────────────────────────────

function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, () => ({
      dx: (Math.random() - 0.5) * 200,
      dy: -100 - Math.random() * 200,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      left: Math.random() * 100,
      top: 60 + Math.random() * 35,
    }))
  , []);

  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      {particles.map((p, i) => (
        <div
          key={i}
          className="ib-particle"
          style={{
            position:'absolute',
            left:`${p.left}%`,
            top:`${p.top}%`,
            width:`${p.size}px`,
            height:`${p.size}px`,
            borderRadius:'50%',
            background:'rgba(200,184,154,0.4)',
            animationDelay:`${p.delay}s`,
            animationDuration:`${p.duration}s`,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ── Book Cover (full-screen stage) ──────────────────────────────────────

function BookCover({ onOpen, exiting }: { onOpen: () => void; exiting: boolean }) {
  return (
    <div style={{
      position:'fixed',
      inset:0,
      zIndex:60,
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      background:'radial-gradient(ellipse at 50% 50%, #1a1008 0%, #0d0703 60%, #060301 100%)',
      cursor:'pointer',
      opacity: exiting ? 0 : 1,
      transition: 'opacity 600ms ease',
    }} onClick={onOpen}>
      {/* Central radial glow */}
      <div style={{
        position:'absolute',
        width:'70vw',
        height:'70vw',
        maxWidth:'900px',
        maxHeight:'900px',
        borderRadius:'50%',
        background:'radial-gradient(circle, rgba(200,184,154,0.07) 0%, transparent 65%)',
        pointerEvents:'none',
      }} />

      {/* Floating particles */}
      <Particles />

      {/* Book */}
      <div className="ib-float" style={{
        width: 'min(65vw, 520px)',
        height: 'min(88vh, 680px)',
        borderRadius: '4px 12px 12px 4px',
        background: 'linear-gradient(160deg, #1f1108 0%, #120a04 60%, #0d0703 100%)',
        border: '1px solid rgba(200,184,154,0.18)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,184,154,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 2,
      }}>
        <div style={{ position:'absolute', inset:'16px', border:'1px solid rgba(200,184,154,0.14)', borderRadius:'2px', pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:'20px', border:'1px solid rgba(200,184,154,0.07)', borderRadius:'1px', pointerEvents:'none' }} />
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'16px', background:'linear-gradient(to right,rgba(0,0,0,0.5),transparent)', pointerEvents:'none' }} />

        <div style={{ textAlign:'center', padding:'0 32px', zIndex:1 }}>
          <p style={{ fontFamily:'Georgia,serif', fontSize:'9px', letterSpacing:'5px', color:'rgba(200,184,154,0.45)', textTransform:'uppercase', margin:'0 0 20px' }}>VIDYAVERSE</p>
          <div style={{ width:'32px', height:'1px', background:'rgba(200,184,154,0.3)', margin:'0 auto 18px' }} />
          <p style={{ fontFamily:'Georgia,serif', fontSize:'11px', letterSpacing:'3px', color:'rgba(200,184,154,0.5)', textTransform:'uppercase', margin:'0 0 12px' }}>Chapter One</p>
          <p style={{ fontFamily:'Georgia,serif', fontSize:'clamp(20px, 4vw, 30px)', fontWeight:700, color:'rgba(240,230,210,0.9)', lineHeight:1.3, margin:'0 0 8px' }}>What is<br/>Artificial<br/>Intelligence?</p>
          <div style={{ width:'32px', height:'1px', background:'rgba(200,184,154,0.3)', margin:'18px auto 32px' }} />
        </div>

        <div style={{
          fontFamily:'Georgia,serif',
          fontSize:'10px',
          letterSpacing:'3px',
          color:'rgba(200,184,154,0.35)',
          textTransform:'uppercase',
          zIndex:1,
          animation:'ib-blink 2s ease-in-out infinite',
        }}>
          Tap to open
        </div>
      </div>

      {/* Bottom stage label */}
      <div style={{
        position:'absolute',
        bottom:'10vh',
        fontFamily:'Georgia,serif',
        fontSize:'10px',
        letterSpacing:'4px',
        color:'rgba(200,184,154,0.15)',
        textTransform:'uppercase',
      }}>
        . . .
      </div>
    </div>
  );
}

// ── Open Book Spread ────────────────────────────────────────────────────

interface OpenBookProps {
  spreads: BookSpread[];
  displayIdx: number;
  leftVisualIdx: number;
  turningToIdx: number | null;
  turning: boolean;
  frontFaceIdx: number;
  typingDone: boolean;
  isLast: boolean;
  onTypingDone: () => void;
  onNext: () => void;
  onClose: () => void;
}

function OpenBook({ spreads, displayIdx, leftVisualIdx, turningToIdx, turning, frontFaceIdx, typingDone, isLast, onTypingDone, onNext, onClose }: OpenBookProps) {
  const PAGE_H = 'min(78vh, 600px)';
  const PAGE_W = 'min(38vw, 480px)';

  const bookShadow = [
    '0 40px 100px rgba(0,0,0,0.6)',
    '0 20px 50px rgba(0,0,0,0.4)',
    '0 8px 20px rgba(0,0,0,0.3)',
  ].join(', ');

  return (
    <div style={{ position:'relative', display:'inline-flex', margin:'0 auto' }}>
      {/* Ambient floor shadow */}
      <div style={{ position:'absolute', bottom:'-24px', left:'30px', right:'30px', height:'30px', background:'rgba(0,0,0,0.5)', filter:'blur(30px)', borderRadius:'50%' }} />

      {/* Book shell */}
      <div style={{ display:'flex', height:PAGE_H, borderRadius:'2px 8px 8px 2px', boxShadow:bookShadow, overflow:'hidden', position:'relative' }}>

        {/* Left page */}
        <div
          style={{
            width: PAGE_W,
            height: '100%',
            background: PAPER_ALT,
            boxShadow: 'inset -30px 0 70px rgba(0,0,0,0.07), inset -4px 0 10px rgba(0,0,0,0.05)',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <LeftPageContent spread={spreads[leftVisualIdx]} />
        </div>

        {/* Spine */}
        <div style={{ width:'52px', height:'100%', background:SPINE, flexShrink:0, boxShadow:'inset -3px 0 12px rgba(0,0,0,0.4), inset 3px 0 12px rgba(0,0,0,0.3)', zIndex:2, position:'relative' }}>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%) rotate(90deg)', whiteSpace:'nowrap', fontFamily:'Georgia,serif', fontSize:'9px', letterSpacing:'3px', color:'rgba(200,184,154,0.4)', textTransform:'uppercase' }}>
            What is AI?
          </div>
        </div>

        {/* Right page — flip wrapper */}
        <div style={{ width:PAGE_W, height:'100%', position:'relative', perspective:'2000px' }}>

          {/* Static right page */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: PAPER,
              boxShadow: 'inset 30px 0 70px rgba(0,0,0,0.05), inset 4px 0 10px rgba(0,0,0,0.03)',
              opacity: turning ? 0 : 1,
              transition: turning ? 'opacity 80ms ease' : 'opacity 150ms ease 300ms',
            }}
          >
            <RightPageContent
              key={displayIdx}
              spread={spreads[displayIdx]}
              idx={displayIdx}
              total={spreads.length}
              isLast={isLast}
              onTypingDone={onTypingDone}
              typingDone={typingDone}
              onNext={onNext}
              onClose={onClose}
            />
          </div>

          {/* Flipping page (3D) */}
          {turning && turningToIdx !== null && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
                transform: 'rotateY(-180deg)',
                transition: `transform ${FLIP_MS}ms cubic-bezier(0.645,0.045,0.355,1)`,
                zIndex: 3,
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: PAPER,
                boxShadow: 'inset 30px 0 70px rgba(0,0,0,0.05)',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
              }}>
                <RightPageContent
                  key={`front-${frontFaceIdx}`}
                  spread={spreads[frontFaceIdx]}
                  idx={frontFaceIdx}
                  total={spreads.length}
                  isLast={frontFaceIdx >= spreads.length - 1}
                  onTypingDone={() => {}}
                  typingDone={false}
                  onNext={() => {}}
                  onClose={() => {}}
                  noType
                />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, rgba(0,0,0,0.08) 0%, transparent 30%)', pointerEvents:'none' }} />
              </div>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: PAPER,
                boxShadow: 'inset -30px 0 70px rgba(0,0,0,0.07)',
                transform: 'rotateY(180deg)',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
              }}>
                <RightPageContent
                  key={`back-${turningToIdx}`}
                  spread={spreads[turningToIdx]}
                  idx={turningToIdx}
                  total={spreads.length}
                  isLast={turningToIdx >= spreads.length - 1}
                  onTypingDone={() => {}}
                  typingDone={false}
                  onNext={() => {}}
                  onClose={() => {}}
                  noType
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spread progress dots */}
      <div style={{ position:'absolute', bottom:'-36px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'6px', alignItems:'center' }}>
        {spreads.map((_, i) => (
          <div key={i} style={{
            height: '5px',
            borderRadius: '3px',
            background: i === displayIdx ? 'rgba(200,184,154,0.7)' : 'rgba(200,184,154,0.2)',
            width: i === displayIdx ? '18px' : '5px',
            transition: 'all 400ms ease',
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────

interface InteractiveBookProps {
  spreads: BookSpread[];
  onComplete?: () => void;
}

export default function InteractiveBook({ spreads, onComplete }: InteractiveBookProps) {
  const [phase, setPhase] = useState<'cover' | 'reading' | 'done'>('cover');
  const [displayIdx, setDisplayIdx] = useState(0);
  const [leftVisualIdx, setLeftVisualIdx] = useState(0);
  const [turning, setTurning] = useState(false);
  const [turningToIdx, setTurningToIdx] = useState<number | null>(null);
  const [typingDone, setTypingDone] = useState(false);
  const [closingBook, setClosingBook] = useState(false);

  const frontFaceRef = useRef(0);
  const displayIdxRef = useRef(0);
  displayIdxRef.current = displayIdx;

  useEffect(() => {
    if (phase === 'reading') {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [phase]);

  useEffect(() => {
    setTypingDone(false);
  }, [displayIdx]);

  const handleOpen = useCallback(() => {
    setPhase('reading');
  }, []);

  const handleNext = useCallback(() => {
    if (!typingDone || turning) return;
    const current = displayIdxRef.current;
    if (current >= spreads.length - 1) return;
    const next = current + 1;
    frontFaceRef.current = current;
    setTurningToIdx(next);
    setTurning(true);

    setTimeout(() => setLeftVisualIdx(next), FLIP_MS / 2);

    setTimeout(() => {
      setDisplayIdx(next);
      setTurning(false);
      setTurningToIdx(null);
    }, FLIP_MS + 60);
  }, [typingDone, turning, spreads.length]);

  const handleClose = useCallback(() => {
    setClosingBook(true);
    setTimeout(() => {
      document.body.style.overflow = '';
      setPhase('done');
      onComplete?.();
    }, 950);
  }, [onComplete]);

  useEffect(() => {
    if (phase !== 'reading') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); handleNext(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, handleNext]);

  if (phase === 'done') return null;

  return (
    <>
      <style>{STYLES}</style>

      {phase === 'cover' && (
        <BookCover onOpen={handleOpen} exiting={false} />
      )}

      {phase === 'reading' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(ellipse at 50% 50%, #1a1008 0%, #0d0703 60%, #060301 100%)',
          }}
        >
          {/* Central glow */}
          <div style={{ position:'absolute', width:'80vw', height:'80vw', maxWidth:'1000px', maxHeight:'1000px', borderRadius:'50%', background:'radial-gradient(circle, rgba(200,184,154,0.05) 0%, transparent 60%)', pointerEvents:'none' }} />

          <Particles />

          <div
            style={{
              transform: closingBook ? 'translateY(60px) scale(0.85)' : 'translateY(0) scale(1)',
              opacity: closingBook ? 0 : 1,
              transition: closingBook ? 'transform 900ms cubic-bezier(0.4,0,0.2,1), opacity 800ms ease' : 'none',
            }}
          >
            <OpenBook
              spreads={spreads}
              displayIdx={displayIdx}
              leftVisualIdx={leftVisualIdx}
              turningToIdx={turningToIdx}
              turning={turning}
              frontFaceIdx={frontFaceRef.current}
              typingDone={typingDone}
              isLast={displayIdx >= spreads.length - 1}
              onTypingDone={() => setTypingDone(true)}
              onNext={handleNext}
              onClose={handleClose}
            />
          </div>

          {typingDone && !turning && displayIdx < spreads.length - 1 && (
            <div className="ib-fadein" style={{ position:'absolute', bottom:'28px', left:'50%', transform:'translateX(-50%)', fontFamily:'Georgia,serif', fontSize:'10px', color:'rgba(200,184,154,0.25)', letterSpacing:'2px', whiteSpace:'nowrap' }}>
              Press → or Space to turn page
            </div>
          )}
        </div>
      )}
    </>
  );
}
