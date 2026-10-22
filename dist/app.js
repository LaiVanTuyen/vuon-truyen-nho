(() => {
'use strict';
const $=s=>document.querySelector(s), all=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const main=$('#main');
const key='vuon-truyen-v2';
let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{}
const state={results:{},voice:true,music:true,progress:{},seen:{},filter:'Tất cả',...saved};
function persist(){try{localStorage.setItem(key,JSON.stringify(state))}catch{}}
let toastTimer;function toast(m){$('#toast').textContent=m;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3200)}
const getStory=id=>STORIES.find(s=>s.id===id);
const narration=id=>window.NARRATION?.stories?.[id];
const accents=['#f5a623','#e94e5b','#5bb04c','#f07b2b','#3d9be0','#9b6bd6'];

/* Tăng độ tươi của màu trong tranh SVG (tranh gốc dùng tông pastel). */
const vividCache={};
function boost(hex){let r=parseInt(hex.slice(0,2),16)/255,g=parseInt(hex.slice(2,4),16)/255,b=parseInt(hex.slice(4,6),16)/255;const max=Math.max(r,g,b),min=Math.min(r,g,b),l=(max+min)/2;let h=0,s=0;if(max!==min){const d=max-min;s=l>.5?d/(2-max-min):d/(max+min);h=max===r?(g-b)/d+(g<b?6:0):max===g?(b-r)/d+2:(r-g)/d+4;h/=6}if(s<.05)return hex;s=Math.min(1,s*1.85+.1);const L=l>.88?l:l*.96;const q=L<.5?L*(1+s):L+s-L*s,p=2*L-q;const f=t=>{t=(t+1)%1;const v=t<1/6?p+(q-p)*6*t:t<1/2?q:t<2/3?p+(q-p)*(2/3-t)*6:p;return Math.round(v*255).toString(16).padStart(2,'0')};return f(h+1/3)+f(h)+f(h-1/3)}
const vivid=svg=>svg.replace(/#([0-9a-fA-F]{6})(?![0-9a-fA-F])/g,(m,h)=>'#'+(vividCache[h]??=boost(h.toLowerCase())));
let svgSerial=0;
function uniqueIds(svg){const n=++svgSerial;return svg.replace(/id="([^"]+)"/g,`id="$1-u${n}"`).replace(/url\(#([^)]+)\)/g,`url(#$1-u${n})`)}
function sceneArt(s,i){return uniqueIds(vivid(window.renderMovieScene(s,i,()=>'')))}
// Cảnh vẽ ở khung 960×540 rồi phóng theo kích thước thật của khung chứa.
const fitter=window.ResizeObserver?new ResizeObserver(es=>{for(const e of es){const sc=e.target.querySelector('.scene');if(sc)sc.style.setProperty('--s',e.contentRect.width/960)}}):null;
function fit(el){const sc=el.querySelector('.scene');if(sc)sc.style.setProperty('--s',el.clientWidth/960);fitter?.observe(el)}

/* ---------- Trang chủ ---------- */
function home(){
 document.title='Vườn Truyện Nhỏ · Truyện kể cho bé';
 const cats=['Tất cả',...new Set(STORIES.map(s=>s.category))];if(!cats.includes(state.filter))state.filter='Tất cả';
 main.innerHTML=`<header class="home-head"><h1 class="logo">Vườn Truyện Nhỏ</h1><p class="tagline">Xem hoạt hình, nghe kể chuyện, trả lời câu hỏi!</p></header><nav class="chips" aria-label="Lọc theo thể loại">${cats.map(c=>`<button class="chip" data-cat="${esc(c)}" aria-pressed="${c===state.filter}">${esc(c)}</button>`).join('')}</nav><section class="grid" id="grid" aria-label="Danh sách truyện"></section>`;
 const grid=$('#grid');
 const draw=()=>{const list=STORIES.map((s,n)=>[s,n]).filter(([s])=>state.filter==='Tất cả'||s.category===state.filter);grid.innerHTML=list.map(([s,n],k)=>{const r=state.results[s.id],seen=state.seen[s.id],p=state.progress[s.id];return `<a class="card" href="#/truyen/${s.id}" style="--accent:${accents[n%accents.length]};--k:${k}">${seen?'<span class="seen">✓ Đã xem</span>':p&&p.scene>0?'<span class="seen doing">Đang xem dở</span>':''}<div class="card-art">${sceneArt(s,0)}</div><div class="card-body"><div><h2>${esc(s.title)}</h2><p>${esc(s.category)} · ${s.minutes} phút${r?` · <span class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(3-r.stars)}</span>`:''}</p></div><span class="play-dot" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span></div></a>`}).join('');all('.card-art').forEach(fit)};
 draw();
 all('[data-cat]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.cat;persist();all('[data-cat]').forEach(x=>x.setAttribute('aria-pressed',x===b));draw()});
}

/* ---------- Nhạc nền nhẹ (tạo trực tiếp, không cần file) ---------- */
const music=(()=>{let ctx,gain,timer,step=0;const scale=[523.25,587.33,659.25,783.99,880,1046.5];const melody=[0,2,4,2,3,1,0,2,4,5,4,2,3,2,1,0];return{start(){try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ctx=ctx||new AC();if(!gain){gain=ctx.createGain();gain.gain.value=.022;gain.connect(ctx.destination)}ctx.resume().catch(()=>{});if(timer)return;const note=()=>{const t=ctx.currentTime,o=ctx.createOscillator(),v=ctx.createGain();o.type='triangle';o.frequency.value=scale[melody[step++%melody.length]];v.gain.setValueAtTime(0,t);v.gain.linearRampToValueAtTime(.6,t+.03);v.gain.exponentialRampToValueAtTime(.001,t+1.1);o.connect(v);v.connect(gain);o.start(t);o.stop(t+1.2);if(step%4===1){const bo=ctx.createOscillator(),bv=ctx.createGain();bo.type='sine';bo.frequency.value=scale[melody[(step-1)%melody.length]]/4;bv.gain.setValueAtTime(0,t);bv.gain.linearRampToValueAtTime(.5,t+.1);bv.gain.exponentialRampToValueAtTime(.001,t+2.4);bo.connect(bv);bv.connect(gain);bo.start(t);bo.stop(t+2.5)}};note();timer=setInterval(note,620)}catch{}},stop(){clearInterval(timer);timer=null;if(ctx)ctx.suspend().catch(()=>{})},duck(on){if(gain&&ctx)gain.gain.setTargetAtTime(on?.012:.022,ctx.currentTime,.3)}}})();

/* ---------- Bộ phát giọng kể ---------- */
const audio=new Audio();audio.preload='auto';
let token=0,waitTimer=null;
function cancelSpeech(){token++;clearTimeout(waitTimer);audio.onended=audio.onerror=null;audio.pause();music.duck(false)}
function wordsTime(text){return Math.max(1800,text.split(/\s+/).length*420)}
// Phát một câu; luôn gọi done() đúng một lần (kể cả khi tắt giọng hoặc lỗi tải file).
function say(clip,text,done,{voice=state.voice}={}){
 const my=++token;clearTimeout(waitTimer);audio.onended=audio.onerror=null;audio.pause();
 const finish=()=>{if(my!==token)return;audio.onended=audio.onerror=null;music.duck(false);done&&done()};
 if(!voice||!clip?.f){waitTimer=setTimeout(finish,clip?.d?clip.d*1000+300:wordsTime(text));return}
 audio.src=clip.f;audio.onended=()=>{waitTimer=setTimeout(finish,280)};audio.onerror=()=>{waitTimer=setTimeout(finish,wordsTime(text))};
 music.duck(true);audio.play().catch(()=>{if(my===token)waitTimer=setTimeout(finish,wordsTime(text))});
}
// Câu nhỏ đi kèm (khen, nhắc) — không chặn luồng.
function blip(clip){if(!state.voice||!clip?.f)return;cancelSpeech();audio.src=clip.f;audio.play().catch(()=>{})}

/* ---------- Trang truyện ---------- */
let story=null,scene=0,seg=0,playing=false,started=false,paused=null;
// Chỉ dùng file giọng đọc khi câu chữ trong file khớp đúng lời hiện tại (tránh đọc lời cũ sau khi sửa truyện).
const same=(a,b)=>String(a||'').replace(/\s+/g,' ').trim()===String(b||'').replace(/\s+/g,' ').trim();
const clipFor=(c,text)=>c&&same(c.t,text)?c:null;
const segCache=new Map();
function segments(s,i){const key=s.id+'#'+i;if(segCache.has(key))return segCache.get(key);
 const parts=window.SPEECH?SPEECH.split(s.scenes[i][1],s.category==='Đồng dao & thơ'):(s.scenes[i][1].match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g)||[s.scenes[i][1]]).map(t=>({t:t.trim()}));
 const rec=narration(s.id)?.scenes?.[i];
 const ok=rec&&rec.length===parts.length&&rec.every((c,k)=>same(c.t,parts[k].t));
 const list=ok?rec.map((c,k)=>({...parts[k],...c})):parts;
 segCache.set(key,list);return list}
function sceneSeconds(s,i){return segments(s,i).reduce((n,c)=>n+(c.d||wordsTime(c.t)/1000)+.3,1.5)}

function openStory(id){
 stopAll();story=getStory(id);if(!story){location.hash='#/';return}
 scene=0;seg=0;started=false;
 document.title=story.title+' · Vườn Truyện Nhỏ';
 const r=state.results[story.id];
 main.innerHTML=`<div class="story-page"><a class="back" href="#/"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>Danh sách truyện</a><div class="story-title"><h1>${esc(story.title)}</h1><span>${esc(story.category)} cho bé · khoảng ${story.minutes} phút${r?` · <b class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(3-r.stars)}</b>`:''}</span></div>
 <div class="player" id="player"><div class="stage movie-stage" id="stage"></div><div class="subtitle" id="subtitle" aria-live="polite"></div><div class="tap-flash" id="tapFlash" aria-hidden="true"></div><div class="scene-bar" aria-hidden="true"><span id="bar"></span></div><div class="overlay" id="overlay"></div></div>
 <div class="controls"><div class="ctl-group"><button class="ctl" id="prev" aria-label="Cảnh trước"><svg viewBox="0 0 24 24"><path d="M7 5v14M18 5 9 12l9 7z"/></svg></button><button class="ctl main" id="play" aria-label="Phát"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></button><button class="ctl" id="next" aria-label="Cảnh sau"><svg viewBox="0 0 24 24"><path d="M17 5v14M6 5l9 7-9 7z"/></svg></button></div>
 <div class="dots" id="dots">${story.scenes.map((_,i)=>`<button data-scene="${i}" aria-label="Cảnh ${i+1}">${i+1}</button>`).join('')}</div>
 <div class="ctl-group"><button class="ctl pill" id="voiceBtn" aria-pressed="${state.voice}"><svg viewBox="0 0 24 24"><path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3"/></svg><span>Giọng</span></button><button class="ctl pill" id="musicBtn" aria-pressed="${state.music}"><svg viewBox="0 0 24 24"><path d="M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm11-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg><span>Nhạc</span></button><button class="ctl" id="fsBtn" aria-label="Toàn màn hình"><svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button></div></div>
 <section class="lesson"><span class="lesson-icon">♥</span><div><h2>Bé học được gì?</h2><p>${esc(story.moral)}</p></div></section>
 <div class="story-actions"><button class="big-btn" id="quizBtn">Trả lời câu hỏi ★</button></div></div>`;
 drawScene(false);showStart();
 $('#play').onclick=()=>{if(!started)return begin();playing?pause():resume()};
 $('#prev').onclick=()=>goScene(scene-1);$('#next').onclick=()=>scene<story.scenes.length-1?goScene(scene+1):ending();
 all('[data-scene]').forEach(b=>b.onclick=()=>goScene(Number(b.dataset.scene)));
 $('#voiceBtn').onclick=()=>{state.voice=!state.voice;persist();$('#voiceBtn').setAttribute('aria-pressed',state.voice);toast(state.voice?'Đã bật giọng kể':'Đã tắt giọng kể — phụ đề vẫn chạy');if(playing){runScene(seg)}};
 $('#musicBtn').onclick=()=>{state.music=!state.music;persist();$('#musicBtn').setAttribute('aria-pressed',state.music);if(playing&&state.music)music.start();else music.stop()};
 $('#fsBtn').onclick=async()=>{const p=$('#player');try{if(document.fullscreenElement)await document.exitFullscreen();else if(p.requestFullscreen)await p.requestFullscreen();else if(p.webkitRequestFullscreen)p.webkitRequestFullscreen();else toast('Thiết bị chưa hỗ trợ toàn màn hình')}catch{toast('Thiết bị chưa cho phép toàn màn hình')}};
 $('#quizBtn').onclick=()=>startQuiz();
 bindStage();
 window.scrollTo({top:0});
}
function drawScene(animate=true){
 const stage=$('#stage');stage.style.setProperty('--scene-duration',sceneSeconds(story,scene)+'s');
 stage.innerHTML=sceneArt(story,scene);fit(stage);
 if(animate){stage.classList.remove('iris');void stage.offsetWidth;stage.classList.add('iris')}
 all('[data-scene]').forEach((b,i)=>{b.classList.toggle('on',i===scene);b.classList.toggle('done',i<scene);if(i===scene)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
 $('#prev').disabled=scene===0;
 $('#subtitle').textContent='';$('#subtitle').classList.remove('show');
 sync();
}
function sync(){const st=$('#stage');if(!st)return;st.classList.toggle('is-playing',playing);const b=$('#play');b.innerHTML=playing?'<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>':'<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg>';b.setAttribute('aria-label',playing?'Tạm dừng':'Phát');keepAwake(playing);tick();
 if('mediaSession' in navigator&&story){try{navigator.mediaSession.metadata=new MediaMetadata({title:story.title,artist:'Vườn Truyện Nhỏ'});navigator.mediaSession.playbackState=playing?'playing':'paused'}catch{}}}
let segStart=0,segDur=1,lock=null,rafId=0;
// Thanh tiến độ của cảnh: theo câu đang đọc và vị trí trong file âm thanh.
function tick(){cancelAnimationFrame(rafId);const step=()=>{const bar=$('#bar');if(!bar||!story)return;const n=segments(story,scene).length;const f=audio.duration&&!audio.paused?audio.currentTime/audio.duration:Math.min(1,(performance.now()-segStart)/segDur);bar.style.width=Math.min(100,(seg+(playing&&started?f:0))/n*100)+'%';if(playing)rafId=requestAnimationFrame(step)};step()}
function keepAwake(on){try{if(on&&!lock&&navigator.wakeLock)navigator.wakeLock.request('screen').then(l=>{lock=l;l.addEventListener('release',()=>{lock=null})}).catch(()=>{});else if(!on&&lock){lock.release().catch(()=>{});lock=null}}catch{}}
const fetched=new Set();function prefetch(c){if(location.protocol==='file:'||!state.voice||!c?.f||fetched.has(c.f))return;fetched.add(c.f);fetch(c.f).catch(()=>fetched.delete(c.f))}
function saveProgress(){if(!story)return;const p=state.progress[story.id]||{};state.progress[story.id]={...p,scene,done:false};persist()}
function flash(icon){const f=$('#tapFlash');if(!f)return;f.innerHTML=icon;f.classList.remove('show');void f.offsetWidth;f.classList.add('show')}
function toggle(){if(!started)return begin();if($('#player').dataset.panel)return;playing?pause():resume();flash(playing?'<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>')}
// Chạm khung hình để dừng/phát, vuốt ngang để chuyển cảnh.
function bindStage(){const st=$('#stage');let x0=null,y0=0,t0=0;
 st.addEventListener('pointerdown',e=>{x0=e.clientX;y0=e.clientY;t0=Date.now()});
 st.addEventListener('pointerup',e=>{if(x0===null)return;const dx=e.clientX-x0,dy=e.clientY-y0;x0=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){if(dx<0)scene<story.scenes.length-1?goScene(scene+1):ending();else goScene(scene-1);return}if(Math.abs(dx)<10&&Math.abs(dy)<10&&Date.now()-t0<500)toggle()});
}
function overlay(html,kind=''){if(html&&kind!=='start'){const sb=$('#subtitle');sb.textContent='';sb.classList.remove('show')}const o=$('#overlay');o.innerHTML=html;o.classList.toggle('show',!!html);$('#player').dataset.panel=html?kind:''}
function showStart(){
 const p=state.progress[story.id],resumeAt=p&&!p.done&&p.scene>0?p.scene:0;
 overlay(`<div class="start-card"><div class="start-title">${esc(story.title)}</div><div class="start-sub">${esc(story.category)} · ${esc(story.tag)}</div>${resumeAt?`<div class="end-actions"><button class="start-btn" id="resumeBtn"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg>Xem tiếp cảnh ${resumeAt+1}</button><button class="ghost-btn" id="startBtn">↺ Xem từ đầu</button></div>`:`<button class="start-btn" id="startBtn"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg>Bắt đầu xem</button>`}<small>Bật loa lên để nghe kể chuyện và nhạc nhé</small></div>`,'start');
 $('#startBtn').onclick=begin;if(resumeAt)$('#resumeBtn').onclick=()=>{started=true;overlay('');playing=true;goScene(resumeAt,true)};
}
function begin(){
 started=true;overlay('');playing=true;sync();if(state.music)music.start();
 if(scene!==0){scene=0;drawScene(true)}saveProgress();
 const n=narration(story.id);
 showSub(story.title);
 say(clipFor(n?.intro,story.title+'.'),story.title,()=>runScene(0));
}
function showSub(text,who=null){const el=$('#subtitle');if(!el)return;el.classList.remove('show');void el.offsetWidth;el.classList.toggle('dialogue',who!==null);el.innerHTML=who!==null?`${who?`<b class="who">${esc(who)}</b>`:""}<span>“${esc(text)}”</span>`:esc(text);el.classList.add('show')}
// Lời thoại: nhân vật đang nói mấp máy miệng.
function setTalking(c){all('#stage .actor.talking').forEach(x=>x.classList.remove('talking'));if(!c)return;
 const chars=c.chars?.length?c.chars:(window.SPEECH&&c.who?SPEECH.speakerOf(c.who).chars:[]);
 for(const t of chars){const list=all('#stage .actor[data-c="'+t+'"]');const a=list.find(x=>x.querySelector('.rig-mouth'))||list[0];if(a){a.classList.add('talking');return}}}
function runScene(from=0){
 if(!playing)return;const list=segments(story,scene);seg=from;
 if(seg>=list.length){waitTimer=setTimeout(()=>{if(!playing)return;scene<story.scenes.length-1?goScene(scene+1,true):ending()},900);return}
 const c=list[seg];showSub(c.t,c.say?(c.who||''):null);setTalking(c.say&&state.voice?c:null);prefetch(list[seg+1]||segments(story,Math.min(scene+1,story.scenes.length-1))[0]);segStart=performance.now();segDur=(c.d||wordsTime(c.t)/1000)*1000;tick();
 say(c,c.t,()=>{setTalking(null);runScene(seg+1)});
}
function goScene(i,auto=false){
 if(!story)return;i=Math.max(0,Math.min(i,story.scenes.length-1));cancelSpeech();
 if(!started){started=true;overlay('')}
 scene=i;seg=0;paused=null;drawScene(true);saveProgress();
 if(auto||playing){playing=true;sync();if(state.music)music.start();waitTimer=setTimeout(()=>runScene(0),650)}
}
function pause(){playing=false;paused={seg};cancelSpeech();music.stop();sync()}
function resume(){if(!started)return begin();overlay('');playing=true;sync();if(state.music)music.start();runScene(paused?.seg||0);paused=null}
function stopAll(){playing=false;cancelSpeech();music.stop();keepAwake(false);cancelAnimationFrame(rafId);story=null}
function ending(){
 cancelSpeech();playing=false;sync();music.stop();const n=narration(story.id);state.seen[story.id]=true;state.progress[story.id]={scene:0,done:true};persist();const nextStory=STORIES[(STORIES.indexOf(story)+1)%STORIES.length];
 overlay(`<div class="end-card"><div class="end-badge">★</div><div class="start-title small">Hết truyện!</div><p>${esc(story.moral)}</p><div class="end-actions"><button class="start-btn" id="endQuiz">Trả lời câu hỏi ★</button><button class="ghost-btn" id="endReplay">↻ Xem lại</button></div><a class="next-link" href="#/truyen/${nextStory.id}">Truyện tiếp theo: <b>${esc(nextStory.title)}</b> →</a></div>`,'end');
 $('#endQuiz').onclick=startQuiz;$('#endReplay').onclick=()=>{overlay('');scene=0;drawScene(true);playing=true;sync();if(state.music)music.start();runScene(0)};
 say(clipFor(n?.moral,'Bé học được gì? '+story.moral),story.moral,null);
}

/* ---------- Câu hỏi ---------- */
let qi=0,score=0,tried=false,locked=false;
function startQuiz(){if(!story)return;cancelSpeech();playing=false;music.stop();sync();qi=0;score=0;$('#player').scrollIntoView({behavior:'smooth',block:'center'});showQuestion(true)}
function showQuestion(intro=false){
 tried=false;locked=false;const q0=story.quiz[qi],nq0=narration(story.id)?.quiz?.[qi];
 // Tráo thứ tự đáp án mỗi lần hỏi để bé không đoán theo vị trí.
 const order=q0[1].map((_,k)=>k);for(let k=order.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[order[k],order[j]]=[order[j],order[k]]}
 const q=[q0[0],order.map(k=>q0[1][k]),order.indexOf(q0[2])],nq={q:clipFor(nq0?.q,q0[0]),a:order.map(k=>clipFor(nq0?.a?.[k],q0[1][k]))};
 overlay(`<div class="quiz-card"><div class="quiz-top"><span>Câu ${qi+1}/${story.quiz.length}</span><button class="icon-x" id="quizClose" aria-label="Đóng câu hỏi">×</button></div><h3>${esc(q[0])}</h3><div class="answers">${q[1].map((a,i)=>`<button class="answer" data-a="${i}"><b>${'ABC'[i]}</b>${esc(a)}</button>`).join('')}</div><p class="feedback" id="feedback" role="status"></p><button class="start-btn" id="nextQ" hidden>${qi===story.quiz.length-1?'Xem kết quả ★':'Câu tiếp theo →'}</button></div>`,'quiz');
 $('#quizClose').onclick=()=>{cancelSpeech();overlay('')};
 // Đọc câu hỏi rồi lần lượt các đáp án, làm nổi đáp án đang được đọc.
 const readAnswer=i=>{all('.answer').forEach((b,k)=>b.classList.toggle('reading',k===i));if(i>=q[1].length){all('.answer').forEach(b=>b.classList.remove('reading'));return}say(nq?.a?.[i],q[1][i],()=>readAnswer(i+1))};
 const ask=()=>say(nq?.q,q[0],()=>readAnswer(0));if(intro&&state.voice&&window.NARRATION?.common?.quizStart)say(window.NARRATION.common.quizStart,'',ask);else ask();
 all('[data-a]').forEach(b=>b.onclick=()=>{if(locked||b.disabled)return;all('.answer').forEach(x=>x.classList.remove('reading'));const a=Number(b.dataset.a),common=window.NARRATION?.common;
  if(a===q[2]){locked=true;if(!tried)score++;b.classList.add('right');$('#feedback').textContent='Đúng rồi! Bé giỏi quá! 🎉';all('[data-a]').forEach(x=>x.disabled=true);$('#nextQ').hidden=false;blip(common?.right?.[qi%(common.right.length||1)])}
  else{tried=true;b.classList.add('wrong');b.disabled=true;$('#feedback').textContent='Chưa đúng rồi. Bé thử lại nhé!';blip(common?.wrong?.[qi%(common.wrong.length||1)])}});
 $('#nextQ').onclick=()=>{qi++;qi<story.quiz.length?showQuestion():quizDone()};
}
function quizDone(){
 const n=story.quiz.length,stars=score===n?3:score>=Math.ceil(n*.6)?2:1,prev=state.results[story.id];
 if(!prev||prev.stars<stars){state.results[story.id]={stars,score,total:n};persist()}
 overlay(`<div class="end-card"><div class="big-stars">${'<span>★</span>'.repeat(stars)}${'<span class="off">★</span>'.repeat(3-stars)}</div><div class="start-title small">${stars===3?'Bé thật tuyệt vời!':'Bé đã rất cố gắng!'}</div><p>Bé trả lời đúng ngay ${score}/${n} câu.</p><div class="end-actions"><button class="start-btn" id="again">↻ Làm lại</button><a class="ghost-btn" href="#/">Chọn truyện khác</a></div></div>`,'end');
 $('#again').onclick=startQuiz;blip(window.NARRATION?.common?.done);
}

/* ---------- Điều hướng ---------- */
function route(){const m=location.hash.match(/^#\/truyen\/([\w-]+)/);if(m)openStory(m[1]);else{stopAll();home();window.scrollTo({top:0})}}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)pause()});
document.addEventListener('keydown',e=>{const t=e.target instanceof Element?e.target:document.body;if(!story||!$('#stage')||t.closest('input,select,textarea')||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key;
 if(k===' '||k==='k'){if(k===' '&&t.closest('button,a'))return;e.preventDefault();toggle()}
 else if(k==='ArrowRight'){e.preventDefault();scene<story.scenes.length-1?goScene(scene+1):ending()}
 else if(k==='ArrowLeft'){e.preventDefault();goScene(scene-1)}
 else if(k==='f')$('#fsBtn').click();else if(k==='m')$('#musicBtn').click()});
if('mediaSession' in navigator){try{navigator.mediaSession.setActionHandler('play',()=>{if(story&&!playing)toggle()});navigator.mediaSession.setActionHandler('pause',()=>{if(story&&playing)toggle()});navigator.mediaSession.setActionHandler('nexttrack',()=>{if(story)$('#next').click()});navigator.mediaSession.setActionHandler('previoustrack',()=>{if(story)$('#prev').click()})}catch{}}
window.addEventListener('hashchange',route);route();
})();
