(function () {
  'use strict';

  /* ---- Inject CSS ---- */
  const style = document.createElement('style');
  style.textContent = `
    #a11y-btn {
      position: fixed;
      bottom: 1.5rem;
      left: 1.5rem;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4a7c59, #6a9e78);
      border: 2px solid rgba(143,188,143,0.6);
      color: #fff;
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 9000;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #a11y-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(74,124,89,0.5);
    }
    #a11y-panel {
      position: fixed;
      bottom: 5rem;
      left: 1.5rem;
      width: 240px;
      background: rgba(40, 70, 50, 0.96);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(143,188,143,0.4);
      border-radius: 16px;
      padding: 1rem 1.2rem 1.2rem;
      z-index: 9001;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      display: none;
      direction: rtl;
      font-family: 'Heebo', sans-serif;
    }
    #a11y-panel.open { display: block; }
    #a11y-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      border-bottom: 1px solid rgba(143,188,143,0.25);
      padding-bottom: 0.6rem;
    }
    #a11y-panel-header h3 {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: #f5f8f5;
    }
    #a11y-close {
      background: none;
      border: none;
      color: #c8dfc8;
      font-size: 1.1rem;
      cursor: pointer;
      line-height: 1;
      padding: 0;
    }
    .a11y-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.55rem 0;
      border-bottom: 1px solid rgba(143,188,143,0.12);
    }
    .a11y-row:last-of-type { border-bottom: none; }
    .a11y-label {
      font-size: 0.85rem;
      color: #c8dfc8;
    }
    .a11y-toggle {
      width: 36px;
      height: 20px;
      border-radius: 10px;
      border: 1px solid rgba(143,188,143,0.5);
      background: rgba(255,255,255,0.08);
      cursor: pointer;
      position: relative;
      transition: background 0.25s;
      flex-shrink: 0;
    }
    .a11y-toggle::after {
      content: '';
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #c8dfc8;
      top: 2px;
      right: 2px;
      transition: transform 0.25s;
    }
    .a11y-toggle.on {
      background: #6a9e78;
      border-color: #8fbc8f;
    }
    .a11y-toggle.on::after {
      transform: translateX(-16px);
    }
    .a11y-font-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.55rem 0;
      border-bottom: 1px solid rgba(143,188,143,0.12);
    }
    .a11y-font-btns {
      display: flex;
      gap: 0.4rem;
    }
    .a11y-font-btn {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(143,188,143,0.4);
      color: #c8dfc8;
      border-radius: 6px;
      padding: 0.15rem 0.5rem;
      cursor: pointer;
      font-size: 0.85rem;
      transition: background 0.2s;
    }
    .a11y-font-btn:hover { background: rgba(143,188,143,0.2); }
    #a11y-reset {
      width: 100%;
      margin-top: 0.8rem;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(143,188,143,0.3);
      color: #c8dfc8;
      border-radius: 8px;
      padding: 0.4rem;
      cursor: pointer;
      font-size: 0.82rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      transition: background 0.2s;
    }
    #a11y-reset:hover { background: rgba(143,188,143,0.15); }

    /* ---- Applied accessibility styles ---- */
    body.a11y-high-contrast {
      filter: contrast(1.5) brightness(1.1);
    }
    body.a11y-underline-links a {
      text-decoration: underline !important;
    }
  `;
  document.head.appendChild(style);

  /* ---- Build widget HTML ---- */
  const btn = document.createElement('button');
  btn.id = 'a11y-btn';
  btn.setAttribute('aria-label', 'פתח תפריט נגישות');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '♿';

  const panel = document.createElement('div');
  panel.id = 'a11y-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'תפריט נגישות');
  panel.innerHTML = `
    <div id="a11y-panel-header">
      <h3>נגישות</h3>
      <button id="a11y-close" aria-label="סגור תפריט נגישות">✕</button>
    </div>
    <div class="a11y-row">
      <span class="a11y-label">ניגודיות גבוהה</span>
      <button class="a11y-toggle" id="toggle-contrast" aria-pressed="false" aria-label="ניגודיות גבוהה"></button>
    </div>
    <div class="a11y-font-row">
      <span class="a11y-label">גודל גופן</span>
      <div class="a11y-font-btns">
        <button class="a11y-font-btn" id="font-up" aria-label="הגדל גופן">A+</button>
        <button class="a11y-font-btn" id="font-normal" aria-label="גופן רגיל">רגיל</button>
        <button class="a11y-font-btn" id="font-down" aria-label="הקטן גופן">A−</button>
      </div>
    </div>
    <div class="a11y-row">
      <span class="a11y-label">הדגשת קישורים</span>
      <button class="a11y-toggle" id="toggle-links" aria-pressed="false" aria-label="הדגשת קישורים"></button>
    </div>
    <button id="a11y-reset">↺ איפוס</button>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  /* ---- State ---- */
  const state = {
    contrast: false,
    fontSize: 0,
    links: false,
  };

  function applyState() {
    document.body.classList.toggle('a11y-high-contrast', state.contrast);
    document.body.classList.toggle('a11y-underline-links', state.links);
    document.documentElement.style.fontSize = state.fontSize
      ? (100 + state.fontSize * 10) + '%'
      : '';
    document.getElementById('toggle-contrast').classList.toggle('on', state.contrast);
    document.getElementById('toggle-contrast').setAttribute('aria-pressed', state.contrast);
    document.getElementById('toggle-links').classList.toggle('on', state.links);
    document.getElementById('toggle-links').setAttribute('aria-pressed', state.links);
    try { localStorage.setItem('a11y', JSON.stringify(state)); } catch(e) {}
  }

  /* ---- Load saved state ---- */
  try {
    const saved = JSON.parse(localStorage.getItem('a11y') || 'null');
    if (saved) Object.assign(state, saved);
  } catch(e) {}
  applyState();

  /* ---- Events ---- */
  btn.addEventListener('click', function () {
    const isOpen = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
  });

  document.getElementById('a11y-close').addEventListener('click', function () {
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  });

  document.getElementById('toggle-contrast').addEventListener('click', function () {
    state.contrast = !state.contrast;
    applyState();
  });

  document.getElementById('toggle-links').addEventListener('click', function () {
    state.links = !state.links;
    applyState();
  });

  document.getElementById('font-up').addEventListener('click', function () {
    if (state.fontSize < 2) { state.fontSize++; applyState(); }
  });

  document.getElementById('font-down').addEventListener('click', function () {
    if (state.fontSize > -1) { state.fontSize--; applyState(); }
  });

  document.getElementById('font-normal').addEventListener('click', function () {
    state.fontSize = 0; applyState();
  });

  document.getElementById('a11y-reset').addEventListener('click', function () {
    state.contrast = false;
    state.fontSize = 0;
    state.links = false;
    applyState();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });
})();
