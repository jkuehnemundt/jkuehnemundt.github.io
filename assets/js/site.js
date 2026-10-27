(function () {
  'use strict';

  var root = document.documentElement;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Day / night toggle ----------
  var toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'light' ? '#F7F1E8' : '#1D1916');
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // ---------- Typed headline (home) ----------
  var headline = document.querySelector('[data-typed-headline]');
  if (headline) {
    var target = headline.querySelector('[data-typed-target]');
    var sub = headline.querySelector('[data-typed-sub]');
    var text = target.textContent.trim();
    var cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');

    // Screen readers get the full heading straight away.
    headline.setAttribute('aria-label', text + ' ' + (sub ? sub.textContent.trim() : ''));

    if (reducedMotion) {
      target.appendChild(cursor);
    } else {
      var typed = document.createElement('span');
      typed.setAttribute('aria-hidden', 'true');
      target.textContent = '';
      target.appendChild(typed);
      target.appendChild(cursor);
      if (sub) sub.classList.add('is-hidden');

      var i = 0;
      var timer = setInterval(function () {
        i += 1;
        typed.textContent = text.slice(0, i);
        if (i >= text.length) {
          clearInterval(timer);
          setTimeout(function () { if (sub) sub.classList.remove('is-hidden'); }, 450);
        }
      }, 75);
    }
  }

  // ---------- Tools filter ----------
  var filter = document.querySelector('[data-tool-filter]');
  if (filter) {
    filter.hidden = false;
    var buttons = filter.querySelectorAll('button[data-os]');
    var rows = document.querySelectorAll('.tool-group .row[data-os]');
    var groups = document.querySelectorAll('[data-tool-group]');

    var apply = function (os) {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.os === os)); });
      rows.forEach(function (r) {
        var rowOs = r.dataset.os;
        r.hidden = !(os === 'all' || rowOs === 'both' || rowOs === os);
      });
      groups.forEach(function (g) {
        g.hidden = g.querySelectorAll('.row:not([hidden])').length === 0;
      });
      try { sessionStorage.setItem('tool-filter', os); } catch (e) {}
    };

    buttons.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.dataset.os); });
    });

    var saved = 'all';
    try { saved = sessionStorage.getItem('tool-filter') || 'all'; } catch (e) {}
    apply(saved);
  }

  // ---------- Bookshelf ----------
  var shelf = document.querySelector('[data-shelf]');
  if (shelf) {
    var spines = shelf.querySelectorAll('[data-book]');
    var details = shelf.querySelectorAll('[data-book-detail]');
    spines.forEach(function (spine) {
      spine.addEventListener('click', function () {
        var id = spine.dataset.book;
        spines.forEach(function (s) { s.setAttribute('aria-pressed', String(s === spine)); });
        details.forEach(function (d) { d.hidden = d.dataset.bookDetail !== id; });
      });
    });
  }

  // ---------- Name: JK types itself out on hover ----------
  var nameLink = document.querySelector('.site-name');
  if (nameLink) {
    var rests = Array.prototype.slice.call(nameLink.querySelectorAll('.site-name__rest'));
    var full = rests.map(function (r) { return r.textContent; });
    var total = full.join('').length;
    var shown = 0, target = 0, nameTimer = null;
    var caret = document.createElement('span');
    caret.className = 'cursor';
    caret.setAttribute('aria-hidden', 'true');
    caret.hidden = true;

    var render = function () {
      var left = shown, active = rests[0];
      rests.forEach(function (r, i) {
        var take = Math.min(full[i].length, left);
        r.textContent = full[i].slice(0, take);
        if (take > 0) active = r;
        left -= take;
      });
      active.parentNode.insertBefore(caret, active.nextSibling);
    };
    var step = function () {
      if (shown === target) { clearInterval(nameTimer); nameTimer = null; return; }
      shown += target > shown ? 1 : -1;
      render();
    };
    var go = function (to, hover) {
      target = to;
      caret.hidden = !hover;
      if (reducedMotion) { shown = to; render(); return; }
      if (nameTimer) clearInterval(nameTimer);
      nameTimer = setInterval(step, to > shown ? 70 : 35);
    };

    render();
    nameLink.addEventListener('mouseenter', function () { go(total, true); });
    nameLink.addEventListener('mouseleave', function () { go(0, false); });
    nameLink.addEventListener('focus', function () { go(total, true); });
    nameLink.addEventListener('blur', function () { go(0, false); });
  }

  // ---------- Console greeting ----------
  // A small hello for anyone who opens the dev tools.
  try {
    console.log(
      '%c JK %c  Poking around in here? Good instinct.',
      'background:#E08A5E;color:#1D1916;font-weight:700;padding:2px 7px;border-radius:3px',
      'color:#E08A5E;font-weight:600'
    );
    console.log(
      '%cHand-built Jekyll · no trackers · fonts served from this domain.\n' +
      'If you like taking things apart, you might like working together: %cgithub.com/jkuehnemundt',
      'color:#A39688',
      'color:#A39688;text-decoration:underline'
    );
  } catch (e) {}
})();
