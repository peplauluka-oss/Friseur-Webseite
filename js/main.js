/* =====================================================================
   Friseursalon Wiesenthal — Interaktionen
   Prinzip: Animation ist Feedback und Orientierung, nie Show.
   Kurz (150–300 ms), ease-out, nur transform/opacity.
   ===================================================================== */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero-Load-Sequenz: Bild + gestaffelte Zeilen (CSS macht die Arbeit) */
  window.addEventListener('load', function () {
    document.body.classList.remove('is-loading');
  });
  // Fallback, falls das load-Event (z. B. durch hängende Ressourcen) ausbleibt
  setTimeout(function () {
    document.body.classList.remove('is-loading');
  }, 1200);

  /* ---------- Sticky-Header: schrumpft nach dem ersten Scroll.
     Kein window-scroll-Listener (jank-anfällig) — ein unsichtbarer
     Sentinel am Seitenanfang steuert den Zustand per IntersectionObserver. */
  var header = document.querySelector('.site-header');
  if (header && 'IntersectionObserver' in window) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:32px;pointer-events:none;';
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- Mobile Navigation */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navToggle.setAttribute('aria-label', open ? 'Menü öffnen' : 'Menü schließen');
      mainNav.classList.toggle('is-open', !open);
    });
    // Menü schließt nach Ankerklick
    mainNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Menü öffnen');
        mainNav.classList.remove('is-open');
      }
    });
  }

  /* ---------- Scroll-Reveals: einmalig, dezent (IntersectionObserver) */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Akkordeons (Leistungen + FAQ)
     Höhe animiert über grid-template-rows: 0fr → 1fr (CSS), hier nur State. */
  function initAccordion(triggerSelector) {
    document.querySelectorAll(triggerSelector).forEach(function (trigger) {
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!panel) return;
      trigger.addEventListener('click', function () {
        var open = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!open));
        panel.classList.toggle('is-open', !open);
      });
    });
  }
  initAccordion('.service-trigger');
  initAccordion('.faq-trigger');

  /* ---------- Team-Karussell (Mobile): Scroll-Snap + Dots */
  var track = document.getElementById('team-track');
  var dotsWrap = document.querySelector('.carousel-dots[data-for="team-track"]');
  if (track && dotsWrap) {
    var cards = track.querySelectorAll('.team-card');
    cards.forEach(function (card, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Zu Teammitglied ' + (i + 1) + ' scrollen');
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function () {
        card.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
      });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll('button');
    var updateDots = function () {
      var center = track.scrollLeft + track.clientWidth / 2;
      var nearest = 0;
      var minDist = Infinity;
      cards.forEach(function (card, i) {
        var cardCenter = card.offsetLeft + card.offsetWidth / 2;
        var dist = Math.abs(cardCenter - center);
        if (dist < minDist) { minDist = dist; nearest = i; }
      });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === nearest); });
    };
    track.addEventListener('scroll', updateDots, { passive: true });
  }

  /* ---------- Vorher/Nachher-Slider: folgt dem Finger 1:1, keine Trägheit */
  document.querySelectorAll('[data-ba]').forEach(function (slider) {
    var setSplit = function (percent) {
      percent = Math.max(0, Math.min(100, percent));
      slider.style.setProperty('--split', percent + '%');
      slider.setAttribute('aria-valuenow', String(Math.round(percent)));
    };

    var dragging = false;
    var fromEvent = function (e) {
      var rect = slider.getBoundingClientRect();
      return ((e.clientX - rect.left) / rect.width) * 100;
    };
    slider.addEventListener('pointerdown', function (e) {
      dragging = true;
      slider.setPointerCapture(e.pointerId);
      slider.classList.remove('pulse');
      setSplit(fromEvent(e));
    });
    slider.addEventListener('pointermove', function (e) {
      if (dragging) setSplit(fromEvent(e));
    });
    ['pointerup', 'pointercancel'].forEach(function (type) {
      slider.addEventListener(type, function () { dragging = false; });
    });

    // Tastatur: Pfeiltasten bewegen den Regler in 5-%-Schritten
    slider.addEventListener('keydown', function (e) {
      var current = parseFloat(slider.getAttribute('aria-valuenow')) || 50;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        setSplit(current - 5);
        e.preventDefault();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        setSplit(current + 5);
        e.preventDefault();
      } else if (e.key === 'Home') {
        setSplit(0); e.preventDefault();
      } else if (e.key === 'End') {
        setSplit(100); e.preventDefault();
      }
    });

    // Einmaliger, dezenter Puls beim ersten Viewport-Eintritt → signalisiert Interaktivität
    if (!reducedMotion && 'IntersectionObserver' in window) {
      var pulseObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            slider.classList.add('pulse');
            pulseObserver.unobserve(slider);
          }
        });
      }, { threshold: 0.5 });
      pulseObserver.observe(slider);
    }
  });

  /* ---------- Google Maps: Zwei-Klick-Consent (DSGVO) */
  var mapBtn = document.getElementById('map-load');
  var mapBox = document.getElementById('map-consent');
  if (mapBtn && mapBox) {
    mapBtn.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=Friseursalon+Wiesenthal+Dorfstra%C3%9Fe+6+13057+Berlin&output=embed';
      iframe.title = 'Google-Maps-Karte: Friseursalon Wiesenthal, Dorfstraße 6, 13057 Berlin';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      mapBox.innerHTML = '';
      mapBox.appendChild(iframe);
    });
  }

  /* ---------- Sticky Mobile CTA: erscheint, sobald die Galerie erreicht ist
     (~60 % Seitentiefe), bleibt dann sichtbar, ausblendbar per X.
     IntersectionObserver statt window-scroll-Listener. */
  var mobileCta = document.getElementById('mobile-cta');
  var ctaClose = document.getElementById('cta-close');
  if (mobileCta && ctaClose && 'IntersectionObserver' in window) {
    mobileCta.hidden = false; // per JS aktiviert — ohne JS bleibt die Leiste weg
    var ctaObserver = new IntersectionObserver(function (entries) {
      var hit = entries.some(function (entry) { return entry.isIntersecting; });
      if (hit) {
        mobileCta.classList.add('is-shown');
        ctaObserver.disconnect();
      }
    }, { threshold: 0.15 });
    // Galerie UND Kontakt beobachten: deckt auch Anker-Sprünge ab,
    // die die Galerie überspringen (z. B. Nav-Klick auf „Kontakt")
    ['galerie', 'kontakt'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) ctaObserver.observe(el);
    });
    ctaClose.addEventListener('click', function () {
      ctaObserver.disconnect();
      mobileCta.classList.remove('is-shown');
      mobileCta.hidden = true;
    });
  }

  /* ---------- Callback-Formular: Validierung + mailto-Fallback
     Später: Form-Endpoint (z. B. Formspree) — vorbereiteter fetch-Call unten. */
  var form = document.getElementById('callback-form');
  if (form) {
    var nameField = document.getElementById('cb-name');
    var telField = document.getElementById('cb-tel');
    var wishField = document.getElementById('cb-wish');
    var consentField = document.getElementById('cb-consent');
    var status = document.getElementById('form-status');

    var setError = function (input, hasError) {
      input.closest('.field').classList.toggle('has-error', hasError);
      input.setAttribute('aria-invalid', String(hasError));
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var validName = nameField.value.trim().length >= 2;
      // Telefonnummer: mind. 6 Ziffern, erlaubt +, Leerzeichen, /, -, ()
      var telDigits = telField.value.replace(/\D/g, '');
      var validTel = telDigits.length >= 6 && /^[+\d\s\/\-()]+$/.test(telField.value.trim());
      var validConsent = consentField.checked;

      setError(nameField, !validName);
      setError(telField, !validTel);
      consentField.closest('.consent').classList.toggle('has-error', !validConsent);

      if (!validName || !validTel || !validConsent) {
        status.textContent = 'Bitte prüfe die markierten Felder.';
        status.dataset.state = 'error';
        (!validName ? nameField : !validTel ? telField : consentField).focus();
        return;
      }

      /* --- Versand-Variante A (aktiv): mailto-Fallback.
         Öffnet das Mailprogramm der Nutzerin mit vorbefüllter Anfrage. --- */
      var body =
        'Rückruf-Anfrage über die Website\n\n' +
        'Name: ' + nameField.value.trim() + '\n' +
        'Telefon: ' + telField.value.trim() + '\n' +
        'Wunsch: ' + (wishField.value.trim() || 'keine Angabe') + '\n';
      window.location.href =
        'mailto:h.wiesenthal@web.de' +
        '?subject=' + encodeURIComponent('Rückruf-Anfrage von ' + nameField.value.trim()) +
        '&body=' + encodeURIComponent(body);

      status.textContent =
        'Dein E-Mail-Programm öffnet sich mit der fertigen Anfrage, einfach absenden. ' +
        'Oder ruf uns direkt an: (030) 932 88 93.';
      status.dataset.state = 'ok';

      /* --- Versand-Variante B (vorbereitet, auskommentiert):
         Form-Endpoint, z. B. Formspree. Einrichtung:
         1. Kostenloses Formular auf https://formspree.io anlegen (Ziel: h.wiesenthal@web.de)
         2. FORM_ENDPOINT unten ersetzen und diesen Block statt Variante A aktivieren.
         3. Datenschutzerklärung um den Anbieter ergänzen!

      fetch('https://formspree.io/f/FORM_ENDPOINT', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameField.value.trim(),
          telefon: telField.value.trim(),
          wunsch: wishField.value.trim()
        })
      }).then(function (res) {
        if (!res.ok) throw new Error('Senden fehlgeschlagen');
        form.reset();
        status.textContent = 'Danke! Wir rufen dich so bald wie möglich zurück.';
        status.dataset.state = 'ok';
      }).catch(function () {
        status.textContent =
          'Das hat leider nicht geklappt. Ruf uns gern direkt an: (030) 932 88 93.';
        status.dataset.state = 'error';
      });
      */
    });
  }
})();
