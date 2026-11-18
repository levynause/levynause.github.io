/* main.js: the desktop engine (windows, panel, launcher, boot, clock). Nothing to edit here; your content lives in content.js. */
'use strict';
/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const bare = u => String(u).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const link = (u, t) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t ?? bare(u))}</a>`;
const row = (k, v) => esc((k.toUpperCase() + ':').padEnd(12)) + v;
const cmd = c => `<div class="cmd"><span>${esc(`guest@${SITE.host}:~$ `)}</span>${esc(c)}</div>`;
const hidden = k => (SITE.hide || []).includes(k);
const phone = () => innerWidth <= 700;
/* Reduced-motion visitors get fades instead of flashing and zooming. Add ?fx to the address to force the full effects. */
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches && !/[?&]fx\b/.test(location.search);
document.documentElement.classList.toggle('calm', calm);

/* missing files: hide the broken image, flag gallery tiles, and name the file in the browser console (F12) */
addEventListener('error', e => { const t = e.target; if (t.tagName !== 'IMG') return; t.hidden = true; t.closest('.ph')?.classList.add('bad'); console.warn('[site] file not found:', t.getAttribute('src')); }, true);

/* ---------- content renderers ---------- */
const SKIP = ['file', 'video', 'embed', 'h', 'cover', 'images', 'episodes'], LINKS = ['link', 'repo', 'schematic', 'gerbers', 'bom'];
const meta = o => `<pre class="meta">${Object.entries(o).filter(([k]) => !SKIP.includes(k)).map(([k, v]) => row(k, LINKS.includes(k) ? link(v) : esc(v))).join('\n')}</pre>`;
const openUrl = u => u.replace('open.spotify.com/embed/', 'open.spotify.com/').replace(/youtube(-nocookie)?\.com\/embed\/([\w-]+).*/, 'youtube.com/watch?v=$2');
const media = i => i.embed ? `<iframe src="${esc(i.embed)}" style="height:${+i.h || 152}px" loading="lazy" allow="encrypted-media; fullscreen" title="${esc(i.title)}"></iframe><a class="alt" href="${esc(openUrl(i.embed))}" target="_blank" rel="noopener">player blank? open it in a new tab</a>`
  : i.video ? `<video controls preload="none" playsinline poster="${esc(i.cover || '')}" src="${esc(i.video)}"></video>` : i.file ? player(i) : '';
const cover = i => i.cover && !i.file && !i.video ? `<img class="cov" loading="lazy" src="${esc(i.cover)}" alt="Cover art for ${esc(i.title)}" onerror="this.hidden=true">` : '';
const item = (i, more = '') => `<article class="item">${cmd(`cat ${slug(i.title)}.txt`)}${cover(i)}${meta(i)}${i.file || i.video || i.embed ? cmd(`play ${i.file || i.video || 'stream'}`) + media(i) : ''}${more}</article>`;
const tracks = a => a.map(i => item(i)).join('');
const shows = a => a.map(s => item(s, (s.episodes || []).map(e => cmd(`play ${slug(e.title)}`) + media({ cover: s.cover, ...e })).join(''))).join('');
const thumbs = (i, pi) => (i.images || []).length ? cmd(`feh --thumbnails ${slug(i.title)}/`) + `<div class="thumbs">${i.images.map((s, n) => `<button class="ph" data-lb="pcb:${pi}" data-n="${n}" aria-label="View image ${n + 1} of ${esc(i.title)}"><img loading="lazy" decoding="async" src="${esc(s)}" alt="${esc(i.title)}"></button>`).join('')}</div>` : '';
const boards = a => a.map((i, pi) => `<article class="item">${cmd(`cat ${slug(i.title)}.txt`)}${meta(i)}${thumbs(i, pi)}</article>`).join('');
const gallery = () => cmd('feh --thumbnails photos/') + `<div class="grid">${(SITE.photos || []).map((p, n) => `<button class="ph" data-n="${n}" aria-label="Open photo ${n + 1}: ${esc(p.caption || 'Concert photo')}"><img loading="lazy" decoding="async" src="${esc(p.src)}" alt="${esc(p.caption || 'Concert photo')}"></button>`).join('')}</div>`;
const bio = () => { const b = SITE.bio || {}; return (ICON ? `<img class="hero${SITE.iconLogo ? ' sq' : ''}" src="${esc(ICON)}" alt="${esc(SITE.name)}" onerror="this.hidden=true">` : '') + cmd('whoami') + meta({ name: SITE.name, ...b.facts })
  + (b.photo ? `<img class="portrait" src="${esc(b.photo)}" alt="${esc(SITE.name)}" onerror="this.hidden=true">` : '')
  + cmd('cat about.txt') + (b.text || []).map(t => `<p>${esc(t)}</p>`).join(''); };
const contact = () => cmd('cat contact.txt') + `<pre class="meta">${[row('email', link('mailto:' + SITE.email, SITE.email)), ...(SITE.links || []).map(l => row(l.label, link(l.url)))].join('\n')}</pre>` + cmd(`mail ${SITE.email}`)
  + `<div class="mail"><label>NAME:<input name="name" autocomplete="name"></label><label>SUBJECT:<input name="subject"></label><label>MESSAGE:<textarea name="message" rows="5"></textarea></label><button class="btn" data-a="send">send</button> opens your email app</div>`;
const sendMail = w => { const v = n => w.querySelector(`[name=${n}]`).value.trim();
  location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(v('subject') || 'Hello from your website')}&body=${encodeURIComponent(v('message') + (v('name') ? '\n\n' + v('name') : ''))}`; };

/* ---------- apps (key order = icon order; def = opens at startup) ---------- */
const ICON = SITE.iconLogo || SITE.logo; // About icon: the square iconLogo if you set one, else the main logo
const cnt = k => (SITE[k] || []).length;
const APPS = {
  bio: { label: 'About', icon: ICON ? `<img src="${esc(ICON)}" alt="" onerror="this.hidden=true">` : '☺', glyph: '☺', cls: SITE.iconLogo ? 'sq' : SITE.logo ? 'dk' : '', title: 'about', w: 560, h: 460, def: 1, html: bio, stat: () => SITE.name },
  music: { label: 'Music', icon: '♫', title: 'music: mixes & masters', w: 560, h: 620, def: 1, html: () => tracks(SITE.music || []), stat: () => `${cnt('music')} items` },
  photo: { label: 'Gallery', icon: '▣', title: 'gallery', w: 620, h: 480, def: 1, html: gallery, stat: () => `${cnt('photos')} photos` },
  pcb: { label: 'PCB Design', icon: 'Ω', title: 'pcb-circuit-design', w: 600, h: 520, def: 1, html: () => boards(SITE.pcb || []), stat: () => `${cnt('pcb')} projects` },
  contact: { label: 'Contact', icon: '@', title: 'contact', w: 480, h: 460, def: 1, html: contact, stat: () => SITE.email },
  sound: { label: 'Sound Design', icon: '∿', title: 'sound-design', w: 560, h: 620, html: () => tracks(SITE.sound || []), stat: () => `${cnt('sound')} items` },
  pods: { label: 'Podcasts', icon: '◉', title: 'podcasts', w: 560, h: 600, html: () => shows(SITE.podcasts || []), stat: () => `${cnt('podcasts')} shows` }
};
const KEYS = Object.keys(APPS).filter(k => !hidden(k)), DEF = KEYS.filter(k => APPS[k].def);

/* ---------- layout: About across the top (logo in the corner beside it), the rest in a row below or 2x2; last window stops short of the xclock ---------- */
const desk = $('#desktop'), wins = {}, tasks = {};
let z = 10, cascade = 0, cur = null, aboutT = 0;
const rect = (w, p) => Object.assign(w.style, { left: p[0] + 'px', top: p[1] + 'px', width: p[2] + 'px', height: p[3] + 'px' });
function grid() {
  const ic = [...$('#icons').children], g = 8, x = (ic.length ? Math.max(...ic.map(b => b.getBoundingClientRect().right)) : 0) - desk.getBoundingClientRect().left + g;
  const W = desk.clientWidth - x - g, H = desk.clientHeight - 2 * g, T = Math.min(Math.round(H * .62), aboutT || Math.round(H * .45)), LW = SITE.logoPos === 'center' ? 0 : Math.min(400, Math.round(W * .28));
  desk.style.setProperty('--lw', LW + 'px'); desk.style.setProperty('--lh', T + 'px');
  if (SITE.logo) { desk.style.setProperty('--logo', `url("${SITE.logo}")`); desk.classList.add('lg'); desk.classList.toggle('c', SITE.logoPos === 'center'); }
  return { x, W, H, g, T, LW };
}
function place(k) {
  if (phone() || !DEF.includes(k)) return null;
  const { x, W, H, g, T, LW } = grid(), rest = DEF.filter(j => j !== 'bio'), top = DEF.includes('bio') ? T + g : 0;
  if (k === 'bio') return [x, g, W - (LW ? LW + g : 0), T];
  const i = rest.indexOf(k), c = Math.min(W >= 1100 ? 4 : 2, rest.length), r = Math.ceil(rest.length / c);
  const cw = (W - g * (c - 1)) / c, ch = (H - top - g * (r - 1)) / r, clock = i === rest.length - 1 && i % c === c - 1;
  return [x + (i % c) * (cw + g), g + top + Math.floor(i / c) * (ch + g), cw, clock && ch >= 300 ? ch - 100 : ch];
}

/* About is the biggest window: it grows to fit all of its text (up to 62% of the height) and the other windows share the rest */
function relayout() { grid(); for (const k in wins) { const p = place(k); if (p && !wins[k].dataset.free && !wins[k].classList.contains('max')) rect(wins[k], p); } }
function fitAbout() {
  const w = wins.bio; if (!w || w.hidden || phone() || w.dataset.free || w.classList.contains('max')) return;
  const keep = w.style.height; w.style.height = 'auto'; aboutT = Math.max(220, w.offsetHeight + 4); w.style.height = keep; relayout();
}

/* ---------- window manager ---------- */
function front(k) { cur = k; wins[k].style.zIndex = ++z; for (const j in wins) { wins[j].classList.toggle('on', j === k); tasks[j].classList.toggle('on', j === k); tasks[j].setAttribute('aria-pressed', j === k); } }
function mini(k) { wins[k].hidden = true; wins[k].classList.remove('on'); tasks[k].classList.remove('on'); if (cur === k) cur = null; }
function shut(k) { wins[k].remove(); tasks[k].remove(); delete wins[k]; delete tasks[k]; if (cur === k) cur = null; $(`.ic[data-k="${k}"]`)?.focus(); }
function drag(e, w) {
  if (e.target.closest('button') || phone() || w.classList.contains('max')) return;
  const bar = e.currentTarget, dx = e.clientX - w.offsetLeft, dy = e.clientY - w.offsetTop;
  bar.setPointerCapture(e.pointerId); w.dataset.free = 1;
  bar.onpointermove = m => { w.style.left = Math.max(80 - w.offsetWidth, Math.min(desk.clientWidth - 80, m.clientX - dx)) + 'px'; w.style.top = Math.max(0, Math.min(desk.clientHeight - 30, m.clientY - dy)) + 'px'; };
  bar.onpointerup = () => { bar.onpointermove = null; };
}
/* old-X11 style: three wireframe outlines race from the icon to the window, then it appears */
function zoom(w, from, done) {
  if (calm || !from) { w.classList.add('fade'); return done(); }
  const to = w.getBoundingClientRect(), f = from.getBoundingClientRect(), box = r => ({ left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  w.style.visibility = 'hidden';
  Promise.all([0, 1, 2].map(i => { const e = document.createElement('div'); e.className = 'wf'; document.body.append(e);
    return e.animate([box(f), box(to)], { duration: 360, delay: i * 55, easing: 'steps(8)', fill: 'both' }).finished.then(() => e.remove()); }))
    .then(() => { w.style.visibility = ''; done(); });
}
function lightbox(i, grp = 'photos') {
  const P = grp.startsWith('pcb:') ? SITE.pcb[+grp.slice(4)] : null, L = P ? P.images.map(s => ({ src: s, caption: P.title.trim() })) : SITE.photos, box = document.createElement('div'), opener = document.activeElement;
  box.id = 'lb'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Photo viewer'); box.tabIndex = -1;
  const show = () => { box.innerHTML = `<img src="${esc(L[i].src)}" alt="${esc(L[i].caption || '')}"><div>${esc(L[i].caption || '')} (${i + 1}/${L.length})</div><button class="btn prev" data-d="-1" aria-label="Previous photo">‹</button><button class="btn next" data-d="1" aria-label="Next photo">›</button><button class="btn x" aria-label="Close viewer">×</button>`; };
  const go = d => { i = (i + d + L.length) % L.length; show(); };
  const close = () => { box.remove(); removeEventListener('keydown', key); opener?.focus?.(); };
  const key = e => { if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1); };
  box.onclick = e => { const b = e.target.closest('button'); b && +b.dataset.d ? go(+b.dataset.d) : close(); };
  addEventListener('keydown', key); show(); document.body.append(box); box.focus();
}
function openWin(k, focus) {
  if (wins[k]) { wins[k].hidden = false; return front(k); }
  const A = APPS[k], vw = desk.clientWidth, vh = desk.clientHeight, p = place(k), w = document.createElement('section');
  const W = p ? p[2] : Math.min(A.w, vw - 16), H = p ? p[3] : Math.min(A.h, vh - 16);
  w.className = 'win'; w.tabIndex = -1; w.setAttribute('role', 'group'); w.setAttribute('aria-label', A.title);
  rect(w, p || [Math.min(70 + cascade * 30, vw - W), Math.min(24 + cascade * 30, vh - H), W, H]); if (!p) cascade = (cascade + 1) % 6;
  let body; try { body = A.html(); } catch (err) { console.error(err); body = `<pre class="meta">error: could not load ${esc(k)} (see the browser console)</pre>`; }
  w.innerHTML = `<div class="bar">${ICON ? `<img class="wl" src="${esc(ICON)}" alt="" onerror="this.hidden=true">` : ''}<b>${esc(A.title)}</b><button class="btn" data-a="min" aria-label="Minimize">_</button><button class="btn" data-a="max" aria-label="Maximize">□</button><button class="btn" data-a="x" aria-label="Close">×</button></div><div class="body">${body}</div><div class="stat"><span>${esc(A.stat())}</span><span>~/${esc(slug(A.label))}</span></div>`;
  w.querySelectorAll('.pl').forEach(wirePlayer);
  w.addEventListener('pointerdown', () => front(k));
  const bar = $('.bar', w); bar.addEventListener('pointerdown', e => drag(e, w));
  bar.addEventListener('dblclick', e => { if (!e.target.closest('button')) w.classList.toggle('max'); });
  w.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const d = b.dataset;
    if (d.a === 'x') shut(k); else if (d.a === 'min') mini(k); else if (d.a === 'max') w.classList.toggle('max'); else if (d.a === 'send') sendMail(w); else if (d.n) lightbox(+d.n, d.lb); });
  const t = document.createElement('button'); t.className = 'btn task'; t.textContent = A.label;
  t.onclick = () => (wins[k].hidden || cur !== k) ? (wins[k].hidden = false, front(k)) : mini(k);
  wins[k] = w; tasks[k] = t; desk.append(w); $('#tasks').append(t); front(k);
  if (k === 'bio') { w.addEventListener('load', fitAbout, true); fitAbout(); }
  zoom(w, $(`.ic[data-k="${k}"]`), () => { if (focus) w.focus({ preventScroll: true }); });
}

/* ---------- icons, launcher menu, clock ---------- */
$('#icons').innerHTML = KEYS.map(k => `<button class="ic" data-k="${k}"><i${APPS[k].cls ? ` class="${APPS[k].cls}"` : ''}>${APPS[k].icon}</i><span>${esc(APPS[k].label)}</span></button>`).join('');
$('#icons').addEventListener('click', e => { const b = e.target.closest('.ic'); if (b) openWin(b.dataset.k, true); });
const menu = $('#menu'), launch = $('#launch');
launch.innerHTML = KEYS.map(k => `<button role="menuitem" data-k="${k}"><i>${APPS[k].glyph || APPS[k].icon}</i>${esc(APPS[k].label)}</button>`).join('')
  + '<hr><button role="menuitem" data-a="desk"><i>▭</i>Show desktop</button><button role="menuitem" data-a="close"><i>×</i>Close all windows</button>';
const setMenu = o => { launch.hidden = !o; menu.setAttribute('aria-expanded', o); menu.classList.toggle('on', o); if (o) $('button', launch).focus(); };
menu.onclick = e => { e.stopPropagation(); setMenu(launch.hidden); };
launch.onclick = e => { const b = e.target.closest('button'); if (!b) return; setMenu(false);
  if (b.dataset.k) openWin(b.dataset.k, true); else if (b.dataset.a === 'desk') Object.keys(wins).forEach(mini); else Object.keys(wins).forEach(shut); };
addEventListener('click', () => setMenu(false));
addEventListener('keydown', e => { if (e.key === 'Escape' && !launch.hidden) { setMenu(false); menu.focus(); } });
if (SITE.wallpaper) { desk.style.setProperty('--wall', `url("${SITE.wallpaper}")`); desk.classList.add('wp'); }
grid();
let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { fitAbout(); relayout(); }, 120); });
document.fonts?.ready.then(fitAbout);
const tick = () => { const d = new Date(), c = $('#clock'); c.dateTime = d.toISOString(); c.textContent = d.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' }); };
tick(); setInterval(tick, 20000);
(() => { /* xclock, bottom-right like Slackware's default X session */
  const ticks = Array.from({ length: 60 }, (_, i) => `<line y1="${i % 5 ? -45 : -41}" y2="-48" stroke-width="${i % 5 ? 1 : 2.4}" transform="rotate(${i * 6})"/>`).join('');
  const x = document.createElement('div'); x.id = 'xclock'; x.setAttribute('role', 'img'); x.setAttribute('aria-label', 'Analog clock');
  x.innerHTML = `<svg viewBox="-50 -50 100 100"><g>${ticks}</g><polygon data-h="h" points="0,-27 3.4,0 0,5 -3.4,0"/><polygon data-h="m" points="0,-40 2.6,0 0,6 -2.6,0"/><line data-h="s" y1="8" y2="-43" stroke-width=".8"/><circle r="2"/></svg>`;
  desk.append(x);
  const turn = (id, d) => $(`[data-h=${id}]`, x).setAttribute('transform', `rotate(${d})`);
  const spin = () => { const d = new Date(), s = d.getSeconds(), m = d.getMinutes() + s / 60; turn('h', (d.getHours() % 12 + m / 60) * 30); turn('m', m * 6); turn('s', s * 6); };
  spin(); setInterval(spin, 1000);
})();

/* ---------- page metadata from content.js ---------- */
document.title = `${SITE.name} — ${SITE.tagline}`;
const ld = document.createElement('script'); ld.type = 'application/ld+json';
ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: SITE.name, jobTitle: SITE.tagline, sameAs: (SITE.links || []).map(l => l.url) });
document.head.append(ld);

/* ---------- boot: typed log, logo flash, then the default windows open one after another ---------- */
const lg = $('#bootlogo');
if (SITE.logo) { const im = new Image(); im.alt = SITE.name; im.src = SITE.logo; im.onerror = () => { lg.textContent = SITE.name; }; lg.append(im); } else lg.textContent = SITE.name;
let skip = false;
['pointerdown', 'keydown'].forEach(t => addEventListener(t, () => { skip = true; }, { once: true }));
const wait = ms => new Promise(r => { const t0 = Date.now(); (function f() { skip || Date.now() - t0 >= ms ? r() : setTimeout(f, 30); })(); });
(async () => {
  for (const l of SITE.boot || []) { if (skip) break; $('#bootlog').textContent += l + '\n'; await wait(calm ? 40 : 120); }
  if (!skip) { lg.className = 'show'; await wait(calm ? 1300 : 1800); }
  $('#boot').classList.add('off'); setTimeout(() => $('#boot').remove(), 600);
  (phone() ? DEF.slice(0, 1) : DEF).forEach((k, i) => setTimeout(() => openWin(k), 450 + i * 420));
})();
