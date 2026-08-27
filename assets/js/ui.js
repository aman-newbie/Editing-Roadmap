// UI helpers: theme toggle, language toggle, playlist/accordion ARIA, iframe titles, basic keyboard helpers
(function(){
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  // Theme toggle
  const themeToggle = qs('#themeToggle');
  function applyTheme(theme){
    if(theme === 'light') document.documentElement.setAttribute('data-theme','light');
    else document.documentElement.removeAttribute('data-theme');
    if(themeToggle){
      themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      const icon = qs('#themeIcon'); if(icon) icon.textContent = theme === 'light' ? '☀️' : '🌙';
    }
  }
  const storedTheme = localStorage.getItem('er:theme');
  applyTheme(storedTheme || 'dark');
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const now = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      localStorage.setItem('er:theme', now === 'light' ? 'light' : 'dark');
      applyTheme(now);
    });
  }

  // Language toggle (hi/en)
  const langToggle = qs('#langToggle');
  function applyLang(lang){
    if(lang === 'en') document.documentElement.setAttribute('data-lang','en');
    else document.documentElement.removeAttribute('data-lang');
    if(langToggle) langToggle.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
    if(langToggle) langToggle.textContent = lang === 'en' ? '🌐 English' : '🌐 Switch to English';
  }
  const storedLang = localStorage.getItem('er:lang') || 'en';
  applyLang(storedLang);
  if(langToggle){
    langToggle.addEventListener('click', ()=>{
      const now = document.documentElement.getAttribute('data-lang') === 'en' ? 'hi' : 'en';
      localStorage.setItem('er:lang', now);
      applyLang(now);
    });
  }

  // Playlist / accordion toggles: sync aria-expanded and aria-controls
  qsa('.playlist-toggle').forEach(btn=>{
    const target = btn.dataset.target;
    if(!target) return;
    btn.setAttribute('aria-controls', target);
    const panel = document.getElementById(target);
    const expanded = panel ? (!panel.hasAttribute('hidden')) : false;
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    btn.addEventListener('click', ()=>{
      if(!panel) return;
      const now = panel.hasAttribute('hidden');
      if(now) panel.removeAttribute('hidden'); else panel.setAttribute('hidden','');
      btn.setAttribute('aria-expanded', now ? 'true' : 'false');
    });
  });

  // Ensure iframes have accessible titles (YouTube fallback)
  qsa('iframe').forEach((fr, i)=>{
    if(!fr.getAttribute('title')){
      const src = fr.getAttribute('src') || '';
      if(src.includes('youtube') || src.includes('youtu.be')) fr.setAttribute('title','YouTube video player');
      else fr.setAttribute('title', 'Embedded content');
    }
  });

  // Add sr-only labels where missing: search input
  const search = qs('#pageSearch');
  if(search && !search.hasAttribute('aria-label')) search.setAttribute('aria-label','Search the roadmap');

  // Quick focus to search with '/'
  document.addEventListener('keydown', (e)=>{
    if(e.key === '/' && document.activeElement.tagName.toLowerCase() !== 'input' && document.activeElement.tagName.toLowerCase() !== 'textarea'){
      e.preventDefault(); const s = qs('#pageSearch'); if(s) s.focus();
    }
  });

  // Safety: make emoji icons have role=img if they look meaningful
  qsa('button, a, .lnum, .phase-num').forEach(el=>{
    // no-op here, mainly left for future adjustments
  });
})();
