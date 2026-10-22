/* Bảng người nói và cách tách lời kể thành lời dẫn + lời thoại.
   Dùng chung cho app.js (phụ đề, nhân vật mấp máy miệng) và tools/gen-audio.mjs (tạo giọng đọc),
   nên hai nơi luôn tách câu giống hệt nhau.
   Quy ước trong data.js: <lời dẫn có tên người nói>: “<lời nhân vật>”. */
(function (root) {
'use strict';
// [tên trong lời dẫn, vai giọng, nhân vật trên sân khấu (một hoặc nhiều, lấy cái có mặt trong cảnh)]
const SPEAKERS = [
 // Mẹ, bà, phụ nữ
 ['Thỏ Mẹ','mother','rabbit-mom'],['Gấu Mẹ','mother','bear-mom'],['Heo Mẹ','mother','pig-mom'],['Vịt Mẹ','mother','duck-mom'],['Gà Mẹ','mother','hen-mom'],
 ['Đất Mẹ','mother',''],['Mẹ','mother',['rabbit-mom','bear-mom','pig-mom','duck-mom','hen-mom','human-lady']],['mẹ','mother',['rabbit-mom','bear-mom','pig-mom','duck-mom','hen-mom','human-lady']],
 ['Cô Bồ Câu','mother','bird'],['Bồ Câu','mother','bird'],
 ['Bà Tiên','lady','human-fairy'],['Vợ Cuội','lady','human-lady'],['vợ Cuội','lady','human-lady'],['Vợ An Tiêm','lady','human-lady'],
 ['bà','grandma','human-grandma'],['Bà','grandma','human-grandma'],
 // Ông, bác, người lớn
 ['Bác Cú Mèo','oldman','owl'],['Bác Gấu','uncle','bear'],['Bác thợ săn','man','human-man'],['Bác đi đường','man',['human-coat','human-man']],['bác đi đường','man',['human-coat','human-man']],
 ['Bác','uncle','bear'],['Sư Tử','big','lion'],['Ông','oldman','human-elder'],['ông','oldman','human-elder'],
 ['Người cha','oldman','human-elder'],['người cha','oldman','human-elder'],['Cha','oldman','human-elder'],
 ['ông Bụt','oldman','human-but'],['Bụt','oldman','human-but'],['vị thần','oldman','human-but'],
 ['Phú ông','rich','human-rich'],['phú ông','rich','human-rich'],['Lão','rich','human-rich'],
 ['Vua Hùng','king','human-king'],['Vua','king','human-king'],['Trời','king','human-king'],['Thần Sét','big','human-thunder'],
 ['Anh Khoai','man','human-man'],['anh Khoai','man','human-man'],
 ['Mai An Tiêm','man','human-man'],['An Tiêm','man','human-man'],['Chàng','man','human-man'],
 ['Lang Liêu','man','human-man'],['Cuội','man','human-man'],['Chú Cuội','man','human-man'],['chú Cuội','man','human-man'],
 ['người anh','rich','human-man2'],['Người anh','rich','human-man2'],['người em','man','human-man'],['Người em','man','human-man'],
 ['Anh','child','human-child'],['Em','child','human-child2'],
 // Con vật
 ['Gió','proud',''],['Mặt Trời','oldman',''],
 ['Cáo','sly','fox'],['Sói','big','wolf'],['Gà Trống','proud','rooster'],['Quạ','uncle','crow'],['Mèo','sly','cat'],['Hổ','big','tiger'],
 ['Chim Sẻ','tiny','sparrow'],['Chim','uncle','phoenix'],
 ['Chuột Già','oldman','mouse'],['Chuột Cống','uncle','mouse'],['Chuột Nhắt','tiny','mouse'],['Chuột','tiny','mouse'],
 ['Kiến','tiny','ant'],['Gà Con','tiny','chick'],['Vịt Con','tiny','duck'],['vịt con','tiny','duck'],['Vịt','tiny','duck'],['Các anh chị vịt','child','duck'],
 ['Cóc','proud','toad'],['Cua','uncle','crab'],['Ong','tiny','bee'],
 ['Hạt mầm','tiny',''],['hạt mầm','tiny',''],['Mầm xanh','tiny',''],
 ['Thỏ Con','child','rabbit'],['Gấu Con','child','bear'],['Heo Con','child','pig'],['Thỏ Trắng','child','rabbit'],['Thỏ Nâu','child','rabbit'],
 ['Heo Cả','child','pig'],['Heo Hai','child','pig'],['Heo Út','child','pig'],
 ['Thỏ','child','rabbit'],['Sóc','child','squirrel'],['Rùa','child','turtle'],['Gấu','child','bear'],['Heo','child','pig'],
 ['Tích Chu','child','human-child'],['Cậu','child','human-child'],['Cháu','child','human-child'],['cháu','child','human-child'],
];

function speakerOf(lead) {
  let best = null, at = -1;
  for (const row of SPEAKERS) {
    const m = new RegExp('(?<!\\p{L})' + row[0] + '(?!\\p{L})', 'u').exec(lead), i = m ? m.index : -1;
    if (i < 0) continue;
    if (at < 0 || i < at || (i === at && row[0].length > best[0].length)) { at = i; best = row; }
  }
  if (!best) return {who: '', role: 'child', chars: []};
  return {who: best[0].replace(/^\p{Ll}/u, c => c.toUpperCase()), role: best[1], chars: [].concat(best[2]).filter(Boolean)};
}

// Tách thành câu, giữ dấu chấm/than/hỏi/ba chấm ở cuối câu.
function sentences(text) {
  return (text.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) || [text]).map(s => s.trim()).filter(Boolean);
}
const commas = (s, role) => s.split(/(?<=,)\s+/).map(t => ({t: t.trim(), role})).filter(p => p.t);

// Trả về danh sách đoạn đọc: {t, role, say?, who?, chars?}.
function split(text, poem) {
  const parts = [];
  if (poem) { for (const s of sentences(text)) parts.push(...commas(s, 'poem')); return parts; }
  const narrate = chunk => { for (const s of sentences(chunk)) { if (s.length > 120) parts.push(...commas(s, 'narrator')); else parts.push({t: s, role: 'narrator'}); } };
  const re = /([^.!?…”]*?):\s*“([^”]+)”/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    narrate(text.slice(last, m.index));
    const lead = m[1].trim() + ':';
    const sp = speakerOf(lead);
    parts.push({t: lead, role: 'narrator'});
    for (const s of sentences(m[2])) parts.push({t: s, role: sp.role, say: true, who: sp.who, chars: sp.chars});
    last = re.lastIndex;
  }
  narrate(text.slice(last));
  return parts;
}

const api = {SPEAKERS, speakerOf, split, sentences};
if (typeof module !== 'undefined' && module.exports) module.exports = api;
root.SPEECH = api;
})(typeof window !== 'undefined' ? window : globalThis);
