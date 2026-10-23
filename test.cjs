const assert=require('node:assert/strict');
const {roles,questions,calculate,baseState,clarificationState,outcome,evidence}=require('./quiz.js');
assert.equal(questions.length,12);let pairs={};
for(const q of questions){assert.equal(q.options.length,2);assert.notEqual(q.options[0].role,q.options[1].role);const key=q.options.map(o=>o.role).sort().join('/');pairs[key]=(pairs[key]||0)+1;}
assert.equal(Object.keys(pairs).length,6);for(const n of Object.values(pairs))assert.equal(n,2);
for(const r of roles){assert.equal(questions.filter(q=>q.options.some(o=>o.role===r.id)).length,6);assert.equal(questions.filter(q=>q.options[0].role===r.id).length,3);}
const prefer=ids=>questions.map(q=>{const options=q.options.filter(o=>ids.includes(o.role));return options.length===1?options[0].role:'equal';});
for(const role of roles){const a=prefer([role.id]);const s=outcome(a);assert.equal(s.primary.id,role.id);assert.equal(s.primary.score,6);assert(!s.needsMore);assert(evidence(role.id,a).length>0);}
for(let a=0;a<4;a++)for(let b=a+1;b<4;b++){
 const ids=[roles[a].id,roles[b].id],answers=prefer(ids);assert.equal(baseState(answers).candidates.length,2);
 for(const id of ids){const other=ids.find(x=>x!==id);assert(clarificationState(answers,[id]).needsMore);assert(!clarificationState(answers,[id,id]).needsMore);assert.equal(outcome(answers,[id,id]).primary.id,id);assert(clarificationState(answers,[other,id]).needsMore);assert.equal(outcome(answers,[other,id,id]).primary.id,id);}
 assert.equal(outcome(answers,['equal','equal','equal']).primary,null);assert.equal(outcome(answers,[ids[0],ids[1],'equal']).profiles.length,2);assert.equal(outcome(answers,['none','none',ids[0]]).primary,null);
}
const all=Array(12).fill('equal');for(const r of calculate(all)){assert.equal(r.score,3);assert.equal(r.count,6);}assert.equal(outcome(all,['equal','equal','equal']).profiles.length,4);
assert.equal(baseState(questions.map(q=>q.options[0].role)).candidates.length,4);
assert.equal(baseState(questions.map(q=>q.options[1].role)).candidates.length,4);
assert(!baseState(Array(12).fill('skip')).enough);assert.equal(outcome(Array(12).fill('skip')).primary,null);
assert(!baseState(Array(12).fill(null)).enough);assert(!baseState(Array(12).fill('invalid')).enough);
assert(!baseState(all.map((v,i)=>i<7?v:'skip')).enough);
const near=prefer(['systems','product']);const shared=questions.find(q=>q.options.some(o=>o.role==='systems')&&q.options.some(o=>o.role==='product'));near[shared.id]='systems';assert.equal(baseState(near).candidates.length,2);assert.equal(outcome(near,['product','product']).primary.id,'product');
for(let i=0;i<3000;i++){const answers=questions.map(q=>[q.options[0].role,q.options[1].role,'equal','skip'][Math.floor(Math.random()*4)]);const s=baseState(answers);for(const r of s.ranked){assert(r.score>=0&&r.score<=6);assert(r.count>=0&&r.count<=6);assert(Number.isFinite(r.score));}assert(s.ranked.reduce((sum,r)=>sum+r.points,0)<=12);if(s.enough){assert(s.answered>=8);assert(s.ranked.every(r=>r.count>=3));}}
const choices=[...roles.map(r=>r.id),'equal','none'];let combinations=0;for(const x of choices)for(const y of choices)for(const z of choices){const r=outcome(all,[x,y,z]);assert(!r.needsMore);if(r.primary)assert(r.votes[r.primary.id]>=2);else assert(r.profiles.length>=2);combinations++;}
console.log('PASS: 12 сравнений; все 6 пар встречаются дважды; каждая роль 6 раз, по 3 в позиции А и Б.');
console.log('PASS: четыре чистых профиля, все пары уточнений, 14/15 вопросов, пропуски, равный выбор, второе направление.');
console.log(`PASS: 3000 случайных наборов и ${combinations} комбинаций уточнений; нет ложного победителя при недостатке ответов.`);

