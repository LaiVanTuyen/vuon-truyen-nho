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
  lady: {voice: FEMALE, rate: -10, pitch: 2},
  grandma: {voice: FEMALE, rate: -20, pitch: -6},
  oldman: {voice: MALE, rate: -14, pitch: -8},
  uncle: {voice: MALE, rate: -10, pitch: -12},
  man: {voice: MALE, rate: -6, pitch: 0},
  king: {voice: MALE, rate: -16, pitch: -16},
  rich: {voice: MALE, rate: 0, pitch: 4},
  big: {voice: MALE, rate: -14, pitch: -18},
  sly: {voice: MALE, rate: 2, pitch: 6},
  proud: {voice: MALE, rate: 4, pitch: 10},
};
// Bảng tên người nói và cách tách câu nằm ở dist/speech.js (dùng chung với trang web).
const SPEECH = (() => { const box = {}; vm.runInNewContext(fs.readFileSync(path.join(dist, 'speech.js'), 'utf8'), box); return box.SPEECH; })();
// Câu cảm thán đọc vui hơn, câu hỏi lên giọng.
function prosody(role, text) {
  const v = {...VOICES[role]};
  if (/!\s*$/.test(text)) { v.pitch += 4; v.rate += 3; }
  if (/\?\s*$/.test(text)) v.pitch += 6;
  const sign = n => (n >= 0 ? '+' : '') + n + '%';
  return {voice: v.voice, opts: {rate: sign(v.rate), pitch: sign(v.pitch)}};
}

const split = (text, poem) => SPEECH.split(text, poem);

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

// Chạy thử không cần mạng: node gen-audio.mjs --dry (chỉ đếm số câu cần tạo).
if (process.argv.includes('--dry')) {
  const missing = jobs.filter(j => !(fs.existsSync(j.file) && fs.statSync(j.file).size > 1000));
  const roles = {}; for (const j of jobs) roles[j.voice + ' ' + j.opts.pitch] = 1;
  console.log(`${jobs.length} câu, ${missing.length} câu cần tạo mới, ${jobs.filter(j => j.entry.say).length} lời thoại nhân vật.`);
  process.exit(0);
}

const {MsEdgeTTS, OUTPUT_FORMAT} = await import('msedge-tts');
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
