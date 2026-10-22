/* Nhân vật vẽ chi tiết (viền mực, đổ bóng khối, mắt có tròng, biểu cảm theo tâm trạng).
   Giữ nguyên tên bộ phận (rig-head, rig-arm, rig-leg, rig-ear, rig-tail, rig-wing, rig-blink, rig-pupil, rig-mouth…)
   để animation.css / cinema.css tiếp tục điều khiển chuyển động.
   Màu viết dạng rgb() để bộ tăng màu trong app.js không làm lệch tông đã thiết kế. */
(() => {
let serial=0;
const R=h=>{h=h.replace('#','');return `rgb(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)})`};
const INK='rgb(66,44,34)';
const O=(w=2.4,o=.8)=>`stroke="${INK}" stroke-width="${w}" stroke-opacity="${o}" stroke-linejoin="round" stroke-linecap="round"`;
// l: sáng, b: màu chính, s: bóng, m: bụng/mõm, a: tai trong/điểm nhấn, n: mũi, i: tròng mắt, sc: khăn
const P={
 rabbit:{l:'#ffffff',b:'#f6efe6',s:'#d6c2ad',m:'#fffaf2',a:'#f4a7b2',n:'#e77d90',i:'#8a5a34',sc:'#4cb35a'},
 bear:{l:'#dba06a',b:'#b8763e',s:'#7f4b1e',m:'#f1d6ae',a:'#e8b48c',n:'#3a2620',i:'#4a2c18',sc:'#e9505c'},
 pig:{l:'#ffd6d6',b:'#f6aeb2',s:'#d9808c',m:'#ffc5ca',a:'#ee8b99',n:'#d2687b',i:'#5a3826',sc:'#2fa7a0'},
 mouse:{l:'#cfcbd1',b:'#a9a3ab',s:'#76707e',m:'#f1e9e2',a:'#f6a9b5',n:'#ee7c93',i:'#2a2230',sc:'#f5b82e'},
 fox:{l:'#ffa85c',b:'#f07a28',s:'#bb4c12',m:'#fff7ec',a:'#3a2520',n:'#2a1b16',i:'#8a5512'},
 lion:{l:'#ffd47c',b:'#f1b043',s:'#c48020',m:'#fff1d2',a:'#b65a1a',n:'#6a3820',i:'#7a4a10'},
 'human-child':{l:'#ffe2c8',b:'#f7c8a0',s:'#d9a37a',m:'#ffdcc0',a:'#ef9c86',n:'#d48c6c',i:'#3a2416',hair:'#2d201a',top:'#ff6b6b',topS:'#d8474f',leg:'#3a76c4'},
 'human-elder':{l:'#ffe2c8',b:'#f1c098',s:'#cf9a72',m:'#ffdcc0',a:'#ef9c86',n:'#cc8464',i:'#3a2416',hair:'#f4f2ec',top:'#8c6a4c',topS:'#6a4e36',leg:'#566676'},
 bird:{l:'#ffffff',b:'#eef0f4',s:'#b9c0d0',m:'#ffffff',a:'#a9b5d8',n:'#f2a23a',i:'#2a2a3a'},
 crow:{l:'#5f7488',b:'#3b4a5c',s:'#222c38',m:'#55677a',a:'#2c3a4a',n:'#2b2b2b',i:'#1a1a22'},
 duck:{l:'#fffbe0',b:'#fff1b0',s:'#e8c766',m:'#fff8d4',a:'#f2d27a',n:'#ff9a1f',i:'#2a2420'},
 chick:{l:'#fff3a6',b:'#ffd43a',s:'#e9a812',m:'#ffe781',a:'#f7c01a',n:'#ff8f1f',i:'#2a2014'},
 turtle:{l:'#a6dc7c',b:'#6fbf55',s:'#3f8a34',m:'#d9eaa0',a:'#8bc760',n:'#3d6b2c',i:'#2a2a1c'},
 ant:{l:'#d9825a',b:'#b55a32',s:'#7a3418',m:'#e8a07c',a:'#8c4220',n:'#5a2810',i:'#1e1410'},
 cat:{l:'#ffc98a',b:'#f4a457',s:'#c46e26',m:'#fff4e4',a:'#f6a9b5',n:'#ee7f93',i:'#5f9a3a',sc:'#4aa3df',stripe:'#d27a2c'},
 squirrel:{l:'#e9a065',b:'#c8743a',s:'#8a4a1e',m:'#f7e2c4',a:'#e8b08a',n:'#3a2620',i:'#3a2416',sc:'#7cc35a'},
 owl:{l:'#d8b58c',b:'#a9805a',s:'#6e4d32',m:'#f3e3c8',a:'#e9a23b',n:'#e9a23b',i:'#e8a21a'},
 rooster:{l:'#ffb36b',b:'#f07a2a',s:'#b8461a',m:'#ffd59a',a:'#2f8f5b',n:'#f6a623',i:'#2a1a12'},
 hen:{l:'#e7b98d',b:'#c98a55',s:'#8f5a30',m:'#f4dcc0',a:'#a8703f',n:'#f6a623',i:'#2a1a12'},
 sparrow:{l:'#d7b08a',b:'#b07c50',s:'#6f4a2c',m:'#f2e6d6',a:'#7a5232',n:'#4a3a30',i:'#1e1612'}
};
function moodOf(mood){return{sleep:mood==='sleep',joy:mood==='celebrate',happy:['celebrate','wave','boast','hug-child','hug-parent','relax'].includes(mood),sad:['sad','concern'].includes(mood),scared:['tremble','shiver','float-distress'].includes(mood),talk:['explain','boast','argue'].includes(mood),strain:['strain','huff','hammer','gnaw'].includes(mood),angry:['argue','huff'].includes(mood)}}
function grads(id,p){const c=k=>R(p[k]);return `<defs><radialGradient id="${id}-fur" cx=".36" cy=".3" r=".78"><stop offset="0" stop-color="${c('l')}"/><stop offset=".55" stop-color="${c('b')}"/><stop offset="1" stop-color="${c('s')}"/></radialGradient><radialGradient id="${id}-head" cx=".38" cy=".3" r=".75"><stop offset="0" stop-color="${c('l')}"/><stop offset=".6" stop-color="${c('b')}"/><stop offset="1" stop-color="${c('s')}"/></radialGradient><linearGradient id="${id}-limb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c('b')}"/><stop offset="1" stop-color="${c('s')}"/></linearGradient><radialGradient id="${id}-iris" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="rgb(255,255,255)" stop-opacity=".25"/><stop offset=".35" stop-color="${c('i')}"/><stop offset="1" stop-color="rgb(20,14,12)"/></radialGradient><radialGradient id="${id}-ear" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="${c('a')}"/><stop offset="1" stop-color="${c('s')}" stop-opacity=".9"/></radialGradient></defs>`}

/* ---------- Khuôn mặt ---------- */
function eye(side,id,m,x0=13,y=-80,k=1){
 const x=side*x0;
 if(m.sleep)return `<path d="M${x-8*k} ${y+1}q${8*k} ${7*k} ${16*k} 0" fill="none" ${O(2.8)}/><path d="M${x+side*7*k} ${y+4}l${side*4} 3" ${O(1.6,.6)}/>`;
 if(m.joy)return `<path d="M${x-8*k} ${y+3}q${8*k} ${-11*k} ${16*k} 0" fill="none" ${O(3)}/>`;
 const rx=(m.scared?9.5:8.6)*k,ry=(m.scared?11.5:10.6)*k,ir=(m.scared?4.4:6.3)*k,dx=m.sad?-.6:1.1;
 return `<g class="rig-blink"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="rgb(255,255,255)" ${O(2.1)}/><g class="rig-pupil"><circle cx="${x+dx}" cy="${y+1.6}" r="${ir}" fill="url(#${id}-iris)"/><circle cx="${x+dx}" cy="${y+1.6}" r="${ir*.5}" fill="rgb(18,12,12)"/><circle cx="${x+dx+ir*.4}" cy="${y-ir*.3}" r="${ir*.36}" fill="rgb(255,255,255)"/><circle cx="${x+dx-ir*.42}" cy="${y+ir*.55}" r="${ir*.17}" fill="rgb(255,255,255)" opacity=".85"/></g>${m.sad?`<path d="M${x-rx} ${y-ry*.25}q${rx} ${-ry*.55} ${2*rx} ${side<0?-3:3}" fill="none" ${O(2.4)}/>`:`<path d="M${x-rx+1} ${y-ry*.42}q${rx-1} ${-ry*.78} ${2*rx-2} 0" fill="none" ${O(2.5)}/>`}</g>`;
}
function brows(m,y=-96,x0=13){
 return [-1,1].map(side=>{const o=side*(x0+8),i=side*(x0-7);
  if(m.sad)return `<path d="M${o} ${y+3}Q${(o+i)/2} ${y+1} ${i} ${y-4}" fill="none" ${O(2.6,.7)}/>`;
  if(m.angry||m.strain)return `<path d="M${o} ${y-3}Q${(o+i)/2} ${y-2} ${i} ${y+4}" fill="none" ${O(2.8,.75)}/>`;
  if(m.scared)return `<path d="M${o} ${y-1}Q${(o+i)/2} ${y-8} ${i} ${y-3}" fill="none" ${O(2.4,.65)}/>`;
  return `<path d="M${o} ${y}Q${(o+i)/2} ${y-4} ${i} ${y-1}" fill="none" ${O(2.2,.45)}/>`}).join('');
}
function mouth(m,y=-50,w=1){
 if(m.sleep)return `<ellipse class="snore-mouth" cy="${y}" rx="${4*w}" ry="4" fill="rgb(150,70,70)" ${O(1.8)}/>`;
 if(m.scared)return `<ellipse cy="${y+1}" rx="${5*w}" ry="7" fill="rgb(120,46,50)" ${O(2)}/>`;
 if(m.sad)return `<path d="M${-8*w} ${y+3}q${8*w} -8 ${16*w} 0" fill="none" ${O(2.4)}/>`;
 if(m.strain)return `<g><rect x="${-9*w}" y="${y-4}" width="${18*w}" height="8" rx="3" fill="rgb(255,255,255)" ${O(2)}/><path d="M${-9*w} ${y}h${18*w}M${-3*w} ${y-4}v8m${6*w}-8v8" ${O(1.2,.5)}/></g>`;
 if(m.happy)return `<g class="rig-mouth"><path d="M${-12*w} ${y-3}q${12*w} ${18} ${24*w} 0Z" fill="rgb(150,50,58)" ${O(2.2)}/><path d="M${-6*w} ${y+5}q${6*w} -5 ${12*w} 0q${-6*w} 6 ${-12*w} 0" fill="rgb(242,128,140)"/><path d="M${-10*w} ${y-2}h${20*w}" stroke="rgb(255,255,255)" stroke-width="3" stroke-linecap="round"/></g>`;
 if(m.talk)return `<g class="rig-mouth"><ellipse cy="${y}" rx="${7*w}" ry="5" fill="rgb(150,50,58)" ${O(2)}/><ellipse cy="${y+2}" rx="${4*w}" ry="2" fill="rgb(242,128,140)"/></g>`;
 return `<g class="rig-mouth"><path d="M${-8*w} ${y-2}q${8*w} 9 ${16*w} 0" fill="none" ${O(2.3)}/></g>`;
}
const blush=(y=-62,x=25,r=8)=>`<ellipse cx="${-x}" cy="${y}" rx="${r}" ry="${r*.55}" fill="rgb(255,120,130)" opacity=".38"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.55}" fill="rgb(255,120,130)" opacity=".38"/>`;
const whiskers=(y=-58,o=.55)=>`<path d="M-18 ${y}-40 ${y-5}m21 9-22 3m55-12 22-5m-21 9 22 3" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linecap="round" opacity="${o}"/>`;

/* ---------- Tay chân ---------- */
function limb(side,id,p,{leg=false,sleeve=null,paw=null,foot=null}={}){
 const color=sleeve||`url(#${id}-limb)`;
 if(leg){const f=foot||R(p.s);return `<g transform="translate(${side*16} -2)"><g class="rig-leg ${side<0?'left':'right'}"><path d="M0 0Q${side*3} 12 ${side*2} 21" fill="none" stroke="${INK}" stroke-opacity=".8" stroke-width="19" stroke-linecap="round"/><path d="M0 0Q${side*3} 12 ${side*2} 21" fill="none" stroke="${color}" stroke-width="14.5" stroke-linecap="round"/><ellipse cx="${side*5}" cy="25" rx="15" ry="8" fill="${f}" ${O(2.2)}/><path d="M${side*5-5} 21v6m5-7v7" ${O(1.3,.45)}/></g></g>`}
 const pw=paw||`url(#${id}-fur)`;
 return `<g transform="translate(${side*27} -46)"><g class="rig-arm ${side<0?'left':'right'}"><path d="M0 0Q${side*6} 14 ${side*3} 27" fill="none" stroke="${INK}" stroke-opacity=".8" stroke-width="16" stroke-linecap="round"/><path d="M0 0Q${side*6} 14 ${side*3} 27" fill="none" stroke="${color}" stroke-width="11.5" stroke-linecap="round"/><circle cx="${side*3}" cy="30" r="8.5" fill="${pw}" ${O(2.1)}/><path d="M${side*3-3} 34q3 2 6 0" ${O(1.2,.4)} fill="none"/></g></g>`;
}

/* ---------- Bộ phận theo loài ---------- */
function ears(type,id,p){
 const f=`url(#${id}-head)`,inner=`url(#${id}-ear)`;
 if(type==='rabbit')return [-1,1].map(s=>`<g transform="translate(${s*15} -107) rotate(${s*7})"><g class="rig-ear ${s<0?'left':'right'}"><path d="M-11 6C-21-28-17-64-1-68 15-69 15-30 11 6Z" fill="${f}" ${O()}/><path d="M-5-2C-11-28-8-54-1-57 6-56 7-28 5-2Z" fill="${inner}"/><path d="M-1-50v30" stroke="rgb(255,255,255)" stroke-width="2.5" opacity=".5" stroke-linecap="round"/></g></g>`).join('');
 if(type==='bear')return [-1,1].map(s=>`<g transform="translate(${s*24} -100)"><g class="rig-ear ${s<0?'left':'right'}"><circle cx="${s*5}" cy="-6" r="15" fill="${f}" ${O()}/><circle cx="${s*5}" cy="-5" r="8.5" fill="${inner}"/></g></g>`).join('');
 if(type==='pig')return [-1,1].map(s=>`<g transform="translate(${s*26} -104)"><g class="rig-ear ${s<0?'left':'right'}"><path d="M${s*-12} 4L${s*12}-30 ${s*20} 6Q${s*4} 14 ${s*-12} 4Z" fill="${f}" ${O()}/><path d="M${s*-4} 2L${s*11}-18 ${s*14} 3Z" fill="${inner}"/></g></g>`).join('');
 if(type==='mouse')return [-1,1].map(s=>`<g transform="translate(${s*24} -100)"><g class="rig-ear ${s<0?'left':'right'}"><circle cx="${s*6}" cy="-6" r="23" fill="${f}" ${O()}/><circle cx="${s*6}" cy="-5" r="15" fill="${inner}"/><path d="M${s*-2}-18q${s*8}-5 ${s*14} 4" stroke="rgb(255,255,255)" stroke-width="2.5" fill="none" opacity=".5" stroke-linecap="round"/></g></g>`).join('');
 if(type==='fox')return [-1,1].map(s=>`<g transform="translate(${s*22} -104)"><g class="rig-ear ${s<0?'left':'right'}"><path d="M${s*-14} 6L${s*6}-36 ${s*16} 8Z" fill="${f}" ${O()}/><path d="M${s*-6} 2L${s*5}-22 ${s*10} 4Z" fill="rgb(255,236,214)"/><path d="M${s*-1}-20L${s*6}-36 ${s*11}-18Z" fill="${R(p.a)}"/></g></g>`).join('');
 if(type==='lion')return [-1,1].map(s=>`<g transform="translate(${s*27} -102)"><g class="rig-ear ${s<0?'left':'right'}"><circle cx="${s*3}" cy="-4" r="12" fill="${f}" ${O()}/><circle cx="${s*3}" cy="-3" r="6" fill="rgb(236,170,120)"/></g></g>`).join('');
 if(type==='cat')return [-1,1].map(s=>`<g transform="translate(${s*22} -104)"><g class="rig-ear ${s<0?'left':'right'}"><path d="M${s*-14} 6Q${s*-2}-30 ${s*8}-32Q${s*18}-10 ${s*16} 8Z" fill="${f}" ${O()}/><path d="M${s*-6} 2Q${s*2}-20 ${s*7}-22 ${s*12}-6 ${s*10} 4Z" fill="${inner}"/></g></g>`).join('');
 if(type==='squirrel')return [-1,1].map(s=>`<g transform="translate(${s*22} -104)"><g class="rig-ear ${s<0?'left':'right'}"><path d="M${s*-10} 6Q${s*-6}-22 ${s*6}-24 ${s*16}-10 ${s*12} 8Z" fill="${f}" ${O()}/><path d="M${s*-3} 2Q${s*-1}-14 ${s*5}-15 ${s*10}-6 ${s*8} 4Z" fill="${inner}"/><path d="M${s*4}-24q${s*2}-10 ${s*-2}-14m${s*6} 14q${s*6}-8 ${s*4}-14" stroke="${R(p.s)}" stroke-width="3" stroke-linecap="round" fill="none"/></g></g>`).join('');
 return '';
}
function headShape(type){
 if(type==='pig')return 'M-41-76C-41-104-22-116 0-116S41-104 41-76 24-39 0-39-41-50-41-76Z';
 if(type==='bear')return 'M-39-77C-39-104-21-116 0-116S39-104 39-77 23-38 0-38-39-52-39-77Z';
 if(type==='fox')return 'M-35-84C-33-107-17-116 0-116S33-107 35-84L47-62 33-59Q19-40 0-40T-33-59L-47-62Z';
 if(type==='mouse')return 'M-33-77C-33-101-18-111 0-111S33-101 33-77 20-42 0-42-33-54-33-77Z';
 if(type==='lion')return 'M-36-78C-36-104-20-114 0-114S36-104 36-78 22-40 0-40-36-54-36-78Z';
 if(type==='cat')return 'M-36-80C-35-104-19-114 0-114S35-104 36-80L44-64 34-60Q20-40 0-40T-34-60L-44-64Z';
 if(type==='squirrel')return 'M-35-78C-35-102-19-113 0-113S35-102 35-78 26-44 0-41-35-52-35-78Z';
 return 'M-36-78C-36-103-20-115 0-115S36-103 36-78 22-39 0-39-36-53-36-78Z';
}
function muzzle(type,p,m){
 const n=R(p.n),mz=R(p.m);
 if(type==='bear')return `<ellipse cy="-58" rx="18" ry="14" fill="${mz}" ${O(2)}/><path d="M-7-66q7-6 14 0 1 7-7 9-8-2-7-9Z" fill="${n}"/><circle cx="-2" cy="-65" r="1.8" fill="rgb(255,255,255)" opacity=".8"/><path d="M0-57v4" ${O(1.6)}/>`+mouth(m,-49,.85);
 if(type==='pig')return `<ellipse cy="-62" rx="18" ry="12.5" fill="${R(p.a)}" ${O(2.2)}/><ellipse cx="-6" cy="-62" rx="3" ry="4.5" fill="rgb(150,60,80)"/><ellipse cx="6" cy="-62" rx="3" ry="4.5" fill="rgb(150,60,80)"/><ellipse cx="-4" cy="-68" rx="7" ry="2.5" fill="rgb(255,255,255)" opacity=".45"/>`+mouth(m,-45,.9);
 if(type==='fox')return `<path d="M-33-70Q-14-66 0-56 14-66 33-70 26-42 0-40-26-42-33-70Z" fill="${mz}"/><path d="M-6-60q6-5 12 0-2 6-6 7-4-1-6-7Z" fill="${n}"/>`+whiskers(-56,.4)+mouth(m,-49,.8);
 if(type==='lion')return `<ellipse cx="-9" cy="-58" rx="13" ry="10" fill="${mz}"/><ellipse cx="9" cy="-58" rx="13" ry="10" fill="${mz}"/><path d="M-7-66q7-5 14 0-2 7-7 8-5-1-7-8Z" fill="${n}"/>`+whiskers(-57,.35)+mouth(m,-47,.85);
 if(type==='mouse')return `<ellipse cy="-60" rx="14" ry="10" fill="${mz}"/><circle cy="-65" r="5.5" fill="${n}" ${O(1.6)}/><circle cx="-2" cy="-67" r="1.6" fill="rgb(255,255,255)"/>`+whiskers(-60,.6)+mouth(m,-51,.75);
 if(type==='cat')return `<ellipse cx="-8" cy="-57" rx="10" ry="8" fill="${mz}"/><ellipse cx="8" cy="-57" rx="10" ry="8" fill="${mz}"/><path d="M-5-64h10q0 5-5 7-5-2-5-7Z" fill="${n}" ${O(1.4)}/>`+whiskers(-57,.55)+mouth(m,-48,.8);
 if(type==='squirrel')return `<ellipse cx="-9" cy="-57" rx="12" ry="9" fill="${mz}"/><ellipse cx="9" cy="-57" rx="12" ry="9" fill="${mz}"/><ellipse cy="-64" rx="5.5" ry="4" fill="${n}"/><circle cx="-1.5" cy="-65.5" r="1.4" fill="rgb(255,255,255)"/>${m.sleep||m.scared?'':'<path d="M-4-52h8v6h-8Z" fill="rgb(255,255,255)" '+O(1.3,.7)+'/>'}`+mouth(m,-49,.75);
 if(type==='rabbit')return `<ellipse cx="-7" cy="-58" rx="9" ry="7" fill="${mz}"/><ellipse cx="7" cy="-58" rx="9" ry="7" fill="${mz}"/><path d="M-5-65h10q0 5-5 6-5-1-5-6Z" fill="${n}" ${O(1.4)}/><path d="M-3-52h6v4h-6Z" fill="rgb(255,255,255)" ${O(1.2,.6)}/>`+whiskers(-58,.35)+mouth(m,-49,.8);
 return `<path d="M-2-64q3 4 0 7" fill="none" ${O(1.8,.55)}/>`+mouth(m,-50,.85);
}
function back(type,id,p){
 const f=`url(#${id}-fur)`;
 if(type==='rabbit')return `<g class="rig-tail"><circle cx="-31" cy="-6" r="13" fill="${R(p.l)}" ${O()}/><path d="M-36-10q4-4 9-1" fill="none" ${O(1.3,.4)}/></g>`;
 if(type==='fox')return `<g class="rig-tail"><path d="M-22 2Q-80 12-84-46-66-40-52-20-46-36-30-28-26-14-18-8Z" fill="${f}" ${O()}/><path d="M-84-46Q-80-28-70-16-62-30-66-40-76-44-84-46Z" fill="rgb(255,247,236)"/></g>`;
 if(type==='pig')return `<path class="rig-tail" d="M28-8q24-6 20-20-4-9-11-3-4 6 4 9 9 1 14-8" fill="none" stroke="${R(p.s)}" stroke-width="5" stroke-linecap="round"/>`;
 if(type==='mouse')return `<path class="rig-tail" d="M-26 0Q-62 18-66-12-68-32-50-34" fill="none" stroke="rgb(240,160,175)" stroke-width="5" stroke-linecap="round"/>`;
 if(type==='lion')return `<g class="rig-tail"><path d="M-24 0Q-60 10-62-26" fill="none" stroke="${R(p.b)}" stroke-width="7" stroke-linecap="round"/><path d="M-62-26q-12-4-8-16 10 2 12-6 8 10-4 22Z" fill="${R(p.a)}" ${O(2)}/></g>`;
 if(type==='bear')return `<circle class="rig-tail" cx="-27" cy="-4" r="8" fill="${R(p.s)}" ${O(1.8)}/>`;
 if(type==='cat')return `<g class="rig-tail"><path d="M-24 2Q-66 4-62-36-60-58-44-56" fill="none" stroke="${INK}" stroke-opacity=".8" stroke-width="15" stroke-linecap="round"/><path d="M-24 2Q-66 4-62-36-60-58-44-56" fill="none" stroke="${R(p.b)}" stroke-width="10.5" stroke-linecap="round"/><path d="M-40 4l-2-10M-56-6l-8-4M-62-30h-9" stroke="${R(p.stripe)}" stroke-width="4" stroke-linecap="round"/></g>`;
 if(type==='squirrel')return `<g class="rig-tail"><path d="M-18 4Q-78 8-80-60-82-118-30-122-2-122-4-98-6-80-28-86-48-92-46-62-44-34-18-24Z" fill="${f}" ${O()}/><path d="M-62-70q-4-36 30-40m-34 70q-10-10-10-30" stroke="${R(p.l)}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/></g>`;
 return '';
}
function mane(p){
 const spikes=Array.from({length:16},(_,i)=>{const a=i/16*Math.PI*2,r1=46,r2=60+(i%2)*6;const x1=Math.cos(a-.2)*r1,y1=Math.sin(a-.2)*r1,x2=Math.cos(a)*r2,y2=Math.sin(a)*r2,x3=Math.cos(a+.2)*r1,y3=Math.sin(a+.2)*r1;return `${i?'L':'M'}${x1.toFixed(1)} ${(y1-78).toFixed(1)}Q${x2.toFixed(1)} ${(y2-78).toFixed(1)} ${x3.toFixed(1)} ${(y3-78).toFixed(1)}`}).join('')+'Z';
 return `<g class="lion-mane"><path d="${spikes}" fill="${R(p.a)}" ${O()}/><circle cy="-78" r="47" fill="rgb(206,112,40)"/><path d="M-30-108q-14 18-12 40m82-40q14 18 12 40" stroke="rgb(230,150,70)" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/></g>`;
}
function scarf(c){return `<path class="rig-scarf" d="M-30-50Q0-36 30-50l-2 13Q0-24-28-37Z" fill="${R(c)}" ${O(2)}/><path d="M-26-44Q0-32 26-44" stroke="rgb(255,255,255)" stroke-width="2" fill="none" opacity=".35" stroke-dasharray="4 5"/><path class="scarf-tail" d="M16-40 28-6 40-14 28-44Z" fill="${R(c)}" ${O(2)}/>`}
function tufts(p,y=-30){return `<path d="M-8 ${y}l3 5 3-5 3 5 3-5" fill="none" stroke="${R(p.s)}" stroke-width="1.6" stroke-linecap="round" opacity=".3"/>`}

/* ---------- Người ---------- */
function human(type,id,p,m){
 const elder=type==='human-elder';
 const hair=elder?`<path d="M-37-80Q-40-114 0-116 40-114 37-80L30-96Q18-104 0-104T-30-96Z" fill="${R(p.hair)}" ${O()}/>`:`<path d="M-38-74Q-44-118 0-120 44-118 38-74L31-92Q14-104-6-98-20-108-31-92Z" fill="${R(p.hair)}" ${O()}/><path d="M-14-112q12-8 28-2" stroke="rgb(90,70,60)" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>`;
 const beard=elder?`<path d="M-22-58Q-22-20 0-14 22-20 22-58Q12-48 0-50-12-48-22-58Z" fill="${R(p.hair)}" ${O()}/><path d="M-10-44q10 4 20 0" stroke="rgb(210,206,196)" stroke-width="2" fill="none"/>`:'';
 const glasses=elder?`<g fill="none" stroke="rgb(120,90,60)" stroke-width="2.4"><circle cx="-13" cy="-80" r="10"/><circle cx="13" cy="-80" r="10"/><path d="M-3-80h6"/></g>`:'';
 const ears=`<ellipse cx="-36" cy="-74" rx="6" ry="9" fill="url(#${id}-head)" ${O(2)}/><ellipse cx="36" cy="-74" rx="6" ry="9" fill="url(#${id}-head)" ${O(2)}/>`;
 const top=R(p.top),topS=R(p.topS);
 const body=`<path d="M-30-52Q0-62 30-52L34 4Q0 10-34 4Z" fill="${top}" ${O()}/><path d="M18-50 30-52 34 4 22 5Z" fill="${topS}" opacity=".6"/>${elder?`<path d="M0-56V2" ${O(1.6,.5)}/><circle cy="-40" r="2.2" fill="rgb(240,220,180)"/><circle cy="-24" r="2.2" fill="rgb(240,220,180)"/><circle cy="-8" r="2.2" fill="rgb(240,220,180)"/>`:`<path d="M-14-56q14 12 28 0" fill="none" stroke="rgb(255,255,255)" stroke-width="4" opacity=".8"/><circle cx="-12" cy="-26" r="4" fill="rgb(255,214,90)"/><circle cx="10" cy="-12" r="4" fill="rgb(255,214,90)"/>`}`;
 const face=`<path d="${headShape(type)}" fill="url(#${id}-head)" ${O()}/>${blush(-62,22,7)}`;
 return `${limb(-1,id,p,{leg:true,sleeve:R(p.leg),foot:'rgb(90,60,50)'})}${limb(1,id,p,{leg:true,sleeve:R(p.leg),foot:'rgb(90,60,50)'})}${limb(-1,id,p,{sleeve:top,paw:`url(#${id}-head)`})}${body}${limb(1,id,p,{sleeve:top,paw:`url(#${id}-head)`})}<g class="rig-head">${ears}${face}${hair}${eye(-1,id,m,13,-80,.9)}${eye(1,id,m,13,-80,.9)}${glasses}${brows(m,-95)}${beard}${elder?mouth(m,-52,.8):muzzle('human',p,m)}</g>`;
}

/* ---------- Chim ---------- */
function bird(type,id,p,m){
 const duck=type==='duck',chick=type==='chick',crow=type==='crow';
 const n=R(p.n);
 const legs=duck?`<path d="M-10 4v14M10 4v14" stroke="${n}" stroke-width="4.5" stroke-linecap="round"/><path d="M-20 22l10-6 10 6ZM0 22l10-6 10 6Z" fill="${n}" ${O(1.6)}/>`:`<path d="M-10 4v17m-8 2 8-2 8 2M10 4v17m-8 2 8-2 8 2" fill="none" stroke="${n}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
 const roo=type==='rooster',hen=type==='hen',spa=type==='sparrow';
 const tail=roo?`<g class="bird-tail"><path d="M-24-30Q-70-60-58-100-40-70-20-44Z" fill="rgb(38,110,72)" ${O(2)}/><path d="M-26-24Q-82-36-84-80-56-56-24-36Z" fill="rgb(26,80,60)" ${O(2)}/><path d="M-26-18Q-74-10-90-44-58-36-26-28Z" fill="rgb(214,80,30)" ${O(2)}/><path d="M-50-78q8 18 22 28" stroke="rgb(120,200,150)" stroke-width="2.5" fill="none" opacity=".6"/></g>`:`<path class="bird-tail" d="M-28-22Q-56-26-58-48-40-44-22-34Z" fill="${R(p.s)}" ${O(2)}/>`;
 const body=`<ellipse cy="-22" rx="34" ry="29" fill="url(#${id}-fur)" ${O()}/><ellipse cx="9" cy="-14" rx="20" ry="17" fill="${R(p.m)}" opacity=".75"/>${chick?`<path d="M-30-10q-6 6 0 10m58-12q6 6 0 10" stroke="${R(p.s)}" stroke-width="2" fill="none" opacity=".6"/>`:''}`;
 const wing=`<g class="rig-wing" transform="translate(-16 -29)"><path d="M-8 0Q14-20 36 4 22 30-6 16Z" fill="${R(crow?p.s:p.a)}" ${O(2)}/><path d="M2 8q12 8 24 0M0 15q10 5 18 2" fill="none" stroke="rgb(255,255,255)" stroke-width="2" opacity=".35" stroke-linecap="round"/></g>`;
 const beak=duck?(m.happy||m.talk?`<path d="M38-62q22-8 32 2-12 4-32 2Z" fill="${n}" ${O(1.8)}/><path d="M38-56q20 2 28 8-14 4-28-2Z" fill="rgb(230,110,20)" ${O(1.8)}/>`:`<path d="M38-62q24-8 32 4-10 8-32 4Z" fill="${n}" ${O(1.8)}/><path d="M50-58h10" stroke="rgb(200,100,20)" stroke-width="1.5"/>`):(m.happy||m.talk?`<path d="m40-62 22 4-22 4Z" fill="${n}" ${O(1.6)}/><path d="m40-54 17 6-17 1Z" fill="rgb(220,120,30)" ${O(1.6)}/>`:`<path d="m40-63 24 8-24 7Z" fill="${n}" ${O(1.6)}/>`);
 const comb=roo||hen?`<path d="M4-78q-2-14 8-12 0-12 10-8 4-10 12-2 10 0 6 14Z" fill="rgb(226,40,48)" ${O(2)} transform="${hen?'translate(6 6) scale(.7)':''}"/>`:'';
 const wattle=roo||hen?`<path d="M42-50q4 14-4 16-6-8 0-16Z" fill="rgb(226,40,48)" ${O(1.6)} transform="${hen?'translate(10 -6) scale(.75)':''}"/>`:'';
 const cap=spa?`<path d="M-4-66Q4-84 26-82 40-78 42-66 24-74 -4-66Z" fill="rgb(110,72,44)"/><ellipse cx="22" cy="-46" rx="9" ry="6" fill="rgb(70,52,40)" opacity=".5"/>`:'';
 const tuft=roo||hen?comb:chick?`<path d="M8-80q-4-14 6-16 0 8 4 4 2-10 10-8-4 8-2 14" fill="${R(p.b)}" ${O(1.8)}/>`:type==='bird'?`<path d="M6-80q4-10 14-8" stroke="${R(p.s)}" stroke-width="3" fill="none" stroke-linecap="round"/>`:'';
 const e=m.sleep?`<path d="M18-62q7 6 14 0" fill="none" ${O(2.6)}/>`:m.joy?`<path d="M18-60q7-9 14 0" fill="none" ${O(2.8)}/>`:`<g class="rig-blink"><ellipse cx="26" cy="-62" rx="${m.scared?8:7}" ry="${m.scared?10:9}" fill="rgb(255,255,255)" ${O(2)}/><circle cx="28" cy="-61" r="${m.scared?3.4:4.8}" fill="url(#${id}-iris)"/><circle cx="28" cy="-61" r="2.4" fill="rgb(16,12,12)"/><circle cx="30" cy="-64" r="1.7" fill="rgb(255,255,255)"/></g>`;
 const brow=m.sad?`<path d="M18-74q8-2 14 4" ${O(2.2,.6)} fill="none"/>`:m.angry||m.strain?`<path d="M18-76q8 2 14 6" ${O(2.4,.7)} fill="none"/>`:'';
 const head=`<g class="rig-head">${tuft}<circle cx="18" cy="-58" r="25" fill="url(#${id}-head)" ${O()}/>${crow?'<path d="M2-70q10-8 24-6" stroke="rgb(120,150,190)" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/>':''}${cap}${e}${brow}${beak}${wattle}<ellipse cx="33" cy="-48" rx="6" ry="3.5" fill="rgb(255,120,130)" opacity="${crow?.0:.4}"/></g>`;
 return `${legs}${tail}${body}${wing}${head}`;
}

/* ---------- Cú (vẽ chính diện) ---------- */
function owl(id,p,m){
 const f=`url(#${id}-fur)`,e=(s)=>eye(s,id,m,17,-92,1.35);
 return `<path d="M-14 2v8m-6 0 6-4 6 4M14 2v8m-6 0 6-4 6 4" fill="none" stroke="${R(p.n)}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><g class="owl-wing left"><path d="M-34-62Q-58-34-40 0-26-14-26-50Z" fill="${R(p.s)}" ${O()}/></g><g class="owl-wing right"><path d="M34-62Q58-34 40 0 26-14 26-50Z" fill="${R(p.s)}" ${O()}/></g><ellipse cy="-36" rx="38" ry="42" fill="${f}" ${O()}/><ellipse cy="-28" rx="25" ry="30" fill="${R(p.m)}"/>${[[-10,-40],[8,-40],[-1,-26],[-12,-14],[10,-14]].map(([x,y])=>`<path d="M${x-5} ${y}q5 6 10 0" fill="none" stroke="${R(p.s)}" stroke-width="2" opacity=".55"/>`).join('')}<g class="rig-head"><path d="M-38-112 -30-132-16-116M38-112 30-132 16-116" fill="${R(p.b)}" ${O()}/><ellipse cy="-94" rx="42" ry="36" fill="url(#${id}-head)" ${O()}/><circle cx="-17" cy="-92" r="19" fill="${R(p.m)}"/><circle cx="17" cy="-92" r="19" fill="${R(p.m)}"/>${e(-1)}${e(1)}${brows(m,-114,17)}<path d="M-6-80h12l-6 12Z" fill="${R(p.a)}" ${O(1.8)}/></g>`;
}
const bow=(x,y)=>`<g transform="translate(${x} ${y}) rotate(-12)"><path d="M0 0-16-10-16 10Z M0 0 16-10 16 10Z" fill="rgb(255,105,150)" ${O(1.8)}/><circle r="5" fill="rgb(255,200,90)" ${O(1.6)}/></g>`;
const apron=`<path d="M-22-46h44l7 48q-29 9-58 0Z" fill="rgb(255,250,240)" ${O(2)}/><path d="M-27-4q27 8 54 0" stroke="rgb(255,120,160)" stroke-width="4" fill="none"/><path d="M-6-24q-6-8 0-10 3-2 6 2 3-4 6-2 6 2 0 10l-6 5Z" fill="rgb(255,120,160)"/>`;

window.drawToonCharacter=function(type,mood='idle'){
 let mom=false;if(type.endsWith('-mom')){mom=true;type=type.slice(0,-4)}
 const id='ch'+(++serial),p=P[type]||P.bear,m=moodOf(mood),defs=grads(id,p);
 if(type==='owl')return `${defs}<g class="rig rig-owl mood-${mood}">${owl(id,p,m)}</g>`;
 if(type==='turtle'){const f=`url(#${id}-fur)`;return `${defs}<g class="rig rig-turtle mood-${mood}"><g class="turtle-feet"><ellipse class="turtle-foot f1" cx="-26" cy="12" rx="14" ry="10" fill="${R(p.a)}" ${O(2)}/><ellipse class="turtle-foot f2" cx="18" cy="12" rx="14" ry="10" fill="${R(p.a)}" ${O(2)}/></g><path d="M-40-2q-14 4-18-4l14-6" fill="${R(p.a)}" ${O(2)}/><path d="M-46-6Q-46-52 0-54 46-52 46-6Q0 8-46-6Z" fill="${f}" ${O(2.6)}/><path d="M-30-12Q-26-40 0-42 26-40 30-12" fill="none" stroke="${R(p.s)}" stroke-width="3" opacity=".5"/><path d="m0-44-14 12 2 16 12 6 12-6 2-16Zm-14 12-20-2m22 18-16 10m26-38 0 0m14 12 20-2m-22 18 16 10" fill="${R(p.l)}" fill-opacity=".35" stroke="${R(p.s)}" stroke-width="2.2" stroke-linejoin="round"/><path d="M-46-6Q0 8 46-6" fill="none" stroke="${R(p.m)}" stroke-width="5"/><path d="M-30-38q10-10 24-12" stroke="rgb(255,255,255)" stroke-width="4" fill="none" opacity=".35" stroke-linecap="round"/><g transform="translate(48 -14)"><g class="turtle-head"><ellipse cx="4" rx="22" ry="18" fill="${R(p.a)}" ${O()}/>${m.sleep?`<path d="M4-6q6 5 12 0" ${O(2.4)} fill="none"/>`:`<g class="rig-blink"><ellipse cx="9" cy="-6" rx="6.5" ry="7.5" fill="rgb(255,255,255)" ${O(1.8)}/><circle cx="11" cy="-5" r="4" fill="url(#${id}-iris)"/><circle cx="11" cy="-5" r="2" fill="rgb(16,12,12)"/><circle cx="12.5" cy="-7" r="1.4" fill="rgb(255,255,255)"/></g>`}<path d="M8 6q8 ${m.happy?8:5} 16 0" fill="${m.happy?'rgb(150,50,58)':'none'}" ${O(2)}/><ellipse cx="18" cy="2" rx="5" ry="3" fill="rgb(255,120,130)" opacity=".35"/></g></g></g>`}
 if(type==='ant'){const f=`url(#${id}-fur)`;return `${defs}<g class="rig rig-ant"><path class="ant-leg l1" d="M-26-10-40 16m20-24-10 26M2-10l6 28m8-32 16 26" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="-30" cy="-18" rx="19" ry="15" fill="${f}" ${O()}/><ellipse cx="-5" cy="-22" rx="13" ry="11" fill="${f}" ${O()}/><path d="M-38-26q6-6 14-4" stroke="rgb(255,255,255)" stroke-width="3" fill="none" opacity=".4" stroke-linecap="round"/><g class="rig-head"><path class="antennae" d="M14-46 6-66m22 18 12-18" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/><circle cx="6" cy="-66" r="3.5" fill="${R(p.b)}"/><circle cx="40" cy="-66" r="3.5" fill="${R(p.b)}"/><circle cx="22" cy="-31" r="20" fill="url(#${id}-head)" ${O()}/><g transform="translate(22 50) scale(.62)">${eye(-1,id,m)}${eye(1,id,m)}${mouth(m,-52)}</g></g></g>`}
 if(['bird','crow','duck','chick','rooster','hen','sparrow'].includes(type)){let b=bird(type,id,p,m);if(mom)b=b.replace(/<\/g>$/,bow(4,-82)+'</g>');return `${defs}<g class="rig rig-bird rig-${type} mood-${mood}">${b}</g>`}
 if(type.startsWith('human'))return `${defs}<g class="rig rig-human mood-${mood}">${human(type,id,p,m)}</g>`;
 const pawColor=type==='fox'?R(p.n):type==='mouse'?R(p.a):type==='pig'?R(p.s):`url(#${id}-fur)`;
 const footColor=type==='fox'?R(p.n):type==='pig'?'rgb(170,90,100)':type==='mouse'?R(p.a):type==='rabbit'?R(p.l):R(p.s);
 const belly=`<ellipse cy="-14" rx="20" ry="26" fill="${R(p.m)}" opacity=".9"/>`;
 const bodyShape=`<ellipse cy="-20" rx="${type==='pig'||type==='bear'?36:33}" ry="41" fill="url(#${id}-fur)" ${O()}/>`;
 const neck=mom?apron:['rabbit','bear','pig','mouse','cat','squirrel'].includes(type)?scarf(p.sc):'';
 const face=`<path d="${headShape(type)}" fill="url(#${id}-head)" ${O()}/>${type==='rabbit'?`<path d="M-36-70q-6 8 2 14m70-14q6 8-2 14" fill="none" ${O(1.6,.5)}/>`:''}${type==='fox'?`<path d="M-16-108q16-8 32 0" stroke="${R(p.l)}" stroke-width="5" fill="none" opacity=".6" stroke-linecap="round"/>`:''}`;
 const lightRim=`<path d="M-24-104q14-10 30-8" stroke="rgb(255,255,255)" stroke-width="4" fill="none" opacity=".45" stroke-linecap="round"/>`;
 const yEyes=type==='pig'?-84:-80;
 return `${defs}<g class="rig rig-${type} mood-${mood}">${type==='lion'?mane(p):''}${back(type,id,p)}${limb(-1,id,p,{leg:true,foot:footColor})}${limb(1,id,p,{leg:true,foot:footColor})}${limb(-1,id,p,{paw:pawColor})}${bodyShape}${belly}${tufts(p)}${neck}${limb(1,id,p,{paw:pawColor})}<g class="rig-head">${ears(type,id,p)}${face}${lightRim}${blush(type==='pig'?-66:-62)}${eye(-1,id,m,13,yEyes)}${eye(1,id,m,13,yEyes)}${brows(m,yEyes-16)}${muzzle(type,p,m)}${type==='cat'?`<path d="M-8-108l3 10M0-110v11M8-108l-3 10" stroke="${R(p.stripe)}" stroke-width="3.5" stroke-linecap="round"/>`:''}${mom?bow(type==='rabbit'?20:24,type==='rabbit'?-112:-108):''}</g></g>`;
};
})();
