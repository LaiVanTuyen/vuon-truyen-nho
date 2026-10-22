// Tạo giọng kể MP3 tiếng Việt cho mọi truyện: node gen-audio.mjs
// Kết quả: dist/audio/<truyện>/<mã>.mp3 và dist/audio/manifest.js (window.NARRATION)
// Người kể dùng giọng nữ ấm, chậm; lời thoại của nhân vật được tách ra và đọc bằng giọng riêng
// (con nhỏ giọng cao, mẹ giọng dịu, ông/bác/Sư Tử giọng nam trầm…). Đồng dao, thơ đọc ngắt nhịp.
// Chạy lại chỉ tạo những câu mới hoặc đã sửa.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {MsEdgeTTS, OUTPUT_FORMAT} from 'msedge-tts';

const FEMALE = 'vi-VN-HoaiMyNeural', MALE = 'vi-VN-NamMinhNeural';
const KBPS = 48;
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const out = path.join(dist, 'audio');

const sandbox = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(dist, 'data.js'), 'utf8'), sandbox);
const stories = sandbox.window.STORIES;

// Giọng theo vai. rate/pitch là mức chênh so với giọng gốc.
const VOICES = {
  narrator: {voice: FEMALE, rate: -12, pitch: 3},
  poem: {voice: FEMALE, rate: -18, pitch: 6},
  cheer: {voice: FEMALE, rate: -4, pitch: 12},
  child: {voice: FEMALE, rate: 0, pitch: 20},
  tiny: {voice: FEMALE, rate: 6, pitch: 28},
  mother: {voice: FEMALE, rate: -8, pitch: 6},
  oldman: {voice: MALE, rate: -14, pitch: -8},
  uncle: {voice: MALE, rate: -10, pitch: -12},
  big: {voice: MALE, rate: -14, pitch: -18},
  sly: {voice: MALE, rate: 2, pitch: 6},
  proud: {voice: MALE, rate: 4, pitch: 10},
};
// Tên nhân vật → vai giọng. Người nói là tên xuất hiện đầu tiên trong lời dẫn ("Thỏ Con ôm mẹ:" → Thỏ Con).
const SPEAKERS = [
  ['Thỏ Mẹ', 'mother'], ['Gấu Mẹ', 'mother'], ['Heo Mẹ', 'mother'], ['Vịt Mẹ', 'mother'], ['Gà Mẹ', 'mother'], ['mẹ', 'mother'], ['Mẹ', 'mother'],
  ['Bác Gấu', 'uncle'], ['Bác', 'uncle'], ['Sư Tử', 'big'], ['Ông', 'oldman'], ['ông', 'oldman'], ['người cha', 'oldman'], ['Cha', 'oldman'], ['Gió', 'uncle'], ['Mặt Trời', 'uncle'],
  ['Cáo', 'sly'], ['Gà Trống', 'proud'], ['Quạ', 'uncle'],
  ['Chuột', 'tiny'], ['Kiến', 'tiny'], ['Chim Sẻ', 'tiny'], ['Gà Con', 'tiny'], ['Vịt Con', 'tiny'], ['vịt con', 'tiny'],
  ['Thỏ Con', 'child'], ['Gấu Con', 'child'], ['Heo Con', 'child'], ['Thỏ Trắng', 'child'], ['Thỏ Nâu', 'child'], ['Thỏ', 'child'], ['Sóc', 'child'], ['Rùa', 'child'], ['Gấu', 'child'], ['Heo', 'child'], ['Mèo', 'sly'], ['Cháu', 'child'], ['cháu', 'child'],
];
function speakerOf(lead) {
  let best = null, at = -1;
  for (const [name, role] of SPEAKERS) {
    const m = new RegExp('(?<!\\p{L})' + name + '(?!\\p{L})', 'u').exec(lead), i = m ? m.index : -1;
    if (i < 0) continue;
    if (at < 0 || i < at || (i === at && name.length > best[0].length)) { at = i; best = [name, role]; }
  }
  return best ? {who: best[0], role: best[1]} : {who: '', role: 'child'};
}
// Câu cảm thán đọc vui hơn, câu hỏi lên giọng.
function prosody(role, text) {
  const v = {...VOICES[role]};
  if (/!\s*$/.test(text)) { v.pitch += 4; v.rate += 3; }
  if (/\?\s*$/.test(text)) v.pitch += 6;
  const sign = n => (n >= 0 ? '+' : '') + n + '%';
  return {voice: v.voice, opts: {rate: sign(v.rate), pitch: sign(v.pitch)}};
}

// Tách lời kể: từng câu; câu có dấu hai chấm tách thành lời dẫn + lời thoại.
function split(text, poem) {
  const sentences = text.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) || [text];
  const parts = [];
  for (let s of sentences) {
    s = s.trim();
    if (!s) continue;
    if (poem) { parts.push(...s.split(/(?<=,)\s+/).map(t => ({t: t.trim(), role: 'poem'}))); continue; }
    const colon = s.indexOf(': ');
    // Sau dấu hai chấm là chữ thường thì đó là phần liệt kê, không phải lời thoại.
    if (colon > 0 && colon < s.length - 3 && /^\p{Lu}/u.test(s.slice(colon + 2))) {
      const lead = s.slice(0, colon + 1), line = s.slice(colon + 2);
      const sp = speakerOf(lead);
      parts.push({t: lead, role: 'narrator'}, {t: line, role: sp.role, who: sp.who, say: true});
    } else if (s.length > 120) parts.push(...s.split(/(?<=,)\s+/).map(t => ({t: t.trim(), role: 'narrator'})));
    else parts.push({t: s, role: 'narrator'});
  }
  return parts;
}

const jobs = [];
function clip(folder, text, role = 'narrator', extra = {}) {
  const {voice, opts} = prosody(role, text);
  const hash = crypto.createHash('sha1').update(voice + JSON.stringify(opts) + text).digest('hex').slice(0, 10);
  const rel = `audio/${folder}/${hash}.mp3`;
  const entry = {t: text, f: rel, d: 0, ...extra};
  jobs.push({entry, file: path.join(dist, rel), text, voice, opts});
  return entry;
}

const manifest = {voices: {narrator: FEMALE, male: MALE}, common: {}, stories: {}};
manifest.common = {
  right: ['Đúng rồi! Bé giỏi quá!', 'Chính xác! Bé nhớ truyện thật tốt!', 'Hoan hô! Bé trả lời đúng rồi!'].map(t => clip('common', t, 'cheer')),
  wrong: ['Chưa đúng rồi. Bé nghĩ thêm và thử lại nhé!', 'Ồ, chưa phải rồi. Bé chọn lại nhé!'].map(t => clip('common', t, 'cheer')),
  done: clip('common', 'Bé đã trả lời xong tất cả câu hỏi. Giỏi lắm!', 'cheer'),
  quizStart: clip('common', 'Bây giờ, mình cùng trả lời câu hỏi nhé!', 'cheer'),
};
for (const s of stories) {
  const poem = s.category === 'Đồng dao & thơ';
  manifest.stories[s.id] = {
    intro: clip(s.id, `${s.title}.`, 'cheer'),
    scenes: s.scenes.map(([, text]) => split(text, poem).map(p => clip(s.id, p.t, p.role, p.say ? {say: 1, who: p.who} : {}))),
    moral: clip(s.id, `Bé học được gì? ${s.moral}`, 'narrator'),
    quiz: s.quiz.map(([q, answers]) => ({q: clip(s.id, q, 'cheer'), a: answers.map(a => clip(s.id, a, 'narrator'))})),
  };
}

async function synth(job) {
  if (fs.existsSync(job.file) && fs.statSync(job.file).size > 1000) return false;
  fs.mkdirSync(path.dirname(job.file), {recursive: true});
  for (let attempt = 1; ; attempt++) {
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(job.voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
      const tmp = fs.mkdtempSync(path.join(out, '.tmp-'));
      const {audioFilePath} = await tts.toFile(tmp, job.text, job.opts);
      fs.renameSync(audioFilePath, job.file);
      fs.rmSync(tmp, {recursive: true, force: true});
      tts.close?.();
      return true;
    } catch (e) {
      if (attempt >= 6) throw new Error(`Không tạo được "${job.text}": ${e.message}`);
      await new Promise(r => setTimeout(r, 4000 * attempt));
    }
  }
}

let made = 0, index = 0;
await Promise.all(Array.from({length: 2}, async () => {
  while (index < jobs.length) {
    const job = jobs[index++];
    if (await synth(job)) {
      process.stdout.write(`\r${++made} câu mới…`);
      await new Promise(r => setTimeout(r, 300));
    }
  }
}));
for (const {entry, file} of jobs) entry.d = Math.round(fs.statSync(file).size * 8 / KBPS) / 1000;

// Xóa file cũ không còn dùng.
const used = new Set(jobs.map(j => path.resolve(j.file)));
for (const dir of fs.readdirSync(out, {withFileTypes: true}).filter(d => d.isDirectory())) {
  const folder = path.join(out, dir.name);
  if (dir.name.startsWith('.tmp-')) { fs.rmSync(folder, {recursive: true, force: true}); continue; }
  for (const f of fs.readdirSync(folder)) if (!used.has(path.resolve(folder, f))) fs.rmSync(path.join(folder, f));
}
fs.writeFileSync(path.join(out, 'manifest.js'), `// Tạo bởi tools/gen-audio.mjs — không sửa tay.\nwindow.NARRATION=${JSON.stringify(manifest)};\n`);
const seconds = jobs.reduce((n, j) => n + j.entry.d, 0);
const lines = jobs.filter(j => j.entry.say).length;
console.log(`\nXong: ${jobs.length} câu (${made} mới, ${lines} lời thoại nhân vật), tổng ${Math.round(seconds / 60)} phút giọng kể.`);
process.exit(0);
