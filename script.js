/* =====================================================================
   دعوة زفاف · محمد زياد
   فتح الظرف · Scroll Reveal · خلفيات متبدّلة · Countdown · التهاني
   ===================================================================== */

(function () {
  'use strict';

  /* البريد الذي تصل إليه التهاني */
  var MAIL = 'alnajah10@hotmail.com';

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
     الغبار الذهبي
  ------------------------------------------------------------------ */
  (function buildDust() {
    if (reduce || !dust) { return; }
    var count = window.innerWidth < 480 ? 22 : 34;
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
     الشرر والمفرقعات الذهبية + ميل الظرف
  ------------------------------------------------------------------ */
  var sparks   = document.getElementById('sparks');
  var envelope = document.getElementById('envelope');

  function burst(x, y, count, power, trail) {
    if (reduce || !sparks) { return; }
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var a = Math.random() * Math.PI * 2;
      var r = power * (0.35 + Math.random() * 0.65);
      var el = document.createElement('span');
      el.className = 'spark' + (trail ? ' trail' : '');
      el.style.left = x + 'px';
      el.style.top  = y + 'px';
      el.style.setProperty('--tx2', (Math.cos(a) * r).toFixed(1) + 'px');
      el.style.setProperty('--ty2', (Math.sin(a) * r - power * 0.25).toFixed(1) + 'px');
      el.style.setProperty('--s0', (0.6 + Math.random() * 0.9).toFixed(2));
      el.style.setProperty('--dur', (620 + Math.random() * 780).toFixed(0) + 'ms');
      frag.appendChild(el);
      (function (node) {
        setTimeout(function () { if (node.parentNode) { node.parentNode.removeChild(node); } }, 1500);
      })(el);
    }
    sparks.appendChild(frag);
  }

  if (intro) {
    intro.addEventListener('pointerdown', function (e) {
      if (started) { return; }
      var r = intro.getBoundingClientRect();
      burst(e.clientX - r.left, e.clientY - r.top, 9, 78, true);
    });
  }

  function envTilt(tx, ty) {
    if (reduce || !envelope || started) { return; }
    envelope.style.setProperty('--tx', tx.toFixed(2) + 'deg');
    envelope.style.setProperty('--ty', ty.toFixed(2) + 'deg');
  }
  window.addEventListener('mousemove', function (e) {
    envTilt(((e.clientX / window.innerWidth) - 0.5) * 14,
            ((e.clientY / window.innerHeight) - 0.5) * -10);
  });
  window.addEventListener('deviceorientation', function (e) {
    if (e.gamma === null) { return; }
    envTilt(Math.max(-1, Math.min(1, (e.gamma || 0) / 30)) * 12,
            Math.max(-1, Math.min(1, ((e.beta || 0) - 45) / 40)) * -8);
  });

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
     فتح الدعوة
  ------------------------------------------------------------------ */
  function openInvitation() {
    if (started) { return; }
    started = true;

    playMusic();
    musicBtn.hidden = false;

    intro.classList.add('opening');
    openBtn.disabled = true;

    if (!reduce && envelope && sparks) {
      var eb = envelope.getBoundingClientRect();
      var ir = intro.getBoundingClientRect();
      var cx = eb.left - ir.left + eb.width / 2;
      var cy = eb.top  - ir.top  + eb.height / 2;
      burst(cx, cy, 30, 210);
      setTimeout(function () { burst(cx, cy - 40, 24, 260, true); }, 420);
      setTimeout(function () { burst(cx, cy - 90, 20, 190); }, 900);
      setTimeout(function () {
        burst(ir.width * 0.5, ir.height * 0.42, 26, 300, true);
      }, 1900);
    }

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
  }

  openBtn.addEventListener('click', openInvitation);
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
