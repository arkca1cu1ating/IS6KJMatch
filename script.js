// ===== 규칙 정의 =====
// 일반: r(KR, JP, [버튼 단계], [단계 점수])
// 선택형(▼ 메뉴): { g: [r(...), ...] }
// 함수형 점수: (b, i) => ...  (b = 일반 규칙 합, i = 플레이어) / F: 1 = 최종 계산(맨 마지막)
// 숫자 입력형: { ...r(...), ...num(단위, 단위당 점수) } / 버튼 없음(규칙칸·버튼칸 병합): M: 1 / 감점 구역 시작: d: 1
const IMG = n => `<img src="image/relic/${n}.webp" alt="${n}">`;
const XO = ['X', 'O'];
const R5 = IMG('rogue_5_relic_final_5'), R2 = IMG('rogue_5_relic_final_2'), R1 = IMG('rogue_5_relic_final_1');
const r = (KR, JP, l, p) => ({ t: { KR, JP }, l, p });
const num = (step, per) => ({ l: Array.from({ length: 100 }, (_, i) => i * step), p: Array.from({ length: 100 }, (_, i) => i * per), N: step });

const RULES = [
  r('최종 인게임 점수가 500점 이상 / 1000점 이상 / 1500점 이상 / 2000점 이상',
    '最終ゲーム内スコアが500点以上 / 1000点以上 / 1500点以上 / 2000点以上',
    ['~499', '500~', '1000~', '1500~', '2000~'], [0, 1, 2, 3, 4]),
  r('【연기 같은 옛 글자】전투에서 ‘흑과 백’ 보유하고 클리어',
    '【古き文字は煙の如し】の戦闘で「雲と漆」を保有してクリア', [...XO, R5], [0, 1, 2]),
  ...[
    ['【산해를 넘어】긴급 전투를 누출 없이 클리어', '【山海を越える】緊急作戦を漏出なしでクリア'],
    ['【마지막 사냥】전투에서 오퍼레이터 5명 이하로 편성하고 클리어', '【末狩】の戦闘でオペレーター5名以下で編成してクリア'],
    ['【마지막 사냥】전투에서 ‘망생진롱’ 보유하고 클리어', '【末狩】の戦闘で「忘生の珍瓏」を保有してクリア'],
    ['【쉐이를 꾀하는 자】전투에서 오퍼레이터 6명 이하로 편성하고 클리어', '【歳を謀る者】の戦闘でオペレーター6名以下で編成してクリア'],
    ['【쉐이를 꾀하는 자】전투에서 ‘무봉장함’ 보유하고 클리어', '【歳を謀る者】の戦闘で「封のない長箱」を保有してクリア']
  ].map(([k, j]) => r(k, j, XO, [0, 1])),
  { g: [
    r('5엔딩 보스전을 【건곤】으로 클리어', 'End5のボス戦を 【定乾坤】でクリア', [...XO, R2], [0, 0, 1]),
    ...[
      ['【건곤: 본원을 평정한다】로', '【定乾坤: 根源を定める】で', [0, 7, 10, 13]],
      ['【절변: 진무를 거행한다】로', '【止変: 鎮撫と化す】で', [0, 1, 2, 3]],
      ['【절변: 형체를 계승한다】로', '【止変: 承形を遡る】で', [0, 2, 4, 5]],
      ['【절변: 대국으로 바꾼다】로', '【止変: 対局に改める】で', [0, 1, 3, 4]],
      ['【절변: 과거를 빚는다】로', '【止変: 旧暦を塑す】で', [0, 0, 1, 3]],
      ['【절변: 짐승들을 부린다】로', '【止変: 群獣を役す】で', [0, 10, 13, 17]]
    ].map(([k, j, p]) => r(`5엔딩 보스전을 ${k} 클리어`, `End5のボス戦を ${j}クリア`, [...XO, R2, R1], p))
  ] },
  { ...r('각 팀별 마지막 주자의 BP 총합 5점마다', '各チームの最終走者のBP合計5点ごとに', XO, [0, b => Math.max(0, Math.floor(b / 5))]), F: 1 },
  r('‘명적통’ 획득 시', '「鏑矢の吹筒」を獲得', XO, [0, 1]),
  r('‘치엔창 꾸러미’ 획득 시', '「一束の銭器鬼」を獲得', XO, [0, 1]),
  // ===== 감점 =====
  { ...r('5엔딩 클리어 실패', 'End5のクリアに失敗',
      ['X', 'O', { KR: '【절변: 짐승들을 부린다】', JP: '【止変:群獣を役す】' }], [0, -3, -1]), d: 1 },
  { ...r('플레이 시간이 n시간을 넘길 경우 (0.5시간마다)', 'プレイ時間が n時間 を超えた場合 (0.5時間ごと)'), ...num(0.5, -2) },
  ...[
    ['【파‘쉐이’진사】혹은 【뒤바뀔 운명】전투에 진입', '【歳破りし陣を祀る】または【天命将に易えんとす】の戦闘に進入', -4],
    ['‘불사’ 유물 미보유', '「不赦」秘宝未保有', -2],
    ['‘불식’ 유물 미보유', '「不息」秘宝未保有', -2]
  ].map(([k, j, p]) => r(k, j, XO, [0, p])),
  { ...r('상점에서 오리지늄각뿔 인출 한도 n회 초과', '商店での源石錐の出金上限 n回 を超過'), ...num(1, -1) },
  { ...r('한 팀에서 같은 오퍼레이터를 3회 이상 모집', '1チームで同じオペレーターを3回以上招集', [''], [(b, i) => dup(i)]), M: 1 }
];

// 룰북 링크 (언어별)
const RULEBOOK = {
  KR: 'https://docs.google.com/document/d/1jze_jRd6LDmx06BoQaNWgxG4c8n1tm_md3YhQF2U8fg/edit?usp=sharing',
  JP: 'https://docs.google.com/document/d/1CYiXh3ed83-EWEkdp2MBI1DpYiLCvZVP7U1iCnxrxYE/edit?usp=sharing'
};

const T = {
  KR: { title: '점수 계산기', rule: '규칙', btn: '버튼', pts: '점수', sum: '합계', reset: '초기화', minus: '감점', ops: '오퍼레이터', rulebook: '룰북',
        photo: '사진', shot: '이미지를 저장하고 프리셋 코드를 복사했습니다.', shotErr: '이미지 저장에 실패했습니다.',
        preset: '프리셋 코드', all: '전체', issue: '발급', apply: '적용', search: '이름 검색 (KR / JP / EN)',
        issued: '코드를 발급했습니다. (클립보드 복사)', applied: '코드를 적용했습니다.', invalid: '잘못된 코드입니다.' },
  JP: { title: 'スコア計算機', rule: 'ルール', btn: 'ボタン', pts: 'スコア', sum: '合計', reset: 'リセット', minus: '減点', ops: 'オペレーター', rulebook: 'ルールブック',
        photo: '写真', shot: '画像を保存し、プリセットコードをコピーしました。', shotErr: '画像の保存に失敗しました。',
        preset: 'プリセットコード', all: '全体', issue: '発行', apply: '適用', search: '名前で検索 (KR / JP / EN)',
        issued: 'コードを発行しました。(クリップボードにコピー)', applied: 'コードを適用しました。', invalid: '無効なコードです。' }
};

// ===== 상태 =====
// S[i] = 플레이어 i의 규칙값 배열, O[i] = 플레이어 i의 오퍼레이터 id 배열(가변, 중복 불가)
const $ = s => document.querySelector(s);
const ORAD = 1000, MAXO = 20, CRAD = MAXO + 1;   // 오퍼레이터 id 최대 999, 플레이어당 최대 20명
const G = RULES.map(x => x.g || [x]);
const RAD = G.map(g => g.reduce((s, x) => s + x.l.length, 0));
const split = (k, v) => { let i = 0; while (v >= G[k][i].l.length) v -= G[k][i++].l.length; return [i, v]; };
const join = (k, i, v) => G[k].slice(0, i).reduce((s, x) => s + x.l.length, 0) + v;
const blank = () => RAD.map(() => 0);
const ok = p => Array.isArray(p) && p.length === RAD.length && p.every((v, k) => Number.isInteger(v) && v >= 0 && v < RAD[k]);
const okO = a => Array.isArray(a) && a.length <= MAXO && new Set(a).size === a.length && a.every(v => Number.isInteger(v) && v > 0 && v < ORAD);
const name = i => (i < 5 ? 'KR' : 'JP') + (i % 5 + 1);
const OP = Object.fromEntries(OPS.map(o => [o[0], o]));
const opImg = o => `image/operators/avatar_char_${o[4]}.png`;
const opName = o => o[lang === 'KR' ? 3 : 2];

let S, O;
try { ({ S, O } = JSON.parse(localStorage.sc3)); if (!(S.length === 10 && S.every(ok) && O.length === 10 && O.every(okO))) throw 0; }
catch (e) { S = Array.from({ length: 10 }, blank); O = Array.from({ length: 10 }, () => []); }
let cur = 0, lang = localStorage.lang === 'JP' ? 'JP' : 'KR', msg = '', err = false, open = -1;

// ===== 프리셋 코드: 혼합 진법 정수 → 36진수 =====
// 플레이어 1명 = [규칙값..., 오퍼레이터 id..., 오퍼레이터 수]  (마지막 자리 = 개수 → 뒤에서부터 해독)
function push(n, i) {
  S[i].forEach((v, k) => n = n * BigInt(RAD[k]) + BigInt(v));
  O[i].forEach(v => n = n * BigInt(ORAD) + BigInt(v));
  return n * BigInt(CRAD) + BigInt(O[i].length);
}
function pop(n) {
  const take = r => { const v = Number(n % BigInt(r)); n /= BigInt(r); return v; };
  const c = take(CRAD), o = [], p = [];
  for (let j = 0; j < c; j++) o.unshift(take(ORAD));
  for (let k = RAD.length - 1; k >= 0; k--) p[k] = take(RAD[k]);
  return [n, p, o];
}
const code = a => (a ? S.reduce((n, _, i) => push(n, i), 0n) : push(0n, cur)).toString(36).toUpperCase();
function load(a, str) {
  str = str.trim().toLowerCase();
  if (!/^[0-9a-z]+$/.test(str)) return false;
  let n = 0n;
  for (const c of str) n = n * 36n + BigInt(parseInt(c, 36));
  const res = [];
  for (let i = a ? 9 : 0; i >= 0; i--) { let p, o; [n, p, o] = pop(n); res.unshift([p, o]); }
  if (n !== 0n || !res.every(([p, o]) => ok(p) && okO(o))) return false;
  if (a) { S = res.map(x => x[0]); O = res.map(x => x[1]); }
  else [S[cur], O[cur]] = res[0];
  return true;
}

// ===== 점수 =====
const raw = (k, v) => { const [i, s] = split(k, v); return G[k][i].p[s]; };
const pt = (i, k) => { const x = raw(k, S[i][k]); return typeof x === 'function' ? x(G[k][0].F ? base(i) : 0, i) : x; };
const base = i => S[i].reduce((s, v, k) => G[k][0].F ? s : s + pt(i, k), 0);
const score = i => S[i].reduce((s, v, k) => s + pt(i, k), 0);
const total = t => [0, 1, 2, 3, 4].reduce((s, j) => s + score(t * 5 + j), 0);
const lb = v => typeof v === 'object' ? v[lang] : v;

// ===== 팀 중복 모집 감점 =====
// 팀 내 1→5 순서로 3번째 이후 등장한 오퍼레이터: 주황(-3), 그중 RED 목록이면 빨강(-6)
const RED = new Set([379, 383, 407, 406, 376, 397, 417, 420, 273]);
function marks(i) {
  const t = i < 5 ? 0 : 5, cnt = {};
  let out = [];
  for (let p = t; p < t + 5; p++) {
    const m = O[p].map(id => (cnt[id] = (cnt[id] || 0) + 1) >= 3 ? (RED.has(id) ? 'r' : 'o') : '');
    if (p === i) out = m;
  }
  return out;
}
const dup = i => marks(i).reduce((s, m) => s + (m === 'r' ? -6 : m === 'o' ? -3 : 0), 0);

// ===== 오퍼레이터 검색 =====
// 정규화: 소문자, 히라가나→가타카나, 공백·기호 제거
const norm = s => s.toLowerCase().replace(/[\u3041-\u3096]/g, c => String.fromCharCode(c.charCodeAt(0) + 96)).replace(/[\s'’·・\-_.]/g, '');
function lev(a, b) {
  let p = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const q = [i];
    for (let j = 1; j <= b.length; j++) q[j] = Math.min(p[j] + 1, q[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    p = q;
  }
  return p[b.length];
}
function sim(q, s) {
  if (s === q) return 4;
  if (s.startsWith(q)) return 3 + q.length / s.length;
  if (s.includes(q)) return 2 + q.length / s.length;
  let j = 0; for (const c of s) if (c === q[j]) j++;
  if (j === q.length) return 1 + q.length / s.length;          // 순서대로 포함(약어)
  const d = 1 - lev(q, s.slice(0, q.length + 2)) / Math.max(q.length, 1);
  return d >= 0.5 ? d : 0;                                     // 오타 허용
}
function search(q) {
  q = norm(q);
  if (!q) return OPS;
  return OPS.map(o => [o, Math.max(...[1, 2, 3].map(k => sim(q, norm(o[k]))))])
    .filter(x => x[1] > 0).sort((a, b) => b[1] - a[1] || b[0][0] - a[0][0]).map(x => x[0]);
}
function showPick() {
  $('#pick').innerHTML = search($('#q').value).map(o =>
    `<button data-op="${o[0]}"${O[cur].includes(o[0]) ? ' disabled' : ''}><img src="${opImg(o)}" alt="" loading="lazy">${opName(o)}</button>`).join('');
}

// ===== 렌더링 =====
['blue', 'red'].forEach((t, ti) => {
  $('#' + t).innerHTML = [0, 1, 2, 3, 4].map(j => `<button data-p="${ti * 5 + j}">${name(ti * 5 + j)}<b></b></button>`).join('');
});

function render() {
  const L = T[lang], c = cur < 5 ? 'b' : 'r';
  localStorage.sc3 = JSON.stringify({ S, O }); localStorage.lang = lang;
  document.documentElement.lang = lang === 'KR' ? 'ko' : 'ja';
  document.querySelectorAll('[data-i]').forEach(e => e.textContent = L[e.dataset.i]);
  document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
  $('#rb').href = RULEBOOK[lang]; $('#rb').title = L.rulebook;
  document.querySelectorAll('[data-p]').forEach(b => {
    b.classList.toggle('on', +b.dataset.p === cur);
    b.querySelector('b').textContent = score(+b.dataset.p);
  });
  const tb = total(0), tr = total(1);
  $('#tb').textContent = tb; $('#tr').textContent = tr;
  $('#tb').classList.toggle('win', tb >= tr); $('#tr').classList.toggle('win', tr >= tb);
  $('#cur').innerHTML = `<span class="${c}">${name(cur)}</span>`;
  $('#pn').textContent = name(cur); $('#pn').className = c;
  $('#q').placeholder = L.search;

  const mk = marks(cur);
  $('#oplist').innerHTML = O[cur].map((id, j) => {
    const o = OP[id] || [id, '', '?', '?', ''];
    return `<div class="slot has ${mk[j]}" title="${opName(o)}"><img src="${opImg(o)}" alt="${opName(o)}"><button class="del" data-del="${j}">🗑</button></div>`;
  }).join('') + (O[cur].length < MAXO ? '<button class="slot" data-s="1">+</button>' : '');

  $('#board tbody').innerHTML = G.map((g, k) => {
    const [i, s] = split(k, S[cur][k]), x = g[i], p = pt(cur, k);
    const dd = g.length > 1 ? `<button class="dd" data-o="${k}">▼</button>` : '';
    const menu = open === k ? `<div class="menu">${g.map((y, j) => `<button data-m="${k},${j}" class="${j === i ? 'on' : ''}">${y.t[lang]}</button>`).join('')}</div>` : '';
    const lab = x.l[s], btn = x.N ? `<input type="number" inputmode="decimal" min="0" max="${99 * x.N}" step="${x.N}" data-n="${k}" value="${lab}">`
      : `<button data-k="${k}"${typeof lab === 'object' ? ' class="sm"' : ''}>${lb(lab)}</button>`;
    return (x.d ? `<tr class="sec"><td colspan="3">${L.minus}</td></tr>` : '') +
      `<tr><td class="rule"${x.M ? ' colspan="2"' : ''}>${dd}${x.t[lang]}${menu}</td>${x.M ? '' : `<td class="lv">${btn}</td>`}` +
      `<td class="pt${p > 0 ? ' on' : p < 0 ? ' neg' : ''}">${p > 0 ? '+' + p : p}</td></tr>`;
  }).join('');
  $('#sum').textContent = score(cur);
  $('#msg').textContent = msg ? L[msg] : ''; $('#msg').className = err ? 'err' : '';
}

// ===== 이벤트 =====
const closePick = () => { $('#modal').hidden = true; };
document.addEventListener('click', e => {
  if (e.target.id === 'modal' || e.target.id === 'mclose') return closePick();
  const d = e.target.closest('button')?.dataset, was = open;
  open = -1;
  if (!d) { if (was > -1) render(); return; }
  if (d.op) { if (!O[cur].includes(+d.op) && O[cur].length < MAXO) O[cur].push(+d.op); closePick(); }
  else if (d.s) { $('#q').value = ''; showPick(); $('#modal').hidden = false; $('#q').focus(); return; }
  else if (d.del) O[cur].splice(+d.del, 1);
  else if (d.lang) lang = d.lang;
  else if (d.p) { cur = +d.p; $('#c1').value = ''; msg = ''; }
  else if (d.o) open = was === +d.o ? -1 : +d.o;
  else if (d.m) { const [k, j] = d.m.split(',').map(Number); S[cur][k] = join(k, j, 0); }
  else if (d.k) { const k = +d.k, [i, s] = split(k, S[cur][k]); S[cur][k] = join(k, i, (s + 1) % G[k][i].l.length); }
  else if (e.target.id === 'reset') S[cur] = blank();
  else if (e.target.id === 'oreset') O[cur] = [];
  else if (d.g) {
    const c = code(d.g === 'all');
    $('#c' + d.g).value = c; navigator.clipboard?.writeText(c).catch(() => {});
    msg = 'issued'; err = false;
  } else if (d.a) { err = !load(d.a === 'all', $('#c' + d.a).value); msg = err ? 'invalid' : 'applied'; }
  render();
});
$('#q').addEventListener('input', showPick);

// ===== 사진: 오퍼레이터+점수판 이미지 저장 & 현재 플레이어 프리셋 코드 복사 =====
// 기기와 상관없이 항상 PC 화면 기준(가로 SHOT_W px)으로 렌더링해서 저장
const H2C = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
const SHOT_W = 1200;
const need = src => window.html2canvas ? Promise.resolve() : new Promise((ok, no) => {
  const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s);
});
$('#shot').addEventListener('click', async () => {
  const b = $('#shot'), c = code(0), n = name(cur);
  navigator.clipboard?.writeText(c).catch(() => {});     // 클릭 직후 복사(브라우저 권한 유지)
  $('#c1').value = c; b.disabled = true;
  try {
    await need(H2C);
    const cv = await html2canvas($('#cap'), {
      backgroundColor: '#fff', scale: 2, scrollX: 0, scrollY: 0,
      windowWidth: SHOT_W + 80, windowHeight: 1000,       // 미디어쿼리를 PC 기준으로 적용
      onclone: d => {
        const cap = d.querySelector('#cap');
        d.documentElement.style.fontSize = '18px';
        Object.assign(cap.style, { width: SHOT_W + 'px', maxWidth: 'none', margin: '0', boxShadow: 'none' });
        cap.querySelectorAll('.del, .tools, #reset, .slot:not(.has), .dd').forEach(e => e.style.display = 'none');
        // 숫자 입력칸 → 일반 텍스트 칸으로 교체 (캡처 시 세로 정렬 어긋남 방지)
        cap.querySelectorAll('td.lv input').forEach(e => {
          const v = d.createElement('div'); v.className = 'nv'; v.textContent = e.value; e.replaceWith(v);
        });
      }
    });
    const a = document.createElement('a');
    a.download = `${n}_${c}.png`; a.href = cv.toDataURL('image/png'); a.click();
    msg = 'shot'; err = false;
  } catch (e) { msg = 'shotErr'; err = true; }
  b.disabled = false; render();
});

document.addEventListener('change', e => {
  const k = e.target.dataset.n; if (k === undefined) return;
  S[cur][k] = Math.min(99, Math.max(0, Math.round((parseFloat(e.target.value) || 0) / G[k][0].N))); render();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePick();
  if (e.key === 'Enter' && e.target.id === 'q') document.querySelector('#pick button:not(:disabled)')?.click();
  else if (e.key === 'Enter' && e.target.id?.startsWith('c')) document.querySelector(`[data-a="${e.target.id.slice(1)}"]`).click();
});

render();
