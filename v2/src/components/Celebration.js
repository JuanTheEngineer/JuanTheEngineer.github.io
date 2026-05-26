// Completion celebration: flying motivational text + brand color flash
// Triggered when all items in a program are completed.

const MESSAGES = [
  'Nice work!',
  'Killer moves!',
  'Awesome job!',
  "Crushed it!",
  'You did it!',
  'Beast mode!',
  'On fire!',
  'Way to go!'
];

let lastFiredAt = 0;

/**
 * Fire the celebration. Safe to call repeatedly — debounced to once per 5s.
 */
export function celebrate() {
  const now = Date.now();
  if (now - lastFiredAt < 5000) return;
  lastFiredAt = now;

  const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  const flash = document.createElement('div');
  flash.className = 'celebration-flash';

  const text = document.createElement('div');
  text.className = 'celebration-text';
  text.textContent = message;

  document.body.appendChild(flash);
  document.body.appendChild(text);

  // Cleanup after animation
  setTimeout(() => flash.remove(), 700);
  setTimeout(() => text.remove(), 3100);
}
