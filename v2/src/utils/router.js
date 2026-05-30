// Tiny hash-based router (works on GitHub Pages)
// Routes are registered with a path pattern and a handler function.
// Path params are denoted with :name (e.g., '/program/:id')

const routes = [];
let notFoundHandler = null;
let beforeNavigateHandler = null;

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

export function onBeforeNavigate(handler) {
  beforeNavigateHandler = handler;
}

/**
 * Programmatic navigation
 * @param {string} path - e.g., '/program/agility_lower_1-1'
 */
export function navigate(path) {
  window.location.hash = path.startsWith('#') ? path : `#${path}`;
}

/**
 * Resolve current hash and call matching handler
 */
export function resolve() {
  const path = window.location.hash.slice(1) || '/';
  if (beforeNavigateHandler) beforeNavigateHandler(path);

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
 * Start listening to hash changes. Call once on app init.
 */
export function startRouter() {
  window.addEventListener('hashchange', resolve);
  // If user lands without a hash, default to /
  if (!window.location.hash) {
    window.location.hash = '#/';
  } else {
    resolve();
  }
}
