// Action App V2 - Entry point
import './styles/main.css';

const app = document.getElementById('app');

app.innerHTML = `
  <header class="px-6 pt-12 pb-6">
    <h1 class="text-3xl font-bold tracking-tight">Action App</h1>
    <p class="text-slate-400 mt-1">Your mobile fitness companion</p>
  </header>

  <main class="flex-1 px-6 pb-24">
    <div class="card p-6 animate-slide-up">
      <h2 class="text-xl font-semibold mb-2">V2 scaffold ready</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        Vite + Tailwind, mobile-first, dark mode by default.
        Next: build the MediaPlayer component and pages.
      </p>
    </div>
  </main>
`;

console.log('🚀 Action App V2 initialized');
