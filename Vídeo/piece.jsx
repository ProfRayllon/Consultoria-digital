/* Ferramentas isoladas → bases genéricas → sistema de gestão premium. 46s, 16:9. */
const { useComposition, CompositionStage, Shot, Easing, animate, clamp } = window;

const BG = '#060E1C';
const TXT = '#EAF1FA';
const MUTE = '#8394AC';
const EDGE = 'rgba(150,180,220,0.20)';
const PANEL = 'rgba(255,255,255,0.035)';
const GLASS = 'linear-gradient(160deg, rgba(18,40,84,0.92), rgba(8,18,40,0.92))';
const GEDGE = 'rgba(120,170,255,0.34)';
const WARN = '#D9694F';
const OK = '#3FB98A';
const VIOLET = '#7E7BF5';

const SANS = "'Sora', system-ui, sans-serif";
const MONO = "'IBM Plex Mono', ui-monospace, monospace";

function track(T, keys, ease) {
  ease = ease || Easing.easeInOutCubic;
  if (T <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const t0 = keys[i][0], v0 = keys[i][1], t1 = keys[i + 1][0], v1 = keys[i + 1][1];
    if (T <= t1) return v0 + (v1 - v0) * ease(clamp((T - t0) / ((t1 - t0) || 1), 0, 1));
  }
  return keys[keys.length - 1][1];
}
const M = {
  enter: (s, d) => animate({ from: 0, to: 1, start: s, end: s + (d || 0.7), ease: Easing.easeOutCubic }),
  draw: (s, d) => animate({ from: 0, to: 1, start: s, end: s + (d || 1), ease: Easing.easeInOutQuad }),
  track,
};
const lerp = (a, b, t) => a + (b - a) * t;

function AppTile({ kind, size }) {
  const s = size || 76;
  // Sem tile colorido nem borda: o PNG já traz a marca pronta.
  // "kind" é o nome do arquivo em uploads/icone_video (o rótulo da ferramenta).
  return (
    <img
      src={'uploads/icone_video/' + encodeURIComponent(kind) + '.png'}
      alt=""
      style={{
        width: s, height: s, flex: 'none', objectFit: 'contain', display: 'block',
        filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.45))',
      }}
    />
  );
}

/* ícones de navegação do sistema (diferentes dos apps) */
function NavIcon({ kind, color }) {
  const st = { fill: 'none', stroke: color, strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const glyph = {
    grid: <g {...st}><rect x="4" y="4" width="8" height="8" rx="1.6" /><rect x="16" y="4" width="8" height="8" rx="1.6" /><rect x="4" y="16" width="8" height="8" rx="1.6" /><rect x="16" y="16" width="8" height="8" rx="1.6" /></g>,
    layers: <g {...st}><path d="M14 3l10 5.5-10 5.5L4 8.5 14 3z" /><path d="M4 14l10 5.5L24 14" /><path d="M4 19.5L14 25l10-5.5" /></g>,
    flow: <g {...st}><rect x="3" y="4" width="8" height="6" rx="1.4" /><rect x="17" y="18" width="8" height="6" rx="1.4" /><path d="M7 10v6a3 3 0 003 3h7" /><path d="M15 16l2 3-2 3" /></g>,
    bell: <g {...st}><path d="M8 11a6 6 0 1112 0c0 5 2 6 2 6H6s2-1 2-6z" /><path d="M11.5 21a3 3 0 005 0" /></g>,
    users: <g {...st}><circle cx="11" cy="10" r="4" /><path d="M4 23c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" /><path d="M19 8.5a3.5 3.5 0 010 7M22 22c0-2.6-1-4.6-2.6-5.8" /></g>,
    shield: <g {...st}><path d="M14 3l9 3.5v7c0 5.6-3.8 9.6-9 11.5-5.2-1.9-9-5.9-9-11.5v-7L14 3z" /><path d="M10 14l3 3 5-5.5" /></g>,
  }[kind];
  return <svg width="30" height="30" viewBox="0 0 28 28" style={{ display: 'block', filter: `drop-shadow(0 0 7px ${color}55)` }}>{glyph}</svg>;
}

const SCATTER = [[520, 316], [1420, 300], [286, 596], [1620, 580], [1046, 786], [1520, 800]];
const LEFTGRID = [[286, 344], [548, 344], [286, 560], [548, 560], [286, 776], [548, 776]];
const HUB = [960, 560];
const DASH = { x: 1148, y: 318, k: 0.52 };

// "icon" e "label" são o mesmo texto de propósito: é o nome do arquivo em
// uploads/icone_video. Para trocar uma ferramenta, basta apontar para outro
// PNG da pasta (há também Google Drive, Power BI e Looker Studio).
const TOOLS = [
  { icon: 'Excel', label: 'Excel', mod: 'Painel', tag: 'v7 · v2 · final', born: 0.3, spread: 3.7, flag: 'qual é a final?', flagAt: 12.5 },
  { icon: 'Power BI', label: 'Power BI', mod: 'Relatórios', tag: 'export manual', born: 4.2, spread: 4.9, flag: 'dados de ontem', flagAt: 13.0 },
  { icon: 'Google Forms', label: 'Google Forms', mod: 'Coletas', tag: 'respostas soltas', born: 5.4, spread: 6.1, flag: 'sem data', flagAt: 13.5 },
  { icon: 'Google Classroom', label: 'Google Classroom', mod: 'Turmas', tag: 'turmas separadas', born: 6.6, spread: 7.3 },
  { icon: 'Moodle', label: 'Moodle', mod: 'Formações', tag: 'sem integração', born: 7.8, spread: 8.5, flag: 'acesso à parte', flagAt: 14.0 },
  { icon: 'Even3', label: 'Even3', mod: 'Inscrições', tag: 'inscrições soltas', born: 9.0, spread: 9.7 },
];

const T_CONV = 24.2, T_RAIL = 30.4;

function Tool({ tool, i, T, accent }) {
  const p = M.enter(tool.born, 0.75)(T);
  if (p <= 0.001) return null;
  const spread = M.draw(tool.spread, 1.25)(T);
  const conv = M.draw(T_CONV + i * 0.09, 1.6)(T);
  let x = lerp(960, SCATTER[i][0], spread), y = lerp(500, SCATTER[i][1], spread);
  x = lerp(x, LEFTGRID[i][0], conv); y = lerp(y, LEFTGRID[i][1], conv);

  const w = lerp(268, 244, conv);
  const h = lerp(206, 192, conv);
  const drift = Math.sin((T + i * 2.1) * 0.5) * 2.6 * spread * (1 - conv);
  const dim = M.draw(16.0, 1.0)(T) * (1 - M.draw(24.0, 1.0)(T));
  const gone = M.draw(32.4, 0.9)(T);
  const flagP = tool.flag ? M.enter(tool.flagAt, 0.4)(T) * (1 - M.draw(15.7, 0.6)(T)) : 0;
  const pop = lerp(1.34, 1, M.draw(tool.born, 1.1)(T));

  return (
    <div style={{
      position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h,
      opacity: p * (1 - 0.74 * dim) * (1 - gone), transform: `translateY(${drift}px) scale(${pop})`,
      background: conv > 0.4 ? 'rgba(255,255,255,0.045)' : PANEL,
      border: `1px solid ${conv > 0.4 ? 'rgba(120,170,255,0.16)' : 'rgba(150,180,220,0.09)'}`,
      borderRadius: 16, boxSizing: 'border-box', padding: '20px 22px',
      display: 'flex', gap: 14, flexDirection: 'column', alignItems: 'flex-start',
      boxShadow: conv > 0.4 ? `0 18px 44px rgba(0,0,0,0.4), 0 0 ${26 * conv}px rgba(46,134,255,0.16)` : 'none',
    }}>
      <AppTile kind={tool.icon} size={lerp(96, 74, conv)} />
      <div>
        <div style={{ font: `600 19px ${SANS}`, color: TXT, letterSpacing: '-0.01em' }}>{tool.label}</div>
        <div style={{ font: `500 11.5px ${MONO}`, letterSpacing: '0.1em', marginTop: 6, color: conv > 0.5 ? accent : MUTE }}>
          {conv > 0.5 ? tool.mod.toUpperCase() + ' · INTEGRADO' : tool.tag.toUpperCase()}
        </div>
      </div>
      {tool.flag && flagP > 0.01 ? (
        <div style={{
          position: 'absolute', right: -8, top: -13, opacity: flagP,
          transform: `translateY(${(1 - flagP) * 6}px)`,
          background: 'rgba(217,105,79,0.14)', border: `1px solid ${WARN}`, color: WARN,
          borderRadius: 999, padding: '4px 11px', font: `500 12px ${MONO}`, whiteSpace: 'nowrap',
        }}>{tool.flag}</div>
      ) : null}
    </div>
  );
}

const PAIRS = [[0, 1], [0, 2], [1, 5], [2, 4], [3, 1], [4, 5], [2, 5], [0, 4], [3, 0]];
function Tangle({ T }) {
  const inP = M.draw(11.7, 2.4)(T);
  const out = M.draw(15.6, 0.8)(T);
  if (inP <= 0.01 || out >= 1) return null;
  return (
    <svg width="1920" height="1080" style={{ position: 'absolute', left: 0, top: 0, opacity: (1 - out) * 0.96 }}>
      {PAIRS.map((pr, i) => {
        const a = SCATTER[pr[0]], b = SCATTER[pr[1]];
        const mx = (a[0] + b[0]) / 2 + (i % 2 ? 150 : -120);
        const my = Math.min((a[1] + b[1]) / 2 + (i % 3 ? -110 : 90), 800);
        const q = M.draw(11.8 + i * 0.18, 0.8)(T);
        return <path key={i} d={`M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}`} fill="none"
          stroke={WARN} strokeWidth="2.8" strokeDasharray="1000" strokeDashoffset={1000 * (1 - q)}
          strokeLinecap="round" opacity="0.92" style={{ filter: `drop-shadow(0 0 7px ${WARN}aa)` }} />;
      })}
    </svg>
  );
}

function Toil({ T }) {
  const p = M.enter(12.5, 0.7)(T);
  const out = M.draw(15.4, 0.7)(T);
  if (p <= 0.01 || out >= 1) return null;
  const h = Math.round(M.draw(12.7, 2.0)(T) * 312);
  return (
    <div style={{
      position: 'absolute', left: 610, top: 424, width: 700, textAlign: 'center',
      opacity: p * (1 - out), transform: `translateY(${(1 - p) * 14}px)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
        <svg width="82" height="104" viewBox="0 0 82 104" style={{ flex: 'none', filter: `drop-shadow(0 0 14px ${WARN}88)`, opacity: M.draw(13.1, 0.9)(T) }}>
          <path d="M41 8 L41 78" stroke={WARN} strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M14 62 L41 94 L68 62" stroke={WARN} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <div style={{ font: `600 138px ${MONO}`, color: TXT, letterSpacing: '-0.05em', lineHeight: 1 }}>
          {h}<span style={{ color: WARN }}>h</span>
        </div>
      </div>
      <div style={{ font: `500 22px ${SANS}`, color: MUTE, marginTop: 14 }}>por ano juntando, conferindo e corrigindo dados</div>
    </div>
  );
}

/* ---------- várias bases, vários gráficos ---------- */
function SheetChrome({ name, children, note }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F3F4F2', borderRadius: 8, border: '1px solid #C9CCC7', boxShadow: '0 26px 60px rgba(0,0,0,0.5)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 30, background: '#E4E6E2', borderBottom: '1px solid #C9CCC7', display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px' }}>
        <span style={{ font: `500 11.5px ${MONO}`, color: '#5C6159' }}>{name}</span>
        {note ? <span style={{ font: `500 10.5px ${MONO}`, color: '#8B9089' }}>{note}</span> : null}
      </div>
      <div style={{ flex: 1, display: 'flex' }}>{children}</div>
    </div>
  );
}

function SheetRows({ width, bad }) {
  return (
    <div style={{ width, borderRight: '1px solid #D6D9D4', padding: '8px 0' }}>
      {Array.from({ length: 11 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 1, padding: '0 7px', marginBottom: 2 }}>
          <div style={{ width: 22, height: 16, background: '#E9EBE7', font: `500 9px ${MONO}`, color: '#8B9089', textAlign: 'center', lineHeight: '16px' }}>{i + 1}</div>
          <div style={{ flex: 1, height: 16, background: i % 2 ? '#fff' : '#FAFAF8', borderBottom: '1px solid #E6E8E4' }}></div>
          <div style={{ width: 52, height: 16, background: bad === i ? '#FBE3DF' : (i % 2 ? '#fff' : '#FAFAF8'), borderBottom: '1px solid #E6E8E4', font: `500 9px ${MONO}`, color: WARN, textAlign: 'center', lineHeight: '16px' }}>{bad === i ? '#N/A' : ''}</div>
        </div>
      ))}
    </div>
  );
}

function LegacyStack({ T }) {
  const out = M.draw(23.9, 0.9)(T);
  if (T < 16.1 || out >= 1) return null;
  const sheets = [
    { at: 16.2, x: 214, y: 296, w: 660, h: 400, rot: 0, name: 'frequencia_2026.xlsx', note: 'v3', chart: 'bars', bad: 6 },
    { at: 17.1, x: 1046, y: 262, w: 660, h: 388, rot: 0, name: 'atendimentos_regional.xlsx', note: 'compartilhada', chart: 'pie', bad: -1 },
    { at: 18.0, x: 622, y: 468, w: 700, h: 400, rot: 0, name: 'consolidado_final_v7.xlsx', note: 'somente leitura', chart: 'line', bad: 3 },
  ];
  const bars = [42, 68, 55, 74, 61, 80];
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out }}>
      {sheets.map((s, i) => {
        const p = M.enter(s.at, 0.9)(T);
        if (p <= 0.01) return null;
        const grow = M.draw(s.at + 0.7, 1.1)(T);
        return (
          <div key={i} style={{
            position: 'absolute', left: s.x, top: s.y, width: s.w, height: s.h,
            opacity: p, transform: `translateY(${(1 - p) * 26}px) rotate(${s.rot}deg) scale(${lerp(0.96, 1, p)})`,
          }}>
            <SheetChrome name={s.name} note={s.note}>
              <SheetRows width={s.w * 0.42} bad={s.bad} />
              <div style={{ flex: 1, padding: '12px 14px' }}>
                <div style={{ height: '100%', border: '1px solid #C9CCC7', background: '#fff', padding: '8px 10px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ font: `500 11px ${SANS}`, color: '#3C403A', textAlign: 'center' }}>Gráfico {i + 1}</div>
                  {s.chart === 'bars' ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 8, borderBottom: '1px solid #9BA09A', borderLeft: '1px solid #9BA09A', padding: '0 10px' }}>
                      {bars.map((b, k) => <div key={k} style={{ flex: 1, height: `${b * grow}%`, background: '#4472C4', border: '1px solid #2F5597' }}></div>)}
                    </div>
                  ) : null}
                  {s.chart === 'pie' ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16, marginTop: 6 }}>
                      <svg width="104" height="104" viewBox="0 0 42 42">
                        <circle cx="21" cy="21" r="15.9" fill="#4472C4" />
                        <path d={`M21 21 L21 5.1 A15.9 15.9 0 0 1 ${21 + 15.9 * Math.sin(2 * Math.PI * 0.36 * grow)} ${21 - 15.9 * Math.cos(2 * Math.PI * 0.36 * grow)} Z`} fill="#ED7D31" />
                        <path d="M21 21 L6.5 27.6 A15.9 15.9 0 0 1 5.5 15 Z" fill="#A5A5A5" opacity={grow} />
                      </svg>
                      <div style={{ display: 'grid', gap: 5 }}>
                        {['Série 1', 'Série 2', 'Série 3'].map((l, k) => (
                          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 9, height: 9, background: ['#4472C4', '#ED7D31', '#A5A5A5'][k] }}></div>
                            <span style={{ font: `400 10.5px ${SANS}`, color: '#5C6159' }}>{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {s.chart === 'line' ? (
                    <svg viewBox="0 0 320 130" style={{ flex: 1, marginTop: 6 }}>
                      <path d="M14 116h296M14 116V10" stroke="#9BA09A" strokeWidth="1" fill="none" />
                      <polyline points="28,96 76,74 124,86 172,52 220,64 268,34" fill="none" stroke="#4472C4" strokeWidth="2"
                        strokeDasharray="320" strokeDashoffset={320 * (1 - grow)} />
                      <polyline points="28,108 76,100 124,104 172,88 220,92 268,78" fill="none" stroke="#ED7D31" strokeWidth="2"
                        strokeDasharray="320" strokeDashoffset={320 * (1 - grow)} />
                    </svg>
                  ) : null}
                </div>
              </div>
            </SheetChrome>
          </div>
        );
      })}
    </div>
  );
}

function Hub({ T, accent }) {
  const p = M.enter(25.2, 1.0)(T);
  const out = M.draw(31.6, 0.9)(T);
  if (p <= 0.01 || out >= 1) return null;
  const pulse = 1 + 0.025 * Math.sin(T * 2.1);
  const arrow = M.enter(29.6, 0.6)(T);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: p * (1 - out) }}>
      <svg width="1920" height="1080" style={{ position: 'absolute', left: 0, top: 0 }}>
        {LEFTGRID.map((g, i) => {
          const q = M.draw(25.4 + i * 0.14, 1.1)(T);
          const d = `M${g[0] + 124},${g[1]} C${g[0] + 330},${g[1]} ${HUB[0] - 240},${HUB[1] + (g[1] - HUB[1]) * 0.18} ${HUB[0] - 92},${HUB[1]}`;
          return <path key={i} d={d} fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round"
            strokeDasharray="900" strokeDashoffset={900 * (1 - q)} opacity="0.75"
            style={{ filter: `drop-shadow(0 0 9px ${accent})` }} />;
        })}
        <circle cx={HUB[0]} cy={HUB[1]} r={86 * p} fill="rgba(46,134,255,0.06)" stroke={accent} strokeWidth="1.8"
          opacity={p} style={{ filter: `drop-shadow(0 0 22px ${accent}aa)` }} />
        <g transform={`translate(${HUB[0]},${HUB[1]}) scale(${p * pulse})`} opacity={p}
          style={{ filter: `drop-shadow(0 0 14px ${accent}aa)` }}>
          <path d="M0,-40 L54,-12 L0,16 L-54,-12 Z" fill={accent} />
          <path d="M0,-12 L54,16 L0,44 L-54,16 Z" fill={accent} opacity="0.62" />
          <path d="M0,16 L54,44 L0,72 L-54,44 Z" fill={VIOLET} opacity="0.6" />
        </g>
        <g opacity={arrow} style={{ filter: `drop-shadow(0 0 10px ${accent})` }}>
          <path d="M1072,548 l30,14 -30,14" fill="none" stroke={accent} strokeWidth="4.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function Kpi({ label, value, sub, good, accent, p, spark }) {
  const c = good ? OK : accent;
  return (
    <div style={{
      flex: 1, background: 'rgba(255,255,255,0.045)', border: `1px solid ${GEDGE}`, borderRadius: 14, padding: '14px 16px',
      opacity: p, transform: `translateY(${(1 - p) * 14}px)`, boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
    }}>
      <div style={{ font: `500 10.5px ${MONO}`, letterSpacing: '0.15em', color: MUTE }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, marginTop: 6 }}>
        <div style={{ font: `600 34px ${SANS}`, color: TXT, letterSpacing: '-0.025em' }}>{value}</div>
        <svg width="62" height="24" viewBox="0 0 64 26">
          <polyline points={spark} fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"
            strokeDasharray="90" strokeDashoffset={90 * (1 - p)} style={{ filter: `drop-shadow(0 0 6px ${c}88)` }} />
        </svg>
      </div>
      <div style={{ font: `500 12px ${SANS}`, color: c, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function Card({ label, note, children, flex, h, accent, zoom }) {
  return (
    <div data-zoom={zoom} style={{
      flex: flex || 1, height: h, background: 'rgba(255,255,255,0.04)', border: `1px solid ${GEDGE}`,
      borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ font: `500 10.5px ${MONO}`, letterSpacing: '0.15em', color: MUTE }}>{label}</span>
        {note ? <span style={{ font: `500 11.5px ${MONO}`, color: accent }}>{note}</span> : null}
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  );
}

const USER_PHOTO_DIR = 'uploads/fotos-usuarios/';
const USER_PHOTO_FILES = {
  MR: 'marina-rocha.jpg',
  JS: 'joao-silva.jpg',
  AL: 'ana-lopes.jpg',
  DC: 'diego-costa.jpg',
  CD: 'camila-duarte.jpg',
  RL: 'rafael-lima.jpg',
  BA: 'bruna-alves.jpg',
  DM: 'diego-matos.jpg',
  PR: 'paula-reis.jpg',
  IS: 'igor-sampaio.jpg',
};

function userPhoto(initials) {
  const file = USER_PHOTO_FILES[initials];
  return file ? USER_PHOTO_DIR + file : '';
}

function Avatar({ initials, size, hue, ring, src, alt }) {
  const d = size || 36;
  const [imgStatus, setImgStatus] = React.useState(src ? 'loading' : 'empty');
  const showPhoto = src && imgStatus !== 'error';
  return (
    <div style={{
      position: 'relative', width: d, height: d, borderRadius: 999, flex: 'none', overflow: 'hidden',
      background: `linear-gradient(155deg, hsl(${hue} 48% 46%), hsl(${hue + 30} 42% 26%))`,
      border: ring ? `2px solid ${ring}` : '1px solid rgba(255,255,255,0.18)',
      boxShadow: ring ? `0 0 16px ${ring}66` : 'none',
    }}>
      <svg width={d} height={d} viewBox="0 0 40 40" style={{ display: 'block' }}>
        <circle cx="20" cy="15" r="6.6" fill="rgba(255,255,255,0.9)" />
        <path d="M6.5 40c1.2-7.6 6.8-12.2 13.5-12.2S32.3 32.4 33.5 40z" fill="rgba(255,255,255,0.82)" />
      </svg>
      {showPhoto ? (
        <img
          src={src}
          alt={alt || initials || ''}
          onLoad={() => setImgStatus('loaded')}
          onError={() => setImgStatus('error')}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', display: 'block', opacity: imgStatus === 'loaded' ? 1 : 0,
          }}
        />
      ) : null}
    </div>
  );
}

/* ---------- janela do sistema ---------- */
const WIN = { x: 1024, y: 286, w: 1440, h: 868, k: 0.52 };
const SCREENS = [
  { id: 'login', at: 30.0, until: 33.5, nav: -1 },
  { id: 'painel', at: 33.5, until: 39.5, nav: 0 },
  { id: 'ranking', at: 39.5, until: 44.6, nav: 4 },
  { id: 'usuarios', at: 44.6, until: 49.9, nav: 5 },
  { id: 'painel', at: 49.9, until: 58.6, nav: 0 },
];
const NAV_ITEMS = [
  ['grid', 'Painel'], ['layers', 'Coletas'], ['flow', 'Processos'],
  ['bell', 'Alertas'], ['users', 'Engajamento'], ['shield', 'Usuários'],
];

function Sidebar({ active, accent, p }) {
  return (
    <div style={{
      width: 254, borderRight: `1px solid ${EDGE}`, padding: '26px 20px',
      display: 'flex', flexDirection: 'column', gap: 24, opacity: p,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <svg width="32" height="32" viewBox="-24 -24 48 48" style={{ filter: `drop-shadow(0 0 10px ${accent}aa)` }}>
          <path d="M0,-17 L23,-5 L0,7 L-23,-5 Z" fill={accent} />
          <path d="M0,-5 L23,7 L0,19 L-23,7 Z" fill={accent} opacity="0.6" />
        </svg>
        <div style={{ font: `600 15px ${SANS}`, color: TXT, lineHeight: 1.15 }}>Sistema<br />de Gestão</div>
      </div>
      <div style={{ display: 'grid', gap: 4 }}>
        {NAV_ITEMS.map((n, i) => {
          const on = i === active;
          return (
            <div key={n[1]} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 11,
              background: on ? 'rgba(46,134,255,0.14)' : 'transparent',
              border: `1px solid ${on ? GEDGE : 'transparent'}`,
            }}>
              <NavIcon kind={n[0]} color={on ? accent : '#8FA6C4'} />
              <span style={{ font: `${on ? 600 : 500} 14.5px ${SANS}`, color: on ? TXT : '#B7C8DE' }}>{n[1]}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 11, borderTop: `1px solid ${EDGE}`, paddingTop: 16 }}>
        <Avatar initials="MR" size={34} hue={212} ring={accent} src={userPhoto('MR')} alt="Marina Rocha" />
        <div>
          <div style={{ font: `600 13px ${SANS}`, color: TXT }}>Marina Rocha</div>
          <div style={{ font: `500 11px ${MONO}`, color: MUTE }}>coordenação</div>
        </div>
      </div>
    </div>
  );
}

function ScreenHead({ title, sub, action, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        <div style={{ font: `600 25px ${SANS}`, color: TXT, letterSpacing: '-0.02em' }}>{title}</div>
        <div style={{ font: `500 12px ${MONO}`, color: MUTE, marginTop: 5 }}>{sub}</div>
      </div>
      {action ? (
        <div style={{
          font: `600 13px ${SANS}`, color: '#08152C', background: accent, borderRadius: 10,
          padding: '10px 16px', boxShadow: `0 0 22px ${accent}55`,
        }}>{action}</div>
      ) : null}
    </div>
  );
}

function LoginScreen({ T, accent }) {
  const f1 = M.enter(30.6, 0.5)(T), f2 = M.enter(31.2, 0.5)(T);
  const press = M.enter(32.5, 0.35)(T) * (1 - M.draw(32.9, 0.4)(T));
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 470, background: 'rgba(255,255,255,0.045)', border: `1px solid ${GEDGE}`, borderRadius: 20,
        padding: '38px 40px', boxShadow: `0 30px 80px rgba(0,0,0,0.45), 0 0 50px rgba(46,134,255,0.12)`,
      }}>
        <svg width="44" height="44" viewBox="-24 -24 48 48" style={{ filter: `drop-shadow(0 0 12px ${accent}aa)`, display: 'block' }}>
          <path d="M0,-17 L23,-5 L0,7 L-23,-5 Z" fill={accent} />
          <path d="M0,-5 L23,7 L0,19 L-23,7 Z" fill={accent} opacity="0.6" />
          <path d="M0,7 L23,19 L0,31 L-23,19 Z" fill={VIOLET} opacity="0.55" />
        </svg>
        <div style={{ font: `600 27px ${SANS}`, color: TXT, letterSpacing: '-0.02em', marginTop: 20 }}>Entrar no sistema</div>
        <div style={{ font: `500 12.5px ${MONO}`, color: MUTE, marginTop: 7 }}>acesso por perfil · registro de auditoria</div>
        <div style={{ display: 'grid', gap: 13, marginTop: 26 }}>
          <div>
            <div style={{ font: `500 11px ${MONO}`, letterSpacing: '0.14em', color: MUTE }}>E-MAIL</div>
            <div style={{
              marginTop: 7, height: 46, borderRadius: 11, border: `1px solid ${f1 > 0.5 ? accent : EDGE}`,
              background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', padding: '0 14px',
              font: `500 15px ${SANS}`, color: f1 > 0.5 ? TXT : MUTE,
              boxShadow: f1 > 0.5 ? `0 0 18px ${accent}33` : 'none',
            }}>{f1 > 0.5 ? 'marina.rocha@programa.gov' : 'seu e-mail'}</div>
          </div>
          <div>
            <div style={{ font: `500 11px ${MONO}`, letterSpacing: '0.14em', color: MUTE }}>SENHA</div>
            <div style={{
              marginTop: 7, height: 46, borderRadius: 11, border: `1px solid ${f2 > 0.5 ? accent : EDGE}`,
              background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', padding: '0 14px',
              font: `600 18px ${MONO}`, color: TXT, letterSpacing: '0.24em',
              boxShadow: f2 > 0.5 ? `0 0 18px ${accent}33` : 'none',
            }}>{f2 > 0.5 ? '••••••••••' : ''}</div>
          </div>
        </div>
        <div style={{
          marginTop: 24, height: 52, borderRadius: 12, background: accent, color: '#08152C',
          font: `600 16px ${SANS}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `scale(${1 - 0.03 * press})`, boxShadow: `0 0 ${26 + 20 * press}px ${accent}66`,
        }}>Entrar</div>
        <div style={{ font: `500 11.5px ${MONO}`, color: MUTE, marginTop: 16, textAlign: 'center' }}>
          autenticação em duas etapas ativa
        </div>
      </div>
    </div>
  );
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'];
const CX = [16, 94, 172, 250, 328, 406, 484, 558];
const S26 = [232, 208, 214, 156, 134, 92, 62, 34];
const S25 = [244, 236, 228, 214, 206, 190, 178, 166];
const SMETA = [238, 220, 202, 184, 166, 148, 130, 112];
const REGIONS = ['Leste', 'Norte', 'Sul', 'Centro', 'Oeste', 'Serra'];
const HEAT = [
  [0.95, 0.88, 0.72, 0.64], [0.82, 0.9, 0.68, 0.55], [0.7, 0.62, 0.85, 0.48],
  [0.58, 0.44, 0.52, 0.9], [0.46, 0.66, 0.4, 0.62], [0.9, 0.54, 0.74, 0.36],
];
const PEND = [['Documentação', 62], ['Prazo de entrega', 38], ['Validação técnica', 24], ['Visita em campo', 12]];

function PainelScreen({ T, accent }) {
  const area = M.draw(34.6, 1.9)(T);
  const l2 = M.draw(35.1, 1.7)(T);
  const l3 = M.draw(35.5, 1.6)(T);
  const donut = M.draw(35.0, 1.6)(T);
  const heat = M.draw(36.0, 1.6)(T);
  const bars = M.draw(36.4, 1.4)(T);
  const call = M.enter(37.0, 0.7)(T);
  const cut = (arr, prog) => {
    const n = Math.max(2, Math.round(CX.length * prog));
    return CX.slice(0, n).map((x, i) => `${x},${arr[i]}`).join(' ');
  };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
      <ScreenHead title="Painel do programa" sub="fonte única · 34 unidades · atualizado agora" action="Relatório" accent={accent} />
      <div style={{ display: 'flex', gap: 11 }}>
        <Kpi label="COLETAS VALIDADAS" value="1.321" sub="em tempo real" accent={accent} p={M.enter(33.9, 0.7)(T)} spark="2,22 13,18 24,20 35,12 46,9 60,4" />
        <Kpi label="PENDÊNCIAS" value="12" sub="3 vencem hoje" accent={accent} p={M.enter(34.1, 0.7)(T)} spark="2,6 13,10 24,8 35,14 46,16 60,20" />
        <Kpi label="COBERTURA" value="92%" sub="meta 85%" good accent={accent} p={M.enter(34.3, 0.7)(T)} spark="2,20 13,17 24,14 35,12 46,8 60,5" />
        <Kpi label="PRAZO MÉDIO" value="2,4d" sub="antes 11d" good accent={accent} p={M.enter(34.5, 0.7)(T)} spark="2,4 13,7 24,10 35,13 46,17 60,21" />
      </div>
      <div style={{ flex: 1, display: 'flex', gap: 11, minHeight: 0 }}>
        <div style={{ flex: 1.62, display: 'flex', flexDirection: 'column', gap: 11, minHeight: 0 }}>
          <Card label="COMPARATIVO · EXECUÇÃO, META E ANO ANTERIOR" note="+18% no trimestre" accent={OK} flex={1.32} zoom="painel">
            <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
              {[['2026', accent], ['Meta', '#9DB4D4'], ['2025', VIOLET]].map(l => (
                <div key={l[0]} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 15, height: 3, borderRadius: 2, background: l[1] }}></div>
                  <span style={{ font: `500 11px ${MONO}`, color: MUTE }}>{l[0]}</span>
                </div>
              ))}
            </div>
            <svg viewBox="0 0 580 300" preserveAspectRatio="none" style={{ flex: 1, width: '100%', marginTop: 4 }}>
              <defs>
                <linearGradient id="dashArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.42" />
                  <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </linearGradient>
              </defs>
              {[56, 106, 156, 206, 256].map(y => <line key={y} x1="16" y1={y} x2="566" y2={y} stroke="rgba(150,180,220,0.11)" strokeWidth="1" />)}
              <polyline points={cut(S26, area) + ' 558,262 16,262'} fill="url(#dashArea)" stroke="none" opacity={area} />
              <polyline points={cut(SMETA, l2)} fill="none" stroke="#9DB4D4" strokeWidth="2.2" strokeDasharray="6 6" opacity="0.8" />
              <polyline points={cut(S25, l3)} fill="none" stroke={VIOLET} strokeWidth="2.6" strokeLinecap="round" />
              <polyline points={cut(S26, area)} fill="none" stroke={accent} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 10px ${accent}88)` }} />
              {CX.slice(0, Math.max(2, Math.round(CX.length * area))).map((x, i) => (
                <circle key={i} cx={x} cy={S26[i]} r="4.5" fill={BG} stroke={accent} strokeWidth="2.6" />
              ))}
              {MONTHS.map((m, i) => (
                <text key={m} x={CX[i]} y="288" textAnchor="middle" fill="#7C8DA6" style={{ font: `500 12px ${MONO}` }}>{m}</text>
              ))}
              {call > 0.01 ? (
                <g opacity={call}>
                  <line x1="484" y1="62" x2="484" y2="262" stroke={accent} strokeWidth="1.2" strokeDasharray="4 5" opacity="0.65" />
                  <rect x="378" y="10" width="192" height="48" rx="10" fill="#0A1830" stroke={accent} strokeWidth="1.2" />
                  <text x="392" y="31" fill={TXT} style={{ font: `600 14px ${SANS}` }}>Jul · 107% da meta</text>
                  <text x="392" y="48" fill="#7C8DA6" style={{ font: `500 11px ${MONO}` }}>+41% vs. 2025</text>
                </g>
              ) : null}
            </svg>
          </Card>
          <Card label="MAPA DE COBERTURA · REGIONAIS x SEMANAS" note="92% coberto" accent={accent} flex={1}>
            <div style={{ flex: 1, display: 'flex', gap: 10, marginTop: 10, minHeight: 0 }}>
              <div style={{ display: 'grid', gap: 7, paddingTop: 2 }}>
                {REGIONS.map(r => (
                  <div key={r} style={{ font: `500 11px ${MONO}`, color: MUTE, height: 18, lineHeight: '18px' }}>{r}</div>
                ))}
              </div>
              <div style={{ flex: 1, display: 'grid', gap: 7 }}>
                {HEAT.map((row, ri) => (
                  <div key={ri} style={{ display: 'flex', gap: 7, height: 18 }}>
                    {row.map((v, ci) => {
                      const q = clamp(heat * 26 - (ri * 4 + ci), 0, 1);
                      return <div key={ci} style={{
                        flex: 1, borderRadius: 4,
                        background: v > 0.8 ? accent : v > 0.6 ? '#3B72C4' : v > 0.45 ? '#2B4E86' : '#1D3355',
                        opacity: (0.25 + 0.75 * v) * q,
                        boxShadow: v > 0.85 ? `0 0 12px ${accent}66` : 'none',
                      }}></div>;
                    })}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: 4 }}>
                <span style={{ font: `500 10px ${MONO}`, color: MUTE }}>alta</span>
                <div style={{ width: 8, flex: 1, margin: '6px 0', borderRadius: 4, background: `linear-gradient(${accent}, #1D3355)` }}></div>
                <span style={{ font: `500 10px ${MONO}`, color: MUTE }}>baixa</span>
              </div>
            </div>
          </Card>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 11, minHeight: 0 }}>
          <Card label="ETAPAS DO PROCESSO" flex={1.1}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, minHeight: 0 }}>
              <svg width="150" height="150" viewBox="0 0 120 120" style={{ flex: 'none' }}>
                <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(150,180,220,0.16)" strokeWidth="15" />
                <circle cx="60" cy="60" r="46" fill="none" stroke={accent} strokeWidth="15" strokeLinecap="round"
                  strokeDasharray="289" strokeDashoffset={289 - 168 * donut} transform="rotate(-90 60 60)"
                  style={{ filter: `drop-shadow(0 0 8px ${accent}88)` }} />
                <circle cx="60" cy="60" r="46" fill="none" stroke={OK} strokeWidth="15" strokeLinecap="round"
                  strokeDasharray="289" strokeDashoffset={289 - 62 * donut} transform="rotate(118 60 60)" />
                <circle cx="60" cy="60" r="46" fill="none" stroke={VIOLET} strokeWidth="15" strokeLinecap="round"
                  strokeDasharray="289" strokeDashoffset={289 - 34 * donut} transform="rotate(200 60 60)" />
                <text x="60" y="57" textAnchor="middle" fill={TXT} style={{ font: `600 21px ${SANS}` }} opacity={donut}>58%</text>
                <text x="60" y="74" textAnchor="middle" fill="#7C8DA6" style={{ font: `500 8px ${MONO}` }} opacity={donut}>CONCLUÍDO</text>
              </svg>
              <div style={{ flex: 1, display: 'grid', gap: 9 }}>
                {[['Concluído', OK, '58%'], ['Em andamento', accent, '31%'], ['Atrasado', VIOLET, '11%']].map(r => (
                  <div key={r[0]} style={{ display: 'flex', alignItems: 'center', gap: 9, opacity: donut }}>
                    <div style={{ width: 9, height: 9, borderRadius: 3, background: r[1] }}></div>
                    <span style={{ font: `500 13px ${SANS}`, color: TXT, flex: 1 }}>{r[0]}</span>
                    <span style={{ font: `500 12px ${MONO}`, color: MUTE }}>{r[2]}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card label="PENDÊNCIAS POR TIPO" note="136 abertas" accent={accent} flex={1}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 13 }}>
              {PEND.map((r, i) => {
                const q = clamp(bars * 4 - i, 0, 1);
                return (
                  <div key={r[0]} style={{ display: 'grid', gap: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ font: `500 12.5px ${SANS}`, color: '#C6D6EA' }}>{r[0]}</span>
                      <span style={{ font: `600 12px ${MONO}`, color: TXT }}>{Math.round(r[1] * q)}</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: 'rgba(150,180,220,0.16)' }}>
                      <div style={{
                        width: `${(r[1] / 62) * 100 * q}%`, height: '100%', borderRadius: 4,
                        background: i === 0 ? accent : i === 3 ? VIOLET : '#4C86D8',
                        boxShadow: i === 0 ? `0 0 12px ${accent}66` : 'none',
                      }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const RANK = [
  ['Camila Duarte', 'Unidade Leste', 'CD', 4820, 100, 208],
  ['Rafael Lima', 'Unidade Norte', 'RL', 4310, 89, 24],
  ['Bruna Alves', 'Unidade Sul', 'BA', 3980, 82, 158],
  ['Diego Matos', 'Unidade Centro', 'DM', 3120, 65, 96],
  ['Paula Reis', 'Unidade Oeste', 'PR', 2740, 57, 274],
  ['Igor Sampaio', 'Unidade Serra', 'IS', 2210, 46, 130],
];

function RankingScreen({ T, accent }) {
  const MEDAL = ['#F2C14E', '#C6D2E2', '#CE8C55'];
  const grow = M.draw(40.4, 1.5)(T);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
      <ScreenHead title="Engajamento das equipes" sub="ciclo de agosto · pontos por coleta validada, prazo e qualidade" action="Definir meta" accent={accent} />
      <div data-zoom="ranking" style={{ display: 'flex', gap: 11 }}>
        {[0, 1, 2].map(i => {
          const p = M.enter(39.9 + i * 0.2, 0.7)(T);
          const r = RANK[i];
          return (
            <div key={i} style={{
              flex: 1, background: i === 0 ? 'rgba(46,134,255,0.10)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${i === 0 ? GEDGE : EDGE}`, borderRadius: 15, padding: '15px 17px',
              opacity: p, transform: `translateY(${(1 - p) * 16}px)`,
              display: 'flex', alignItems: 'center', gap: 13,
              boxShadow: i === 0 ? '0 0 32px rgba(46,134,255,0.16)' : 'none',
            }}>
              <div style={{ position: 'relative' }}>
                <Avatar initials={r[2]} size={52} hue={r[5]} ring={MEDAL[i]} src={userPhoto(r[2])} alt={r[0]} />
                <div style={{
                  position: 'absolute', right: -6, bottom: -6, width: 24, height: 24, borderRadius: 999,
                  background: MEDAL[i], color: '#0A1526', font: `700 12px ${MONO}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{i + 1}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: `600 16px ${SANS}`, color: TXT }}>{r[0]}</div>
                <div style={{ font: `500 11.5px ${MONO}`, color: MUTE, marginTop: 3 }}>{r[1]}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ font: `600 26px ${SANS}`, color: TXT, letterSpacing: '-0.02em' }}>
                  {Math.round(r[3] * grow).toLocaleString('pt-BR')}
                </div>
                <div style={{ font: `500 11px ${MONO}`, color: MUTE }}>pontos</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ flex: 1, display: 'flex', gap: 11, minHeight: 0 }}>
        <Card label="PONTUAÇÃO POR UNIDADE" note="ciclo atual" accent={accent} flex={1.34}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: 14, minHeight: 0 }}>
            {RANK.map((r, i) => {
              const q = clamp(M.draw(41.0, 1.4)(T) * 6 - i * 0.8, 0, 1);
              return (
                <div key={r[0]} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ font: `600 12.5px ${MONO}`, color: i === 0 ? accent : MUTE }}>{Math.round(r[3] * q).toLocaleString('pt-BR')}</span>
                  <div style={{
                    width: '72%', height: `${r[4] * 0.68 * q}%`, borderRadius: '7px 7px 3px 3px',
                    background: i === 0 ? `linear-gradient(${accent}, #1C4E96)` : 'linear-gradient(#4C86D8, #1B3A66)',
                    boxShadow: i === 0 ? `0 0 20px ${accent}55` : 'none',
                  }}></div>
                  <Avatar initials={r[2]} size={30} hue={r[5]} ring={i === 0 ? accent : null} src={userPhoto(r[2])} alt={r[0]} />
                  <span style={{ font: `500 10.5px ${MONO}`, color: MUTE, textAlign: 'center' }}>{r[1].replace('Unidade ', '')}</span>
                </div>
              );
            })}
          </div>
        </Card>
        <Card label="CLASSIFICAÇÃO GERAL" flex={1}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
            {RANK.map((r, i) => {
              const q = M.enter(41.6 + i * 0.14, 0.55)(T);
              return (
                <div key={r[0]} style={{
                  display: 'flex', alignItems: 'center', gap: 11, opacity: q,
                  transform: `translateX(${(1 - q) * 14}px)`,
                  background: i === 0 ? 'rgba(46,134,255,0.10)' : 'transparent',
                  border: `1px solid ${i === 0 ? GEDGE : 'transparent'}`,
                  borderRadius: 11, padding: '7px 9px',
                }}>
                  <span style={{ font: `600 12px ${MONO}`, color: i < 3 ? MEDAL[i] : MUTE, width: 20 }}>{i + 1}º</span>
                  <Avatar initials={r[2]} size={30} hue={r[5]} src={userPhoto(r[2])} alt={r[0]} />
                  <div style={{ flex: 1 }}>
                    <div style={{ font: `600 13px ${SANS}`, color: TXT }}>{r[0]}</div>
                    <div style={{ height: 5, borderRadius: 3, background: 'rgba(150,180,220,0.16)', marginTop: 5 }}>
                      <div style={{ width: `${r[4] * q}%`, height: '100%', borderRadius: 3, background: i === 0 ? accent : '#5F87C9' }}></div>
                    </div>
                  </div>
                  <span style={{ font: `600 12.5px ${MONO}`, color: TXT }}>{r[3].toLocaleString('pt-BR')}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

const USERS = [
  ['MR', 'Marina Rocha', 'Coordenação', 'Sede', 'agora', 'ativo', 'todos os módulos', 212],
  ['JS', 'João Silva', 'Equipe de campo', 'Unidade Leste', 'há 12 min', 'ativo', 'coleta e ocorrências', 158],
  ['AL', 'Ana Lopes', 'Auditoria', 'Sede', 'há 2 h', 'ativo', 'somente leitura', 274],
  ['DC', 'Diego Costa', 'Supervisão', 'Unidade Norte', 'ontem', 'ativo', 'aprovações', 24],
  ['PR', 'Paula Reis', 'Equipe de campo', 'Unidade Oeste', 'há 5 dias', 'convite', 'coleta', 96],
];

function UsuariosScreen({ T, accent }) {
  const cols = ['USUÁRIO', 'PERFIL', 'UNIDADE', 'ÚLTIMO ACESSO', 'PERMISSÕES', 'STATUS'];
  const flexes = [2.1, 1.3, 1.3, 1.2, 1.6, 0.9];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
      <ScreenHead title="Usuários e permissões" sub="24 ativos · 3 convites pendentes · histórico completo por ação" action="Convidar usuário" accent={accent} />
      <div style={{ display: 'flex', gap: 11 }}>
        {[['ATIVOS', '24'], ['PERFIS', '5'], ['CONVITES', '3'], ['AÇÕES REGISTRADAS', '9.412']].map((k, i) => {
          const q = M.enter(45.0 + i * 0.14, 0.6)(T);
          return (
            <div key={k[0]} style={{
              flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${EDGE}`, borderRadius: 13,
              padding: '13px 16px', opacity: q, transform: `translateY(${(1 - q) * 12}px)`,
            }}>
              <div style={{ font: `500 10.5px ${MONO}`, letterSpacing: '0.15em', color: MUTE }}>{k[0]}</div>
              <div style={{ font: `600 28px ${SANS}`, color: TXT, letterSpacing: '-0.02em', marginTop: 4 }}>{k[1]}</div>
            </div>
          );
        })}
      </div>
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${EDGE}`, borderRadius: 16, padding: '16px 18px', minHeight: 0 }}>
        <div style={{ display: 'flex', gap: 14, paddingBottom: 12, borderBottom: `1px solid ${EDGE}` }}>
          {cols.map((c, i) => (
            <div key={c} style={{ font: `500 10.5px ${MONO}`, letterSpacing: '0.15em', color: MUTE, flex: flexes[i] }}>{c}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gap: 2, marginTop: 6 }}>
          {USERS.map((u, i) => {
            const q = M.enter(45.7 + i * 0.18, 0.6)(T);
            const on = u[5] === 'ativo';
            return (
              <div key={u[1]} style={{
                display: 'flex', gap: 14, alignItems: 'center', padding: '10px 0',
                borderBottom: i < USERS.length - 1 ? '1px solid rgba(150,180,220,0.10)' : 'none',
                opacity: q, transform: `translateY(${(1 - q) * 10}px)`,
              }}>
                <div style={{ flex: flexes[0], display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar initials={u[0]} size={34} hue={u[7]} ring={i === 0 ? accent : null} src={userPhoto(u[0])} alt={u[1]} />
                  <span style={{ font: `600 14.5px ${SANS}`, color: TXT }}>{u[1]}</span>
                </div>
                <span style={{ flex: flexes[1], font: `500 13.5px ${SANS}`, color: '#C6D6EA' }}>{u[2]}</span>
                <span style={{ flex: flexes[2], font: `500 13.5px ${SANS}`, color: '#C6D6EA' }}>{u[3]}</span>
                <span style={{ flex: flexes[3], font: `500 12px ${MONO}`, color: MUTE }}>{u[4]}</span>
                <span style={{ flex: flexes[4], font: `500 12px ${MONO}`, color: MUTE }}>{u[6]}</span>
                <div style={{ flex: flexes[5] }}>
                  <span style={{
                    font: `600 11.5px ${MONO}`, color: on ? OK : '#F2C14E',
                    border: `1px solid ${on ? OK : '#F2C14E'}`, borderRadius: 999, padding: '4px 11px',
                  }}>{u[5]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- alvos do super zoom ----------
   Em vez de chutar coordenadas, medimos o elemento marcado com data-zoom
   usando offsetLeft/offsetTop, que são coordenadas de layout e não sofrem
   com os transforms da câmera. O offsetParent do alvo é a própria janela
   (ou o celular), então uma leitura já dá o deslocamento completo.
   O resultado fica em cache: a geometria não muda durante a peça.        */
const ZOOM_CACHE = {};

function alvoZoom(chave) {
  if (ZOOM_CACHE[chave]) return ZOOM_CACHE[chave];
  if (typeof document === 'undefined') return null;
  const el = document.querySelector('[data-zoom="' + chave + '"]');
  if (!el || !el.offsetWidth) return null;
  let x = 0, y = 0, n = el, raiz = null;
  while (n) {
    if (n.dataset && n.dataset.zoomroot) { raiz = n.dataset.zoomroot; break; }
    x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent;
  }
  if (!raiz) return null;
  const base = raiz === 'phone' ? PHONE : WIN;
  const k = raiz === 'phone' ? PHONE.k : WIN.k;
  const alvo = {
    cx: base.x + (x + el.offsetWidth / 2) * k,
    cy: base.y + (y + el.offsetHeight / 2) * k,
    w: el.offsetWidth * k,
    h: el.offsetHeight * k,
  };
  ZOOM_CACHE[chave] = alvo;
  return alvo;
}

function AppWindow({ T, accent }) {
  const p = M.enter(29.9, 1.0)(T);
  const out = M.draw(58.6, 0.8)(T);
  if (p <= 0.01 || out >= 1) return null;
  const mob = M.draw(49.9, 1.2)(T);
  const shift = mob * -302;
  let cur = SCREENS[0];
  for (const sc of SCREENS) if (T >= sc.at) cur = sc;
  const inP = clamp((T - cur.at) / 0.55, 0, 1);
  const screen = cur.id === 'login' ? <LoginScreen T={T} accent={accent} />
    : cur.id === 'painel' ? <PainelScreen T={T} accent={accent} />
    : cur.id === 'ranking' ? <RankingScreen T={T} accent={accent} />
    : <UsuariosScreen T={T} accent={accent} />;
  return (
    <div data-zoomroot="win" style={{
      position: 'absolute', left: WIN.x + shift, top: WIN.y, width: WIN.w, height: WIN.h,
      transformOrigin: '0 0', transform: `scale(${WIN.k * (1 - 0.12 * mob)}) translateY(${(1 - p) * 40}px)`,
      opacity: p * (1 - out), background: GLASS, border: `1px solid ${GEDGE}`, borderRadius: 26,
      boxShadow: '0 50px 120px rgba(0,0,0,0.55), 0 0 70px rgba(46,134,255,0.16)',
      display: 'flex', overflow: 'hidden',
    }}>
      {cur.id === 'login' ? null : <Sidebar active={cur.nav} accent={accent} p={clamp((T - 33.3) / 0.6, 0, 1)} />}
      <div style={{
        flex: 1, padding: '26px 30px', display: 'flex', minWidth: 0,
        opacity: 0.25 + 0.75 * inP, transform: `translateY(${(1 - Easing.easeOutCubic(inP)) * 18}px)`,
      }}>{screen}</div>
    </div>
  );
}

/* ---------- visão mobile ---------- */
const PHONE = { x: 1688, y: 158, w: 430, h: 900, k: 0.86 };
const M_SCREENS = [
  { id: 'painel', at: 50.8, until: 53.6 },
  { id: 'ranking', at: 53.6, until: 56.0 },
  { id: 'usuarios', at: 56.0, until: 58.6 },
];

function MobileHead({ title, sub, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ font: `600 22px ${SANS}`, color: TXT, letterSpacing: '-0.02em' }}>{title}</div>
        <div style={{ font: `500 11px ${MONO}`, color: MUTE, marginTop: 4 }}>{sub}</div>
      </div>
      <Avatar initials="MR" size={36} hue={212} ring={accent} src={userPhoto('MR')} alt="Marina Rocha" />
    </div>
  );
}

function MobilePainel({ T, accent }) {
  const line = M.draw(51.4, 1.4)(T);
  const pts = '10,86 44,74 78,78 112,54 146,46 180,28 214,16';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
      <MobileHead title="Painel" sub="atualizado agora" accent={accent} />
      <div style={{ display: 'flex', gap: 10 }}>
        {[['COLETAS', '1.321', false], ['PENDÊNCIAS', '12', true]].map(k => (
          <div key={k[0]} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid ${GEDGE}`, borderRadius: 14, padding: '12px 13px' }}>
            <div style={{ font: `500 9.5px ${MONO}`, letterSpacing: '0.14em', color: MUTE }}>{k[0]}</div>
            <div style={{ font: `600 26px ${SANS}`, color: TXT, marginTop: 4, letterSpacing: '-0.02em' }}>{k[1]}</div>
            <div style={{ font: `500 10.5px ${SANS}`, color: k[2] ? '#F2C14E' : OK, marginTop: 2 }}>{k[2] ? '3 vencem hoje' : '+37 hoje'}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${GEDGE}`, borderRadius: 14, padding: '13px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ font: `500 9.5px ${MONO}`, letterSpacing: '0.14em', color: MUTE }}>EXECUÇÃO x META</span>
          <span style={{ font: `500 10.5px ${MONO}`, color: OK }}>+18%</span>
        </div>
        <svg viewBox="0 0 224 100" style={{ width: '100%', marginTop: 8 }}>
          <path d="M10 92 L214 34" fill="none" stroke="rgba(150,180,220,0.3)" strokeWidth="1.4" strokeDasharray="4 5" />
          <polyline points={pts} fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round"
            strokeDasharray="260" strokeDashoffset={260 * (1 - line)} style={{ filter: `drop-shadow(0 0 7px ${accent}99)` }} />
        </svg>
      </div>
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid ${GEDGE}`, borderRadius: 14, padding: '13px 14px', minHeight: 0 }}>
        <div style={{ font: `500 9.5px ${MONO}`, letterSpacing: '0.14em', color: MUTE }}>PENDÊNCIAS</div>
        <div style={{ display: 'grid', gap: 11, marginTop: 12 }}>
          {[['Unidade Norte', 'vence hoje', '#F2C14E'], ['Unidade Sul', 'em análise', accent], ['Unidade Leste', 'concluída', OK]].map((r, i) => {
            const q = M.enter(52.0 + i * 0.2, 0.5)(T);
            return (
              <div key={r[0]} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: q }}>
                <div style={{ width: 8, height: 8, borderRadius: 999, background: r[2] }}></div>
                <span style={{ font: `500 13.5px ${SANS}`, color: TXT, flex: 1 }}>{r[0]}</span>
                <span style={{ font: `500 11px ${MONO}`, color: MUTE }}>{r[1]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileRanking({ T, accent }) {
  const MEDAL = ['#F2C14E', '#C6D2E2', '#CE8C55'];
  const grow = M.draw(54.0, 1.2)(T);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
      <div data-zoom="mobile" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <MobileHead title="Engajamento" sub="ciclo de agosto" accent={accent} />
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 116, marginTop: 4 }}>
        {[1, 0, 2].map((idx, pos) => {
          const r = RANK[idx];
          const hgt = [64, 86, 52][pos];
          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
              <Avatar initials={r[2]} size={pos === 1 ? 42 : 34} hue={r[5]} ring={MEDAL[idx]} src={userPhoto(r[2])} alt={r[0]} />
              <div style={{
                width: '84%', height: hgt * grow, borderRadius: '8px 8px 0 0',
                background: idx === 0 ? `linear-gradient(${accent}, #1C4E96)` : 'rgba(255,255,255,0.09)',
                border: `1px solid ${idx === 0 ? GEDGE : EDGE}`, borderBottom: 'none',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 6,
                boxShadow: idx === 0 ? `0 0 22px ${accent}55` : 'none',
              }}>
                <span style={{ font: `700 14px ${MONO}`, color: idx === 0 ? '#081428' : TXT }}>{idx + 1}º</span>
              </div>
            </div>
          );
        })}
      </div>
      </div>
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid ${GEDGE}`, borderRadius: 14, padding: '13px 14px', minHeight: 0 }}>
        <div style={{ font: `500 9.5px ${MONO}`, letterSpacing: '0.14em', color: MUTE }}>CLASSIFICAÇÃO</div>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {RANK.slice(0, 5).map((r, i) => {
            const q = M.enter(54.4 + i * 0.14, 0.5)(T);
            return (
              <div key={r[0]} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: q }}>
                <span style={{ font: `600 11px ${MONO}`, color: i < 3 ? MEDAL[i] : MUTE, width: 16 }}>{i + 1}</span>
                <Avatar initials={r[2]} size={28} hue={r[5]} src={userPhoto(r[2])} alt={r[0]} />
                <div style={{ flex: 1 }}>
                  <div style={{ font: `600 12.5px ${SANS}`, color: TXT }}>{r[0]}</div>
                  <div style={{ height: 4, borderRadius: 2, background: 'rgba(150,180,220,0.18)', marginTop: 4 }}>
                    <div style={{ width: `${r[4] * q}%`, height: '100%', borderRadius: 2, background: i === 0 ? accent : '#5F87C9' }}></div>
                  </div>
                </div>
                <span style={{ font: `600 11.5px ${MONO}`, color: TXT }}>{r[3].toLocaleString('pt-BR')}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileUsuarios({ T, accent }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
      <MobileHead title="Usuários" sub="24 ativos · 3 convites" accent={accent} />
      <div style={{
        height: 42, borderRadius: 12, border: `1px solid ${EDGE}`, background: 'rgba(255,255,255,0.03)',
        display: 'flex', alignItems: 'center', gap: 9, padding: '0 13px',
      }}>
        <svg width="15" height="15" viewBox="0 0 16 16"><circle cx="7" cy="7" r="5" fill="none" stroke={MUTE} strokeWidth="1.8" /><path d="M11 11l4 4" stroke={MUTE} strokeWidth="1.8" strokeLinecap="round" /></svg>
        <span style={{ font: `500 13px ${SANS}`, color: MUTE }}>buscar pessoa ou unidade</span>
      </div>
      <div data-zoom="lista" style={{ flex: 1, display: 'grid', gap: 9, alignContent: 'start', minHeight: 0 }}>
        {USERS.map((u, i) => {
          const q = M.enter(56.4 + i * 0.16, 0.5)(T);
          const on = u[5] === 'ativo';
          return (
            <div key={u[1]} style={{
              display: 'flex', alignItems: 'center', gap: 11, opacity: q,
              transform: `translateY(${(1 - q) * 10}px)`,
              background: 'rgba(255,255,255,0.045)', border: `1px solid ${i === 0 ? GEDGE : EDGE}`,
              borderRadius: 13, padding: '11px 12px',
            }}>
              <Avatar initials={u[0]} size={34} hue={u[7]} ring={i === 0 ? accent : null} src={userPhoto(u[0])} alt={u[1]} />
              <div style={{ flex: 1 }}>
                <div style={{ font: `600 13.5px ${SANS}`, color: TXT }}>{u[1]}</div>
                <div style={{ font: `500 10.5px ${MONO}`, color: MUTE, marginTop: 2 }}>{u[2]} · {u[3]}</div>
              </div>
              <span style={{
                font: `600 10px ${MONO}`, color: on ? OK : '#F2C14E',
                border: `1px solid ${on ? OK : '#F2C14E'}`, borderRadius: 999, padding: '3px 9px',
              }}>{u[5]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Phone({ T, accent }) {
  const p = M.enter(50.4, 1.0)(T);
  const out = M.draw(58.6, 0.8)(T);
  if (p <= 0.01 || out >= 1) return null;
  let cur = M_SCREENS[0];
  for (const sc of M_SCREENS) if (T >= sc.at) cur = sc;
  const inP = clamp((T - cur.at) / 0.5, 0, 1);
  const tabs = ['grid', 'layers', 'users', 'shield'];
  const activeTab = cur.id === 'painel' ? 0 : cur.id === 'ranking' ? 2 : 3;
  const screen = cur.id === 'painel' ? <MobilePainel T={T} accent={accent} />
    : cur.id === 'ranking' ? <MobileRanking T={T} accent={accent} />
    : <MobileUsuarios T={T} accent={accent} />;
  return (
    <div data-zoomroot="phone" style={{
      position: 'absolute', left: PHONE.x, top: PHONE.y, width: PHONE.w, height: PHONE.h,
      transformOrigin: '0 0', opacity: p * (1 - out),
      transform: `scale(${PHONE.k}) translate(${(1 - p) * 120}px, 0)`,
      background: GLASS, border: `11px solid #12233C`, borderRadius: 54,
      boxShadow: '0 50px 120px rgba(0,0,0,0.55), 0 0 66px rgba(46,134,255,0.16)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px 4px' }}>
        <span style={{ font: `600 13px ${MONO}`, color: TXT }}>9:41</span>
        <div style={{ width: 104, height: 24, borderRadius: 999, background: '#12233C' }}></div>
        <span style={{ font: `500 12px ${MONO}`, color: MUTE }}>4G ▮</span>
      </div>
      <div style={{
        flex: 1, padding: '20px 22px 14px', display: 'flex', minHeight: 0,
        opacity: 0.3 + 0.7 * inP, transform: `translateY(${(1 - Easing.easeOutCubic(inP)) * 16}px)`,
      }}>{screen}</div>
      <div style={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        borderTop: `1px solid ${EDGE}`, padding: '14px 0 22px',
      }}>
        {tabs.map((t, i) => (
          <div key={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <NavIcon kind={t} color={i === activeTab ? accent : '#68809E'} />
            <div style={{ width: 5, height: 5, borderRadius: 999, background: i === activeTab ? accent : 'transparent' }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Close({ T, accent }) {
  const p = M.enter(59.6, 1.0)(T);
  if (p <= 0.01) return null;
  const p2 = M.enter(60.8, 0.9)(T);
  const b = { color: accent, fontWeight: 700 };
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 34, opacity: p, padding: '0 200px',
    }}>
      <div style={{
        font: `500 60px ${SANS}`, color: TXT, textAlign: 'center', letterSpacing: '-0.03em',
        lineHeight: 1.2, textWrap: 'balance', transform: `translateY(${(1 - p) * 18}px)`,
      }}>
        Seu processo cresceu além da <span style={b}>planilha</span>?
      </div>
      <div style={{
        font: `500 44px ${SANS}`, color: MUTE, textAlign: 'center', letterSpacing: '-0.02em',
        lineHeight: 1.32, maxWidth: 1320, textWrap: 'balance',
        opacity: p2, transform: `translateY(${(1 - p2) * 14}px)`,
      }}>
        Transforme-o em um <span style={b}>sistema de gestão sob medida</span>.
      </div>
    </div>
  );
}

const TITLES = [
  { at: 0.6, until: 3.4, text: 'No começo, uma planilha resolve.', size: 62 },
  { at: 4.0, until: 7.6, text: 'Mas o projeto cresce.', size: 76 },
  { at: 8.0, until: 11.4, text: 'E a informação começa a se espalhar.', size: 58 },
  { at: 11.9, until: 15.4, text: 'Mais retrabalho. Mais versões. Menos controle.', size: 46 },
  { at: 16.4, until: 19.8, text: 'Cada base gera o seu próprio relatório.', size: 52, top: true },
  { at: 20.3, until: 23.7, text: 'O problema não são as ferramentas. É a falta de um fluxo integrado.', size: 50 },
  { at: 24.2, until: 27.4, text: 'É aqui que entra um sistema de gestão.', size: 66 },
  { at: 27.6, until: 29.6, text: 'Tudo passa a viver em um só lugar.', size: 54 },
  { at: 30.4, until: 33.2, text: 'Acesso por perfil, com registro de tudo.', size: 40, top: true },
  { at: 33.8, until: 39.2, text: 'Indicadores atualizados. Decisões mais rápidas.', size: 40, top: true },
  { at: 39.9, until: 44.3, text: 'Metas e ranking mantêm as equipes engajadas.', size: 40, top: true },
  { at: 44.9, until: 49.6, text: 'Cada pessoa com o seu acesso e o seu histórico.', size: 40, top: true },
  { at: 50.6, until: 55.8, text: 'E o mesmo sistema vai para o campo.', size: 40, top: true },
  { at: 56.1, until: 58.4, text: 'Mesmos dados, na mão da equipe.', size: 40, top: true },
];

function Titles({ T, accent }) {
  let a = null, end = 0;
  for (const it of TITLES) if (T >= it.at) { a = it; end = it.until; }
  if (!a || T >= end) return null;
  const o = clamp(Math.min((T - a.at) / 0.3, (end - T) / 0.3), 0, 1);
  const rise = clamp((T - a.at) / 0.55, 0, 1);
  return (
    <div style={{
      position: 'absolute', left: 104, top: a.top ? 54 : 'auto', bottom: a.top ? 'auto' : 86,
      opacity: o, maxWidth: 1260,
    }}>
      <div style={{ width: 54 * rise, height: 3, background: accent, borderRadius: 2, marginBottom: 14 }}></div>
      <div style={{
        font: `600 ${a.size}px ${SANS}`, color: TXT, letterSpacing: '-0.035em', lineHeight: 1.1,
        transform: `translateY(${(1 - Easing.easeOutCubic(rise)) * 14}px)`, textWrap: 'balance',
        textShadow: '0 6px 30px rgba(6,14,28,0.9)',
      }}>{a.text}</div>
    </div>
  );
}

function Piece(props) {
  const T = useComposition().T;
  const accent = props.accent;
  // Câmera base: enquadramento FIXO em cada trecho, sem aproximação lenta.
  //   32.2-48.2  painel inteiro em 1.86
  //   48.2-50.2  recua para caber painel + celular
  //   50.2-58.0  1.28 (teto do mobile: em 1.40 o celular encosta na borda)
  const sBase = M.track(T, [[0, 1.5], [1.8, 1.3], [4.2, 1.06], [9.8, 0.95], [15.5, 0.95], [16.6, 0.98], [24.0, 0.96], [29.8, 0.96], [32.2, 1.86], [48.2, 1.86], [50.2, 1.28], [58.7, 1.28], [59.15, 1.0], [68, 1.02]]);
  const fyBase = M.track(T, [[0, 490], [6.0, 540], [24.0, 560], [29.8, 560], [32.2, 512], [48.2, 512], [50.2, 545], [58.7, 545], [59.15, 540], [68, 540]]);
  const fxBase = M.track(T, [[0, 960], [24.0, 960], [29.8, 960], [32.2, 1398], [48.2, 1398], [50.2, 1390], [58.7, 1390], [59.15, 960], [68, 960]]);

  // Super zoom: mergulha em UM elemento até ele ocupar a tela e volta.
  // As janelas respeitam o limite de cada cena (SCREENS / M_SCREENS), para a
  // câmera nunca ficar aproximada na hora em que o conteúdo troca.
  //   grafico  33.5-39.5  entra durante a animação da linha, segura 1,6s
  //   ranking  39.5-44.6  o pódio com as pessoas, segura 1,2s
  //   mobile   53.6-56.0  o topo do "Engajamento" no celular, segura 0,8s
  //   lista    56.0-58.6  a lista de usuários, entrada e saída lentas
  const zoomDesk = M.enter(35.9, 1.0)(T) * (1 - M.draw(38.5, 0.9)(T));
  const zoomRank = M.enter(41.2, 1.0)(T) * (1 - M.draw(43.4, 0.9)(T));
  const zoomMob = M.enter(53.8, 0.9)(T) * (1 - M.draw(55.5, 0.5)(T));
  const zoomLista = M.enter(56.4, 1.2)(T) * (1 - M.draw(57.8, 0.85)(T));
  let s = sBase, fx = fxBase, fy = fyBase;
  const aplicaZoom = (g, chave) => {
    if (g <= 0.001) return;
    const a = alvoZoom(chave);
    if (!a) return;
    // 0.88 deixa uma folga em volta do gráfico em vez de encostar na borda.
    const alvoS = Math.min(6.0, Math.min(1920 / a.w, 1080 / a.h) * 0.88);
    s = lerp(s, alvoS, g);
    fx = lerp(fx, a.cx, g);
    fy = lerp(fy, a.cy, g);
  };
  aplicaZoom(zoomDesk, 'painel');
  aplicaZoom(zoomRank, 'ranking');
  aplicaZoom(zoomMob, 'mobile');
  aplicaZoom(zoomLista, 'lista');
  const fade = 1 - M.draw(66.6, 0.6)(T);
  const veil = M.draw(20.4, 0.9)(T) * (1 - M.draw(23.7, 0.9)(T));
  return (
    <div style={{
      position: 'absolute', inset: 0, opacity: fade, overflow: 'hidden',
      background: `radial-gradient(1400px 900px at 50% 44%, #0D2144 0%, #091733 46%, ${BG} 100%)`,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(150,180,220,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(150,180,220,0.055) 1px, transparent 1px)',
        backgroundSize: '96px 96px',
      }}></div>
      <div style={{
        position: 'absolute', inset: 0, transformOrigin: '960px 540px',
        transform: `translate(${(960 - fx) * s}px, ${(540 - fy) * s}px) scale(${s})`,
      }}>
        <Shot from={-1} to={59.4}>
          <Tangle T={T} />
          <Hub T={T} accent={accent} />
          {TOOLS.map((t, i) => <Tool key={i} tool={t} i={i} T={T} accent={accent} />)}
          <Toil T={T} />
          <LegacyStack T={T} />
          <AppWindow T={T} accent={accent} />
          <Phone T={T} accent={accent} />
        </Shot>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: BG, opacity: veil * 0.8, pointerEvents: 'none' }}></div>
      <Shot from={59.2} to={69}><Close T={T} accent={accent} /></Shot>
      {props.showTitles ? <Titles T={T} accent={accent} /> : null}
    </div>
  );
}

function VideoApp() {
  const tw = window.useTweaks(window.TWEAK_DEFAULTS || {});
  const t = tw[0], setTweak = tw[1];
  const accent = t.accent || '#2E86FF';
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <CompositionStage width={1920} height={1080} bg={BG}
        scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <Piece accent={accent} showTitles={t.showTitles !== false} />
      </CompositionStage>
      <window.TweaksPanel>
        <window.TweakSection label="Vídeo" />
        <window.TweakColor label="Cor de destaque" value={accent}
          options={['#2E86FF', '#4C9AF5', '#38BDF8', '#6C8CFF']}
          onChange={(v) => setTweak('accent', v)} />
        <window.TweakToggle label="Títulos na tela" value={t.showTitles !== false}
          onChange={(v) => setTweak('showTitles', v)} />
        <window.TweakSection label="Edição" />
        <window.TweakToggle label="Motion editor" value={t.motionEditor !== false}
          onChange={(v) => setTweak('motionEditor', v)} />
      </window.TweaksPanel>
    </div>
  );
}

window.VideoApp = VideoApp;
