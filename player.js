/* Audio player: XMMS-style skin with a live spectrum analyzer and album art.
   Real analysis needs the site served over http(s) (GitHub Pages or a local server).
   Opened by double-click (file://) the bars animate with a simulated signal instead. */
let AC; // one shared AudioContext
const BARS = 28, EDGE = Array.from({ length: BARS + 1 }, (_, i) => 1 + Math.floor((i / BARS) ** 2 * 140));
const PLAY = '\u25B6\uFE0E', PAUSE = '\u275A\u275A';
const fmt = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '-:--';

const player = i => `<div class="pl"><div class="art">${i.cover ? `<img src="${esc(i.cover)}" alt="Cover art for ${esc(i.title)}">` : ''}</div>`
  + `<div class="lcd"><div class="ttl">${esc(i.title)}</div><div class="vis"><canvas width="168" height="48"></canvas><span class="time">0:00/-:--</span></div></div>`
  + `<div class="ctl"><button class="btn" data-c="play" aria-label="Play or pause">${PLAY}</button><button class="btn" data-c="stop" aria-label="Stop">\u25A0</button><input class="seek" type="range" min="0" max="1000" value="0" aria-label="Seek"><input class="vol" type="range" min="0" max="100" value="80" aria-label="Volume"></div>`
  + `<audio preload="none" src="${esc(i.file)}"></audio></div>`;

function wirePlayer(p) {
  const q = s => p.querySelector(s), a = q('audio'), g = q('canvas').getContext('2d');
  const seek = q('.seek'), time = q('.time'), pb = q('[data-c=play]'), art = q('.art img');
  const lv = Array(BARS).fill(0), pk = Array(BARS).fill(0);
  let an, buf, raf = 0, sk = false;
  a.volume = .8;

  const frame = t => {
    if (an) an.getByteFrequencyData(buf);
    let live = !a.paused;
    g.clearRect(0, 0, 168, 48);
    for (let i = 0; i < BARS; i++) {
      let v = 0;
      if (!a.paused) {
        if (an) {
          const lo = EDGE[i], hi = Math.max(lo + 1, EDGE[i + 1]); let s = 0;
          for (let j = lo; j < hi; j++) s += buf[j];
          v = Math.min(1, s / (hi - lo) / 255 * (1 + i / BARS));
        } else v = (Math.sin(t / 220 + i * .6) * .5 + .5) * (.35 + .65 * Math.random()) * (1 - i / (2 * BARS));
      }
      lv[i] = v > lv[i] ? v : lv[i] * .88;      // fast attack, slow fall
      pk[i] = Math.max(lv[i], pk[i] - .012);    // falling peak caps
      if (pk[i] > .01) live = true;
      const h = Math.round(lv[i] * 12), c = Math.round(pk[i] * 12);
      for (let r = 0; r < h; r++) { g.fillStyle = r < 7 ? '#3f6' : r < 10 ? '#fd3' : '#f44'; g.fillRect(i * 6, 45 - r * 4, 5, 3); }
      if (c > h) { g.fillStyle = '#ddd'; g.fillRect(i * 6, 45 - (c - 1) * 4, 5, 3); }
    }
    raf = live ? requestAnimationFrame(frame) : 0;
  };
  const label = () => { time.textContent = fmt(a.currentTime) + '/' + fmt(a.duration); };

  const setup = () => {
    if (!an && location.protocol.startsWith('http')) {
      try {
        AC = AC || new (window.AudioContext || window.webkitAudioContext)();
        an = AC.createAnalyser(); an.fftSize = 512; an.smoothingTimeConstant = .7;
        AC.createMediaElementSource(a).connect(an); an.connect(AC.destination);
        buf = new Uint8Array(an.frequencyBinCount);
      } catch (e) { an = null; }
    }
    if (AC && AC.state === 'suspended') AC.resume();
  };
  a.addEventListener('play', () => {
    setup(); pb.textContent = PAUSE;
    if (!raf) raf = requestAnimationFrame(frame);
  });
  ['pause', 'ended'].forEach(ev => a.addEventListener(ev, () => { pb.textContent = PLAY; }));
  a.addEventListener('timeupdate', () => { label(); if (!sk && a.duration) seek.value = a.currentTime / a.duration * 1000; });
  a.addEventListener('loadedmetadata', label);
  seek.oninput = () => { if (a.duration) a.currentTime = seek.value / 1000 * a.duration; };
  seek.onpointerdown = () => { sk = true; };
  seek.onpointerup = seek.onchange = () => { sk = false; };
  q('.vol').oninput = e => { a.volume = e.target.value / 100; };
  if (art) art.onerror = () => { art.hidden = true; };
  p.addEventListener('click', e => {
    const c = e.target.closest('[data-c]')?.dataset.c;
    if (c === 'play') a.paused ? (setup(), a.play().catch(() => {})) : a.pause();
    else if (c === 'stop') { a.pause(); a.currentTime = 0; }
  });
}

// only one thing plays at a time
document.addEventListener('play', e => document.querySelectorAll('audio,video').forEach(m => m !== e.target && m.pause()), true);
