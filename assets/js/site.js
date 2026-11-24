/* INTACT SERVICES prototype.
   Everything here runs in the browser. Nothing is sent anywhere. */
(() => {
  'use strict';

  /* ------------------------------------------------------------------
     DUMMY DATA: edit these to change prices, roles and problems.
     ------------------------------------------------------------------ */

  // Hours and prices are both per MONTH. Full-time = 160 hrs a month (40 hrs a week × 4 weeks).
  // `monthly` below is the price of one full-time person; part-time blocks follow PART_TIME_CURVE.
  const FULL_TIME = 160;
  const WEEKS_PER_MONTH = 4;
  // tagline + tasks: what the role does, in a few words (shown in bold and as tags in the calculator).
  // monthly: example price for one full-time person (see PRICING.md for the research behind it).
  // inHouse: what a U.S. company pays to employ the same role full-time, fully loaded
  //          (median salary ÷ 0.70 wage share, BLS ECEC). Sources in PRICING.md.
  const ROLES = {
    coordinator: { name: 'HR Coordinator', level: 'L1 · Execute', tagline: 'Keeps HR admin running', tasks: ['Onboarding', 'Records', 'Payroll inputs'], monthly: 2400, inHouse: 6000 },
    recruiter:   { name: 'HR Recruiter', level: 'L1 · Execute', tagline: 'Finds and screens candidates', tasks: ['Sourcing', 'Screening', 'Interviews'], monthly: 2400, inHouse: 9000 },
    generalist:  { name: 'HR Generalist', level: 'L2 · Own', tagline: 'Runs day-to-day HR', tasks: ['Policies', 'Performance', 'Employee issues'], monthly: 3600, inHouse: 8900 },
    partner:     { name: 'HR Business Partner', level: 'L3 · Advise', tagline: 'Coaches your managers', tasks: ['Workforce planning', 'Talent', 'Manager advice'], monthly: 5200, inHouse: 12500 },
    senior:      { name: 'Senior HR Partner', level: 'L4 · Lead', tagline: 'Leads HR strategy and big changes', tasks: ['Org design', 'Restructuring', 'Leadership'], monthly: 7200, inHouse: 16500 },
  };

  // The ladder: each level can do everything the level below does, plus more.
  // L1 has two specialists side by side; neither covers the other's work.
  const LEVELS = [
    { tag: 'L1 · Execute', note: 'Two specialists. Pick either or both.', roles: ['coordinator', 'recruiter'] },
    { tag: 'L2 · Own', below: 'L1', adds: 'owns day-to-day HR', roles: ['generalist'] },
    { tag: 'L3 · Advise', below: 'L2', adds: 'advises your managers', roles: ['partner'] },
    { tag: 'L4 · Lead', below: 'L3', adds: 'leads HR strategy', roles: ['senior'] },
  ];

  // Part-time blocks cost more per hour than full-time, like every fractional HR firm prices them.
  // Price for h hours = full-time price × (h ÷ 160) ^ PART_TIME_CURVE. 1 = straight pro rata; lower = steeper premium.
  // With 0.75: 20 hrs ≈ 1.7× the full-time hourly rate, 80 hrs ≈ 1.2×, 160 hrs = 1×.
  const PART_TIME_CURVE = 0.75;

  // Average U.S. cost to recruit one non-executive hire (SHRM 2025).
  const HIRE_COST = 5500;

  // Commitment options in the Pod calculator.
  const TERMS = [
    { months: 1, label: 'Monthly', discount: 0 },
    { months: 6, label: '6 months', discount: 0.10 },
    { months: 12, label: '12 months', discount: 0.15 },
  ];

  // Hero problem finder. Each problem suggests one role and a starting number of hours a month.
  const PROBLEMS = {
    starting: [
      { text: 'We need to hire, fast.', role: 'recruiter', hours: 80, does: 'Sourcing, screening and interview scheduling, so your team only meets the best candidates.' },
      { text: "I'm doing HR myself after hours.", role: 'coordinator', hours: 40, does: 'Onboarding, records, leave and payroll inputs taken off your plate.' },
      { text: 'We need contracts, policies and a handbook.', role: 'generalist', hours: 40, does: 'Contracts, policies and a handbook set up properly, then kept up to date.' },
    ],
    established: [
      { text: 'Our HR team is stretched.', role: 'generalist', hours: 160, does: 'An experienced extra pair of hands for day-to-day HR operations.' },
      { text: 'We need senior HR for a big change.', role: 'senior', hours: 80, does: 'Org design, restructuring and leadership coaching for as long as the change lasts.' },
      { text: 'We need cover for a gap or a project.', role: 'partner', hours: 160, does: 'Cover a vacancy or leave, or run a project like a performance-review cycle.' },
    ],
  };
  const FINDER_HOURS = [40, 80, 160]; // hours a month

  // Pod calculator: hours a month change in steps of STEP, up to MAX per role.
  const STEP = 20;
  const MAX = 800;
  const POD_DEFAULT = { coordinator: 20 };

  // Booking: dummy call slots on the next five weekdays, at these UTC hours.
  const SLOT_HOURS_UTC = [14, 16, 19];

  /* ------------------------------------------------------------------ */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const money = (n) => usd.format(Math.round(n));
  // Whole full-time people at the full-time price; any remainder is a part-time block on the curve.
  // Rounded to the nearest $10 so prices look like a price list, not a calculation.
  const priceFor = (roleKey, hours) => {
    const { monthly } = ROLES[roleKey];
    const full = Math.floor(hours / FULL_TIME);
    const rest = hours - full * FULL_TIME;
    const partTime = rest ? monthly * (rest / FULL_TIME) ** PART_TIME_CURVE : 0;
    return Math.round((monthly * full + partTime) / 10) * 10;
  };
  // In-house alternative: at least one full-time hire per role; pro rata above that.
  const inHouseFor = (roleKey, hours) => Math.round(ROLES[roleKey].inHouse * Math.max(1, hours / FULL_TIME) / 100) * 100;
  const el = (tag, props = {}, children = []) => {
    const node = Object.assign(document.createElement(tag), props);
    node.append(...children);
    return node;
  };

  // "≈ $6,000" with a non-breaking space, so the ≈ never ends up alone at the end of a line.
  const approx = (n) => `≈ ${money(n)}`;

  // Savings under a price: "Save ≈ $X a month", then "Y% less than <what it's compared with>".
  function renderSavings(node, ours, inHouse, against) {
    const save = inHouse - ours;
    if (!node) return;
    if (!ours || save <= 0) { node.replaceChildren(); return; }
    const pct = Math.round((save / inHouse) * 100);
    node.replaceChildren(
      el('p', { className: 'savings-main', textContent: `Save ${approx(save)} a month` }),
      el('p', { className: 'savings-note' }, [el('b', { textContent: `${pct}% less` }), ` than ${against}`]),
    );
  }

  /* ---------- Header: compact logo on scroll, mobile menu ---------- */
  const header = $('#siteHeader');
  const onScroll = () => header.classList.toggle('is-compact', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuBtn = $('#menuBtn');
  const nav = $('#nav');
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // The header code above runs on every page. Everything below is for the home page only.
  if (!$('#finder')) return;

  /* ---------- Hero: problem finder ---------- */
  const finder = { problem: null, hours: 0 };
  const pickStep = $('[data-step="pick"]');
  const resultStep = $('[data-step="result"]');

  Object.entries(PROBLEMS).forEach(([group, list]) => {
    const holder = $(`[data-group="${group}"]`);
    list.forEach((p) => {
      const btn = el('button', { type: 'button', className: 'problem', textContent: p.text });
      btn.addEventListener('click', () => showResult(p));
      holder.append(btn);
    });
  });

  const hoursSeg = $('#rHours');
  FINDER_HOURS.forEach((h) => {
    const b = el('button', { type: 'button' }, [`${h} hrs`, el('small', { textContent: `≈ ${h / WEEKS_PER_MONTH} a week` })]);
    b.dataset.hours = h;
    b.addEventListener('click', () => { finder.hours = h; renderResult(); });
    hoursSeg.append(b);
  });

  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // On small screens the card changes height, so bring its top back into view.
  function alignFinder() {
    const top = $('#finder').getBoundingClientRect().top;
    const headerBottom = header.getBoundingClientRect().bottom;
    if (top < headerBottom) window.scrollBy({ top: top - headerBottom - 12, behavior: reduceMotion() ? 'auto' : 'smooth' });
  }

  function showResult(problem) {
    finder.problem = problem;
    finder.hours = problem.hours;
    renderResult();
    pickStep.hidden = true;
    resultStep.hidden = false;
    $('#rRole').focus({ preventScroll: true });
    alignFinder();
  }

  function renderResult() {
    const { problem, hours } = finder;
    const role = ROLES[problem.role];
    $('#rQuote').textContent = `“${problem.text}”`;
    $('#rRole').textContent = role.name;
    $('#rLevel').textContent = role.level;
    $('#rDoes').textContent = problem.does;
    $('#rPrice').textContent = money(priceFor(problem.role, hours));
    const inHouse = inHouseFor(problem.role, hours);
    renderSavings($('#rSavings'), priceFor(problem.role, hours), inHouse,
      `hiring a full-time ${role.name} in-house (${approx(inHouse)}/mo with benefits), before the ${approx(HIRE_COST)} it costs to recruit one.`);
    $$('button', hoursSeg).forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.hours) === hours)));
  }

  $('#finderBack').addEventListener('click', () => {
    resultStep.hidden = true;
    pickStep.hidden = false;
    $('.problem', pickStep).focus({ preventScroll: true });
    alignFinder();
  });

  $('#toPod').addEventListener('click', () => {
    Object.keys(pod.hours).forEach((k) => { pod.hours[k] = 0; });
    pod.hours[finder.problem.role] = finder.hours;
    renderPod();
    $('#pricing').scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth' });
  });

  /* ---------- Pod calculator ---------- */
  const pod = { hours: {}, term: TERMS[0] };
  const resetPod = () => {
    Object.keys(ROLES).forEach((k) => { pod.hours[k] = POD_DEFAULT[k] || 0; });
    pod.term = TERMS[0];
  };
  resetPod();

  // Hint under each stepper: the weekly equivalent, or "full-time" on exact multiples.
  const fteLabel = (h) => {
    if (h === 0) return 'not needed';
    const fte = h / FULL_TIME;
    if (Number.isInteger(fte)) return fte === 1 ? 'full-time' : `${fte} full-time`;
    if (fte > 1) return `≈ ${fte.toFixed(1)} full-time`;
    return `≈ ${h / WEEKS_PER_MONTH} hrs a week`;
  };

  const rows = $('#podRows');
  const rowRefs = {};

  function buildRow(key) {
    const role = ROLES[key];
    const minus = el('button', { type: 'button', textContent: '−', ariaLabel: `Fewer hours of ${role.name}` });
    const plus = el('button', { type: 'button', textContent: '+', ariaLabel: `More hours of ${role.name}` });
    const out = el('output', { ariaLive: 'polite' });
    const sub = el('div', { className: 'pod-sub' });
    minus.addEventListener('click', () => { pod.hours[key] = Math.max(0, pod.hours[key] - STEP); renderPod(); });
    plus.addEventListener('click', () => { pod.hours[key] = Math.min(MAX, pod.hours[key] + STEP); renderPod(); });
    const row = el('div', { className: 'pod-row' }, [
      el('div', { className: 'pod-info' }, [
        el('h3', { textContent: role.name }),
        el('p', { className: 'pod-tagline', textContent: role.tagline }),
        el('ul', { className: 'pod-tasks', ariaLabel: `${role.name} handles` }, role.tasks.map((t) => el('li', { textContent: t }))),
        el('p', { className: 'pod-rate', textContent: `${money(role.monthly)}/mo full-time · in-house ≈ ${money(role.inHouse)}` }),
      ]),
      el('div', { className: 'stepper' }, [minus, out, plus]),
      sub,
    ]);
    rowRefs[key] = { row, minus, plus, out, sub };
    return row;
  }

  // One group per level, with a header saying what the level adds on top of the one below.
  LEVELS.forEach((lvl) => {
    const note = lvl.below
      ? el('p', { className: 'tier-note' }, [el('span', { className: 'tier-plus', textContent: `Everything ${lvl.below} does, plus` }), ` ${lvl.adds}`])
      : el('p', { className: 'tier-note', textContent: lvl.note });
    rows.append(el('div', { className: 'tier', role: 'group', ariaLabel: lvl.tag }, [
      el('div', { className: 'tier-head' }, [el('span', { className: 'level level-ink', textContent: lvl.tag }), note]),
      ...lvl.roles.map(buildRow),
    ]));
  });

  const termSeg = $('#term');
  TERMS.forEach((t) => {
    const b = el('button', { type: 'button' }, [t.label]);
    if (t.discount) b.append(el('small', { textContent: `save ${Math.round(t.discount * 100)}%` }));
    b.addEventListener('click', () => { pod.term = t; renderPod(); });
    t.button = b;
    termSeg.append(b);
  });

  function podTotals() {
    const lines = Object.keys(ROLES)
      .filter((k) => pod.hours[k] > 0)
      .map((k) => ({ key: k, hours: pod.hours[k], price: priceFor(k, pod.hours[k]) }));
    // Round the monthly figure first so "per month × months" always matches the total shown.
    const base = Math.round(lines.reduce((s, l) => s + l.price, 0));
    const monthly = Math.round(base * (1 - pod.term.discount) / 10) * 10;
    const inHouse = lines.reduce((s, l) => s + inHouseFor(l.key, l.hours), 0);
    return { lines, base, monthly, inHouse, total: monthly * pod.term.months, saved: (base - monthly) * pod.term.months };
  }

  function renderPod() {
    Object.entries(rowRefs).forEach(([key, r]) => {
      const h = pod.hours[key];
      r.out.replaceChildren(document.createTextNode(`${h} hrs/mo`), el('small', { textContent: fteLabel(h) }));
      r.minus.disabled = h === 0;
      r.plus.disabled = h >= MAX;
      r.row.classList.toggle('is-on', h > 0);
      r.sub.replaceChildren(document.createTextNode(money(priceFor(key, h))), el('small', { textContent: 'per month' }));
    });

    const t = podTotals();
    const list = $('#sumLines');
    list.replaceChildren(...(t.lines.length
      ? t.lines.map((l) => el('li', {}, [
          el('span', { textContent: `${ROLES[l.key].name} · ${l.hours} hrs/mo` }),
          el('span', { textContent: money(l.price) }),
        ]))
      : [el('li', { className: 'empty', textContent: 'Add hours to any role to build your Pod.' })]));

    TERMS.forEach((term) => term.button.setAttribute('aria-pressed', String(term === pod.term)));
    $('#sumMonthly').textContent = money(t.monthly);
    $('#barTotal').textContent = money(t.monthly);
    $('#sumNote').textContent = !t.lines.length ? ''
      : pod.term.months === 1 ? 'Billed monthly.'
      : `${money(t.total)} over ${pod.term.months} months, including ${money(t.saved)} off for committing.`;
    const who = t.lines.length === 1 ? `a full-time ${ROLES[t.lines[0].key].name}` : `these ${t.lines.length} roles`;
    renderSavings($('#sumSavings'), t.monthly, t.inHouse,
      `hiring ${who} in-house (${approx(t.inHouse)}/mo with benefits), before recruiting costs.`);
    $('[data-book="pod"]').disabled = !t.lines.length;
  }

  $('#podReset').addEventListener('click', () => { resetPod(); renderPod(); });
  renderPod();

  // Mobile: show a running total while the rows are on screen and the summary isn't.
  const bar = $('#podBar');
  if ('IntersectionObserver' in window) {
    const seen = { rows: false, summary: false };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { seen[e.target === rows ? 'rows' : 'summary'] = e.isIntersecting; });
      bar.classList.toggle('show', seen.rows && !seen.summary);
    }, { threshold: 0 });
    io.observe(rows);
    io.observe($('#podSummary'));
  }

  /* ---------- Booking dialog ---------- */
  const dialog = $('#booking');
  const steps = { time: $('[data-bstep="time"]'), details: $('[data-bstep="details"]'), done: $('[data-bstep="done"]') };
  const form = $('#bookForm');
  const booking = { context: '', slot: null, dayIndex: 0 };
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'local time';
  const fmtTime = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
  const fmtDay = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
  const fmtDate = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' });
  const fmtLong = new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

  function nextWeekdays(count) {
    const days = [];
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    while (days.length < count) {
      d.setUTCDate(d.getUTCDate() + 1);
      const wd = d.getUTCDay();
      if (wd !== 0 && wd !== 6) days.push(new Date(d));
    }
    return days;
  }

  function contextFor(source) {
    if (source === 'finder' && finder.problem) {
      const role = ROLES[finder.problem.role];
      return `About: “${finder.problem.text}” → ${role.name}, ${finder.hours} hrs a month (${money(priceFor(finder.problem.role, finder.hours))}/mo)`;
    }
    if (source === 'pod') {
      const t = podTotals();
      const mix = t.lines.map((l) => `${ROLES[l.key].name} ${l.hours} hrs/mo`).join(', ');
      return `About your Pod: ${mix}. ${money(t.monthly)}/mo, ${pod.term.label.toLowerCase()}.`;
    }
    return '';
  }

  function showStep(name) {
    Object.entries(steps).forEach(([k, node]) => { node.hidden = k !== name; });
  }

  function renderDays() {
    const days = nextWeekdays(5);
    const dayBox = $('#days');
    dayBox.replaceChildren(...days.map((d, i) => {
      const b = el('button', { type: 'button', className: 'day' }, [fmtDay.format(d), el('small', { textContent: fmtDate.format(d) })]);
      b.setAttribute('aria-pressed', String(i === booking.dayIndex));
      b.addEventListener('click', () => { booking.dayIndex = i; renderDays(); });
      return b;
    }));
    const day = days[booking.dayIndex];
    $('#slots').replaceChildren(...SLOT_HOURS_UTC.map((h) => {
      const when = new Date(day);
      when.setUTCHours(h, 0, 0, 0);
      const b = el('button', { type: 'button', className: 'slot', textContent: fmtTime.format(when) });
      b.addEventListener('click', () => pickSlot(when));
      return b;
    }));
  }

  function pickSlot(when) {
    booking.slot = when;
    $('#picked').textContent = `${fmtLong.format(when)}, ${fmtTime.format(when)}`;
    showStep('details');
    form.elements.name.focus();
  }

  function openBooking(source) {
    booking.context = contextFor(source);
    booking.slot = null;
    booking.dayIndex = 0;
    const ctx = $('#bookContext');
    ctx.textContent = booking.context;
    ctx.hidden = !booking.context;
    $('#bookTitle').textContent = '20 minutes. No HR brief needed.';
    $('#tz').textContent = tz.replace(/_/g, ' ');
    form.reset();
    renderDays();
    showStep('time');
    setMenu(false);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  const closeBooking = () => (typeof dialog.close === 'function' ? dialog.close() : dialog.removeAttribute('open'));

  $$('[data-book]').forEach((b) => b.addEventListener('click', () => openBooking(b.dataset.book)));
  $$('[data-close]', dialog).forEach((b) => b.addEventListener('click', closeBooking));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) closeBooking(); });
  $('#changeTime').addEventListener('click', () => showStep('time'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const name = form.elements.name.value.trim().split(/\s+/)[0];
    const email = form.elements.email.value.trim();
    $('#bookTitle').textContent = "You're booked.";
    $('#doneText').textContent = `Thanks ${name}. Your call is on ${fmtLong.format(booking.slot)} at ${fmtTime.format(booking.slot)}. The invite would go to ${email}.`;
    showStep('done');
    $('#bookTitle').focus();
  });
})();
