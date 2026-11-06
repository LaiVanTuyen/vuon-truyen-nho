// Kiểm tra nội dung truyện trước khi tạo giọng / xuất bản: node kiem-tra-truyen.mjs [id-truyện]
// Không cần mạng. Báo LỖI (phải sửa) và CHÚ Ý (nên xem lại). Thoát mã 1 nếu có lỗi.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const read = f => fs.readFileSync(path.join(dist, f), 'utf8');
const box = {window: {}, console};
box.globalThis = box;
vm.createContext(box);
for (const f of ['data.js', 'speech.js', 'cinema-art.js', 'characters.js', 'animation-vn.js', 'stage.js']) {
  try { vm.runInContext(read(f), box, {filename: f}); } catch (e) { if (f === 'data.js' || f === 'speech.js') throw e; }
}
let manifest = null;
try { const m = {window: {}}; vm.runInNewContext(read('audio/manifest.js'), m); manifest = m.window.NARRATION; } catch {}

const STORIES = box.window.STORIES, SPEECH = box.window.SPEECH;
const animationSrc = read('animation.js');
const VN = box.window.VN_SCENES || {};
const STAGE = box.window.STAGE || {};
const only = process.argv[2];

// Nhân vật vẽ được = có khai báo trong characters.js (bảng màu P, trang phục HUM, tên human-… hoặc loại đặc biệt)
// và vẽ ra hình không lỗi. Loại lạ không báo lỗi khi vẽ mà bị tô thành Gấu, nên phải đối chiếu khai báo.
const charSrc = read('characters.js');
const KNOWN = new Set([
  ...[...charSrc.matchAll(/^\s*'?([a-z0-9-]+)'?:\{(?:l|top):'#/gm)].map(m => m[1]),
  ...(charSrc.match(/human-[a-z0-9]+/g) || []),
  ...[...charSrc.matchAll(/type==='([a-z0-9-]+)'/g)].map(m => m[1]),
]);
const drawable = type => {
  if (!KNOWN.has(type) && !KNOWN.has(type.replace(/-mom$/, ''))) return false;
  try { const svg = box.window.drawToonCharacter(type, 'idle'); return typeof svg === 'string' && svg.length > 200 && !svg.includes('undefined'); }
  catch { return false; }
};

const MOTIONS = new Set((read('animation.css') + read('cinema.css') + read('vn.css')).match(/\.motion\.[a-z-]+/g)?.map(s => s.slice(8)) || []);
let errors = 0, warns = 0;
const err = (id, msg) => { errors++; console.log(`  ✗ LỖI   [${id}] ${msg}`); };
const warn = (id, msg) => { warns++; console.log(`  ! CHÚ Ý [${id}] ${msg}`); };

const ids = new Set();
for (const s of STORIES) {
  if (only && s.id !== only) continue;
  const id = s.id || '(không id)';
  if (ids.has(id)) err(id, 'trùng id truyện');
  ids.add(id);
  for (const k of ['id', 'title', 'category', 'age', 'minutes', 'animal', 'color', 'tag', 'desc', 'moral', 'scenes', 'quiz'])
    if (s[k] === undefined || s[k] === '') err(id, `thiếu trường "${k}"`);
  if (!/^[a-z0-9-]+$/.test(id)) err(id, 'id chỉ dùng chữ thường không dấu, số và gạch nối');
  for (const k of ['animal', 'friend']) if (s[k] && !drawable(s[k])) err(id, `${k} = "${s[k]}" không có hình trong characters.js`);

  const poem = s.category === 'Đồng dao & thơ';
  if (!(s.scenes?.length >= 4 && s.scenes.length <= 8)) warn(id, `có ${s.scenes?.length} cảnh; nên 4–8 cảnh`);
  // Dàn cảnh: stage.js (window.STAGE[id][i]) trước; không có thì dùng dàn cảnh cũ 4 cảnh trong animation.js / animation-vn.js.
  const classic = !!VN[id] || animationSrc.includes(`case '${id}'`);
  (s.scenes || []).forEach((_, i) => {
    if (!STAGE[id]?.[i] && !(classic && i < 4)) err(`${id} cảnh ${i + 1}`, 'chưa có dàn cảnh (stage.js, animation.js hoặc animation-vn.js)');
  });

  (s.scenes || []).forEach(([title, text], i) => {
    const at = `${id} cảnh ${i + 1}`;
    if (!title || !text) return err(at, 'thiếu tên cảnh hoặc lời kể');
    const open = (text.match(/“/g) || []).length, close = (text.match(/”/g) || []).length;
    if (open !== close) err(at, `ngoặc kép lệch: ${open} “ và ${close} ”`);
    if (/"/.test(text)) err(at, 'dùng ngoặc kép thẳng " — phải dùng “ ” để giọng đọc nhận lời thoại');
    if (/“[^”]*“/.test(text)) err(at, 'lời thoại lồng nhau “ … “ … ”');
    if (/[^:\s]\s*“/.test(text.replace(/([^.!?…”]*?):\s*“/g, ''))) warn(at, 'có lời trong “ ” không đứng sau dấu hai chấm → sẽ bị đọc bằng giọng người kể');
    if (text.length > 300) warn(at, `lời kể dài ${text.length} ký tự (nên 150–280)`);
    if (/\d/.test(text)) warn(at, 'có chữ số; nên viết bằng chữ cho bé dễ nghe và đọc theo');
    const parts = SPEECH.split(text, poem);
    let lead = '';
    for (const p of parts) {
      if (!p.say) lead = p.t;
      if (p.say && !p.who && lead) { warn(at, `lời dẫn "${lead}" không có tên trong SPEAKERS → đọc bằng giọng trẻ con mặc định (đúng nếu là cả nhóm cùng nói)`); lead = ''; }
      if (!p.say && p.t.length > 120) warn(at, `câu kể dài ${p.t.length} ký tự, nên tách: "${p.t.slice(0, 40)}…"`);
      for (const c of p.chars || []) if (!drawable(c)) err(at, `SPEAKERS trỏ tới nhân vật "${c}" chưa vẽ được`);
    }
    {
      try {
        // Dựng lại danh sách nhân vật của cảnh mà không cần trình duyệt: A() chỉ ghi lại loại và động tác.
        const H = new Proxy({}, {get: (_, k) => k === 'A' ? ((t, x, y, sc, mo = 'idle') => `@A:${t}:${mo}@`) : k === 'B' ? (() => '') : k === 'E' ? (x => x) : () => ''});
        const castOf = n => VN[id] ? String((VN[id](n, H) || {}).cast || '') : null; // truyện cũ trong animation.js: không dò được
        let st = STAGE[id]?.[i], castStr;
        if (st) {
          if (typeof st === 'function') st = st(H);
          const own = (st.c || []).map(c => Array.isArray(c) ? H.A(...c) : typeof c === 'function' ? c(H) : String(c)).join('');
          const base = st.old !== undefined ? castOf(st.old) : '';
          if (st.c && st.addCast && base === null) castStr = null;
          else castStr = st.c ? (st.addCast ? base + own : own) : base;
        } else castStr = castOf(i);
        if (castStr === null) throw 0;
        const actors = [...castStr.matchAll(/@A:([a-z0-9-]+):([a-z0-9-]+)@/g)];
        const cast = actors.map(m => m[1]);
        for (const c of cast) if (!drawable(c)) err(at, `dàn cảnh dùng nhân vật "${c}" chưa vẽ được`);
        for (const [, , mo] of actors) if (!MOTIONS.has(mo)) warn(at, `chuyển động "${mo}" chưa có CSS (.motion.${mo})`);
        const speakers = parts.filter(p => p.say && p.chars?.length);
        for (const p of speakers) if (!p.chars.some(c => cast.includes(c))) warn(at, `${p.who} nói nhưng không có nhân vật ${p.chars.join('/')} trên sân khấu → không mấp máy miệng`);
      } catch (e) { /* dàn cảnh cần trình duyệt; bỏ qua */ }
    }
  });

  if (!Array.isArray(s.quiz) || s.quiz.length !== 3) warn(id, `có ${s.quiz?.length ?? 0} câu hỏi; mỗi truyện nên có 3`);
  (s.quiz || []).forEach(([q, answers, right], n) => {
    const at = `${id} câu hỏi ${n + 1}`;
    if (!q || !Array.isArray(answers)) return err(at, 'sai cấu trúc [câu hỏi, [đáp án], chỉ số đúng]');
    if (answers.length !== 3) warn(at, `có ${answers.length} đáp án; nên 3`);
    if (!(right >= 0 && right < answers.length)) err(at, `chỉ số đáp án đúng ${right} nằm ngoài danh sách`);
    if (new Set(answers).size !== answers.length) err(at, 'đáp án bị trùng');
    if (!/\?\s*$/.test(q)) warn(at, 'câu hỏi nên kết thúc bằng dấu ?');
  });

  if (manifest) {
    const m = manifest.stories?.[id];
    if (!m) warn(id, 'chưa có giọng kể → chạy tools/gen-audio.mjs');
    else (s.scenes || []).forEach(([, text], i) => {
      const want = SPEECH.split(text, poem).map(p => p.t).join('|');
      const have = (m.scenes?.[i] || []).map(e => e.t).join('|');
      if (want !== have) warn(`${id} cảnh ${i + 1}`, 'giọng kể chưa khớp lời mới → chạy tools/gen-audio.mjs');
    });
  }
}
if (only && !ids.size) { console.log(`Không có truyện id "${only}".`); process.exit(1); }
console.log(`\n${ids.size} truyện: ${errors} lỗi, ${warns} chú ý.`);
process.exit(errors ? 1 : 0);
