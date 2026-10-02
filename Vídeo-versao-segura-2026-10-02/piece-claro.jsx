/* Piece: "Do dado disperso à decisão" — 33s, 16:9. Educação / setor público. */
const React = window.React;
const { useComposition, CompositionStage, Shot, Easing, animate, clamp } = window;

const INK = '#08131F';
const PAPER = '#EEF2F6';
const LINE = '#C9D3DE';
const MUTE = '#5C6B7A';
const LOGO = 'uploads/logo-1788133636624-ftmw.png';

function track(T, keys, ease) {
  ease = ease || Easing.easeInOutCubic;
  if (T <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const t0 = keys[i][0], v0 = keys[i][1], t1 = keys[i + 1][0], v1 = keys[i + 1][1];
    if (T <= t1) return v0 + (v1 - v0) * ease(clamp((T - t0) / ((t1 - t0) || 1), 0, 1));
  }
  return keys[keys.length - 1][1];
}
const MOTION = {
  enter: (start, dur) => animate({ from: 0, to: 1, start, end: start + (dur || 0.7), ease: Easing.easeOutCubic }),
  draw: (start, dur) => animate({ from: 0, to: 1, start, end: start + (dur || 1), ease: Easing.easeInOutQuad }),
  pop: (start, dur) => animate({ from: 0, to: 1, start, end: start + (dur || 0.5), ease: Easing.easeOutBack }),
  track,
};

const SANS = "'Sora', system-ui, sans-serif";
const MONO = "'IBM Plex Mono', ui-monospace, monospace";

const CARDS = [
  { x: 960, y: 540, rot: -1, t: 0.1, title: 'Frequência_escolar.xlsx', kind: 'xlsx' },
  { x: 520, y: 322, rot: -6, t: 2.6, title: 'Matrículas_v2.xlsx', kind: 'xlsx', err: 'versão antiga', errAt: 7.5 },
  { x: 1400, y: 312, rot: 5, t: 2.9, title: 'Formulário — visita', kind: 'form', err: 'sem data', errAt: 8.4 },
  { x: 372, y: 762, rot: 4, t: 3.2, title: 'Consolidado_SEDUC.xlsx', kind: 'xlsx', err: '#N/A', errAt: 7.9 },
  { x: 1528, y: 742, rot: -5, t: 3.5, title: 'Relatório_programa.pdf', kind: 'pdf' },
  { x: 960, y: 176, rot: 2, t: 3.8, title: 'Checklist_unidade.xlsx', kind: 'xlsx', err: 'duplicado', errAt: 8.8 },
  { x: 176, y: 540, rot: -3, t: 4.1, title: 'Fotos e áudios', kind: 'chat' },
  { x: 1756, y: 528, rot: 3, t: 4.4, title: 'Planilha_final_v7.xlsx', kind: 'xlsx', err: 'qual é a final?', errAt: 9.3 },
  { x: 960, y: 902, rot: -2, t: 4.7, title: 'Merenda_JAN.xlsx', kind: 'xlsx' },
];

const KIND_TAG = { xlsx: 'PLANILHA', form: 'FORMULÁRIO', pdf: 'PDF', chat: 'MENSAGENS' };

function Card({ c, i, T, accent }) {
  const p = MOTION.enter(c.t, 0.9)(T);
  const conv = MOTION.draw(14.55 + i * 0.05, 1.5)(T);
  if (p <= 0.001) return null;
  const x = c.x + (960 - c.x) * conv;
  const y = c.y + (540 - c.y) * conv;
  const s = (0.82 + 0.18 * p) * (1 - 0.62 * conv) * (i === 0 ? 1.06 : 1);
  const drift = Math.sin((T + i * 1.7) * 0.5) * 3;
  const gray = MOTION.draw(11.0, 1.1)(T);
  const ep = c.errAt ? MOTION.pop(c.errAt, 0.5)(T) : 0;
  const rows = [[64, LINE], [92, LINE], [48, LINE], [78, LINE]];
  return (
    <div style={{
      position: 'absolute', left: x - 156, top: y - 100, width: 312, height: 200,
      opacity: p * (1 - conv), transform: `translateY(${drift}px) rotate(${c.rot * (1 - conv)}deg) scale(${s})`,
      filter: `saturate(${1 - 0.85 * gray})`,
      background: '#fff', borderRadius: 14, border: `1px solid ${LINE}`,
      boxShadow: `0 ${18 * (1 - conv)}px ${44 * (1 - conv)}px rgba(8,19,31,${0.10 * (1 - conv)})`,
      padding: '14px 16px', boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 10, height: 10, borderRadius: 3, background: c.kind === 'xlsx' ? '#2E8B57' : c.kind === 'pdf' ? '#C0453B' : accent }}></div>
        <div style={{ font: `600 15px ${MONO}`, color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
      </div>
      <div style={{ font: `500 10px ${MONO}`, letterSpacing: '0.14em', color: MUTE, marginTop: 5 }}>{KIND_TAG[c.kind]}</div>
      <div style={{ display: 'grid', gap: 9, marginTop: 16 }}>
        {rows.map((r, k) => (
          <div key={k} style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: r[0], height: 9, borderRadius: 2, background: r[1] }}></div>
            <div style={{ width: 140 - r[0] / 2, height: 9, borderRadius: 2, background: '#E3E9F0' }}></div>
            <div style={{ width: 46, height: 9, borderRadius: 2, background: '#E3E9F0' }}></div>
          </div>
        ))}
      </div>
      {c.err && ep > 0.01 ? (
        <div style={{
          position: 'absolute', right: -10, top: -14, transform: `scale(${ep})`,
          background: '#C0453B', color: '#fff', borderRadius: 999, padding: '5px 12px',
          font: `600 13px ${MONO}`, whiteSpace: 'nowrap', boxShadow: '0 6px 16px rgba(192,69,59,0.3)',
        }}>{c.err}</div>
      ) : null}
    </div>
  );
}

function Connectors({ T, accent }) {
  const out = MOTION.draw(14.3, 0.7)(T);
  if (T < 6.4 || out >= 1) return null;
  return (
    <svg width="1920" height="1080" style={{ position: 'absolute', left: 0, top: 0, opacity: (1 - out) * 0.75 }}>
      {CARDS.slice(1).map((c, i) => {
        const d = Math.hypot(960 - c.x, 540 - c.y);
        const p = MOTION.draw(6.7 + i * 0.17, 0.8)(T);
        return (
          <line key={i} x1={c.x} y1={c.y} x2={960} y2={540}
            stroke={accent} strokeWidth="2.5" strokeDasharray={`${d}`}
            strokeDashoffset={`${d * (1 - p)}`} strokeLinecap="round" opacity="0.5" />
        );
      })}
    </svg>
  );
}

function Toil({ T, accent }) {
  const p = MOTION.enter(7.3, 0.6)(T);
  const out = MOTION.draw(14.2, 0.7)(T);
  if (p <= 0.01 || out >= 1) return null;
  const h = Math.round(MOTION.draw(7.5, 2.8)(T) * 26);
  return (
    <div style={{
      position: 'absolute', left: 960 - 160, top: 540 + 126, width: 320,
      opacity: p * (1 - out), transform: `translateY(${(1 - p) * 14}px) scale(${0.9 + 0.1 * p})`,
      textAlign: 'center',
    }}>
      <div style={{ font: `600 48px ${MONO}`, color: INK, letterSpacing: '-0.02em' }}>{h}h<span style={{ color: accent }}>/mês</span></div>
      <div style={{ font: `500 16px ${SANS}`, color: MUTE, marginTop: 4 }}>juntando, conferindo, corrigindo</div>
    </div>
  );
}

function Statement({ T }) {
  const p = MOTION.enter(11.3, 0.8)(T);
  const out = MOTION.draw(14.1, 0.6)(T);
  if (p <= 0.01 || out >= 1) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: p * (1 - out) }}>
      <div style={{ position: 'absolute', inset: 0, background: PAPER, opacity: 0.92 }}></div>
      <div style={{ position: 'absolute', left: 180, right: 180, top: 390, textAlign: 'center', transform: `translateY(${(1 - p) * 22}px)` }}>
        <div style={{ font: `600 70px ${SANS}`, color: INK, letterSpacing: '-0.035em', lineHeight: 1.14, textWrap: 'balance' }}>
          As ferramentas não estão erradas.
        </div>
        <div style={{ font: `600 70px ${SANS}`, color: MUTE, letterSpacing: '-0.035em', lineHeight: 1.14, marginTop: 6 }}>
          Elas só não sustentam a escala.
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, accent, p, good }) {
  return (
    <div style={{
      flex: 1, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 12,
      padding: '16px 18px', opacity: p, transform: `translateY(${(1 - p) * 12}px)`,
    }}>
      <div style={{ font: `500 12px ${MONO}`, letterSpacing: '0.12em', color: MUTE }}>{label}</div>
      <div style={{ font: `600 38px ${SANS}`, color: INK, letterSpacing: '-0.02em', marginTop: 6 }}>{value}</div>
      <div style={{ font: `500 13px ${SANS}`, color: good ? '#2E8B57' : accent, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function SystemWindow({ T, accent }) {
  const p = MOTION.enter(15.6, 1.3)(T);
  const shrink = MOTION.draw(24.6, 1.0)(T);
  const out = MOTION.draw(27.9, 0.8)(T);
  if (p <= 0.01 || out >= 1) return null;
  const s = (0.86 + 0.14 * p) * (1 - 0.28 * shrink);
  const sent = MOTION.pop(20.4, 0.7)(T);
  const n = Math.round(1284 + sent * 37);
  const bars = [0.42, 0.66, 0.51, 0.79, 0.6, 0.88, 0.72, 0.95];
  const lineP = MOTION.draw(22.4, 1.5)(T);
  const nav = ['Painel', 'Coletas', 'Unidades', 'Alertas e prazos', 'Relatórios', 'Permissões', 'Auditoria'];
  return (
    <div style={{
      position: 'absolute', left: 260, top: 150, width: 1400, height: 740,
      opacity: p * (1 - out), transform: `translateY(${(1 - p) * 26 - shrink * 66}px) scale(${s})`,
      background: '#fff', borderRadius: 18, border: `1px solid ${LINE}`,
      boxShadow: '0 40px 90px rgba(8,19,31,0.16)', overflow: 'hidden', display: 'flex',
    }}>
      <div style={{ width: 238, background: '#F7F9FB', borderRight: `1px solid ${LINE}`, padding: '20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <img src={LOGO} alt="" style={{ width: 46, height: 46, objectFit: 'contain', mixBlendMode: 'multiply' }} />
          <div style={{ font: `600 14px ${SANS}`, color: INK, lineHeight: 1.2 }}>Gestão<br />do Programa</div>
        </div>
        <div style={{ display: 'grid', gap: 3 }}>
          {nav.map((it, i) => (
            <div key={it} style={{
              font: `${i === 0 ? 600 : 500} 13.5px ${SANS}`, color: i === 0 ? INK : MUTE,
              background: i === 0 ? '#E6EDF5' : 'transparent', borderRadius: 8, padding: '9px 11px',
              display: 'flex', justifyContent: 'space-between',
            }}><span>{it}</span>{i === 3 ? <span style={{ color: '#C0453B', font: `600 12px ${MONO}` }}>3</span> : null}</div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ font: `600 25px ${SANS}`, color: INK, letterSpacing: '-0.02em' }}>Painel do programa</div>
            <div style={{ font: `500 13px ${MONO}`, color: MUTE, marginTop: 5 }}>atualizado agora · 34 unidades · fonte única</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ font: `500 13px ${SANS}`, color: MUTE, border: `1px solid ${LINE}`, borderRadius: 8, padding: '8px 14px' }}>Este mês</div>
            <div style={{ font: `600 13px ${SANS}`, color: '#fff', background: accent, borderRadius: 8, padding: '8px 14px' }}>Relatório</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Kpi label="COLETAS VALIDADAS" value={n.toLocaleString('pt-BR')} sub={sent > 0.05 ? '+37 agora' : 'em tempo real'} accent={accent} p={MOTION.enter(18.4, 0.7)(T)} good={sent > 0.05} />
          <Kpi label="PENDÊNCIAS" value="12" sub="3 vencem hoje" accent={accent} p={MOTION.enter(18.6, 0.7)(T)} />
          <Kpi label="COBERTURA" value="92%" sub="meta 85%" accent={accent} p={MOTION.enter(18.8, 0.7)(T)} good />
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 12 }}>
          <div style={{ flex: 1.25, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ font: `500 12px ${MONO}`, letterSpacing: '0.12em', color: MUTE }}>COLETAS POR REGIONAL</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 13, marginTop: 14 }}>
              {bars.map((b, i) => {
                const g = MOTION.enter(21.5 + i * 0.08, 0.7)(T);
                return <div key={i} style={{ flex: 1, height: `${b * 100 * g}%`, background: i === 5 ? accent : '#BFD3E8', borderRadius: '6px 6px 2px 2px' }}></div>;
              })}
            </div>
          </div>
          <div style={{ flex: 1, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ font: `500 12px ${MONO}`, letterSpacing: '0.12em', color: MUTE }}>EXECUÇÃO x META</div>
            <svg viewBox="0 0 340 150" style={{ width: '100%', marginTop: 12 }}>
              <polyline points="6,132 334,54" fill="none" stroke={LINE} strokeWidth="2.5" strokeDasharray="6 7" />
              <polyline points="6,120 54,104 102,108 150,78 198,66 246,44 294,30 334,18"
                fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round"
                strokeDasharray="420" strokeDashoffset={420 * (1 - lineP)} />
            </svg>
            <div style={{ font: `500 12px ${MONO}`, color: MUTE, marginTop: 6 }}>histórico completo · quem alterou e quando</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Phone({ T, accent }) {
  const p = MOTION.enter(18.2, 0.8)(T);
  const out = MOTION.draw(23.4, 0.8)(T);
  if (p <= 0.01 || out >= 1) return null;
  const tap = MOTION.pop(20.2, 0.4)(T);
  const done = MOTION.draw(20.5, 0.4)(T);
  return (
    <div style={{
      position: 'absolute', left: 96, top: 596, width: 250, height: 438,
      opacity: p * (1 - out), transform: `translateY(${(1 - p) * 80}px)`,
      background: INK, borderRadius: 30, padding: 9, boxShadow: '0 30px 70px rgba(8,19,31,0.28)',
    }}>
      <div style={{ background: '#fff', borderRadius: 23, height: '100%', padding: '18px 16px', boxSizing: 'border-box' }}>
        <div style={{ font: `500 11px ${MONO}`, letterSpacing: '0.12em', color: MUTE }}>COLETA EM CAMPO</div>
        <div style={{ font: `600 16px ${SANS}`, color: INK, marginTop: 7, lineHeight: 1.25 }}>Visita 07<br />Escola Municipal Leste</div>
        <div style={{ display: 'grid', gap: 8, marginTop: 14 }}>
          {[['Alunos presentes', '37'], ['Turmas visitadas', '4'], ['Foto do local', 'anexada']].map((f, i) => (
            <div key={f[0]} style={{ border: `1px solid ${LINE}`, borderRadius: 9, padding: '9px 11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ font: `500 12px ${SANS}`, color: MUTE }}>{f[0]}</span>
              <span style={{ font: `600 12px ${MONO}`, color: i === 2 ? accent : INK }}>{f[1]}</span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 16, background: done > 0.5 ? '#2E8B57' : accent, color: '#fff', borderRadius: 10,
          textAlign: 'center', padding: '12px 0', font: `600 14px ${SANS}`,
          transform: `scale(${1 - 0.06 * Math.sin(tap * Math.PI)})`,
        }}>{done > 0.5 ? 'Enviado ✓' : 'Enviar'}</div>
        <div style={{ font: `500 11px ${MONO}`, color: MUTE, textAlign: 'center', marginTop: 9, opacity: done }}>
          já está no painel
        </div>
      </div>
    </div>
  );
}

function Cursor({ T }) {
  const p = MOTION.enter(19.2, 0.4)(T);
  const out = MOTION.draw(23.2, 0.5)(T);
  if (p <= 0.01 || out >= 1) return null;
  const path = [[19.6, 205, 985], [20.15, 214, 978], [21.2, 1215, 425], [22.5, 1180, 690], [23.4, 1465, 630]];
  const x = MOTION.track(T, path.map(k => [k[0], k[1]]));
  const y = MOTION.track(T, path.map(k => [k[0], k[2]]));
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: p * (1 - out) }}>
      <svg width="26" height="34" viewBox="0 0 26 34">
        <path d="M2 2 L2 26 L9 20 L14 31 L19 28 L14 18 L22 17 Z" fill="#fff" stroke={INK} strokeWidth="2" />
      </svg>
    </div>
  );
}

const GAINS = [
  ['CONSOLIDAÇÃO', 'automática', '26h por ciclo'],
  ['RELATÓRIOS', 'em minutos', 'dias de espera'],
  ['INDICADORES', 'em tempo real', 'só no fechamento'],
  ['PERMISSÕES', 'por perfil', 'arquivo solto'],
];

function Gains({ T, accent }) {
  const out = MOTION.draw(27.9, 0.7)(T);
  if (T < 24.9 || out >= 1) return null;
  return (
    <div style={{ position: 'absolute', left: 200, right: 200, bottom: 62, display: 'flex', gap: 16, opacity: 1 - out }}>
      {GAINS.map((it, i) => {
        const p = MOTION.enter(25.0 + i * 0.16, 0.7)(T);
        const strike = MOTION.draw(25.7 + i * 0.16, 0.5)(T);
        return (
          <div key={i} style={{
            flex: 1, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14,
            padding: '18px 20px', opacity: p, transform: `translateY(${(1 - p) * 26}px)`,
            boxShadow: '0 18px 40px rgba(8,19,31,0.08)',
          }}>
            <div style={{ font: `500 11.5px ${MONO}`, letterSpacing: '0.12em', color: MUTE }}>{it[0]}</div>
            <div style={{ font: `600 30px ${SANS}`, color: INK, letterSpacing: '-0.02em', marginTop: 6 }}>{it[1]}</div>
            <div style={{ position: 'relative', display: 'inline-block', marginTop: 8 }}>
              <span style={{ font: `500 13.5px ${SANS}`, color: MUTE }}>{it[2]}</span>
              <div style={{ position: 'absolute', left: 0, top: '52%', height: 2, width: `${strike * 100}%`, background: accent }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Close({ T, accent, cta }) {
  const p = MOTION.enter(28.4, 0.9)(T);
  if (p <= 0.01) return null;
  const p2 = MOTION.enter(29.4, 0.8)(T);
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', opacity: p, gap: 20,
    }}>
      <img src={LOGO} alt="" style={{ width: 190, height: 190, objectFit: 'contain', mixBlendMode: 'multiply', marginBottom: -34, opacity: p }} />
      <div style={{
        font: `600 84px ${SANS}`, color: INK, letterSpacing: '-0.04em', textAlign: 'center',
        transform: `translateY(${(1 - p) * 22}px)`, lineHeight: 1.06,
      }}>
        Do dado disperso <span style={{ color: accent }}>à decisão.</span>
      </div>
      <div style={{
        font: `400 25px ${SANS}`, color: MUTE, textAlign: 'center', maxWidth: 1080,
        lineHeight: 1.5, textWrap: 'pretty', opacity: p2, transform: `translateY(${(1 - p2) * 14}px)`,
      }}>{cta}</div>
    </div>
  );
}

const TITLES = [
  { at: 0.5, until: 2.35, text: 'Começa numa planilha.' },
  { at: 2.9, until: 6.2, text: 'Depois, em muitas.' },
  { at: 6.9, until: 10.6, text: 'Consolidar virou o trabalho.' },
  { at: 15.7, until: 17.9, text: 'Um sistema resolve na origem.' },
  { at: 18.3, until: 20.9, text: 'A equipe registra uma vez, em campo.' },
  { at: 21.3, until: 24.0, text: 'O painel responde na hora.' },
];

function Titles({ T, accent }) {
  let a = null, end = 0;
  for (const it of TITLES) if (T >= it.at) { a = it; end = it.until; }
  if (!a || T >= end) return null;
  const o = clamp(Math.min((T - a.at) / 0.28, (end - T) / 0.28), 0, 1);
  const rise = clamp((T - a.at) / 0.5, 0, 1);
  return (
    <div style={{ position: 'absolute', left: 104, bottom: 96, opacity: o, maxWidth: 1100 }}>
      <div style={{ width: 62 * rise, height: 4, background: accent, borderRadius: 2, marginBottom: 18 }}></div>
      <div style={{
        font: `600 62px ${SANS}`, color: INK, letterSpacing: '-0.035em', lineHeight: 1.08,
        transform: `translateY(${(1 - Easing.easeOutCubic(rise)) * 16}px)`, textWrap: 'balance',
      }}>{a.text}</div>
    </div>
  );
}

function Piece(props) {
  const T = useComposition().T;
  const accent = props.accent;
  const s = MOTION.track(T, [[0, 1.55], [2.5, 1.45], [6.0, 0.92], [11, 1.0], [14.5, 1.02], [16.8, 0.95], [18.0, 1.0], [19.7, 1.5], [21.1, 1.42], [22.7, 1.55], [24.3, 1.0], [28, 1.0], [33, 1.05]]);
  const fx = MOTION.track(T, [[0, 960], [6.0, 960], [18.0, 960], [19.7, 300], [21.1, 1120], [22.7, 1240], [24.3, 960], [33, 960]]);
  const fy = MOTION.track(T, [[0, 540], [6.0, 540], [18.0, 540], [19.7, 800], [21.1, 400], [22.7, 660], [24.3, 540], [33, 540]]);
  const fade = 1 - MOTION.draw(32.3, 0.6)(T);
  return (
    <div style={{ position: 'absolute', inset: 0, background: PAPER, overflow: 'hidden', opacity: fade }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${LINE} 1px, transparent 1px), linear-gradient(90deg, ${LINE} 1px, transparent 1px)`,
        backgroundSize: '64px 64px', opacity: 0.35,
      }}></div>
      <div style={{
        position: 'absolute', inset: 0, transformOrigin: '960px 540px',
        transform: `translate(${(960 - fx) * s}px, ${(540 - fy) * s}px) scale(${s})`,
      }}>
        <Shot from={-1} to={16.3}>
          <Connectors T={T} accent={accent} />
          {CARDS.map((cd, i) => <Card key={i} c={cd} i={i} T={T} accent={accent} />)}
          <Toil T={T} accent={accent} />
        </Shot>
        <Shot from={11.0} to={14.9}><Statement T={T} /></Shot>
        <Shot from={15.4} to={28.8}>
          <SystemWindow T={T} accent={accent} />
          <Phone T={T} accent={accent} />
          <Cursor T={T} />
          <Gains T={T} accent={accent} />
        </Shot>
        <Shot from={28.2} to={34}><Close T={T} accent={accent} cta={props.cta} /></Shot>
      </div>
      {props.showTitles ? <Titles T={T} accent={accent} /> : null}
    </div>
  );
}

const DEFAULT_CTA = 'Desenvolvo sistemas, dashboards, automações e soluções digitais sob medida, combinando tecnologia, dados e visão de negócio.';

function VideoApp() {
  const tw = window.useTweaks(window.TWEAK_DEFAULTS || {});
  const t = tw[0], setTweak = tw[1];
  const accent = t.accent || '#1D6BF0';
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <CompositionStage width={1920} height={1080} bg={PAPER}
        scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <Piece accent={accent} cta={t.cta || DEFAULT_CTA} showTitles={t.showTitles !== false} />
      </CompositionStage>
      <window.TweaksPanel>
        <window.TweakSection label="Vídeo" />
        <window.TweakColor label="Cor de destaque" value={accent}
          options={['#1D6BF0', '#0F9D77', '#E4572E', '#6C4BF0']}
          onChange={(v) => setTweak('accent', v)} />
        <window.TweakToggle label="Títulos na tela" value={t.showTitles !== false}
          onChange={(v) => setTweak('showTitles', v)} />
        <window.TweakText label="Texto de fechamento" value={t.cta || DEFAULT_CTA}
          onChange={(v) => setTweak('cta', v)} />
        <window.TweakSection label="Edição" />
        <window.TweakToggle label="Motion editor" value={t.motionEditor !== false}
          onChange={(v) => setTweak('motionEditor', v)} />
      </window.TweaksPanel>
    </div>
  );
}

window.VideoApp = VideoApp;
