/* =====================================================================
   دعوة زفاف · محمد زياد
   فتح الظرف · Scroll Reveal · خلفيات متبدّلة · Countdown · التهاني
   ===================================================================== */

(function () {
  'use strict';

  /* البريد الذي تصل إليه التهاني */
  var MAIL = 'r4biajbareen93@gmail.com';

  var intro     = document.getElementById('intro');
  var openBtn   = document.getElementById('openBtn');
  var page      = document.getElementById('page');
  var backdrop  = document.getElementById('backdrop');
  var dust      = document.getElementById('dust');
  var progress  = document.getElementById('progress');
  var progBar   = progress ? progress.firstElementChild : null;
  var bgm       = document.getElementById('bgm');
  var musicBtn  = document.getElementById('musicBtn');
  var groomImg  = document.getElementById('groomImg');
  var scrollCue = document.getElementById('scrollCue');

  var cdD = document.getElementById('cdD');
  var cdH = document.getElementById('cdH');
  var cdM = document.getElementById('cdM');
  var cdS = document.getElementById('cdS');
  var cdWrap = document.getElementById('countdown');
  var cdDone = document.getElementById('cdDone');

  var wishForm = document.getElementById('wishForm');
  var wishDone = document.getElementById('wishDone');
  var wName    = document.getElementById('wName');
  var wMsg     = document.getElementById('wMsg');
  var wError   = document.getElementById('wError');
  var sendBtn  = document.getElementById('sendBtn');
  var sendTxt  = document.getElementById('sendTxt');

  var themes  = Array.prototype.slice.call(document.querySelectorAll('.theme'));
  var secs    = Array.prototype.slice.call(document.querySelectorAll('.sec'));
  var revEls  = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  var parEls  = Array.prototype.slice.call(document.querySelectorAll('.par'));

  var reduce = window.matchMedia &&
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var started = false;

  /* ------------------------------------------------------------------
     أساسيات
  ------------------------------------------------------------------ */
  if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
  window.scrollTo(0, 0);

  /* ------------------------------------------------------------------
     وضع الأداء الخفيف للأجهزة الضعيفة
  ------------------------------------------------------------------ */
  var lite = (function () {
    try {
      var cores = navigator.hardwareConcurrency || 4;
      var mem   = navigator.deviceMemory || 4;
      var slow  = (navigator.connection && /2g/.test(navigator.connection.effectiveType || '')) || false;
      return cores <= 4 || mem <= 3 || slow;
    } catch (e) { return false; }
  })();
  if (lite) { document.documentElement.classList.add('lite'); }

  /* ------------------------------------------------------------------
     الغبار الذهبي
  ------------------------------------------------------------------ */
  (function buildDust() {
    if (reduce || !dust) { return; }
    var count = lite ? 10 : (window.innerWidth < 480 ? 20 : 30);
    var frag  = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var m = document.createElement('span');
      var size = (Math.random() * 3.4 + 1.2).toFixed(2);
      m.className = 'mote';
      m.style.width  = size + 'px';
      m.style.height = size + 'px';
      m.style.left   = (Math.random() * 100).toFixed(2) + '%';
      m.style.animationDuration = (Math.random() * 16 + 15).toFixed(1) + 's';
      m.style.animationDelay    = (-Math.random() * 26).toFixed(1) + 's';
      m.style.setProperty('--dx', (Math.random() * 90 - 45).toFixed(0) + 'px');
      m.style.opacity = (Math.random() * 0.5 + 0.4).toFixed(2);
      frag.appendChild(m);
    }
    dust.appendChild(frag);
  })();

  /* ------------------------------------------------------------------
     صورة العريس — بديل أنيق إن غابت
  ------------------------------------------------------------------ */
  if (groomImg) {
    groomImg.addEventListener('error', function () {
      var p = groomImg.closest('.portrait');
      if (p) { p.classList.add('no-img'); }
    });
  }

  /* ------------------------------------------------------------------
     الموسيقى
  ------------------------------------------------------------------ */
  var AUDIO_FILES = ['wedding.mp3', 'wedding_mp3.mp3'];
  var audioIdx = 0;

  if (bgm) {
    bgm.addEventListener('error', function () {
      audioIdx++;
      if (audioIdx < AUDIO_FILES.length) {
        bgm.src = AUDIO_FILES[audioIdx];
        bgm.load();
        if (started) { playMusic(); }
      } else if (musicBtn) {
        musicBtn.classList.add('muted');
      }
    });
  }

  function playMusic() {
    if (!bgm) { return; }
    try { bgm.volume = 0; } catch (e) {}
    var p = bgm.play();
    if (p && typeof p.then === 'function') {
      p.then(fadeIn).catch(function () { musicBtn.classList.add('muted'); });
    } else {
      fadeIn();
    }
  }

  function fadeIn() {
    musicBtn.classList.remove('muted');
    var v = 0;
    var t = setInterval(function () {
      v += 0.04;
      if (v >= 0.85) { v = 0.85; clearInterval(t); }
      try { bgm.volume = v; } catch (err) { clearInterval(t); }
    }, 90);
  }

  musicBtn.addEventListener('click', function () {
    if (bgm.paused) {
      playMusic();
    } else {
      bgm.pause();
      musicBtn.classList.add('muted');
    }
  });

  document.addEventListener('visibilitychange', function () {
    if (!bgm) { return; }
    if (document.hidden) {
      if (!bgm.paused) { bgm.pause(); bgm.dataset.auto = '1'; }
    } else if (bgm.dataset.auto === '1' && started) {
      bgm.dataset.auto = '';
      bgm.play().catch(function () { musicBtn.classList.add('muted'); });
    }
  });

  /* ------------------------------------------------------------------
     كشف العناصر أثناء النزول
  ------------------------------------------------------------------ */
  var revealIO = null;
  if ('IntersectionObserver' in window && !reduce) {
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          revealIO.unobserve(en.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  }

  function armReveals() {
    var fg = document.querySelector('.sec-hero .frame-gold');
    if (fg) { setTimeout(function () { fg.classList.add('open'); }, 60); }

    if (!revealIO) {
      revEls.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    revEls.forEach(function (el) { revealIO.observe(el); });
  }

  /* ------------------------------------------------------------------
     تبديل الخلفيات حسب القسم الظاهر
  ------------------------------------------------------------------ */
  function setTheme(n) {
    themes.forEach(function (t) {
      t.classList.toggle('on', t.classList.contains('th-' + n));
    });
  }

  if ('IntersectionObserver' in window) {
    var themeIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { setTheme(en.target.getAttribute('data-theme') || '1'); }
      });
    }, { threshold: 0, rootMargin: '-48% 0px -48% 0px' });
    secs.forEach(function (s) { themeIO.observe(s); });
  }

  /* ------------------------------------------------------------------
     Parallax + شريط التقدّم
  ------------------------------------------------------------------ */
  var ticking = false;

  function onScrollFrame() {
    ticking = false;

    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var p   = Math.min(1, Math.max(0, window.pageYOffset / max));

    if (progBar) { progBar.style.transform = 'scaleX(' + p.toFixed(4) + ')'; }

    if (!reduce) {
      for (var i = 0; i < parEls.length; i++) {
        var el = parEls[i];
        var f  = parseFloat(el.getAttribute('data-par')) || 0;
        el.style.translate = '0 ' + ((p - 0.5) * f * 6).toFixed(1) + 'px';
      }
    }

    if (scrollCue && window.pageYOffset > 60) { scrollCue.classList.remove('show'); }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScrollFrame);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ------------------------------------------------------------------
     شبكة أمان: الدعوة تظهر مهما حدث خلل في الجهاز أو المتصفح
  ------------------------------------------------------------------ */
  var revealed = false;
  function forceReveal() {
    if (revealed) { return; }
    revealed = true;
    try {
      page.classList.add('live');
      if (progress) { progress.classList.add('live'); }
      armReveals();
      setTheme(1);
      document.body.classList.remove('locked');
      if (intro) { intro.classList.add('gone'); intro.style.display = 'none'; }
      window.scrollTo(0, 0);
    } catch (e) {}
  }
  window.addEventListener('error', function () {
    if (started) { forceReveal(); }
  });

  /* ------------------------------------------------------------------
     فتح الدعوة
  ------------------------------------------------------------------ */
  function openInvitation() {
    if (started) { return; }
    started = true;

    playMusic();
    musicBtn.hidden = false;

    intro.classList.add('opening');
    openBtn.disabled = true;

    var letter = document.getElementById('letter');

    var tRise = reduce ? 60   : 1900;   /* البطاقة تخرج وتظهر أمام الضيف */
    var tOpen = reduce ? 120  : 2950;   /* تُفتح البطاقة كما تُفتح باليد */
    var tZoom = reduce ? 200  : 4550;   /* تكبر البطاقة وتتحول إلى الدعوة */
    var tPage = reduce ? 220  : 4750;
    var tGone = reduce ? 320  : 5250;

    setTimeout(function () { if (letter) { letter.classList.add('show'); } }, tRise);
    setTimeout(function () { if (letter) { letter.classList.add('open'); } }, tOpen);
    setTimeout(function () { if (letter) { letter.classList.remove('show'); letter.classList.add('zoom'); } }, tZoom);

    setTimeout(function () {
      revealed = true;
      page.classList.add('live');
      if (progress) { progress.classList.add('live'); }
      armReveals();
      setTheme(1);
    }, tPage);

    setTimeout(function () {
      intro.classList.add('gone');
      document.body.classList.remove('locked');
      window.scrollTo(0, 0);
      onScroll();
      if (scrollCue && !reduce) { scrollCue.classList.add('show'); }
    }, tGone);

    setTimeout(function () {
      intro.style.display = 'none';
    }, tGone + 1100);

    /* إن تعثّر أي شيء، تُعرض الدعوة على أي حال */
    setTimeout(forceReveal, tGone + 3500);
  }

  openBtn.addEventListener('click', openInvitation);
  if (intro) { intro.addEventListener('click', openInvitation); }
  openBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { openInvitation(); }
  });

  /* ------------------------------------------------------------------
     العد التنازلي — 27 أغسطس 2026 · 19:00 بتوقيت إسرائيل (UTC+3)
  ------------------------------------------------------------------ */
  var TARGET = new Date('2026-08-27T19:00:00+03:00').getTime();
  var last = { d: null, h: null, m: null, s: null };

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function paint(el, val, key) {
    if (!el) { return; }
    var txt = pad(val);
    if (last[key] === txt) { return; }
    last[key] = txt;
    el.textContent = txt;
    if (!reduce) {
      el.classList.remove('tick');
      void el.offsetWidth;
      el.classList.add('tick');
    }
  }

  function tick() {
    var diff = TARGET - Date.now();
    if (diff <= 0) {
      if (cdWrap) { cdWrap.hidden = true; }
      if (cdDone) { cdDone.hidden = false; }
      return;
    }
    var s = Math.floor(diff / 1000);
    paint(cdD, Math.floor(s / 86400), 'd');
    paint(cdH, Math.floor((s % 86400) / 3600), 'h');
    paint(cdM, Math.floor((s % 3600) / 60), 'm');
    paint(cdS, s % 60, 's');
  }
  tick();
  setInterval(tick, 1000);

  /* ------------------------------------------------------------------
     كلمة من القلب — الإرسال إلى البريد عبر iframe مخفي (بلا CORS)
  ------------------------------------------------------------------ */
  var fsFrame = document.getElementById('fsFrame');
  var fsUrl   = document.getElementById('fsUrl');
  var sending = false;
  var doneTimer = null;

  if (fsUrl) { fsUrl.value = location.href; }

  function wishSuccess() {
    if (!sending) { return; }
    sending = false;
    if (doneTimer) { clearTimeout(doneTimer); doneTimer = null; }
    wishForm.hidden = true;
    wishDone.hidden = false;
  }

  if (fsFrame) {
    fsFrame.addEventListener('load', function () { wishSuccess(); });
  }

  function showError(msg) {
    if (!wError) { return; }
    wError.innerHTML = '';
    wError.appendChild(document.createTextNode(msg));
    var subject = encodeURIComponent('تهنئة جديدة لزفاف محمد زياد');
    var body = encodeURIComponent('الاسم: ' + wName.value + '\n\nالتهنئة: ' + wMsg.value);
    var a = document.createElement('a');
    a.href = 'mailto:' + MAIL + '?subject=' + subject + '&body=' + body;
    a.textContent = ' إرسالها عبر البريد';
    wError.appendChild(a);
    wError.hidden = false;
  }

  if (wishForm) {
    wishForm.addEventListener('submit', function (e) {
      wError.hidden = true;
      wName.classList.remove('err');
      wMsg.classList.remove('err');

      var nameVal = wName.value.trim();
      var msgVal  = wMsg.value.trim();

      if (nameVal.length < 2) {
        e.preventDefault();
        wName.classList.add('err');
        wName.focus();
        showError('اكتبوا الاسم من فضلكم.');
        return;
      }
      if (msgVal.length < 2) {
        e.preventDefault();
        wMsg.classList.add('err');
        wMsg.focus();
        showError('اكتبوا كلمتكم من فضلكم.');
        return;
      }

      /* الإرسال يتم داخل iframe مخفي — الضيف يبقى في الصفحة */
      sending = true;
      sendBtn.disabled = true;
      sendTxt.textContent = 'جارٍ الإرسال…';

      doneTimer = setTimeout(wishSuccess, 6000);
    });
  }
})();

/* =====================================================================
   نسخة تجريبية — التنقل صفحة بعد صفحة
   ===================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('pages');

  var page = document.getElementById('page');
  var secs = Array.prototype.slice.call(document.querySelectorAll('.sec'));
  var current = 0, busy = false, ready = false;

  /* شريط التنقل */
  var nav = document.createElement('nav');
  nav.className = 'pnav';
  nav.innerHTML =
    '<button type="button" class="pprev" aria-label="السابق">' +
      '<svg viewBox="0 0 24 24"><path d="M17 14 12 9l-5 5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>' +
    '</button>' +
    '<span class="pdots"></span>' +
    '<button type="button" class="pnext" aria-label="التالي">' +
      '<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>' +
    '</button>';
  document.body.appendChild(nav);

  var hint = document.createElement('p');
  hint.className = 'phint';
  hint.textContent = 'اسحب للأعلى · أو المس الشاشة';
  document.body.appendChild(hint);

  var prevBtn = nav.querySelector('.pprev');
  var nextBtn = nav.querySelector('.pnext');
  var dotsWrap = nav.querySelector('.pdots');

  secs.forEach(function (s, i) {
    var d = document.createElement('span');
    d.className = 'pdot' + (i === 0 ? ' on' : '');
    dotsWrap.appendChild(d);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function reveal(sec) {
    var els = sec.querySelectorAll('.rv');
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove('in');
    }
    void sec.offsetWidth;
    for (var j = 0; j < els.length; j++) {
      els[j].classList.add('in');
    }
    var fg = sec.querySelector('.frame-gold');
    if (fg) { fg.classList.remove('open'); void fg.offsetWidth; fg.classList.add('open'); }
  }

  function show(i, instant) {
    if (busy || i < 0 || i >= secs.length) { return; }
    if (i === current && !instant) { return; }
    busy = true;

    var out = secs[current];
    if (out && out !== secs[i]) {
      out.classList.remove('is-active');
      out.classList.add('is-leaving');
      setTimeout(function () { out.classList.remove('is-leaving'); }, 600);
    }

    current = i;
    var sec = secs[i];
    sec.classList.add('is-active');
    sec.scrollTop = 0;
    reveal(sec);

    dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === secs.length - 1;
    if (i > 0) { hint.classList.add('hide'); }

    setTimeout(function () { busy = false; }, instant ? 60 : 620);
  }

  function next() { show(current + 1); }
  function prev() { show(current - 1); }

  nextBtn.addEventListener('click', function (e) { e.stopPropagation(); next(); });
  prevBtn.addEventListener('click', function (e) { e.stopPropagation(); prev(); });

  /* السحب واللمس */
  var y0 = 0, x0 = 0, t0 = 0, moved = false;
  page.addEventListener('touchstart', function (e) {
    if (!e.touches.length) { return; }
    y0 = e.touches[0].clientY; x0 = e.touches[0].clientX;
    t0 = Date.now(); moved = false;
  }, { passive: true });

  page.addEventListener('touchmove', function (e) {
    if (!e.touches.length) { return; }
    if (Math.abs(e.touches[0].clientY - y0) > 8 || Math.abs(e.touches[0].clientX - x0) > 8) { moved = true; }
  }, { passive: true });

  page.addEventListener('touchend', function (e) {
    if (!e.changedTouches.length) { return; }
    var dy = e.changedTouches[0].clientY - y0;
    var dx = e.changedTouches[0].clientX - x0;
    var sec = secs[current];
    var scrollable = sec.scrollHeight > sec.clientHeight + 4;

    if (Math.abs(dy) > 50 && Math.abs(dy) > Math.abs(dx)) {
      if (scrollable) {
        var atBottom = sec.scrollTop + sec.clientHeight >= sec.scrollHeight - 6;
        var atTop = sec.scrollTop <= 4;
        if (dy < 0 && !atBottom) { return; }
        if (dy > 0 && !atTop) { return; }
      }
      if (dy < 0) { next(); } else { prev(); }
      return;
    }
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) { next(); } else { prev(); }
      return;
    }
    if (!moved && Date.now() - t0 < 400) {
      var t = e.target;
      if (!t.closest('a, button, input, textarea, label, .pnav')) { next(); }
    }
  }, { passive: true });

  page.addEventListener('click', function (e) {
    if ('ontouchstart' in window) { return; }
    if (e.target.closest('a, button, input, textarea, label, .pnav')) { return; }
    next();
  });

  document.addEventListener('keydown', function (e) {
    if (!ready) { return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { next(); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { prev(); }
  });

  /* البدء بعد انتهاء فتح الظرف */
  var poll = setInterval(function () {
    if (page.classList.contains('live')) {
      clearInterval(poll);
      ready = true;
      document.body.classList.add('locked');
      nav.classList.add('on');
      show(0, true);
    }
  }, 200);
})();
