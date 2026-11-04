// Highlights the sidebar entry for the section being read.
(() => {
  const links = new Map(
    [...document.querySelectorAll('.toc a[href^="#"]')].map((a) => [a.getAttribute('href').slice(1), a]),
  );
  const setActive = (id) => {
    links.forEach((a, key) => a.classList.toggle('active', key === id));
  };
  // The section whose top has most recently passed under the header is the
  // one being read. At the very bottom, the last sections are too short to
  // get there, so the last one wins.
  const sections = [...document.querySelectorAll('main section[id]')];
  const update = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      setActive(sections[sections.length - 1].id);
      return;
    }
    let current = sections[0];
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= 160) current = s;
    }
    setActive(current.id);
  };
  // A section picked from the contents stays highlighted, even when it
  // can't scroll all the way up.
  let picked = null;
  document.querySelector('.toc').addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (a) picked = a.getAttribute('href').slice(1);
  });
  window.addEventListener('scroll', () => {
    if (picked) { setActive(picked); return; }
    update();
  }, { passive: true });
  window.addEventListener('scrollend', () => { picked = null; });
  window.addEventListener('wheel', () => { picked = null; }, { passive: true });
  window.addEventListener('hashchange', () => setActive(location.hash.slice(1)));
  if (location.hash) setActive(location.hash.slice(1)); else update();
})();
