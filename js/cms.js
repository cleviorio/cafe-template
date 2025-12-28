/**
 * Simple CMS loader for Sveltia + Markdown
 * No framework, no dependencies
 * Safe fallback if content fails
 */

async function loadMarkdown(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);

  const text = await res.text();

  // Split frontmatter
  const parts = text.split('---');
  if (parts.length < 3) throw new Error('Invalid frontmatter');

  const fm = parts[1].trim();
  const body = parts.slice(2).join('---').trim();

  const data = {};

  fm.split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    data[key] = value;
  });

  data.body = body;
  return data;
}

(async () => {
  try {
    // Load content
    const home = await loadMarkdown('/content/pages/home.md');
    const site = await loadMarkdown('/content/settings/site.md');

    // HERO
    if (home.title && document.getElementById('cms-title')) {
      document.getElementById('cms-title').innerText = home.title;
    }

    if (home.subtitle && document.getElementById('cms-subtitle')) {
      document.getElementById('cms-subtitle').innerText = home.subtitle;
    }

    if (home.body && document.getElementById('cms-body')) {
      document.getElementById('cms-body').innerText = home.body;
    }

    // FOOTER / CONTACT
    if (site.city && document.getElementById('cms-city')) {
      document.getElementById('cms-city').innerText = site.city;
    }

    if (site.phone && document.getElementById('cms-phone')) {
      const phoneEl = document.getElementById('cms-phone');
      phoneEl.innerText = site.phone;
      phoneEl.href = `tel:${site.phone.replace(/\s+/g, '')}`;
    }

    if (site.email && document.getElementById('cms-email')) {
      const emailEl = document.getElementById('cms-email');
      emailEl.innerText = site.email;
      emailEl.href = `mailto:${site.email}`;
    }

  } catch (err) {
    // Silent fail – site must NEVER break
    console.warn('[CMS] Content not loaded:', err.message);
  }
})();
