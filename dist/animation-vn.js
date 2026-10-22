/* Dàn cảnh cho truyện dân gian Việt Nam. Mỗi truyện là một hàm (i, H) trả về
   {world, night, cast, props, front, say, camera, event, top}. H là bộ công cụ vẽ của animation.js. */
(() => {
const T = (x, y, k = 1, body = '', cls = '') => `<g transform="translate(${x} ${y}) scale(${k})"><g class="${cls}">${body}</g></g>`;

/* ---------- Đạo cụ ---------- */
const bambooStalk = (x, y, len, horiz = false, cls = '') => {
  const segs = Math.round(len / 26);
  const body = Array.from({length: segs}, (_, n) => {
    const dx = ((n * 53) % 140) - 70, dy = -((n * 37) % 90) - 20, r = ((n * 61) % 120) - 60;
    return `<g class="seg" style="--i:${n};--dx:${dx}px;--dy:${dy}px;--r:${r}deg"><rect x="${n * 26}" y="-7" width="24" height="14" rx="4" fill="${n % 2 ? '#8fbf5a' : '#7cb04a'}" stroke="#4f7a30" stroke-width="2"/><path d="M${n * 26 + 24}-8v16" stroke="#e8f2c0" stroke-width="3"/></g>`;
  }).join('');
  return `<g transform="translate(${x} ${y}) rotate(${horiz ? 0 : -90})"><g class="${cls}">${body}</g></g>`;
};
const bambooPile = (x, y) => T(x, y, 1, Array.from({length: 9}, (_, n) => `<rect x="${(n % 5) * 18 - 45}" y="${-Math.floor(n / 5) * 12 - 10}" width="26" height="11" rx="4" transform="rotate(${(n * 23) % 40 - 20})" fill="${n % 2 ? '#8fbf5a' : '#7cb04a'}" stroke="#4f7a30" stroke-width="2"/>`).join(''));
const bambooGrove = (x, y, k = 1) => T(x, y, k, Array.from({length: 6}, (_, i) => { const dx = i * 22 - 55, lean = (i - 2.5) * 12; return `<path d="M${dx} 0Q${dx + lean * .4}-140 ${dx + lean}-250" fill="none" stroke="${i % 2 ? '#7fa452' : '#6a9444'}" stroke-width="10" stroke-linecap="round"/>${[60, 120, 180].map(h => `<path d="M${dx + lean * h / 250 - 6}-${h}h12" stroke="#4f7a34" stroke-width="3"/>`).join('')}<path d="M${dx + lean}-250q20-10 34 4-18 6-34-4Z" fill="#6aa846"/>`; }).join(''), 'canopy');
const plowTool = (x, y) => T(x, y, 1, '<path d="M0 0 60-70" stroke="#8a5a2e" stroke-width="7" stroke-linecap="round"/><path d="M-10 4 14-6 8 14Z" fill="#8a8a8a" stroke="#555" stroke-width="2"/>');
const melon = (x, y, k = 1, cls = '') => T(x, y, k, `<ellipse rx="40" ry="30" fill="#3f9a3a" stroke="#22602a" stroke-width="3"/>${[-24, -8, 8, 24].map(d => `<path d="M${d}-28q${d > 0 ? 8 : -8} 28 0 56" stroke="#1f5a22" stroke-width="5" fill="none"/>`).join('')}<ellipse cx="-14" cy="-14" rx="10" ry="5" fill="#9fdc8a" opacity=".6"/>`, cls);
const melonCut = (x, y, k = 1) => T(x, y, k, `<path d="M-46 0A46 46 0 0 0 46 0Z" fill="#3f9a3a" stroke="#22602a" stroke-width="3"/><path d="M-40 0A40 40 0 0 0 40 0Z" fill="#fff4d6"/><path d="M-36 0A36 36 0 0 0 36 0Z" fill="#ef3b4a"/>${[[-18, 10], [0, 16], [18, 10], [-8, 26], [10, 26]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="2.5" ry="4" fill="#222"/>`).join('')}<path d="M-46 0h92" stroke="#22602a" stroke-width="3"/>`);
const vines = (x, y) => `<path class="vine-grow" d="M${x} ${y}q60-30 120 0t120 0 120 0 110-10" fill="none" stroke="#4f9a3a" stroke-width="6" stroke-linecap="round"/>` + [0, 1, 2, 3, 4].map(n => `<path d="M${x + 40 + n * 100} ${y - 6}q12-24 30-10-12 18-30 10Z" fill="#5fae45"/>`).join('');
const boat = (x, y) => `<g class="boat-sail"><g transform="translate(${x} ${y})"><path d="M-90 0h180l-30 34H-60Z" fill="#a8743e" stroke="#6a4626" stroke-width="3"/><path d="M0 0v-120" stroke="#6a4626" stroke-width="5"/><path d="M4-116q60 40 0 104Z" fill="#f4e2b8" stroke="#c9a46a" stroke-width="3"/><path d="M-30 0v-18h20v18" fill="#c9a46a"/></g></g>`;
const seeds = (x, y) => Array.from({length: 7}, (_, n) => `<ellipse class="seed-drop" style="--i:${n}" cx="${x + n * 38}" cy="${y + (n % 3) * 12}" rx="4" ry="6" fill="#2a2420"/>`).join('');
const bed = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-150" y="-20" width="300" height="28" rx="10" fill="#b5a083"/><path d="M-130-24q120-50 260 0v28h-260Z" fill="#c9b4d8"/><ellipse cx="-110" cy="-34" rx="38" ry="16" fill="#fff6e8" stroke="#d8c8b0" stroke-width="2"/><path d="M-140 8v40m280-40v40" stroke="#a38f73" stroke-width="12"/></g>`;
const bowl = (x, y, k = 1) => T(x, y, k, '<path d="M-26-16h52q-4 26-26 26t-26-26Z" fill="#f4f0e6" stroke="#9aa8b8" stroke-width="3"/><ellipse cy="-16" rx="26" ry="7" fill="#8fd0f0" stroke="#9aa8b8" stroke-width="2"/><path d="M-12-30q-2-8 4-12M8-30q-2-8 4-12" stroke="#bfe8ff" stroke-width="3" fill="none" stroke-linecap="round"/>');
const banhChung = (x, y, k = 1, cls = '') => T(x, y, k, '<rect x="-34" y="-62" width="68" height="62" rx="6" fill="#4f9a3a" stroke="#2a6a24" stroke-width="3"/><path d="M-12-62V0M12-62V0M-34-40h68M-34-20h68" stroke="#e8d8a0" stroke-width="4"/><path d="M-30-58l12 10" stroke="#8fd06a" stroke-width="3"/>', cls);
const banhDay = (x, y, k = 1, cls = '') => T(x, y, k, '<ellipse cy="-10" rx="38" ry="12" fill="#f4f0e4" stroke="#cfc6b0" stroke-width="3"/><ellipse cy="-16" rx="34" ry="9" fill="#fffdf6"/><ellipse cx="-10" cy="-18" rx="10" ry="3" fill="#ffffff"/>', cls);
const laDong = (x, y) => T(x, y, 1, [0, 1, 2, 3].map(n => `<path d="M${n * 16 - 30} 0q20-60 46-80 6 50-30 80Z" fill="${n % 2 ? '#3f8a30' : '#4fa03a'}" stroke="#2a6a24" stroke-width="2"/>`).join(''));
const riceTray = (x, y) => T(x, y, 1, `<ellipse rx="70" ry="18" fill="#c99a5a" stroke="#8a6a3a" stroke-width="3"/><ellipse cy="-4" rx="58" ry="12" fill="#fffaf0"/>${Array.from({length: 18}, (_, n) => `<ellipse cx="${(n * 23) % 100 - 50}" cy="${-4 + (n % 3) * 3 - 3}" rx="3" ry="1.6" fill="#e8dcc0"/>`).join('')}`);
const fancyDish = (x, y) => T(x, y, 1, '<ellipse rx="44" ry="11" fill="#f2c64a" stroke="#b8862a" stroke-width="3"/><path d="M-30-6q10-30 30-24 20-6 30 24Z" fill="#e8743a"/><path d="M-10-24q10-14 22-4" stroke="#3fae4a" stroke-width="4" fill="none"/>');
const table = (x, y, w = 220) => `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-12" width="${w}" height="14" rx="5" fill="#a8743e" stroke="#6a4626" stroke-width="3"/><path d="M${-w / 2 + 16} 2v60M${w / 2 - 16} 2v60" stroke="#7a5230" stroke-width="10"/></g>`;
const starFruit = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0-16 6-6 16-4 8 4 10 16 0 10-10 16-8 4-16-4-6-6Z" fill="#f6d33a" stroke="#c99a10" stroke-width="2"/></g>`;
const kheTree = (x, y, k = 1) => H0.tree(x, y, k * 1.3) + [[-60, -250], [-20, -280], [30, -240], [70, -270], [-40, -205], [50, -200], [0, -225]].map(([dx, dy]) => starFruit(x + dx * k, y + dy * k)).join('');
const goldBag = (x, y, k = 1, cls = '') => T(x, y, k, '<path d="M-26 0q-10-40 10-52h32q20 12 10 52Z" fill="#c99a5a" stroke="#7a5a2e" stroke-width="3"/><path d="M-14-52q14 10 28 0" stroke="#7a5a2e" stroke-width="4" fill="none"/><circle cx="-4" cy="-20" r="7" fill="#ffd23f" stroke="#c99a10" stroke-width="2"/>', cls);
const goldPile = (x, y) => T(x, y, 1, Array.from({length: 14}, (_, n) => `<ellipse cx="${(n * 29) % 120 - 60}" cy="${-((n * 11) % 36)}" rx="13" ry="7" fill="${n % 2 ? '#ffd23f' : '#f2b81a'}" stroke="#b8860a" stroke-width="2"/>`).join('') + '<g class="twinkle" fill="#fff6b0"><path d="M20-60l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z"/></g>');
const goldFalling = (x, y) => Array.from({length: 6}, (_, n) => `<g class="gold-fall" style="--i:${n}"><ellipse cx="${x + (n % 3) * 26 - 26}" cy="${y + n * 8}" rx="10" ry="6" fill="#ffd23f" stroke="#b8860a" stroke-width="2"/></g>`).join('');
const island = (x, y) => `<g transform="translate(${x} ${y})"><ellipse rx="190" ry="40" fill="#f2deaa"/><ellipse cy="-6" rx="170" ry="28" fill="#f8e8c0"/></g>`;
const drum = (x, y) => T(x, y, 1, '<path d="M-40 0-52 70M40 0l12 70" stroke="#7a4626" stroke-width="8"/><g class="drum-hit"><ellipse cy="-40" rx="56" ry="18" fill="#f4dcb0" stroke="#7a4626" stroke-width="4"/><path d="M-56-40v60q56 24 112 0v-60" fill="#c8402c" stroke="#7a4626" stroke-width="4"/><path d="M-56-10q56 22 112 0" stroke="#f2c64a" stroke-width="4" fill="none"/></g>');
const jar = (x, y) => T(x, y, 1, '<path d="M-40-90h80q20 30 10 70-10 24-50 24t-50-24q-10-40 10-70Z" fill="#a85a3a" stroke="#6a3622" stroke-width="4"/><ellipse cy="-90" rx="42" ry="10" fill="#6a3622"/><ellipse cy="-90" rx="34" ry="6" fill="#7fc8e8"/>');
const bolt = (x, y, k = 1) => `<g class="lightning">${T(x, y, k, '<path d="M0 0 30-60 14-60 34-110-10-40 8-40Z" fill="#ffe24a" stroke="#e8a010" stroke-width="3"/>')}</g>`;
const banyan = (x, y, k = 1, cls = '') => T(x, y, k, `<path d="M-30 0q-6-90 10-170h40q16 80 10 170Z" fill="#8a6a4a" stroke="#5e4630" stroke-width="3"/>${[-70, -40, 40, 70].map(dx => `<path d="M${dx * .6}-150q${dx * .4} 40 ${dx} 150" stroke="#8a6a4a" stroke-width="5" fill="none"/>`).join('')}<path d="M-30 0q-40 10-60 24M30 0q40 10 60 24M0 0v26" stroke="#7a5a3a" stroke-width="8" fill="none" stroke-linecap="round"/><g class="canopy"><path d="M-170-170q-40-60 30-90 10-60 90-50 50-40 110 0 80-10 90 50 60 30 20 90-20 40-100 30-60 30-130 0-80 20-110-30Z" fill="#4f8f4a"/><path d="M-120-220q10-40 60-36 30-30 70-6 50-6 56 30-20 26-60 16-30 20-70 6-40 16-56-10Z" fill="#6aa85e"/></g>`, cls);
const starLantern = (x, y, c = '#ff4a4a') => `<g transform="translate(${x} ${y})"><path d="M0-90v40" stroke="#7a5a3a" stroke-width="3"/><g class="lantern-sway"><path d="M0-50 10-24 38-22 16-6 24 22 0 6-24 22-16-6-38-22-10-24Z" fill="${c}" stroke="#a82a2a" stroke-width="2" opacity=".95"/><circle r="6" fill="#ffe680"/></g></g>`;
const bell = (x, y, k = 1, cls = 'bell-ring') => T(x, y, k, `<g class="${cls}"><path d="M0-30v10" stroke="#d0453a" stroke-width="4"/><path d="M-22 18q0-38 22-38t22 38Z" fill="#ffd23f" stroke="#b8860a" stroke-width="3"/><path d="M-26 18h52" stroke="#b8860a" stroke-width="5" stroke-linecap="round"/><circle cy="24" r="5" fill="#b8860a"/><path d="M-10-26q10-10 20 0" stroke="#d0453a" stroke-width="5" fill="none"/></g>`);
const gate = (x, y) => T(x, y, 1, '<rect x="-110" y="-150" width="26" height="150" fill="#b8a88a" stroke="#7a6a50" stroke-width="3"/><rect x="84" y="-150" width="26" height="150" fill="#b8a88a" stroke="#7a6a50" stroke-width="3"/><path d="M-130-150 0-200 130-150Z" fill="#a8543a" stroke="#6a3622" stroke-width="3"/><rect x="-60" y="-178" width="120" height="26" rx="4" fill="#f4e2b8" stroke="#a8543a" stroke-width="2"/><text y="-159" text-anchor="middle" font-family="Baloo 2,Nunito,sans-serif" font-weight="800" font-size="16" fill="#a8543a">NGÕ NHÀ TRỜI</text>');
const satchel = (x, y) => T(x, y, 1, '<rect x="-16" y="-14" width="32" height="24" rx="5" fill="#3d9be0" stroke="#2a6fb0" stroke-width="2"/><path d="M-12-14q12-14 24 0" stroke="#2a6fb0" stroke-width="3" fill="none"/>');
const veggies = (x, y) => T(x, y, 1, '<path d="M-36-20h72l-10 30h-52Z" fill="#c98b4a" stroke="#8a5a2a" stroke-width="3"/><path d="M-30-20q-10-30 10-34 6 20 2 34M-6-20q0-34 20-36 4 22-6 36M14-20q16-24 30-14-10 14-18 14" fill="#4fae45" stroke="#2a7a2a" stroke-width="2"/>');
const coins = (x, y) => Array.from({length: 4}, (_, n) => `<g class="coin-drop" style="--i:${n}"><circle cx="${x + n * 26}" cy="${y + (n % 2) * 8}" r="9" fill="#ffd23f" stroke="#b8860a" stroke-width="2"/><rect x="${x + n * 26 - 3}" y="${y + (n % 2) * 8 - 3}" width="6" height="6" fill="#b8860a"/></g>`).join('');
const umbrellaLeaf = (x, y) => T(x, y, 1, '<path d="M0 0v-90" stroke="#3f8a33" stroke-width="5"/><path d="M-60-80Q0-140 60-80Q30-92 0-86-30-92-60-80Z" fill="#4cb35a" stroke="#2f7a3a" stroke-width="3"/>');
const curvyPath = () => '<path d="M-20 520Q200 420 420 470T980 400" fill="none" stroke="#d5c296" stroke-width="70"/><path d="M-20 516Q200 416 420 466T980 396" fill="none" stroke="#e8d6ad" stroke-width="54"/>';
const bigBranch = (trunkX = 120) => `<path d="M${trunkX - 40} 540V120h80v420Z" fill="#8a6a4a" stroke="#5e4630" stroke-width="3"/><path d="M${trunkX + 40} 330Q400 300 640 320" stroke="#8a6a4a" stroke-width="34" fill="none" stroke-linecap="butt"/><ellipse cx="640" cy="320" rx="8" ry="17" fill="#c8a47a" stroke="#5e4630" stroke-width="3"/><g class="canopy"><path d="M${trunkX - 120} 140q-40-70 40-100 40-50 120-10 70-20 80 50 30 50-40 70-80 30-160 0Z" fill="#4f8f4a"/></g>`;
const peachBranch = () => `<path d="M960 300Q700 280 420 320" stroke="#7a4a3a" stroke-width="26" fill="none"/><ellipse cx="420" cy="320" rx="7" ry="13" fill="#c89a7a" stroke="#5e3a2a" stroke-width="3"/>${[880, 820, 760, 700, 640, 560, 500].map((x, n) => `<g transform="translate(${x} ${296 - (n % 2) * 22})">${[0, 72, 144, 216, 288].map(a => `<ellipse cy="-9" rx="7" ry="10" transform="rotate(${a})" fill="#ffb3c8" stroke="#e57a9a" stroke-width="1.5"/>`).join('')}<circle r="4" fill="#ffe680"/></g>`).join('')}`;
const flowerTop = (x, y) => T(x, y, 1, [0, 72, 144, 216, 288].map(a => `<ellipse cy="-14" rx="10" ry="16" transform="rotate(${a})" fill="#ffd23f" stroke="#e0a010" stroke-width="2"/>`).join('') + '<circle r="9" fill="#ff8a3d"/>');
let H0 = null;

/* ---------- Các truyện ---------- */
const S = {
'cay-tre'(i, H) {
  const {A, B} = H;
  if (i === 0) return {world: 'village', props: plowTool(260, 450), cast: A('human-man', 300, 445, 1.3, 'hammer') + A('human-rich', 640, 445, 1.35, 'explain'), say: B(470, 110, 'Làm giỏi, ta gả con gái cho!', 'left', 1)};
  if (i === 1) return {world: 'forest', props: bambooGrove(620, 345, .9) + bambooGrove(820, 345, .8) + bambooPile(300, 365), cast: A('human-man', 420, 350, 1.3, 'concern') + A('human-rich', 150, 350, 1.1, 'boast'), say: B(380, 80, 'Tìm mãi chẳng đủ trăm đốt…', 'left', 1)};
  if (i === 2) return {world: 'forest', front: bambooStalk(130, 400, 520, true, 'bamboo-join'), cast: A('human-man', 230, 345, 1.25, 'celebrate') + A('human-but', 680, 345, 1.35, 'appear'), say: B(420, 70, 'Khắc nhập, khắc nhập!', 'left', 1.2), event: 'sparkles'};
  return {world: 'village', front: `<g class="stick-shake">${bambooStalk(260, 400, 520, true)}</g>`, cast: A('human-man', 170, 445, 1.25, 'explain') + A('human-rich', 520, 445, 1.3, 'tremble') + A('human-lady', 820, 445, 1.2, 'wave'), say: B(380, 90, 'Ta xin lỗi! Ta giữ lời hứa!', 'left', 1) + B(120, 170, 'Khắc xuất!', 'left', 4), event: 'confetti'};
},
'dua-hau'(i, H) {
  const {A, B} = H;
  if (i === 0) return {world: 'palace', cast: A('human-man', 300, 440, 1.3, 'explain') + A('human-king', 620, 430, 1.4, 'argue'), say: B(150, 110, 'Nhờ đôi bàn tay chăm chỉ!', 'left', 1)};
  if (i === 1) return {world: 'sea', props: seeds(520, 220), cast: A('human-man', 330, 430, 1.25, 'explain') + A('human-lady', 470, 432, 1.2, 'concern') + A('bird', 600, 170, .7, 'fly-in') + A('crow', 720, 150, .6, 'fly-in'), say: B(120, 90, 'Mình cùng làm, sẽ sống được!', 'left', 1)};
  if (i === 2) return {world: 'sea', props: vines(420, 410) + [[520, 412], [640, 404], [760, 412]].map(([x, y], n) => `<g class="pop-in" style="--i:${n}">${melon(x, y, .7)}</g>`).join(''), front: melonCut(330, 470, .9), cast: A('human-man', 220, 430, 1.2, 'celebrate') + A('human-lady', 420, 432, 1.15, 'celebrate') + A('human-child', 600, 438, .95, 'celebrate'), say: B(260, 90, 'Ruột đỏ, ngọt mát quá!', 'left', 1), event: 'sparkles'};
  return {world: 'sea', props: `<g class="melon-bob">${melon(470, 300, .6)}<text x="440" y="306" font-family="Baloo 2,Nunito,sans-serif" font-weight="800" font-size="13" fill="#fff">An Tiêm</text></g>` + boat(760, 270), cast: A('human-man', 220, 430, 1.2, 'wave') + A('human-lady', 340, 432, 1.15, 'wave') + A('human-child', 120, 438, .9, 'celebrate'), say: B(440, 100, 'Thuyền đến đón rồi!', 'left', 2), event: 'hearts'};
},
'tich-chu'(i, H) {
  const {A, B} = H;
  if (i === 0) return {world: 'village', cast: A('human-grandma', 720, 445, 1.3, 'wave') + A('human-child', 160, 448, 1.05, 'dash'), say: B(140, 100, 'Bà ơi, cháu đi chơi đây!', 'left', 1)};
  if (i === 1) return {world: 'room', props: bed(470, 352), top: true, cast: A('human-grandma', 560, 340, 1.05, 'lie') + A('sparrow', 600, 250, .7, 'fly-away'), say: B(180, 70, 'Tích Chu ơi, cho bà ngụm nước!', 'left', .6)};
  if (i === 2) return {world: 'village', cast: A('human-child', 330, 448, 1.1, 'tremble') + A('sparrow', 520, 170, .7, 'flutter') + A('human-fairy', 700, 445, 1.3, 'appear'), say: B(120, 100, 'Bà ơi, bà đừng đi!', 'left', 1) + B(560, 70, 'Lấy nước suối tiên nhé!', 'left', 4), event: 'sparkles'};
  return {world: 'village', front: bowl(300, 470, 1.2), cast: A('human-child', 440, 448, 1.1, 'hug-child') + A('human-grandma', 570, 445, 1.3, 'hug-parent'), say: B(300, 100, 'Cháu thương bà nhất!', 'left', 1), event: 'hearts'};
},
'banh-chung'(i, H) {
  const {A, B} = H;
  if (i === 0) return {world: 'palace', cast: A('human-man2', 200, 440, 1.2, 'idle') + A('human-coat', 330, 440, 1.2, 'idle') + A('human-king', 500, 430, 1.4, 'explain') + A('human-man', 780, 440, 1.2, 'concern'), say: B(300, 70, 'Lễ vật nào ý nghĩa nhất?', 'left', 1)};
  if (i === 1) return {world: 'village', night: true, cast: A('human-man', 300, 445, 1.25, 'concern') + A('human-but', 640, 440, 1.35, 'appear'), say: B(420, 80, 'Không gì quý bằng hạt gạo!', 'left', 1.5), event: 'stars'};
  if (i === 2) return {world: 'village', props: laDong(560, 470) + riceTray(700, 470), front: `<g class="pop-in" style="--i:0">${banhChung(460, 480)}</g><g class="pop-in" style="--i:1">${banhDay(600, 500)}</g>`, cast: A('human-man', 300, 445, 1.3, 'tidy'), say: B(330, 90, 'Bánh vuông, bánh tròn!', 'left', 1), event: 'sparkles'};
  return {world: 'palace', front: table(470, 420, 300) + banhChung(420, 408, .8) + banhDay(530, 408, .85) + fancyDish(330, 405), cast: A('human-man', 220, 440, 1.25, 'wave') + A('human-king', 680, 430, 1.4, 'celebrate'), say: B(420, 90, 'Bánh ngon, ý nghĩa thật đẹp!', 'left', 1), event: 'confetti'};
},
'cay-khe'(i, H) {
  const {A, B} = H; H0 = H;
  if (i === 0) return {world: 'village', props: kheTree(720, 440, .9), cast: A('human-man2', 260, 445, 1.3, 'boast') + A('human-man', 480, 445, 1.25, 'sad'), say: B(120, 100, 'Em chỉ được cây khế thôi!', 'left', 1)};
  if (i === 1) return {world: 'village', props: kheTree(700, 440, .9), cast: A('human-man', 380, 445, 1.25, 'sad') + A('phoenix', 650, 230, .95, 'peck'), say: B(380, 70, 'Ăn một quả, trả cục vàng!', 'left', 1.2)};
  if (i === 2) return {world: 'sea', props: island(560, 330) + goldPile(600, 320), front: goldBag(470, 440, .8), cast: A('human-man', 520, 330, .9, 'celebrate') + A('phoenix', 300, 200, .9, 'flutter'), say: B(330, 70, 'Lấy vừa đủ thôi!', 'left', 1), event: 'sparkles'};
  return {world: 'sea', props: goldFalling(470, 300), cast: `<div class="wrap" style="transform:translate(0,0)"><div class="motion fly-wobble" style="position:absolute;left:0;top:0">${A('phoenix', 420, 230, 1.15, 'flutter') + A('human-man2', 440, 205, .65, 'tremble')}</div></div>`, front: `<g class="motion fly-wobble">${goldBag(470, 300, .9)}</g>`, say: B(560, 90, 'Nặng quá, bỏ bớt đi!', 'left', 1)};
},
'coc-kien-troi'(i, H) {
  const {A, B} = H;
  if (i === 0) return {world: 'dry', cast: A('toad', 270, 420, 1.25, 'argue') + A('crab', 420, 425, .85, 'idle') + A('bear', 560, 412, 1.1, 'idle') + A('fox', 700, 415, 1, 'idle') + A('bee', 810, 320, .9, 'flutter'), say: B(120, 100, 'Ộp ộp! Lên kiện ông Trời!', 'left', 1)};
  if (i === 1) return {world: 'heaven', props: jar(800, 470) + drum(470, 410), cast: A('toad', 340, 440, 1.2, 'hammer') + A('bee', 640, 200, .8, 'flutter') + A('crab', 800, 395, .55, 'idle'), say: B(170, 120, 'Tùng! Tùng! Tùng!', 'left', 1) + B(560, 80, 'Ai dám làm ồn ở đây?', 'left', 3)};
  if (i === 2) return {world: 'heaven', props: jar(560, 480) + bolt(700, 220, 1) + bolt(220, 200, .8), cast: A('human-thunder', 520, 440, 1.3, 'tremble') + A('bee', 600, 230, .8, 'flutter') + A('crab', 600, 470, .6, 'strain') + A('fox', 200, 440, 1.05, 'boast') + A('bear', 820, 432, 1.15, 'boast'), say: B(260, 80, 'Ối ối, tha cho ta!', 'left', 1)};
  return {world: 'village', props: H.rain(), cast: A('toad', 300, 440, 1.25, 'celebrate') + A('crab', 450, 448, .8, 'celebrate') + A('bear', 600, 438, 1.05, 'celebrate') + A('fox', 740, 440, .95, 'celebrate') + A('bee', 520, 300, .8, 'flutter'), say: B(170, 100, 'Mưa rồi! Mưa rồi!', 'left', 1), event: 'sparkles'};
},
'chu-cuoi'(i, H) {
  const {A, B} = H;
  if (i === 0) return {world: 'forest', props: banyan(780, 350, .8), cast: A('human-man', 230, 350, 1.3, 'tremble') + A('tiger', 520, 345, 1.3, 'tidy') + A('tiger', 660, 355, .7, 'celebrate'), say: B(120, 100, 'Ồ, cây đa thần kỳ quá!', 'left', 1.5), event: 'sparkles'};
  if (i === 1) return {world: 'village', props: banyan(680, 440, .55), cast: A('human-man', 330, 445, 1.3, 'explain') + A('human-lady', 470, 445, 1.25, 'wave'), say: B(160, 100, 'Nhớ tưới nước sạch nhé!', 'left', 1)};
  if (i === 2) return {world: 'village', props: `<g class="tree-rise">${banyan(600, 430, .55)}</g>`, cast: `<div class="wrap float-up">${A('human-man', 590, 470, 1.1, 'strain')}</div>` + A('human-lady', 250, 445, 1.2, 'tremble'), say: B(330, 90, 'Cây ơi, ở lại!', 'left', 1)};
  return {world: 'moon', night: true, props: banyan(620, 360, .7), front: starLantern(140, 480) + starLantern(290, 500, '#ffb02e') + starLantern(860, 490, '#ff6aa0'), cast: A('rabbit', 380, 400, .9, 'celebrate') + A('human-man', 530, 395, 1.2, 'wave') + A('human-fairy', 760, 395, 1.2, 'wave'), say: B(320, 90, 'Trung thu vui vẻ nhé!', 'left', 1), event: 'stars'};
},
'deo-nhac-meo'(i, H) {
  const {A, B} = H;
  const room = H.mouseHole(120) + table(560, 300, 420);
  if (i === 0) return {world: 'room', night: true, props: room, cast: A('mouse-old', 420, 360, 1.05, 'explain') + A('mouse', 560, 365, .85, 'tremble') + A('mouse', 680, 365, .8, 'concern') + A('mouse', 300, 365, .8, 'idle'), say: B(300, 80, 'Phải nghĩ cách thôi!', 'left', 1)};
  if (i === 1) return {world: 'room', night: true, props: room, front: `<g class="pop-in" style="--i:0">${bell(560, 230, 1.4)}</g>`, cast: A('mouse', 560, 365, .9, 'celebrate') + A('mouse-old', 420, 360, 1, 'wave') + A('mouse', 700, 365, .8, 'celebrate') + A('mouse', 300, 365, .8, 'celebrate'), say: B(260, 70, 'Đeo chuông cho Mèo!', 'left', 1) + B(560, 120, 'Hay quá!', 'left', 3), event: 'sparkles'};
  if (i === 2) return {world: 'room', night: true, props: room + bell(560, 335, .9, ''), cast: A('mouse-old', 420, 360, 1.05, 'explain') + A('mouse', 640, 365, .85, 'tremble') + A('mouse', 760, 365, .9, 'tremble') + A('mouse', 300, 365, .8, 'concern'), say: B(260, 70, 'Ai sẽ đi đeo chuông?', 'left', 1) + B(560, 140, 'Cháu… cháu còn bé…', 'left', 3.5)};
  return {world: 'room', night: true, props: H.mouseHole(120), cast: A('cat', 760, 360, 1.35, 'boast') + A('mouse', 460, 365, .8, 'fox-exit') + A('mouse', 560, 365, .85, 'fox-exit') + A('mouse-old', 250, 360, 1, 'concern'), say: B(640, 70, 'Meo!', 'left', .5) + B(150, 110, 'Nói dễ, làm khó!', 'left', 3)};
},
'meo-day-ho'(i, H) {
  const {A, B} = H;
  if (i === 0) return {world: 'forest', cast: A('cat', 320, 350, 1.1, 'explain') + A('tiger', 590, 345, 1.45, 'concern'), say: B(430, 90, 'Thầy Mèo ơi, dạy em võ!', 'left', 1)};
  if (i === 1) return {world: 'forest', cast: A('cat', 260, 350, 1.05, 'leap') + A('tiger', 560, 345, 1.35, 'leap'), say: B(160, 100, 'Rình, vồ, nhảy!', 'left', 1)};
  if (i === 2) return {world: 'forest', props: H.tree(720, 360, 1.25), cast: A('tiger', 260, 345, 1.4, 'pounce') + A('cat', 690, 350, 1, 'climb-up'), say: B(140, 90, 'Thử vồ thầy xem!', 'left', 1)};
  return {world: 'forest', props: H.tree(720, 360, 1.25), cast: A('cat', 715, 165, .95, 'celebrate') + A('tiger', 520, 345, 1.4, 'jump-grapes'), say: B(420, 50, 'May mà ta chưa dạy!', 'left', 1)};
},
'dung-dang'(i, H) {
  const {A, B} = H;
  const kids = (m, x0 = 240) => A('human-child', x0, 448, 1.05, m) + A('human-girl', x0 + 120, 448, 1.05, m) + A('human-child2', x0 + 240, 448, 1.05, m);
  if (i === 0) return {world: 'village', cast: `<div class="wrap" style="animation:walk-across var(--scene-duration,20s) linear both">${kids('walk-on', 140)}</div>` + A('human-grandma', 760, 445, 1.2, 'wave'), say: B(220, 110, 'Dung dăng dung dẻ!', 'left', 1)};
  if (i === 1) return {world: 'village', props: gate(700, 450), cast: kids('wave', 160), say: B(220, 110, 'Lạy cậu lạy mợ!', 'left', 1)};
  if (i === 2) return {world: 'village', front: satchel(250, 400), cast: A('goat', 240, 448, 1.05, 'walk-on') + A('toad', 520, 452, .8, 'idle') + A('hen', 700, 450, .9, 'peck') + A('chick', 800, 455, .55, 'peck'), say: B(120, 110, 'Dê đi học, cóc ở nhà!', 'left', 1)};
  return {world: 'village', cast: kids('sit-down', 220), say: B(260, 110, 'Ngồi xệp xuống đây!', 'left', 1.6), event: 'confetti'};
},
'ba-cong'(i, H) {
  const {A, B} = H;
  if (i === 0) return {world: 'village', props: H.rain(), cast: A('human-grandma', 230, 445, 1.25, 'bent-walk') + A('shrimp', 400, 452, .9, 'walk-on') + A('tep', 500, 455, .75, 'walk-on'), say: B(150, 90, 'Tụi cháu đưa bà đi nhé!', 'left', 1)};
  if (i === 1) return {world: 'village', props: curvyPath(), cast: A('human-grandma', 280, 470, 1.2, 'bent-walk') + A('shrimp', 440, 470, .85, 'walk-on') + A('tep', 540, 462, .7, 'walk-on'), say: B(180, 100, 'Sắp tới nhà bà rồi!', 'left', 1)};
  if (i === 2) return {world: 'village', front: coins(480, 470), cast: A('human-grandma', 300, 445, 1.25, 'idle') + A('shrimp', 560, 458, .9, 'peck') + A('tep', 700, 460, .75, 'peck'), say: B(430, 100, 'Bà ơi, tiền của bà!', 'left', 2.5)};
  return {world: 'village', front: veggies(400, 470), cast: A('human-grandma', 300, 445, 1.25, 'celebrate') + A('shrimp', 520, 458, .9, 'celebrate') + A('tep', 640, 460, .75, 'celebrate'), say: B(200, 100, 'Cảm ơn các cháu!', 'left', 1), event: 'hearts'};
},
'con-kien-cay-da'(i, H) {
  const {A, B} = H;
  if (i === 0) return {world: 'garden', props: bigBranch(120), cast: A('ant', 240, 306, .7, 'ant-shuttle'), say: B(320, 140, 'Ơ, cành cụt rồi!', 'left', 3)};
  if (i === 1) return {world: 'garden', props: peachBranch(), cast: `<div class="wrap" style="transform:translate(960px,0) scaleX(-1)">${A('ant', 300, 296, .7, 'ant-shuttle')}</div>`, say: B(330, 140, 'Leo vào, leo ra!', 'left', 3)};
  if (i === 2) return {world: 'garden', props: bigBranch(120) + '<path d="M160 260Q260 200 340 120" stroke="#8a6a4a" stroke-width="24" fill="none" stroke-linecap="round"/>', cast: A('ant', 150, 340, .7, 'climb-up'), say: B(300, 150, 'Mình thử cành khác!', 'left', 1)};
  return {world: 'garden', props: bigBranch(120) + '<path d="M160 260Q260 200 340 120" stroke="#8a6a4a" stroke-width="24" fill="none" stroke-linecap="round"/>' + flowerTop(352, 110), cast: A('ant', 320, 128, .7, 'celebrate') + A('ant', 560, 306, .55, 'walk-on'), say: B(380, 60, 'Tới nơi rồi!', 'left', 1), event: 'sparkles'};
}
};
window.VN_SCENES = new Proxy(S, {get(t, k) { const f = t[k]; return f ? (i, H) => { H0 = H; return f(i, H); } : undefined; }});
})();
