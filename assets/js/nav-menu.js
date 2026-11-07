/* Shared header menu — expands down on hover (desktop); tap on touch */
(function () {
  'use strict';
  const root = document.querySelector('.nav-menu');
  const btn = document.getElementById('menuToggle');
  const panel = document.getElementById('navDropdown');
  if (!root || !btn || !panel) return;

  const labelOpen = btn.getAttribute('data-label-open') || 'Menu';
  const labelClose = btn.getAttribute('data-label-close') || 'Close';
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

  function setOpen(open) {
    root.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? labelClose : labelOpen);
    if (open) {
      panel.hidden = false;
      // Keep label as Menu on hover-desktop; Close only when sticky-open via tap
      btn.textContent = (!canHover.matches && open) ? labelClose : labelOpen;
    } else {
      btn.textContent = labelOpen;
      window.setTimeout(() => {
        if (!root.classList.contains('is-open') && !root.matches(':hover') && !root.matches(':focus-within')) {
          panel.hidden = true;
        }
      }, 280);
    }
  }

  // Desktop: CSS :hover / :focus-within opens the panel; keep [hidden] cleared while interacting
  function syncHoverOpen() {
    if (!canHover.matches) return;
    const want = root.matches(':hover') || root.matches(':focus-within') || root.classList.contains('is-open');
    if (want) {
      panel.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
    } else if (!root.classList.contains('is-open')) {
      btn.setAttribute('aria-expanded', 'false');
      window.setTimeout(() => {
        if (!root.matches(':hover') && !root.matches(':focus-within') && !root.classList.contains('is-open')) {
          panel.hidden = true;
        }
      }, 280);
    }
  }

  root.addEventListener('mouseenter', () => {
    if (!canHover.matches) return;
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  });
  root.addEventListener('mouseleave', () => {
    if (!canHover.matches) return;
    if (root.classList.contains('is-open')) return;
    btn.setAttribute('aria-expanded', 'false');
    window.setTimeout(() => {
      if (!root.matches(':hover') && !root.matches(':focus-within') && !root.classList.contains('is-open')) {
        panel.hidden = true;
      }
    }, 280);
  });

  // Tap / click — primary on touch; on desktop don't require click to open
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (canHover.matches) {
      // Desktop: click toggles sticky open (optional); default path is hover
      setOpen(!root.classList.contains('is-open'));
      return;
    }
    setOpen(!root.classList.contains('is-open'));
  });

  panel.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', (e) => {
    if (!root.classList.contains('is-open')) return;
    if (root.contains(e.target)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  canHover.addEventListener('change', () => {
    setOpen(false);
    syncHoverOpen();
  });
})();
