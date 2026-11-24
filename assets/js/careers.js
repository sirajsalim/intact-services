/* INTACT SERVICES prototype: Careers page.
   The apply form is a demo. Nothing is sent or uploaded. */
(() => {
  'use strict';

  const form = document.getElementById('applyForm');
  if (!form) return;

  const done = document.getElementById('applyDone');
  const MAX_CV_BYTES = 5 * 1024 * 1024;
  const smooth = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

  // "Apply" on a role: pick that role in the form and jump to it.
  document.querySelectorAll('[data-apply]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!form.hidden) form.elements.role.value = btn.dataset.apply;
      document.getElementById('apply').scrollIntoView({ behavior: smooth() });
      (form.hidden ? document.getElementById('applyAgain') : form.elements.name).focus({ preventScroll: true });
    });
  });

  // Keep CVs under 5 MB.
  form.elements.cv.addEventListener('change', () => {
    const file = form.elements.cv.files[0];
    form.elements.cv.setCustomValidity(file && file.size > MAX_CV_BYTES ? 'Please choose a file under 5 MB.' : '');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const first = form.elements.name.value.trim().split(/\s+/)[0];
    document.getElementById('applyDoneText').textContent =
      `Thanks ${first}. We'd review your application for ${form.elements.role.value} and email you at ${form.elements.email.value.trim()} about the next step.`;
    form.hidden = true;
    done.hidden = false;
    document.getElementById('applyDoneTitle').focus();
  });

  document.getElementById('applyAgain').addEventListener('click', () => {
    form.reset();
    done.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });
})();
