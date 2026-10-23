const assert=require('node:assert/strict');
const {roles,questions,calculate}=require('./quiz.js');
assert.equal(questions.length,20);
for(const role of roles)assert.equal(questions.filter(q=>q.role===role.id).length,5);
for(let v=0;v<=3;v++)for(const r of calculate(Array(20).fill(v))){assert.equal(r.score,v*5);assert.equal(r.count,5);}
for(const role of roles){const r=calculate(questions.map(q=>q.role===role.id?3:0));assert.equal(r[0].id,role.id);assert.equal(r[0].score,15);assert.equal(r[1].score,0);}
for(const r of calculate(Array(20).fill(4))){assert.equal(r.count,0);assert.equal(r.score,0);}
let partial=questions.map(q=>q.role==='business'?3:4);partial[0]=4;let r=calculate(partial)[0];assert.equal(r.count,4);assert.equal(r.score,15);
for(let i=0;i<1000;i++){const a=Array.from({length:20},()=>Math.floor(Math.random()*5));for(const r of calculate(a)){assert(r.score>=0&&r.score<=15);assert(r.count>=0&&r.count<=5);assert(Number.isFinite(r.score));}}
console.log('PASS: баланс вопросов, границы, четыре профиля, равенство, пропуски, нормализация, 1000 случайных наборов.');
