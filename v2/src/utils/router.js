// History-based router (clean URLs, no #)
// Works on GitHub Pages with 404.html fallback

const routes = [];
let notFoundHandler = null;

/**
 * Register a route.
 * @param {string} pattern - e.g. '/program/:id'
 * @param {(params: object) => void} handler
 */
export function route(pattern, handler) {
  const keys = [];
  const regex = new RegExp(
    '^' +
      pattern.replace(/:([^/]+)/g, (_, key) => {
        keys.push(key);
        return '([^/]+)';
      }) +
      '$'
  );
  routes.push({ pattern, regex, keys, handler });
}

export function setNotFound(handler) {
  notFoundHandler = handler;
}

/**
 * Programmatic navigation
 * @param {string} path - e.g., '/program/agility_lower_1-1'
 */
export function navigate(path) {
  window.history.pushState(null, '', path);
  resolve();
}

/**
 * Resolve current path and call matching handler
 */
export function resolve() {
  const path = window.location.pathname || '/';

  for (const r of routes) {
    const match = path.match(r.regex);
    if (match) {
      const params = {};
      r.keys.forEach((key, i) => {
        params[key] = decodeURIComponent(match[i + 1]);
      });
      r.handler(params);
      return;
    }
  }

  if (notFoundHandler) notFoundHandler(path);
}

/**
 * Start listening to navigation events. Call once on app init.
 */
export function startRouter() {
  // Handle back/forward buttons
  window.addEventListener('popstate', resolve);

  // Intercept all link clicks for SPA navigation
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    // Only intercept internal links (start with /)
    if (href && href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      navigate(href);
    }
  });

  // Handle legacy hash URLs (redirect to clean URL)
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    const cleanPath = window.location.hash.slice(1);
    window.history.replaceState(null, '', cleanPath);
  }

  resolve();
}
