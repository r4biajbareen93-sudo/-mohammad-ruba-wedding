/* =====================================================================
   دعوة زفاف · محمد زياد
   فتح الظرف · Scroll Reveal · خلفيات متبدّلة · Countdown · التهاني
   ===================================================================== */

(function () {
  'use strict';

  /* البريد الذي تصل إليه التهاني */
  var MAIL = 'alnajah10@hotmail.com';
  var ENDPOINT = 'https://formsubmit.co/ajax/' + MAIL;

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

    var showAt = reduce ? 200 : 2200;
    var goneAt = reduce ? 320 : 3000;

    setTimeout(function () {
      page.classList.add('live');
      if (progress) { progress.classList.add('live'); }
      armReveals();
      setTheme(1);
    }, showAt);

    setTimeout(function () {
      intro.classList.add('gone');
      document.body.classList.remove('locked');
      window.scrollTo(0, 0);
      onScroll();
      if (scrollCue && !reduce) { scrollCue.classList.add('show'); }
    }, goneAt);

    setTimeout(function () {
      intro.style.display = 'none';
    }, goneAt + 1050);
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
     كلمة من القلب — الإرسال إلى البريد
  ------------------------------------------------------------------ */
  function showError(msg, withMail) {
    if (!wError) { return; }
    wError.innerHTML = '';
    wError.appendChild(document.createTextNode(msg));
    if (withMail) {
      var subject = encodeURIComponent('تهنئة جديدة لزفاف محمد زياد');
      var body = encodeURIComponent('الاسم: ' + wName.value + '\n\nالتهنئة: ' + wMsg.value);
      var a = document.createElement('a');
      a.href = 'mailto:' + MAIL + '?subject=' + subject + '&body=' + body;
      a.textContent = ' إرسالها عبر البريد';
      wError.appendChild(a);
    }
    wError.hidden = false;
  }

  if (wishForm) {
    wishForm.addEventListener('submit', function (e) {
      e.preventDefault();
      wError.hidden = true;
      wName.classList.remove('err');
      wMsg.classList.remove('err');

      var nameVal = wName.value.trim();
      var msgVal  = wMsg.value.trim();

      if (nameVal.length < 2) {
        wName.classList.add('err');
        wName.focus();
        showError('اكتبوا الاسم من فضلكم.', false);
        return;
      }
      if (msgVal.length < 2) {
        wMsg.classList.add('err');
        wMsg.focus();
        showError('اكتبوا كلمتكم من فضلكم.', false);
        return;
      }

      sendBtn.disabled = true;
      sendTxt.textContent = 'جارٍ الإرسال…';

      fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          '_subject': 'تهنئة جديدة لزفاف محمد زياد',
          '_template': 'table',
          '_captcha': 'false',
          'المصدر': 'دعوة زفاف محمد زياد',
          'الاسم': nameVal,
          'التهنئة': msgVal
        })
      })
      .then(function (res) { return res.json().catch(function () { return {}; }); })
      .then(function (data) {
        var ok = data && (data.success === 'true' || data.success === true);
        if (ok) {
          wishForm.hidden = true;
          wishDone.hidden = false;
        } else {
          sendBtn.disabled = false;
          sendTxt.textContent = 'إرسال التهنئة';
          showError('لم يصل الإرسال هذه المرة. جرّبوا مرة أخرى أو', true);
        }
      })
      .catch(function () {
        sendBtn.disabled = false;
        sendTxt.textContent = 'إرسال التهنئة';
        showError('تعذّر الاتصال بالشبكة. جرّبوا مرة أخرى أو', true);
      });
    });
  }
})();
