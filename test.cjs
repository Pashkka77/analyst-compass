const assert=require('node:assert/strict');
const {roles,questions,calculate}=require('./quiz.js');
assert.equal(questions.length,12);
for(const role of roles)assert.equal(questions.filter(q=>q.role===role.id).length,3);
for(let v=0;v<=3;v++)for(const r of calculate(Array(12).fill(v))){assert.equal(r.score,v*3);assert.equal(r.count,3);}
for(const role of roles){const r=calculate(questions.map(q=>q.role===role.id?3:0));assert.equal(r[0].id,role.id);assert.equal(r[0].score,9);assert.equal(r[1].score,0);}
for(const r of calculate(Array(12).fill(4))){assert.equal(r.count,0);assert.equal(r.score,0);}
let partial=questions.map(q=>q.role==='business'?3:4);partial[0]=4;let r=calculate(partial)[0];assert.equal(r.count,2);assert.equal(r.score,9);
for(let i=0;i<1000;i++){const a=Array.from({length:12},()=>Math.floor(Math.random()*5));for(const r of calculate(a)){assert(r.score>=0&&r.score<=9);assert(r.count>=0&&r.count<=3);assert(Number.isFinite(r.score));}}
console.log('PASS: баланс вопросов, границы, четыре профиля, равенство, пропуски, нормализация, 1000 случайных наборов.');
const {baseState,clarificationState,outcome,evidence}=require('./quiz.js');
for(let a=0;a<roles.length;a++)for(let b=a+1;b<roles.length;b++){
 const ids=[roles[a].id,roles[b].id];const answers=questions.map(q=>ids.includes(q.role)?3:0);
 assert.equal(baseState(answers).candidates.length,2);
 assert(clarificationState(answers).needsMore);
 for(const id of ids){
  assert(clarificationState(answers,[id]).needsMore);
  assert(!clarificationState(answers,[id,id]).needsMore);
  assert.equal(outcome(answers,[id,id]).primary.id,id);
  const other=ids.find(x=>x!==id);
  assert(clarificationState(answers,[other,id]).needsMore);
  assert.equal(outcome(answers,[other,id,id]).primary.id,id);
  assert(!clarificationState(answers,[other,id,id]).needsMore);
  assert(evidence(id,answers,[id,id]).length>0);
 }
 assert.equal(outcome(answers,['equal','equal','equal']).primary,null);
 assert.equal(outcome(answers,[ids[0],ids[1],'equal']).profiles.length,2);
 assert.equal(outcome(answers,['none','none',ids[0]]).primary,null);
}
assert.equal(outcome(Array(12).fill(4)).primary,null);
assert.equal(outcome(Array(12).fill(0)).primary,null);
for(const role of roles){const a=questions.map(q=>q.role===role.id?3:0);assert(!clarificationState(a).needsMore);assert.equal(outcome(a).primary.id,role.id);}
const all=Array(12).fill(3);assert.equal(baseState(all).candidates.length,4);
assert.equal(outcome(all,['equal','equal','equal']).profiles.length,4);
assert.equal(outcome(all,['business','systems','product']).primary,null);
assert.equal(outcome(all,['business','systems','product']).profiles.length,3);
const choices=[...roles.map(r=>r.id),'equal','none'];let combinations=0;
for(const x of choices)for(const y of choices)for(const z of choices){const r=outcome(all,[x,y,z]);assert(!r.needsMore);if(r.primary){assert(r.votes[r.primary.id]>=2);assert(r.profiles.length===1);}else assert(r.profiles.length>=2);combinations++;}
console.log(`PASS: все 6 пар направлений, обе стороны победы, 14/15 вопросов, ничьи, 4 кандидата и ${combinations} комбинаций уточнений.`);
let near=questions.map(q=>q.role==='systems'?3:q.role==='product'?3:0);near[3]=2;assert.equal(baseState(near).candidates.length,2);assert.equal(outcome(near,['product','product']).primary.id,'product');
let sparse=Array(12).fill(3);sparse[0]=4;sparse[5]=4;assert(!baseState(sparse).enough);assert(!clarificationState(sparse).needsMore);
console.log('PASS: уточнения могут выбрать второе близкое направление; недостаточные данные не вызывают ложного победителя.');


