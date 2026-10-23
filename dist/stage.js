/* Dàn cảnh cho từng cảnh của mỗi truyện: window.STAGE[id][i].
   Mỗi cảnh là một đối tượng (hoặc hàm H => đối tượng):
   old: k   lấy dàn cảnh cũ số k (trong animation.js / animation-vn.js) làm nền
   w        bối cảnh: garden, forest, river, room, village, sea, palace, heaven, moon, dry, mountain
   n        ban đêm
   c        nhân vật: [loại, x, y, cỡ, động tác] hoặc hàm H => chuỗi HTML
   addCast  thêm nhân vật vào dàn cảnh cũ thay vì thay thế
   p / f    đạo cụ phía sau / phía trước nhân vật
   e        hiệu ứng: hearts, stars, sparkles, confetti
   Bong bóng lời thoại được hiện tự động trên đầu nhân vật đang nói (app.js). */
(() => {
const P = window.VN_PROPS;
const old = k => ({old: k});
const add = (k, c, extra = {}) => ({old: k, addCast: true, c, ...extra});
const swap = (k, c, extra = {}) => ({old: k, c, ...extra});
const svgG = (x, y, k, body) => `<g transform="translate(${x} ${y}) scale(${k})">${body}</g>`;
/* Đạo cụ riêng cho các cảnh mới */
const grapes = (x, y) => svgG(x, y, 1, [[0, 0], [-14, 6], [14, 6], [-8, 22], [8, 22], [0, 37]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="11" fill="#9c6fc0" stroke="#7a52a0" stroke-width="2"/>`).join('') + '<path d="M0-12v-16" stroke="#6b8a4a" stroke-width="4"/><path d="M0-22q14-12 24 0-12 8-24 0" fill="#6aa846"/>');
const iceHouse = x => `<g transform="translate(${x} 293)"><path d="M-80 0v-110H80V0Z" fill="#cdeefc" stroke="#8cc8e8" stroke-width="3"/><path d="m-96-108 96-80 96 80Z" fill="#e8f8ff" stroke="#8cc8e8" stroke-width="3"/><path d="M-60-80h40M10-90h50M-40-40h60" stroke="#ffffff" stroke-width="4" opacity=".9"/><rect x="-24" y="-70" width="46" height="70" rx="20" fill="#9cd2ea"/><g class="twinkle" fill="#fff"><path d="M50-120l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z"/></g></g>`;
const puddle = x => `<ellipse cx="${x}" cy="372" rx="150" ry="24" fill="#9cd2ea" opacity=".8"/><ellipse cx="${x}" cy="368" rx="110" ry="14" fill="#cdeefc" opacity=".8"/>`;
const pot = (x, y) => svgG(x, y, 1, '<path d="M-50-40h100l-8 46q-42 16-84 0Z" fill="#6a6a72" stroke="#3a3a44" stroke-width="3"/><ellipse cy="-40" rx="52" ry="10" fill="#e8f2d8"/><path d="M-20-44q8-6 14 0M6-46q8-6 14 0" stroke="#e8743a" stroke-width="5" fill="none"/><path class="steam" d="M-14-56q-10-14 0-28m28 28q-10-14 0-28" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>');
const bowls = (x, y) => [-110, -40, 40, 110].map(d => svgG(x + d, y, 1, '<path d="M-20-8h40q-4 18-20 18t-20-18Z" fill="#fff" stroke="#c9b48a" stroke-width="2"/><ellipse cy="-8" rx="20" ry="5" fill="#f4f0e4"/>')).join('');
const hut = (x, y) => svgG(x, y, 1, '<path d="M-70 0v-70h140V0Z" fill="#c9a46a" stroke="#8a6a3a" stroke-width="3"/><path d="M-96-64 0-130 96-64Z" fill="#d8b46a" stroke="#9a7a3a" stroke-width="3"/><path d="M-70-64 0-120M70-64 0-120M-30-64 0-118M30-64 0-118" stroke="#b08a3a" stroke-width="2"/><rect x="-16" y="-50" width="32" height="50" fill="#7a5a3a"/>');
const fish = (x, y) => svgG(x, y, 1, '<path d="M-30 0q20-22 44 0-24 22-44 0Z" fill="#7cc4e8" stroke="#3a8ab0" stroke-width="2"/><path d="M14 0l16-12v24Z" fill="#7cc4e8" stroke="#3a8ab0" stroke-width="2"/><circle cx="-18" cy="-3" r="3" fill="#1a2a3a"/>');
const snowCover = () => '<rect width="960" height="540" fill="#eaf4ff" opacity=".35"/><path d="M-20 360Q300 330 600 352T980 340V560H-20Z" fill="#ffffff" opacity=".92"/><g class="snowfall" fill="#fff">' + Array.from({length: 26}, (_, n) => `<circle class="flake" style="--i:${n}" cx="${(n * 37) % 960}" cy="${(n * 53) % 300}" r="${3 + n % 3}"/>`).join('') + '</g>';
const broom = (x, y) => svgG(x, y, 1, '<path d="M0-120V-10" stroke="#a8743e" stroke-width="7" stroke-linecap="round"/><path d="M-24 30-6-14h12l18 44Z" fill="#e2c25a" stroke="#a88a2a" stroke-width="2"/><path d="M-12 26-4-10M0 28V-10M12 26 4-10" stroke="#a88a2a" stroke-width="2"/>');
const chicks = (xs, y, m) => H => xs.map((x, n) => H.A('chick', x, y + (n % 2) * 6, .6, m)).join('');

window.STAGE = {
'rua-tho': [
  {w: 'garden', c: [['rabbit', 330, 335, 1.35, 'boast'], ['squirrel', 700, 340, .9, 'celebrate'], ['turtle', 840, 355, .9, 'turtle-forward']]},
  old(0), old(1),
  {w: 'forest', p: H => H.flag(860), c: [['rabbit', 560, 345, 1.3, 'relax'], ['sparrow', 300, 210, .8, 'flutter']]},
  add(2, [['sparrow', 820, 200, .7, 'flutter']]),
  old(3),
  {w: 'garden', c: [['rabbit', 400, 340, 1.3, 'wave'], ['turtle', 580, 350, 1.2, 'celebrate'], ['owl', 790, 250, .7, 'celebrate']], e: 'hearts'}],
'kien-bo-cau': [
  {w: 'river', c: [['ant', 300, 470, 1, 'walk-on'], ['bird', 700, 190, 1.05, 'flutter']]},
  old(0), old(1), old(2),
  swap(2, [['human-man', 260, 337, 1.2, 'tremble'], ['ant', 330, 350, .8, 'gnaw'], ['bird', 650, 210, 1.1, 'flutter']]),
  swap(3, [['bird', 470, 255, 1.3, 'fly-safe'], ['human-man', 200, 337, 1.1, 'fox-exit'], ['ant', 330, 350, 1, 'celebrate']]),
  old(3)],
'bo-dua': [
  old(0),
  swap(0, [['human-elder', 500, 330, 1.5, 'explain'], ['human-child', 270, 340, 1.05, 'sad'], ['human-child2', 730, 340, 1.05, 'argue']]),
  old(1), old(2),
  {w: 'room', c: [['human-child', 420, 340, 1.15, 'hug-child'], ['human-child2', 540, 340, 1.15, 'hug-parent'], ['human-elder', 760, 330, 1.3, 'celebrate']], e: 'hearts'},
  old(3),
  {w: 'room', f: () => P.table(480, 420, 380) + bowls(480, 410), c: [['human-child', 300, 345, 1.1, 'celebrate'], ['human-elder', 480, 335, 1.3, 'explain'], ['human-child2', 660, 345, 1.1, 'celebrate']], e: 'hearts'}],
'cao-nho': [
  {w: 'forest', c: [['fox', 420, 345, 1.5, 'concern']]},
  add(0, [['sparrow', 640, 170, .85, 'flutter']]),
  add(1, [['sparrow', 700, 180, .8, 'flutter']]),
  old(2), old(3),
  swap(3, [['fox', 410, 345, 1.5, 'celebrate'], ['sparrow', 600, 240, .9, 'flutter']], {f: grapes(470, 290), e: 'hearts'})],
'doi-ban': [
  old(0),
  {w: 'river', c: [['chick', 250, 300, 1, 'sad'], ['duck', 560, 355, 1.3, 'swim']]},
  old(1),
  {w: 'river', c: [H => `<div class="wrap swim-together">${H.A('duck', 520, 350, 1.4, 'swim')}${H.A('chick', 520, 282, .8, 'tremble')}</div>`, ['fox', 150, 320, 1.35, 'huff']]},
  old(2), old(3),
  {w: 'garden', c: [['hen-mom', 480, 345, 1.3, 'celebrate'], ['chick', 340, 350, 1, 'celebrate'], ['duck', 640, 350, 1.2, 'celebrate']], e: 'hearts'}],
'su-tu-chuot': [
  old(0),
  {w: 'forest', c: [['lion', 580, 330, 1.7, 'boast'], ['mouse', 380, 350, 1.05, 'tremble']]},
  old(1),
  swap(2, [['lion', 550, 330, 1.8, 'tremble']]),
  swap(2, [['lion', 550, 330, 1.8, 'concern'], ['mouse', 330, 350, 1.1, 'explain']]),
  old(3),
  {w: 'forest', c: [['lion', 560, 330, 1.7, 'celebrate'], ['mouse', 380, 350, 1.1, 'celebrate']], e: 'hearts'}],
'qua-nuoc': [
  old(0),
  swap(0, [['crow', 300, 300, 1.3, 'explain'], ['rabbit', 560, 340, 1.1, 'sad']]),
  old(1),
  swap(2, [['crow', 420, 305, 1.4, 'explain']]),
  add(2, [['ant', 260, 350, .7, 'walk-on']]),
  add(3, [['rabbit', 230, 340, 1, 'celebrate'], ['ant', 700, 355, .7, 'celebrate']])],
'gio-mat-troi': [
  old(0),
  swap(0, [['human-coat', 470, 337, 1.35, 'walk']]),
  old(1),
  swap(1, [['human-coat', 520, 337, 1.35, 'idle']], {p: H => H.darkCloud(770, 86) + H.windFace(170, 140, false)}),
  old(2), old(3)],
'ba-chu-heo': [
  {w: 'garden', p: H => H.house(780, 'wood'), c: [['pig-mom', 780, 340, 1.4, 'wave'], ['pig', 200, 350, 1, 'walk-on'], ['pig', 320, 350, 1, 'walk-on'], ['pig', 440, 350, 1, 'walk-on']]},
  old(0), old(1),
  {w: 'garden', p: H => H.house(600, 'wood'), c: [['pig', 470, 350, 1, 'run-to-safe'], ['pig', 640, 350, 1, 'wave'], ['wolf', 150, 350, 1.3, 'sneak']]},
  add(2, [['wolf', 110, 350, 1.3, 'huff']]),
  {w: 'garden', p: H => H.house(620, 'brick'), c: [['wolf', 330, 350, 1.5, 'huff']]},
  old(3),
  {w: 'garden', p: H => H.house(660, 'brick'), c: [['pig', 300, 350, 1, 'hammer'], ['pig', 420, 350, 1, 'hammer'], ['pig', 540, 350, 1, 'celebrate']], e: 'hearts'}],
'hat-mam': [
  old(0),
  add(0, [['ant', 330, 380, .6, 'walk-on']]),
  old(1), old(2),
  swap(2, [['rabbit', 640, 345, 1.2, 'tidy']]),
  old(3)],
'tho-trang': [
  old(0),
  add(1, [['rabbit-mom', 720, 330, 1.5, 'explain']]),
  {w: 'room', n: true, p: H => H.brushCup(470, 350), c: [['rabbit', 340, 340, 1.3, 'tidy'], ['rabbit-mom', 680, 330, 1.6, 'explain']]},
  old(2),
  add(3, [['rabbit-mom', 720, 335, 1.5, 'explain']]),
  old(3)],
'ban-gau': [
  {w: 'room', p: H => H.blocks(480, 340), c: [['rabbit', 660, 340, 1.2, 'celebrate'], ['cat', 250, 345, .9, 'wave']]},
  old(0), old(1), old(2),
  {w: 'room', p: H => H.blocks(500, 345), c: [['bear', 330, 340, 1.35, 'tidy'], ['rabbit', 680, 340, 1.2, 'explain']]},
  old(3)],
'cu-cai': [
  old(0), old(1),
  swap(2, [['human-child', 430, 342, 1.1, 'strain'], ['human-elder', 570, 330, 1.35, 'strain']]),
  old(2),
  add(2, [['mouse', 120, 356, .8, 'dash']]),
  old(3),
  {w: 'room', f: () => P.table(480, 420, 380) + pot(480, 404), c: [['human-elder', 480, 330, 1.25, 'explain'], ['human-child', 290, 342, 1, 'celebrate'], ['pig', 670, 350, .95, 'celebrate'], ['mouse', 790, 356, .75, 'celebrate']], e: 'hearts'}],
'tho-vang-loi': [
  old(0), old(1),
  {w: 'forest', c: [['rabbit', 420, 345, 1.15, 'tremble'], ['squirrel', 720, 330, .9, 'explain']]},
  swap(2, [['fox', 150, 345, 1.4, 'sneak'], ['rabbit', 600, 345, 1.1, 'tremble']]),
  old(2), old(3),
  swap(3, [['rabbit', 400, 338, 1.2, 'wave'], ['rabbit-mom', 580, 330, 1.7, 'explain'], ['bear', 810, 335, 1.4, 'wave']], {e: 'hearts'})],
'chuot-tham-an': [
  {w: 'room', n: true, p: H => H.mouseHole(800), c: [['mouse-mom', 600, 345, 1.2, 'explain'], ['mouse', 460, 350, 1, 'celebrate']]},
  old(0), old(1), old(2),
  add(2, [['mouse-mom', 600, 345, 1.15, 'concern']]),
  add(3, [['mouse-mom', 760, 345, 1.1, 'wave']])],
'ga-trong-cao': [
  {w: 'garden', p: H => H.house(260, 'wood') + iceHouse(700), c: [['rabbit', 410, 345, 1.1, 'celebrate'], ['fox', 560, 345, 1.2, 'boast']]},
  {w: 'garden', p: H => H.house(640, 'wood') + puddle(250), c: [['fox', 420, 345, 1.2, 'shiver'], ['rabbit', 720, 330, .9, 'wave']]},
  swap(0, [['rabbit', 230, 345, 1.2, 'sad'], ['fox', 650, 322, .85, 'boast']]),
  old(1),
  swap(1, [['rabbit', 200, 345, 1.1, 'concern'], ['rooster', 420, 345, 1.3, 'boast'], ['bear', 840, 335, 1.3, 'idle']]),
  add(2, [['fox', 690, 322, .8, 'tremble']]), old(3)],
'gau-chia-qua': [
  old(0), old(1), old(2),
  {w: 'garden', p: H => H.tree(720, 345, 1) + H.apple(470, 380) + H.apple(560, 385), c: [['bear', 300, 340, 1.3, 'celebrate'], ['rabbit', 450, 345, 1, 'celebrate'], ['mouse', 590, 352, .85, 'peck'], ['sparrow', 700, 250, .8, 'flutter']], e: 'hearts'},
  old(3),
  {w: 'room', p: H => H.cake(560, 330), c: [['bear', 380, 340, 1.25, 'celebrate'], ['bear-mom', 720, 330, 1.65, 'wave']], e: 'sparkles'}],
'heo-rua-tay': [
  add(0, [['duck', 760, 350, 1.1, 'idle']]),
  old(1),
  {w: 'room', p: H => H.germ(330, 230, 0) + H.germ(390, 200, 1) + H.germ(290, 190, 2), c: [['pig', 300, 345, 1.2, 'concern'], ['pig-mom', 620, 332, 1.6, 'explain']]},
  old(2), old(3),
  {w: 'garden', p: H => H.basin(480, 390), c: [['pig', 330, 345, 1.15, 'explain'], ['duck', 640, 350, 1.15, 'idle']]}],
'gau-hai-tho': [
  old(0), old(1),
  swap(0, [['bear', 300, 335, 1.5, 'shiver'], ['rabbit', 715, 322, .95, 'wave']]),
  old(2),
  {w: 'garden', p: H => H.house(720, 'wood') + H.log(720, 345), c: [['rabbit', 350, 342, 1.1, 'dash'], H => H.brown(H.A('rabbit', 870, 345, 1, 'tremble'))]},
  old(3)],
'vit-tap-boi': [
  old(0),
  add(0, [['duck-mom', 420, 372, 1.3, 'explain']]),
  old(1), old(2),
  add(3, [['duck', 700, 380, .9, 'swim']]),
  {w: 'garden', c: [['duck', 420, 345, 1, 'celebrate'], ['duck-mom', 580, 340, 1.4, 'hug-parent']], e: 'hearts'}],
'gau-danh-rang': [
  add(0, [['bear-mom', 720, 330, 1.6, 'explain']]),
  {w: 'room', n: true, top: true, p: H => P.bed(480, 352) + H.germ(450, 250, 0) + H.germ(520, 230, 1) + H.germ(580, 262, 2), c: [['bear', 470, 345, 1.05, 'nap']]},
  old(1), old(2),
  {w: 'room', c: [['owl', 640, 320, 1.1, 'explain'], ['bear', 380, 340, 1.3, 'idle'], ['bear-mom', 190, 330, 1.4, 'wave']]},
  old(3)],
'tho-qua-duong': [
  {w: 'garden', c: [['rabbit-mom', 380, 335, 1.4, 'walk'], ['rabbit', 500, 342, 1, 'walk']]},
  old(0), old(1), old(2), old(3),
  swap(3, [['rabbit', 420, 340, 1.05, 'explain'], ['squirrel', 600, 345, .9, 'idle'], ['rabbit-mom', 200, 335, 1.3, 'wave']])],
'nam-vit-con': [
  old(0), old(0), old(1),
  {w: 'river', p: H => H.reeds(760, 400), c: [['duck-mom', 380, 365, 1.3, 'concern'], ['sparrow', 620, 220, .8, 'flutter']]},
  old(2), old(3)],
'cau-vong': [
  old(0),
  {w: 'garden', p: H => H.sunFace(770, 83, 'happy'), c: [['chick', 380, 350, .9, 'celebrate'], ['hen-mom', 600, 345, 1.2, 'wave']]},
  old(1), old(2), old(3),
  swap(1, [['chick', 360, 350, .9, 'explain'], ['duck', 600, 355, 1.05, 'idle']])],
'meo-treo-cau': [
  old(0), old(1), old(2),
  swap(0, [['cat', 520, 340, 1, 'strain'], ['mouse', 300, 355, .9, 'dash']], {e: 'confetti'}),
  old(3)],
'dan-ga-con': [
  old(0), old(1), old(2),
  {w: 'garden', c: [['hen-mom', 300, 345, 1.3, 'walk'], chicks([480, 540, 600, 660], 360, 'walk-on')]},
  {w: 'garden', c: [['hen-mom', 470, 345, 1.5, 'argue'], chicks([380, 420, 520, 560], 372, 'tremble'), ['cat', 780, 345, 1.1, 'fox-exit']]},
  old(3)],
'soc-mua-thu': [
  add(0, [['owl', 780, 240, .7, 'explain']]),
  old(1),
  {w: 'forest', p: H => H.leavesFall(), c: [['squirrel', 360, 340, 1.3, 'tidy'], ['mouse', 640, 350, 1, 'celebrate']]},
  old(2),
  {w: 'forest', p: snowCover(), c: [['mouse', 420, 350, 1, 'shiver'], ['squirrel', 640, 340, 1.2, 'wave']]},
  old(3)],
'qua-tang-me': [
  old(0),
  {w: 'garden', c: [['rabbit', 360, 342, 1.15, 'explain'], ['bear', 620, 335, 1.3, 'explain']]},
  old(1), old(2), old(3),
  {w: 'room', f: broom(330, 360), c: [['rabbit', 400, 340, 1.2, 'tidy'], ['rabbit-mom', 650, 330, 1.6, 'celebrate']], e: 'hearts'}],
/* ---------- Dân gian Việt Nam ---------- */
'cay-tre': [
  swap(0, [['human-man', 300, 445, 1.3, 'hammer'], ['human-rich', 640, 445, 1.35, 'boast']]),
  swap(0, [['human-man', 340, 445, 1.3, 'celebrate'], ['human-rich', 560, 445, 1.35, 'explain']]),
  {w: 'village', c: [['human-rich', 360, 445, 1.35, 'explain'], ['human-man', 600, 445, 1.3, 'concern']]},
  swap(1, [['human-man', 420, 350, 1.3, 'sad']]),
  {w: 'forest', p: () => P.bambooGrove(760, 345, .9), c: [['human-man', 300, 350, 1.25, 'sad'], ['human-but', 600, 345, 1.35, 'appear']], e: 'sparkles'},
  old(2),
  swap(3, [['human-man', 170, 445, 1.25, 'explain'], ['human-rich', 520, 445, 1.3, 'tremble']]),
  {w: 'village', c: [['human-man', 380, 445, 1.25, 'celebrate'], ['human-lady', 520, 445, 1.2, 'celebrate'], ['human-rich', 730, 445, 1.3, 'wave']], e: 'confetti'}],
'dua-hau': [
  {w: 'palace', c: [['human-man', 320, 440, 1.25, 'idle'], ['human-king', 540, 430, 1.4, 'celebrate'], ['human-man2', 770, 440, 1.2, 'wave']]},
  add(0, [['human-man2', 790, 440, 1.15, 'explain']]),
  {w: 'sea', c: [['human-man', 330, 430, 1.25, 'explain'], ['human-lady', 470, 432, 1.2, 'concern'], ['human-boy', 600, 438, .95, 'sad']]},
  {w: 'sea', p: hut(720, 410), f: fish(420, 380), c: [['human-boy', 360, 438, .95, 'celebrate'], ['human-man', 520, 430, 1.2, 'wave']]},
  swap(1, [['human-man', 330, 430, 1.25, 'explain'], ['human-lady', 470, 432, 1.2, 'wave'], ['bird', 600, 170, .7, 'fly-in'], ['crow', 720, 150, .6, 'fly-in']]),
  swap(2, [['human-man', 220, 430, 1.2, 'celebrate'], ['human-lady', 420, 432, 1.15, 'celebrate'], ['human-boy', 600, 438, .95, 'celebrate']]),
  swap(3, [['human-man', 220, 430, 1.2, 'wave']]),
  swap(3, [['human-man', 220, 430, 1.2, 'celebrate'], ['human-lady', 340, 432, 1.15, 'celebrate'], ['human-boy', 120, 438, .9, 'celebrate']], {e: 'hearts'})],
'tich-chu': [
  {w: 'room', c: [['human-grandma', 560, 345, 1.3, 'explain'], ['human-boy', 400, 350, 1.05, 'celebrate']], e: 'hearts'},
  swap(0, [['human-grandma', 720, 445, 1.3, 'wave'], ['human-boy', 160, 448, 1.05, 'dash'], ['human-girl', 90, 448, 1, 'dash']]),
  swap(1, [['human-grandma', 560, 340, 1.05, 'lie']]),
  old(1),
  swap(2, [['human-boy', 330, 448, 1.1, 'tremble'], ['sparrow', 560, 160, .7, 'fly-away']]),
  swap(2, [['human-boy', 330, 448, 1.1, 'sad'], ['human-fairy', 650, 445, 1.3, 'appear']], {e: 'sparkles'}),
  {w: 'mountain', c: [['human-boy', 260, 455, 1.05, 'walk-on']], f: () => P.bowl(560, 470, 1.1)},
  swap(3, [['human-boy', 440, 448, 1.1, 'hug-child'], ['human-grandma', 570, 445, 1.3, 'hug-parent']])],
'banh-chung': [
  old(0),
  {w: 'village', c: [['human-man2', 300, 445, 1.25, 'boast'], ['human-coat', 520, 445, 1.25, 'boast']]},
  {w: 'village', c: [['human-man', 420, 445, 1.3, 'sad']]},
  old(1), old(2),
  swap(2, [['human-man', 330, 445, 1.3, 'celebrate']], {f: () => P.banhDay(520, 490, 1.3)}),
  swap(3, [['human-man2', 200, 440, 1.15, 'boast'], ['human-man', 360, 440, 1.2, 'explain'], ['human-king', 700, 430, 1.4, 'idle']]),
  old(3)],
'cay-khe': [
  old(0),
  swap(0, [['human-man', 420, 445, 1.25, 'tidy']]),
  old(1),
  {w: 'sea', c: [H => `<div class="wrap fly-carry">${H.A('phoenix', 420, 240, 1.15, 'flutter')}${H.A('human-man', 440, 214, .6, 'celebrate')}</div>`]},
  old(2),
  swap(0, [['human-man2', 300, 445, 1.3, 'boast'], ['human-man', 500, 445, 1.25, 'wave']]),
  swap(2, [['human-man2', 520, 330, .9, 'boast'], ['phoenix', 300, 200, .9, 'flutter']], {f: () => P.goldBag(440, 440, 1.5)}),
  old(3)],
'coc-kien-troi': [
  {w: 'dry', c: [['toad', 420, 420, 1.3, 'argue']]},
  old(0),
  {w: 'heaven', p: () => P.jar(800, 470) + P.drum(470, 410), c: [['toad', 300, 440, 1.2, 'explain'], ['crab', 800, 395, .55, 'idle'], ['bee', 640, 200, .8, 'flutter'], ['fox', 150, 440, 1, 'idle'], ['bear', 900, 432, 1, 'idle']]},
  old(1),
  {w: 'heaven', p: () => P.jar(800, 470), c: [['human-thunder', 560, 440, 1.3, 'argue'], ['toad', 320, 440, 1.2, 'boast'], ['bee', 470, 240, .8, 'flutter']]},
  old(2),
  {w: 'heaven', c: [['human-king', 560, 430, 1.4, 'explain'], ['toad', 330, 440, 1.2, 'explain']]},
  old(3)],
'chu-cuoi': [
  {w: 'forest', c: [['human-man', 260, 350, 1.3, 'walk-on'], ['sparrow', 700, 200, .7, 'flutter']]},
  {w: 'forest', p: () => P.banyan(800, 350, .8), c: [['human-man', 200, 350, 1.2, 'concern'], ['tiger', 520, 345, 1.3, 'concern'], ['tiger', 660, 360, .7, 'lie']]},
  old(0),
  swap(1, [['human-man', 330, 445, 1.3, 'explain'], ['human-grandma', 520, 445, 1.2, 'celebrate'], ['human-boy', 210, 448, .9, 'celebrate']]),
  old(1),
  swap(2, [['human-lady', 250, 445, 1.2, 'tremble']]),
  old(2), old(3)],
'deo-nhac-meo': [
  {w: 'room', n: true, p: H => H.mouseHole(120), c: [['cat', 560, 350, 1.35, 'boast'], ['mouse', 120, 360, .6, 'tremble']]},
  old(0),
  swap(0, [['mouse-old', 420, 360, 1.05, 'concern'], ['mouse', 560, 365, .85, 'explain'], ['mouse', 680, 365, .8, 'tremble'], ['mouse', 300, 365, .8, 'explain']]),
  old(1), old(2), old(3),
  {w: 'room', n: true, p: H => H.mouseHole(480), c: [['mouse-old', 340, 365, 1.05, 'explain'], ['mouse', 620, 368, .85, 'sad']]}],
'meo-day-ho': [
  {w: 'forest', c: [['tiger', 400, 345, 1.4, 'pounce'], ['rabbit', 720, 345, .9, 'dash']]},
  old(0),
  {w: 'forest', c: [['cat', 300, 350, 1.05, 'explain'], ['tiger', 560, 345, 1.35, 'sneak']]},
  old(1), old(2), old(3),
  {w: 'forest', p: H => H.tree(720, 360, 1.25), c: [['tiger', 200, 345, 1.3, 'fox-exit'], ['cat', 715, 165, .95, 'explain'], ['rabbit', 470, 345, .9, 'idle'], ['squirrel', 590, 345, .85, 'idle']]}],
'dung-dang': [
  {w: 'village', c: [['human-child', 300, 448, 1.05, 'idle'], ['human-girl', 420, 448, 1.05, 'wave'], ['human-child2', 540, 448, 1.05, 'idle']]},
  old(0), old(1), old(2), old(3)],
'ba-cong': [
  old(0), old(1), old(2),
  swap(2, [['human-grandma', 300, 445, 1.25, 'wave'], ['shrimp', 520, 458, .9, 'celebrate'], ['tep', 640, 460, .75, 'celebrate']], {f: '', e: 'hearts'}),
  old(3)],
'con-kien-cay-da': [
  old(0), old(1), old(2), old(3),
  swap(3, [['ant', 320, 128, .7, 'celebrate'], ['ant', 560, 306, .55, 'walk-on'], ['ant', 420, 306, .55, 'walk-on']], {e: 'confetti'})]
};
})();
