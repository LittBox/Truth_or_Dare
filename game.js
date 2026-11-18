/* 使用原有 app.js 中的 punishments 题库；不改动题目内容。 */
(() => {
  'use strict';
  const questions = typeof punishments !== 'undefined' ? Object.entries(punishments).map(([id, raw]) => {
    const match = /^【(真心话|大冒险)】/.exec(raw);
    return match ? { id: Number(id), type: match[1] === '真心话' ? 'truth' : 'dare', text: raw.replace(/^【(?:真心话|大冒险)】/, '') } : null;
  }).filter(Boolean) : [];
  const pools = {
    truth: questions.filter(q => q.type === 'truth'),
    dare: questions.filter(q => q.type === 'dare')
  };
  const bags = { truth: [], dare: [] };
  let currentType = null;
  let busy = false;
  let flipTimer = null;
  const selection = document.querySelector('#selection');
  const drawView = document.querySelector('#drawView');
  const flipCard = document.querySelector('#flipCard');
  const typeNode = document.querySelector('#resultType');
  const questionNode = document.querySelector('#question');
  const indexNode = document.querySelector('#questionIndex');
  const again = document.querySelector('#againBtn');
  const back = document.querySelector('#backBtn');

  // Fisher–Yates shuffle: finish a complete round before repeating a question.
  function refill(type) {
    const items = [...pools[type]];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    bags[type] = items;
  }
  function pick(type) {
    if (!bags[type].length) refill(type);
    return bags[type].pop();
  }
  function draw(type) {
    if (busy || !pools[type].length) return;
    busy = true;
    currentType = type;
    clearTimeout(flipTimer);
    selection.hidden = true;
    drawView.hidden = false;
    flipCard.className = `flip-card ${type}-mode`;
    const item = pick(type);
    typeNode.textContent = type === 'truth' ? '♡ 真心话 / TRUTH' : '⚡ 大冒险 / DARE';
    questionNode.textContent = item.text;
    indexNode.textContent = `CARD NO. ${String(item.id).padStart(3, '0')}`;
    again.disabled = true;
    // Allow the face-down state to paint before flipping.
    flipTimer = setTimeout(() => {
      flipCard.classList.add('flipped');
      flipTimer = setTimeout(() => { busy = false; again.disabled = false; }, 800);
    }, 140);
  }
  document.querySelectorAll('[data-type]').forEach(button => {
    button.addEventListener('click', () => draw(button.dataset.type));
  });
  again.addEventListener('click', () => draw(currentType));
  back.addEventListener('click', () => {
    clearTimeout(flipTimer);
    busy = false;
    flipCard.className = 'flip-card';
    drawView.hidden = true;
    selection.hidden = false;
    again.disabled = false;
  });
})();
