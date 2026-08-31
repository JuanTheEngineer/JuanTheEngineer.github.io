(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function s(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(n){if(n.ep)return;n.ep=!0;const a=s(n);fetch(n.href,a)}})();const be=[];let ae=null;function j(e,t){const s=[],r=new RegExp("^"+e.replace(/:([^/]+)/g,(n,a)=>(s.push(a),"([^/]+)"))+"$");be.push({pattern:e,regex:r,keys:s,handler:t})}function Ie(e){ae=e}function h(e){window.history.pushState(null,"",e),re()}function re(){const e=window.location.pathname||"/";for(const t of be){const s=e.match(t.regex);if(s){const r={};t.keys.forEach((n,a)=>{r[n]=decodeURIComponent(s[a+1])}),t.handler(r);return}}ae&&ae(e)}function Ae(){if(window.addEventListener("popstate",re),document.addEventListener("click",e=>{const t=e.target.closest("a[href]");if(!t)return;const s=t.getAttribute("href");s&&s.startsWith("/")&&!s.startsWith("//")&&(e.preventDefault(),h(s))}),window.location.hash&&window.location.hash.startsWith("#/")){const e=window.location.hash.slice(1);window.history.replaceState(null,"",e)}re()}const he="action-app:progress",ve="action-app:recent-programs",Be=5;function ne(){try{return JSON.parse(localStorage.getItem(he)||"{}")}catch{return{}}}function ye(e){try{localStorage.setItem(he,JSON.stringify(e))}catch{}}function we(e){const t=ne();return new Set(t[e]||[])}function Ne(e,t){const s=ne(),r=new Set(s[e]||[]);return r.has(t)?r.delete(t):r.add(t),s[e]=Array.from(r),ye(s),r}function Ue(e){const t=ne();delete t[e],ye(t)}function ke(){try{const e=JSON.parse(localStorage.getItem(ve)||"[]");return Array.isArray(e)?e:[]}catch{return[]}}function He(e){if(e)try{const t=ke().filter(s=>s.id!==e);t.unshift({id:e,visitedAt:Date.now()}),localStorage.setItem(ve,JSON.stringify(t.slice(0,Be)))}catch{}}const w={workouts:null,exercises:null,plans:null,exerciseMap:null};async function R(){if(w.workouts)return w.workouts;const e=await fetch("/workouts.json");if(!e.ok)throw new Error(`Failed to load workouts.json: ${e.status}`);return w.workouts=await e.json(),w.workouts}async function N(){if(w.exercises)return w.exercises;const e=await fetch("/exercises.json");if(!e.ok)throw new Error(`Failed to load exercises.json: ${e.status}`);return w.exercises=await e.json(),w.exerciseMap=new Map(w.exercises.exercises.map(t=>[t.id,t])),w.exercises}async function $e(){if(w.plans)return w.plans;const e=await fetch("/plans.json");if(!e.ok)throw new Error(`Failed to load plans.json: ${e.status}`);return w.plans=await e.json(),w.plans}async function _e(e){return(await R()).programs.find(s=>s.id===e)||null}async function ze(e){return await N(),w.exerciseMap?.get(e)||null}async function Re(e){const[t]=await Promise.all([_e(e),N()]);if(!t)return null;const s=a=>{const o=w.exerciseMap.get(a.exerciseId)||null;return{kind:"single",exerciseId:a.exerciseId,exercise:o,name:o?.name||a.exerciseId,reps:a.reps??o?.recommendations?.reps,sets:a.sets??o?.recommendations?.sets,repUnits:a.repUnits??o?.recommendations?.repUnits,note:a.note??o?.recommendations?.note,tags:a.tags||[]}},r=a=>({kind:a.kind,note:a.note,tags:a.tags||[],exercises:a.exercises.map(o=>{const i=w.exerciseMap.get(o.exerciseId)||null;return{exerciseId:o.exerciseId,exercise:i,name:i?.name||o.exerciseId,reps:o.reps??i?.recommendations?.reps,sets:o.sets??i?.recommendations?.sets,repUnits:o.repUnits??i?.recommendations?.repUnits,note:o.note??i?.recommendations?.note}})}),n=(t.items||[]).map(a=>a.kind?r(a):s(a));return{...t,resolvedItems:n}}function Oe(){return["localhost","127.0.0.1"].includes(window.location.hostname)}function De(e){e.innerHTML=`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-16 pb-8">
        <p class="eyebrow">Action App</p>
        <h1 class="h-display mt-2">No more excuses</h1>
        <p class="text-[15px] text-slate-400 mt-3 leading-relaxed max-w-md">
          Your mobile fitness companion.
          Pick a program, follow along, get it done.
        </p>
      </header>

      <main class="flex-1 px-6 pb-24 space-y-6">
        <section data-region="recent" class="hidden space-y-3 animate-slide-up"></section>

        <section class="space-y-3">
          ${Oe()?`<button
            data-action="create"
            class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight">Create</h2>
                <p class="text-sm text-slate-400 mt-0.5">New program or exercise</p>
              </div>
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>`:""}

          <button
            data-action="search"
            class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up"
            style="animation-delay: 50ms"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
                <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight">Search</h2>
                <p class="text-sm text-slate-400 mt-0.5">Find a program by name</p>
              </div>
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>

          <button
            data-action="programs"
            class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up"
            style="animation-delay: 100ms"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center">
                <svg class="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight">Browse programs</h2>
                <p class="text-sm text-slate-400 mt-0.5">Curated workout plans</p>
              </div>
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>

          <button
            data-action="exercises"
            class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up"
            style="animation-delay: 150ms"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center">
                <svg class="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7"/>
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight">Exercise library</h2>
                <p class="text-sm text-slate-400 mt-0.5">All exercises with demos</p>
              </div>
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        </section>
      </main>

      <footer class="px-6 pb-8 text-center">
        <a href="https://forms.gle/QWEpe3gCLZWDiJjR8" target="_blank" rel="noopener"
          class="text-xs text-slate-500 hover:text-brand-400 transition-colors">
          Send feedback →
        </a>
      </footer>
    </div>
  `,e.querySelector('[data-action="create"]')?.addEventListener("click",()=>h("/studio")),e.querySelector('[data-action="search"]')?.addEventListener("click",()=>h("/search")),e.querySelector('[data-action="programs"]')?.addEventListener("click",()=>h("/programs")),e.querySelector('[data-action="exercises"]')?.addEventListener("click",()=>h("/exercises")),Fe(e).catch(t=>console.warn("[recent] skipped",t))}async function Fe(e){const t=ke();if(t.length===0)return;const s=e.querySelector('[data-region="recent"]');if(!s)return;const{programs:r}=await R(),n=new Map(r.map(o=>[o.id,o])),a=t.map(o=>({...o,program:n.get(o.id)})).filter(o=>o.program).slice(0,3);a.length!==0&&(s.classList.remove("hidden"),s.innerHTML=`
    <div class="flex items-baseline justify-between">
      <h2 class="eyebrow">Pick up where you left off</h2>
      ${a.length===3&&t.length>3?'<button data-action="all-recent" class="text-xs text-slate-400 hover:text-brand-400 transition-colors">All</button>':""}
    </div>
    <ul class="space-y-2">
      ${a.map(o=>Ge(o.program)).join("")}
    </ul>
  `,s.querySelectorAll("[data-program-id]").forEach(o=>{o.addEventListener("click",()=>h(`/program/${o.dataset.programId}`))}),s.querySelector('[data-action="all-recent"]')?.addEventListener("click",()=>h("/programs")))}function Ge(e){const t=e.items?.length||e.exercises?.length||0,s=we(e.id).size,r=t>0?Math.round(s/t*100):0,n=s===0?"Not started":s>=t?"Complete":`${s} of ${t} done`;return`
    <li>
      <button
        data-program-id="${e.id}"
        class="w-full card p-4 text-left active:scale-[0.98] transition-transform"
      >
        <div class="flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold tracking-tight truncate">${Je(e.title)}</h3>
            <div class="flex items-center gap-2 mt-2">
              <div class="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-linear-to-r from-brand-500 to-brand-400 transition-all" style="width: ${r}%"></div>
              </div>
              <span class="text-[11px] text-slate-400 num font-medium whitespace-nowrap">${n}</span>
            </div>
          </div>
          <svg class="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </button>
    </li>
  `}function Je(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Ve(e){e.innerHTML=`
    <header class="px-6 pt-12 pb-2 flex items-center gap-3">
      <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="h-page">Programs</h1>
    </header>
    <main class="flex-1 px-6 pb-24 flex items-center justify-center">
      <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </main>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>h("/"));try{const[t,s]=await Promise.all([R(),$e()]);We(e,t.programs,s.plans)}catch(t){Ke(e,t)}}function We(e,t,s){const r=new Map(t.map(a=>[a.id,a])),n=[];for(const a of s)for(const o of a.subPlans||[]){const i=(o.programs||[]).map(d=>r.get(d)).filter(Boolean);i.length!==0&&n.push({category:a.name,title:o.name,description:o.description,programs:i})}e.innerHTML=`
    <header class="px-6 pt-12 pb-4 flex items-center gap-3">
      <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="h-page">Programs</h1>
    </header>

    <main class="flex-1 px-6 pb-24 space-y-8">
      ${n.map((a,o)=>`
        <section class="space-y-3 animate-slide-up" style="animation-delay: ${o*30}ms">
          <div>
            <p class="eyebrow">${a.category}</p>
            <h2 class="h-section mt-1">${a.title}</h2>
            ${a.description?`<p class="text-sm text-slate-400 mt-1 leading-relaxed">${a.description}</p>`:""}
          </div>
          <ul class="space-y-2">
            ${a.programs.map(i=>Ye(i)).join("")}
          </ul>
        </section>
      `).join("")}
    </main>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>h("/")),e.querySelectorAll("[data-program-id]").forEach(a=>{a.addEventListener("click",()=>{h(`/program/${a.dataset.programId}`)})})}function Ye(e){const t=e.items?.length||e.exercises?.length||0;return`
    <li>
      <button
        data-program-id="${e.id}"
        class="w-full card p-4 text-left active:scale-[0.98] transition-transform"
      >
        <div class="flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold tracking-tight truncate">${e.title}</h3>
            <p class="text-xs text-slate-400 mt-1 truncate">
              <span class="num">${t}</span> exercise${t!==1?"s":""}${e.requirements?` · ${e.requirements}`:""}
            </p>
          </div>
          <svg class="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </button>
    </li>
  `}function Ke(e,t){e.innerHTML=`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold text-red-400 mb-2">Couldn't load programs</h2>
        <p class="text-sm text-slate-400">${t?.message||t}</p>
      </div>
    </main>
  `}function Se(e){if(!e)return null;const t=[/youtube\.com\/watch\?v=([^&]+)/,/youtube\.com\/shorts\/([^?&/]+)/,/youtube\.com\/embed\/([^?&/]+)/,/youtu\.be\/([^?&/]+)/];for(const s of t){const r=e.match(s);if(r)return r[1]}return null}function Ze(e,t="hqdefault"){const s=Se(e);return s?`https://i.ytimg.com/vi/${s}/${t}.jpg`:null}function Qe(e,t={}){const s=Se(e);if(!s)return null;const r=new URLSearchParams({autoplay:"1",rel:"0",modestbranding:"1",playsinline:"1"}),n=Math.floor(t.startTime||0),a=Math.floor(t.endTime||0),o=!(n>0&&a>0&&n>=a);return o&&n>0&&r.set("start",String(n)),o&&a>0&&r.set("end",String(a)),`https://www.youtube.com/embed/${s}?${r.toString()}`}function Ee(e,t="w_800,q_auto,f_auto"){return!e||!e.includes("cloudinary.com")?e:e.replace("/upload/",`/upload/${t}/`)}function Xe(e){if(!e||!e.type)return"unknown";if(["youtube","tiktok","vimeo"].includes(e.type))return"embed";const t=e.mediaType==="video"||["mp4","webm","mov"].includes(e.format);return e.format==="gif"?"image":t?"video":"image"}function le(e,t,s={}){if(!t){e.innerHTML='<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No media</div>';return}const r=Xe(t),n=s.className||"w-full max-h-[60vh] object-contain rounded-2xl bg-slate-800";switch(e.classList.add("animate-fade-in"),r){case"image":et(e,t,n,s.onError);break;case"video":tt(e,t,n,s.autoplay,s.onError);break;case"embed":st(e,t,n,s.onEmbedPlay);break;default:e.innerHTML=`<div class="${n} flex items-center justify-center text-slate-500 text-sm">Unsupported media type</div>`}}function et(e,t,s,r){const n=t.type==="cloudinary"?Ee(t.url,"w_800,q_auto,f_auto"):t.url;e.innerHTML=`
    <img
      src="${n}"
      alt="Exercise demonstration"
      class="${s}"
      loading="lazy"
      decoding="async"
    />
  `,r&&e.querySelector("img")?.addEventListener("error",()=>r(),{once:!0})}function tt(e,t,s,r=!0,n){const a=t.type==="cloudinary"?Ee(t.url,"w_800,q_auto,f_auto"):t.url;let o="";if(t.format==="mp4"){const d=t.startTime||0,l=t.endTime||0,u=!(d>0&&l>0&&d>=l);u&&d>0&&l>0?o=`#t=${d},${l}`:u&&d>0&&(o=`#t=${d}`)}e.innerHTML=`
    <video
      src="${a}${o}"
      class="${s} cursor-pointer"
      ${r?"autoplay":""}
      loop
      muted
      playsinline
      preload="metadata"
    ></video>
  `;const i=e.querySelector("video");i?.addEventListener("click",()=>{i.paused?i.play():i.pause()}),n&&i?.addEventListener("error",()=>n(),{once:!0})}function st(e,t,s,r){const o=`${(t.url||"").includes("/shorts/")?"aspect-9/16 max-h-[70vh] mx-auto":"aspect-video"} w-full rounded-2xl overflow-hidden bg-slate-900`,i=t.type==="youtube"?Ze(t.url,"hqdefault"):null;e.innerHTML=`
    <div class="${o} relative">
      <button
        class="group absolute inset-0 flex items-center justify-center overflow-hidden touch-manipulation"
        data-action="play-embed"
        aria-label="Play video"
      >
        ${i?`<img src="${i}" alt="Video thumbnail" class="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />`:""}
        <div class="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
        <div class="relative z-10 w-16 h-16 rounded-full bg-brand-500 group-active:scale-95 transition-transform flex items-center justify-center shadow-2xl">
          <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span class="absolute bottom-3 right-3 text-xs text-white/80 bg-black/60 px-2 py-1 rounded-full z-10">
          ${t.type==="youtube"?"YouTube":t.type}
        </span>
      </button>
    </div>
  `;const d=e.querySelector('[data-action="play-embed"]');d&&d.addEventListener("click",()=>{const l=t.type==="youtube"?Qe(t.url,{startTime:t.startTime,endTime:t.endTime}):t.url;e.innerHTML=`
        <div class="${o} relative">
          <iframe
            src="${l}"
            class="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      `,r?.()},{once:!0})}function z(e,t){const s=ot((t||[]).filter(Boolean));if(s.length===0){e.innerHTML='<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No demos available</div>';return}const r=new Set;let n=!1;const a=new Set(["youtube","tiktok","vimeo"]);s.forEach((i,d)=>{a.has(i.type)&&r.add(d)}),r.size>0?o():e.innerHTML=`
      <div data-region="loader" class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center">
        <div class="demo-loader" aria-label="Loading demo"></div>
      </div>
    `,s.forEach((i,d)=>{a.has(i.type)||at(i,l=>{l&&(r.add(d),o())})}),setTimeout(()=>{r.size===0&&(s.forEach((i,d)=>r.add(d)),o())},6e3);function o(){const i=s.filter((u,p)=>r.has(p));if(i.length===0)return;const d=s.findIndex((u,p)=>r.has(p)),l=n?-1:i.indexOf(s[d]);rt(e,i,l>=0?l:0,u=>{n=n||u})}}function at(e,t){const s=e.url;if(!s){t(!1);return}if(!(e.format==="gif")&&(e.mediaType==="video"||["mp4","webm","mov"].includes(e.format))){const a=document.createElement("video");a.preload="metadata",a.src=s,a.addEventListener("loadeddata",()=>t(!0),{once:!0}),a.addEventListener("error",()=>t(!1),{once:!0})}else{const a=new Image;if(a.src=s,a.complete&&a.naturalWidth>0){t(!0);return}a.addEventListener("load",()=>t(!0),{once:!0}),a.addEventListener("error",()=>t(!1),{once:!0})}}function rt(e,t,s,r){let n=nt(s,t.length);e.innerHTML=`
    <div class="relative">
      <div
        data-region="track"
        class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 gap-3 pb-1"
        style="scroll-snap-stop: always;"
      ></div>
      ${t.length>1?`
        <div class="flex items-center justify-center gap-1.5 mt-3" data-region="dots"></div>
        <p data-region="caption" class="text-xs text-slate-400 text-center px-2 mt-2 leading-relaxed min-h-4"></p>
      `:""}
    </div>
  `;const a=e.querySelector('[data-region="track"]'),o=e.querySelector('[data-region="dots"]'),i=e.querySelector('[data-region="caption"]');a.style.scrollbarWidth="none";const d=new Set;t.forEach((c,f)=>{const g=document.createElement("div");g.className="shrink-0 w-full snap-center",le(g,c,{onError:()=>{g.innerHTML=`<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">Couldn't load</div>`},onEmbedPlay:()=>d.add(f)}),a.appendChild(g)});const l=()=>{o&&(o.innerHTML=t.map((c,f)=>`
        <button data-dot-index="${f}" aria-label="Demo ${f+1}" class="p-1.5 -m-1.5 group touch-manipulation">
          <span class="block w-1 h-1 rounded-full transition-colors ${f===n?"bg-brand-400":"bg-slate-600 group-hover:bg-slate-500"}"></span>
        </button>`).join(""),o.querySelectorAll("[data-dot-index]").forEach(c=>{c.addEventListener("click",()=>{r(!0);const f=Number(c.dataset.dotIndex),g=a.children[f];g&&a.scrollTo({left:g.offsetLeft-a.offsetLeft,behavior:"smooth"})})}))},u=()=>{if(!i)return;const c=t[n],f=it(c),g=c.metadata?.creatorUrl,v=c.url;if(g){const $=Le(c),x=c.metadata?.channel;x?i.innerHTML=`${U($)} · <a href="${U(g)}" target="_blank" rel="noopener" class="hover:text-brand-400 transition-colors">${U(x)} ↗</a>`:i.innerHTML=`<a href="${U(g)}" target="_blank" rel="noopener" class="hover:text-brand-400 transition-colors">${U(f)} ↗</a>`}else v&&(c.type==="youtube"||c.type==="tiktok"||c.type==="vimeo")?i.innerHTML=`<a href="${v}" target="_blank" rel="noopener" class="hover:text-brand-400 transition-colors">${U(f)} ↗</a>`:i.textContent=f};let p=!1;a.addEventListener("scroll",()=>{p||(p=!0,requestAnimationFrame(()=>{p=!1;const c=a.children[0]?.offsetWidth||1,f=Math.round(a.scrollLeft/c);if(f!==n&&f>=0&&f<t.length){if(r(!0),d.has(n)){const g=a.children[n];g&&(d.delete(n),le(g,t[n],{onError:()=>{},onEmbedPlay:()=>d.add(n)}))}n=f,l(),u()}}))},{passive:!0}),requestAnimationFrame(()=>{const c=a.children[n];c&&(a.scrollLeft=c.offsetLeft-a.offsetLeft)}),l(),u()}function nt(e,t){return Math.max(0,Math.min(t-1,e))}function ot(e){const t={cloudinary:0,youtube:1,vimeo:2,tiktok:2,url:3,local:4};return[...e].sort((s,r)=>s.isPrimary&&!r.isPrimary?-1:r.isPrimary&&!s.isPrimary?1:(t[s.type]??99)-(t[r.type]??99))}function Le(e){return{cloudinary:e.format==="mp4"?"Video":"Demo",youtube:"YouTube",tiktok:"TikTok",vimeo:"Vimeo",local:"Demo",url:"External"}[e.type]||e.type}function it(e){const t=Le(e),s=e.metadata?.channel;return s?`${t} · ${s}`:e.notes?`${t} · ${e.notes}`:t}function U(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function lt(e,t){const s=document.createElement("article");s.className=`card overflow-hidden transition-all ${t.isCompleted?"opacity-60":""}`,s.dataset.itemIndex=String(t.index);const r=e.exercise?.demos||[],a=`${t.index+1}. ${e.name}`;if(s.innerHTML=`
    <div class="flex items-stretch">
      <button
        data-action="toggle"
        class="flex-1 min-w-0 px-4 py-4 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation"
      >
        <div class="flex-1 min-w-0">
          ${ct(e.tags)}
          <h3 class="font-semibold tracking-tight leading-tight ${t.isCompleted?"line-through text-slate-500":"text-slate-100"}">
            ${A(a)}
          </h3>
          <p class="text-sm text-slate-400 mt-1 num truncate">
            ${dt(e)}
          </p>
        </div>
        <svg class="w-4 h-4 text-slate-500 shrink-0 transition-transform ${t.isExpanded?"rotate-180":""}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <button
        data-action="complete"
        aria-label="${t.isCompleted?"Mark incomplete":"Mark complete"}"
        class="shrink-0 self-stretch px-4 flex items-center justify-center touch-manipulation active:bg-white/5 transition-colors"
      >
        <span class="w-7 h-7 rounded-full border-2 ${t.isCompleted?"bg-brand-500 border-brand-500":"border-slate-600"} flex items-center justify-center transition-colors">
          ${t.isCompleted?`
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          `:""}
        </span>
      </button>
    </div>
    <div data-region="content" class="${t.isExpanded?"":"hidden"}">
      <div class="px-4 pb-4 space-y-4">
        <div data-media-slot></div>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-slate-800/50 rounded-xl p-3 text-center overflow-hidden">
            <p class="${(e.reps||"").length>5?"text-lg":"text-3xl"} font-extrabold text-brand-400 leading-none num tracking-tight">${A(e.reps||"—")}</p>
            <p class="label-meta mt-1.5">${A(e.repUnits||"reps")}</p>
          </div>
          <div class="bg-slate-800/50 rounded-xl p-3 text-center overflow-hidden">
            <p class="${(e.sets||"").length>5?"text-lg":"text-3xl"} font-extrabold text-brand-400 leading-none num tracking-tight">${A(e.sets||"—")}</p>
            <p class="label-meta mt-1.5">sets</p>
          </div>
        </div>
        ${e.note?`
          <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
            <p class="text-sm text-slate-300 leading-relaxed">${A(e.note)}</p>
          </div>
        `:""}
        ${e.exercise?.purpose?.trim()?`
          <div class="text-sm text-slate-300 leading-relaxed">
            <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">Purpose</p>
            <p>${A(e.exercise.purpose)}</p>
          </div>
        `:""}
        ${e.exercise?.how_to?.trim()?`
          <div class="text-sm text-slate-300 leading-relaxed">
            <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">How to perform</p>
            <p class="whitespace-pre-line">${A(e.exercise.how_to)}</p>
          </div>
        `:""}
      </div>
    </div>
  `,t.isExpanded&&r.length>0){const o=s.querySelector("[data-media-slot]");o&&z(o,r)}return s.querySelector('[data-action="toggle"]')?.addEventListener("click",()=>{t.onToggle?.(t.index)}),s.querySelector('[data-action="complete"]')?.addEventListener("click",o=>{o.stopPropagation(),t.onComplete?.(t.index)}),s}function dt(e){const t=e.reps||"—",s=e.sets||"—";return`${t} · ${s} sets`}function ct(e=[]){return e.length?`
    <div class="flex gap-1.5 mb-1.5">
      ${e.map(t=>`
        <span class="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">${A(t)}</span>
      `).join("")}
    </div>
  `:""}function A(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const pt={superset:"Super Set",compound:"Compound",circuit:"Circuit"};function ut(e,t){const s=document.createElement("article");s.className=`transition-all ${t.isCompleted?"opacity-60":""}`,s.dataset.itemIndex=String(t.index);const r=pt[e.kind]||e.kind,n=t.index+1,a=e.exercises.map((o,i)=>{const d=String.fromCharCode(97+i),l=`${n}${d}. ${O(o.name)}`,u=i===0,p=i===e.exercises.length-1;return`
      <div class="card ${u?"rounded-t-2xl":"rounded-t-none"} ${p?"rounded-b-2xl":"rounded-b-none"} overflow-hidden ${u?"":"border-t-0"}">
        ${u?"":'<div class="h-px bg-slate-700/50"></div>'}
        <div class="flex items-stretch">
          <button
            data-action="toggle-member"
            data-member-idx="${i}"
            class="flex-1 min-w-0 px-4 py-4 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation"
          >
            <div class="flex-1 min-w-0">
              ${u?`<div class="flex gap-1.5 mb-1.5"><span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300">${r}</span></div>`:""}
              <h3 class="font-semibold tracking-tight leading-tight ${t.isCompleted?"line-through text-slate-500":"text-slate-100"}">
                ${l}
              </h3>
              <p class="text-sm text-slate-400 mt-1 num truncate">
                ${o.reps||"—"} · ${o.sets||"—"} sets
              </p>
            </div>
            <svg class="w-4 h-4 text-slate-500 shrink-0 transition-transform ${t.isExpanded?"rotate-180":""}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <button
            data-action="complete"
            aria-label="${t.isCompleted?"Mark incomplete":"Mark complete"}"
            class="shrink-0 self-stretch px-4 flex items-center justify-center touch-manipulation active:bg-white/5 transition-colors"
          >
            <span class="w-7 h-7 rounded-full border-2 ${t.isCompleted?"bg-brand-500 border-brand-500":"border-slate-600"} flex items-center justify-center transition-colors">
              ${t.isCompleted?'<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>':""}
            </span>
          </button>
        </div>
        <div data-region="member-content-${i}" class="${t.isExpanded?"":"hidden"}">
          <div class="px-4 pb-4 space-y-4">
            <div data-member-media="${i}"></div>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-slate-800/50 rounded-xl p-3 text-center overflow-hidden">
                <p class="${(o.reps||"").length>5?"text-lg":"text-3xl"} font-extrabold text-brand-400 leading-none num tracking-tight">${O(o.reps||"—")}</p>
                <p class="label-meta mt-1.5">${O(o.repUnits||"reps")}</p>
              </div>
              <div class="bg-slate-800/50 rounded-xl p-3 text-center overflow-hidden">
                <p class="${(o.sets||"").length>5?"text-lg":"text-3xl"} font-extrabold text-brand-400 leading-none num tracking-tight">${O(o.sets||"—")}</p>
                <p class="label-meta mt-1.5">sets</p>
              </div>
            </div>
            ${o.note?`
            <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
              <p class="text-sm text-slate-300 leading-relaxed">${O(o.note)}</p>
            </div>`:""}
          </div>
        </div>
      </div>
    `}).join("");return s.innerHTML=a,s.querySelectorAll('[data-action="toggle-member"]').forEach(o=>{o.addEventListener("click",()=>{t.onToggle?.(t.index)})}),s.querySelectorAll('[data-action="complete"]').forEach(o=>{o.addEventListener("click",i=>{i.stopPropagation(),t.onComplete?.(t.index)})}),t.isExpanded&&e.exercises.forEach((o,i)=>{const d=s.querySelector(`[data-member-media="${i}"]`),l=o.exercise?.demos||[];d&&l.length>0&&z(d,l)}),s}function O(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const de=["Nice work!","Killer moves!","Awesome job!","Crushed it!","You did it!","Beast mode!","On fire!","Way to go!","Strengthened and Conditioned!"];let ce=0;function mt(){const e=Date.now();if(e-ce<5e3)return;ce=e;const t=de[Math.floor(Math.random()*de.length)],s=document.createElement("div");s.className="celebration-flash";const r=document.createElement("div");r.className="celebration-text",r.textContent=t,document.body.appendChild(s),document.body.appendChild(r),setTimeout(()=>s.remove(),700),setTimeout(()=>r.remove(),3100)}async function xt(e,t){e.innerHTML=Y(`
    <main class="flex-1 px-6 pb-24 flex items-center justify-center">
      <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </main>
  `),K(e);try{const s=await Re(t);if(!s){gt(e,t);return}He(s.id),ft(e,s)}catch(s){bt(e,s)}}function ft(e,t){const s=we(t.id),r=t.resolvedItems.length;let n=-1;e.innerHTML=Y(`
    <div class="sticky top-15 z-10 px-6 pt-2 pb-3 bg-slate-950/85 backdrop-blur-md border-b border-slate-900">
      <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div data-region="progress-bar" class="h-full bg-linear-to-r from-brand-500 to-brand-400 transition-all duration-500" style="width: ${s.size/r*100}%"></div>
      </div>
      <p class="text-[11px] text-slate-500 mt-1.5 font-medium num">
        <span data-region="completed-count">${s.size}</span> of ${r} complete
      </p>
    </div>

    <header class="px-6 pt-4 pb-3">
      <h1 class="h-page">${I(t.title)}</h1>
      ${t.requirements?`
        <p class="text-sm text-slate-400 mt-1.5">${I(t.requirements)}</p>
      `:""}
      ${t.source?`
        <p class="text-xs text-slate-500 mt-2">
          Program by ${t.source.url?`<a href="${I(t.source.url)}" target="_blank" rel="noopener" class="text-slate-400 hover:text-brand-400 transition-colors">${I(t.source.name)} ↗</a>`:`<span class="text-slate-400">${I(t.source.name)}</span>`}${t.source.organization?` · ${I(t.source.organization)}`:""}
        </p>
      `:""}
    </header>

    <main class="flex-1 px-6 pb-32 pt-2">
      <ul data-region="items" class="space-y-2.5"></ul>

      <div data-region="actions" class="mt-8 space-y-3 hidden">
        <button data-action="reset" class="btn-ghost w-full text-slate-500 hover:text-red-400 text-sm">
          Reset progress
        </button>
      </div>

      <button data-action="share" class="btn-ghost w-full mt-6 flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
        </svg>
        <span>Share program</span>
      </button>
    </main>
  `,t.title),K(e);const a=e.querySelector('[data-region="items"]'),o=e.querySelector('[data-region="actions"]'),i=()=>{a.innerHTML="",t.resolvedItems.forEach((u,p)=>{const c=document.createElement("li"),f={index:p,isExpanded:p===n,isCompleted:s.has(p),onToggle:v=>{n=n===v?-1:v,l(),n===v&&requestAnimationFrame(()=>{const $=a.querySelector(`[data-item-index="${v}"]`);if($){const x=window.scrollY+$.getBoundingClientRect().top-130;window.scrollTo({top:Math.max(0,x),behavior:"smooth"})}})},onComplete:v=>{const $=s.size===r,x=Ne(t.id,v);s.clear(),x.forEach(k=>s.add(k)),x.has(v)&&n===v&&(n=-1),l(),!$&&s.size===r&&setTimeout(mt,250)}},g=u.kind==="single"?lt(u,f):ut(u,f);c.appendChild(g),a.appendChild(c)})},d=()=>{const u=e.querySelector('[data-region="progress-bar"]');u&&(u.style.width=`${s.size/r*100}%`);const p=e.querySelector('[data-region="completed-count"]');p&&(p.textContent=String(s.size)),o.classList.toggle("hidden",s.size===0)},l=()=>{i(),d()};l(),e.querySelector('[data-action="reset"]')?.addEventListener("click",()=>{confirm("Reset progress for this program?")&&(Ue(t.id),s.clear(),l())}),e.querySelector('[data-action="share"]')?.addEventListener("click",()=>{const u=window.location.href;navigator.share?navigator.share({title:t.title,text:`Check out: ${t.title}`,url:u}).catch(()=>{}):navigator.clipboard?.writeText(u).then(()=>alert("Link copied!")).catch(()=>prompt("Copy:",u))})}function Y(e,t="Program"){return`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400 truncate">${I(t)}</span>
      </header>
      ${e}
    </div>
  `}function K(e){e.querySelector('[data-action="back"]')?.addEventListener("click",()=>h("/programs"))}function gt(e,t){e.innerHTML=Y(`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold mb-2">Program not found</h2>
        <p class="text-sm text-slate-400">No program with id <code class="text-slate-300">${I(t)}</code>.</p>
      </div>
    </main>
  `),K(e)}function bt(e,t){e.innerHTML=Y(`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold text-red-400 mb-2">Couldn't load program</h2>
        <p class="text-sm text-slate-400">${I(t?.message||String(t))}</p>
      </div>
    </main>
  `),K(e)}function I(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function ht(e){e.innerHTML=`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400">Create</span>
      </header>

      <main class="flex-1 px-6 pb-24 pt-8">
        <h1 class="h-page mb-2">Studio</h1>
        <p class="text-sm text-slate-400 mb-8">Create new or edit existing.</p>

        <div class="space-y-3">
          <button
            data-action="new-program"
            class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center">
                <svg class="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight">Programs</h2>
                <p class="text-sm text-slate-400 mt-0.5">Create new or edit existing programs</p>
              </div>
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>

          <button
            data-action="new-exercise"
            class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up"
            style="animation-delay: 50ms"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center">
                <svg class="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight">Exercises</h2>
                <p class="text-sm text-slate-400 mt-0.5">Create new or edit existing exercises</p>
              </div>
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>

          <button
            data-action="ai-builder"
            class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up"
            style="animation-delay: 100ms"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
                <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight">AI Builder</h2>
                <p class="text-sm text-slate-400 mt-0.5">Chat with AI to build a program</p>
              </div>
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        </div>
      </main>
    </div>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>h("/")),e.querySelector('[data-action="new-program"]')?.addEventListener("click",()=>h("/studio/program")),e.querySelector('[data-action="new-exercise"]')?.addEventListener("click",()=>h("/studio/exercise")),e.querySelector('[data-action="ai-builder"]')?.addEventListener("click",()=>h("/studio/ai"))}let _=null;async function vt(){if(_)return _;const{exercises:e}=await N();return _=e.map(t=>({id:t.id,name:t.name,hasDemos:(t.demos||[]).length>0,tokens:B(t.name).concat((t.aliases||[]).flatMap(s=>B(s))).concat(B(t.id.replace(/[-_]/g," "))),exercise:t})),_}function yt(e){_&&_.push({id:e.id,name:e.name,hasDemos:(e.demos||[]).length>0,tokens:B(e.name).concat((e.aliases||[]).flatMap(t=>B(t))).concat(B(e.id.replace(/[-_]/g," "))),exercise:e})}async function Z(e,t=10){const s=await vt();if(!e||!e.trim())return s.slice(0,t);const r=B(e);return s.map(n=>({...n,score:kt(n.tokens,r)})).filter(n=>n.score>0).sort((n,a)=>a.score-n.score).slice(0,t)}function wt(e,t={}){e.innerHTML=`
    <div class="space-y-3">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          data-input="search"
          type="text"
          placeholder="Search exercises..."
          class="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-colors"
        />
      </div>
      <ul data-region="results" class="space-y-1 max-h-[300px] overflow-y-auto hidden"></ul>
      <div data-region="empty" class="hidden text-center py-4">
        <p class="text-sm text-slate-400">No exercises match that name.</p>
      </div>
      <button data-action="create-new" class="hidden w-full py-2.5 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">+ Create new exercise</button>
    </div>
  `;const s=e.querySelector('[data-input="search"]'),r=e.querySelector('[data-region="results"]'),n=e.querySelector('[data-region="empty"]'),a=e.querySelector('[data-action="create-new"]');let o=null;const i=(l,u)=>{if(!u||!u.trim()){r.classList.add("hidden"),n.classList.add("hidden"),a.classList.add("hidden");return}if(a.classList.remove("hidden"),l.length===0){r.classList.add("hidden"),n.classList.remove("hidden");return}n.classList.add("hidden"),r.classList.remove("hidden"),r.innerHTML=l.map(p=>`
      <li>
        <button
          data-exercise-id="${p.id}"
          class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800/60 active:bg-slate-800 transition-colors flex items-center gap-3 touch-manipulation"
        >
          <span class="flex-1 min-w-0">
            <span class="text-sm font-medium text-slate-100 block truncate">${$t(p.name)}</span>
          </span>
          ${p.hasDemos?`
            <span class="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-sm">demo</span>
          `:""}
        </button>
      </li>
    `).join(""),r.querySelectorAll("[data-exercise-id]").forEach(p=>{p.addEventListener("click",()=>{const c=l.find(f=>f.id===p.dataset.exerciseId);c&&t.onSelect?.(c.exercise)})})},d=async()=>{const l=s.value,u=await Z(l);i(u,l)};s.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(d,150)}),i([],""),a?.addEventListener("click",()=>t.onCreateNew?.(s.value.trim()))}function B(e){return e?e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().split(/[^a-z0-9]+/).filter(t=>t.length>0):[]}function kt(e,t){let s=0;for(const r of t){let n=0;for(const a of e)a===r?n=Math.max(n,10):a.startsWith(r)?n=Math.max(n,7):a.includes(r)&&(n=Math.max(n,4));if(n===0)return 0;s+=n}return s}function $t(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const Q=[{value:"youtube",label:"YouTube",fields:["url","startTime","endTime","notes"]},{value:"cloudinary",label:"Cloudinary",fields:["url","startTime","endTime","notes"]},{value:"local",label:"Local file",fields:["url","notes"]},{value:"url",label:"URL (external)",fields:["url","notes"]},{value:"tiktok",label:"TikTok",fields:["url","notes"]},{value:"vimeo",label:"Vimeo",fields:["url","startTime","endTime","notes"]}];function oe(e,t){s();function s(){e.innerHTML=`
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-[10px] text-slate-500 uppercase font-semibold">Demo Sources</label>
          <span class="text-[10px] text-slate-500 num">${t.length} demo${t.length!==1?"s":""}</span>
        </div>
        ${t.length===0?'<p class="text-xs text-slate-500 italic">No demos yet. Add one below.</p>':""}
        <div class="space-y-3">
          ${t.map((a,o)=>r(a,o)).join("")}
        </div>
        <button data-action="add-demo" class="w-full border border-dashed border-slate-700 rounded-xl py-2.5 text-sm text-slate-400 hover:text-brand-400 hover:border-brand-500/50 transition-colors touch-manipulation">
          + Add demo
        </button>
      </div>
    `,n()}function r(a,o){const d=(Q.find(u=>u.value===a.type)||Q[0]).fields.includes("startTime"),l=a.type==="youtube"?St(a.url):null;return`
      <div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 space-y-2.5" data-demo-index="${o}">
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-slate-500 font-bold num">#${o+1}</span>
          <select data-demo-field="type" data-index="${o}" class="flex-1 bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-brand-500">
            ${Q.map(u=>`<option value="${u.value}"${a.type===u.value?" selected":""}>${u.label}</option>`).join("")}
          </select>
          <label class="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer select-none">
            <input type="radio" name="primary-demo" data-index="${o}" ${a.isPrimary?"checked":""} class="w-3 h-3 text-brand-500"/>
            <span>Primary</span>
          </label>
          <button data-action="remove-demo" data-index="${o}" class="p-1 rounded-sm hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors" aria-label="Remove demo">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div>
          <input data-demo-field="url" data-index="${o}" value="${ue(a.url||"")}" placeholder="https://..." class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500 font-mono"/>
        </div>
        ${l?`<img src="${l}" alt="Thumbnail" class="w-full h-20 object-cover rounded-lg bg-slate-900"/>`:""}
        ${d?`
          <div class="grid grid-cols-2 gap-2">
            <div><label class="text-[10px] text-slate-500 block mb-0.5">Start (sec)</label>
              <input data-demo-field="startTime" data-index="${o}" type="number" min="0" value="${a.startTime||0}" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-brand-500 num"/></div>
            <div><label class="text-[10px] text-slate-500 block mb-0.5">End (sec)</label>
              <input data-demo-field="endTime" data-index="${o}" type="number" min="0" value="${a.endTime||0}" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-brand-500 num"/></div>
          </div>
        `:""}
        <div>
          <input data-demo-field="notes" data-index="${o}" value="${ue(a.notes||"")}" placeholder="Notes (optional)" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/>
        </div>
      </div>
    `}function n(){e.querySelector('[data-action="add-demo"]')?.addEventListener("click",()=>{t.push({type:"youtube",mediaType:"video",format:"youtube",url:"",startTime:0,endTime:0,isPrimary:t.length===0,notes:""}),s()}),e.querySelectorAll('[data-action="remove-demo"]').forEach(a=>{a.addEventListener("click",()=>{const o=+a.dataset.index,i=t[o].isPrimary;t.splice(o,1),i&&t.length>0&&(t[0].isPrimary=!0),s()})}),e.querySelectorAll('input[name="primary-demo"]').forEach(a=>{a.addEventListener("change",()=>{const o=+a.dataset.index;t.forEach((i,d)=>{i.isPrimary=d===o})})}),e.querySelectorAll('[data-demo-field="type"]').forEach(a=>{a.addEventListener("change",()=>{const o=+a.dataset.index;t[o].type=a.value,t[o].format=a.value==="youtube"?"youtube":a.value==="cloudinary"?pe(t[o].url):a.value,t[o].mediaType="video",s()})}),e.querySelectorAll("[data-demo-field]").forEach(a=>{if(a.tagName==="SELECT")return;const o=()=>{const i=+a.dataset.index,d=a.dataset.demoField;d==="startTime"||d==="endTime"?t[i][d]=Number(a.value)||0:t[i][d]=a.value,d==="url"&&t[i].type==="cloudinary"&&(t[i].format=pe(a.value))};a.addEventListener("input",o),a.addEventListener("change",o)})}}function St(e){if(!e)return null;const t=e.match(/(?:v=|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);return t?`https://img.youtube.com/vi/${t[1]}/hqdefault.jpg`:null}function pe(e){return e&&/\.(mp4|webm|mov)(\?|$)/i.test(e)?"mp4":"gif"}function ue(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Et(e,t,s){const{items:r}=t;if(r.length===0){e.innerHTML="";return}e.innerHTML=r.map((n,a)=>n.type==="group"?qt(n,a,t):Lt(n,a,t)).join(""),Tt(e,t,s)}function Lt(e,t,s){const r=s.expandedIndex===t,n=e.exerciseNote||"",a=n.length>50?n.substring(0,50)+"…":n,o=(e.tags||[]).map(i=>`<span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-300">${i}</span>`).join("");return`<li class="card" data-idx="${t}" data-type="single">
  <div class="flex items-center px-4 py-3 gap-2 relative">
    <div class="flex-1 min-w-0 cursor-pointer" data-action="expand" data-idx="${t}">
      ${o?`<div class="flex gap-1 mb-1">${o}</div>`:""}
      <p class="text-sm font-medium text-slate-100 truncate">${W(e.exerciseName)}</p>
      <p class="text-xs text-slate-400 num mt-0.5">${e.reps||"—"} ${e.repUnits||"reps"} · ${e.sets||"—"} sets</p>
      ${a?`<p class="text-[11px] text-slate-500 truncate mt-0.5 italic">${W(a)}</p>`:""}
    </div>
    ${qe(t)}
  </div>
  ${r?`<div class="border-t border-slate-800" data-region="edit-form" data-idx="${t}"></div>`:""}
</li>`}function qt(e,t,s){const r=s.expandedIndex===t,n={superset:"Superset",compound:"Compound",circuit:"Circuit"}[e.kind]||e.kind,a=e.members.map((o,i)=>`
    <div class="flex items-center px-4 py-2.5 gap-2 ${i>0?"border-t border-slate-800/50":""}">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-100 truncate">${W(o.exerciseName)}</p>
        <p class="text-xs text-slate-400 num mt-0.5">${o.reps||"—"} ${o.repUnits||"reps"} · ${o.sets||"—"} sets</p>
      </div>
      ${r?`<div class="flex gap-0.5">
        <button data-action="member-up" data-idx="${t}" data-mi="${i}" class="p-1 rounded text-slate-600 hover:text-slate-300 ${i===0?"opacity-20 pointer-events-none":""}" aria-label="Move up"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg></button>
        <button data-action="member-down" data-idx="${t}" data-mi="${i}" class="p-1 rounded text-slate-600 hover:text-slate-300 ${i===e.members.length-1?"opacity-20 pointer-events-none":""}" aria-label="Move down"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></button>
        <button data-action="member-remove" data-idx="${t}" data-mi="${i}" class="p-1 rounded text-slate-600 hover:text-red-400" aria-label="Remove from group"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
      </div>`:""}
    </div>
  `).join("");return`<li class="card border-l-[3px] border-l-brand-500" data-idx="${t}" data-type="group">
  <div class="flex items-center px-4 py-2 gap-2 bg-brand-500/5 relative">
    <div class="flex-1 min-w-0 cursor-pointer" data-action="expand" data-idx="${t}">
      <span class="text-[10px] font-bold uppercase tracking-wide text-brand-300">${n}</span>
      <span class="text-[10px] text-slate-500 num ml-2">${e.members.length} exercises</span>
    </div>
    ${qe(t)}
  </div>
  ${a}
  ${r?`<div class="border-t border-slate-800" data-region="edit-form" data-idx="${t}"></div>`:""}
</li>`}function qe(e){return`<button data-action="menu" data-idx="${e}" class="relative z-10 p-3 -mr-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation shrink-0" aria-label="Actions">
    <svg class="w-5 h-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
  </button>`}function Ct(e,t,s,r){Mt();const n=s.items[t],a=n.type==="group",o=s.items.length,i=t>0?s.items[t-1]:null,d=t<o-1?s.items[t+1]:null;let l="";a?(l+=E("edit","Edit group"),t>0&&(l+=E("move-up","Move up")),t<o-1&&(l+=E("move-down","Move down")),i?.type==="single"&&(l+=E("group-above","Add above to group")),d?.type==="single"&&(l+=E("group-below","Add below to group")),l+=E("ungroup","Ungroup")):(l+=E("edit","Edit"),t>0&&(l+=E("move-up","Move up")),t<o-1&&(l+=E("move-down","Move down")),i?.type==="single"?l+=E("group-above","Group with above"):i?.type==="group"&&(l+=E("group-above","Join group above")),d?.type==="single"?l+=E("group-below","Group with below"):d?.type==="group"&&(l+=E("group-below","Join group below"))),l+=E("remove","Remove","text-red-400");const u=a?n.members.map(c=>c.exerciseName).join(" + "):n.exerciseName||"Item",p=document.createElement("div");p.dataset.region="action-menu",p.className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-fade-in",p.innerHTML=`
    <div class="bg-slate-900 border-t border-slate-700 rounded-t-2xl w-full max-w-sm pb-8 pt-3 px-2">
      <div class="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-3"></div>
      <p class="text-xs text-slate-500 text-center mb-2 px-4 truncate">${W(u)}</p>
      <div class="space-y-0.5">${l}</div>
      <button data-menu-action="cancel" class="w-full mt-2 py-3 text-sm text-slate-500 hover:text-slate-300 transition-colors">Cancel</button>
    </div>
  `,document.body.appendChild(p),p.querySelectorAll("[data-menu-action]").forEach(c=>{c.addEventListener("click",f=>{f.stopPropagation();const g=c.dataset.menuAction;p.remove(),g!=="cancel"&&jt(g,t,s,r)})}),p.addEventListener("click",c=>{c.target===p&&p.remove()})}function E(e,t,s=""){return`<button data-menu-action="${e}" class="w-full text-left px-5 py-3 text-sm font-medium rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors ${s}">${t}</button>`}function Mt(){document.querySelectorAll('[data-region="action-menu"]').forEach(e=>e.remove())}function jt(e,t,s,r,n){const a=s.items[t],o=t>0?s.items[t-1]:null,i=t<s.items.length-1?s.items[t+1]:null;switch(e){case"edit":r.onEdit?.(t);break;case"move-up":r.onMove?.(t,t-1);break;case"move-down":r.onMove?.(t,t+1);break;case"group-above":o?.type==="group"?r.onJoinGroup?.(t,t-1):a.type==="group"&&o?.type==="single"?r.onAbsorbIntoGroup?.(t,t-1):me(t,"above",r);break;case"group-below":i?.type==="group"?r.onJoinGroup?.(t,t+1):a.type==="group"&&i?.type==="single"?r.onAbsorbIntoGroup?.(t,t+1):me(t,"below",r);break;case"ungroup":r.onUngroup?.(t);break;case"remove":r.onRemove?.(t);break}}function me(e,t,s){const r=document.createElement("div");r.dataset.region="kind-picker",r.className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in",r.innerHTML=`
    <div class="bg-slate-900 border-t border-slate-700 rounded-t-2xl w-full max-w-sm p-5 space-y-4 pb-8">
      <p class="text-sm font-medium text-slate-200 text-center">Group type</p>
      <div class="flex gap-2">
        <button data-kind="superset" class="flex-1 py-3 rounded-xl text-sm font-medium bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 active:scale-95 transition-all">Superset</button>
        <button data-kind="compound" class="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all">Compound</button>
        <button data-kind="circuit" class="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all">Circuit</button>
      </div>
      <button data-action="cancel-kind" class="w-full py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">Cancel</button>
    </div>
  `,document.body.appendChild(r),r.querySelectorAll("[data-kind]").forEach(n=>{n.addEventListener("click",()=>{r.remove(),s.onGroup?.(e,t,n.dataset.kind)})}),r.querySelector('[data-action="cancel-kind"]')?.addEventListener("click",()=>r.remove()),r.addEventListener("click",n=>{n.target===r&&r.remove()})}function Tt(e,t,s){e.querySelectorAll('[data-action="expand"]').forEach(r=>{r.addEventListener("click",()=>s.onEdit?.(+r.dataset.idx))}),e.querySelectorAll('[data-action="menu"]').forEach(r=>{r.addEventListener("click",n=>{n.stopPropagation(),Ct(e,+r.dataset.idx,t,s)})}),e.querySelectorAll('[data-action="member-up"]').forEach(r=>{r.addEventListener("click",n=>{n.stopPropagation(),s.onMemberMove?.(+r.dataset.idx,+r.dataset.mi,+r.dataset.mi-1)})}),e.querySelectorAll('[data-action="member-down"]').forEach(r=>{r.addEventListener("click",n=>{n.stopPropagation(),s.onMemberMove?.(+r.dataset.idx,+r.dataset.mi,+r.dataset.mi+1)})}),e.querySelectorAll('[data-action="member-remove"]').forEach(r=>{r.addEventListener("click",n=>{n.stopPropagation(),s.onMemberRemove?.(+r.dataset.idx,+r.dataset.mi)})})}function W(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let m=Ce(),b=-1;function Ce(){return{meta:{title:"",id:"",requirements:"",description:"",difficulty:"",duration:""},items:[],newExercises:[]}}function Pt(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/_+$/g,"")}function It(e){e.innerHTML=`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400">Programs</span>
      </header>
      <main class="flex-1 px-6 pb-24 pt-8">
        <h1 class="h-page mb-2">Program Studio</h1>
        <p class="text-sm text-slate-400 mb-8">What would you like to do?</p>
        <div class="space-y-3">
          <button data-action="start-fresh" class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
                <svg class="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight text-sm">Create new program</h2>
                <p class="text-xs text-slate-400 mt-0.5">Start from scratch</p>
              </div>
            </div>
          </button>
          <button data-action="edit-existing" class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up" style="animation-delay:50ms">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight text-sm">Edit existing program</h2>
                <p class="text-xs text-slate-400 mt-0.5">Modify an existing program</p>
              </div>
            </div>
          </button>
          <button data-action="clone-existing" class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up" style="animation-delay:100ms">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight text-sm">Clone existing program</h2>
                <p class="text-xs text-slate-400 mt-0.5">Copy as a starting point for a new one</p>
              </div>
            </div>
          </button>
        </div>
      </main>
    </div>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>h("/studio")),e.querySelector('[data-action="start-fresh"]')?.addEventListener("click",()=>{X(e,null,!1)}),e.querySelector('[data-action="edit-existing"]')?.addEventListener("click",async()=>{const t=await xe();t&&X(e,t,!0)}),e.querySelector('[data-action="clone-existing"]')?.addEventListener("click",async()=>{const t=await xe();t&&X(e,t,!1)})}function X(e,t,s){m=Ce(),b=-1,e.innerHTML=`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span data-region="header-title" class="text-sm font-medium text-slate-400 flex-1">${t?s?"Edit: "+q(t.title):"New (from "+q(t.title)+")":"New Program"}</span>
      </header>
      <main class="flex-1 px-6 pb-32 pt-6 space-y-8">
        <section class="space-y-4">
          <h2 class="eyebrow">Program Details</h2>
          <div class="space-y-3">
            <div>
              <label class="text-xs text-slate-400 mb-1 block">Title *</label>
              <input data-field="title" type="text" placeholder="e.g. Lower Body Rebuild A"
                class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30" />
              <p data-region="id-preview" class="text-[11px] text-slate-500 mt-1 font-mono"></p>
            </div>
            <div>
              <label class="text-xs text-slate-400 mb-1 block">Requirements</label>
              <input data-field="requirements" type="text" placeholder="e.g. Dumbbells, Bench"
                class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30" />
            </div>
          </div>
        </section>
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="eyebrow">Exercises</h2>
            <span data-region="item-count" class="text-[11px] text-slate-500 num">0 items</span>
          </div>
          <ul data-region="timeline" class="space-y-2"></ul>
          <div data-region="empty-timeline" class="card p-6 text-center">
            <p class="text-sm text-slate-400">No exercises yet. Search below to add.</p>
          </div>
        </section>
        <section class="space-y-3">
          <h2 class="eyebrow">Add Exercise</h2>
          <div data-region="picker"></div>
        </section>

        <!-- Export -->
        <section data-region="export-section" class="hidden space-y-3 pt-4 border-t border-slate-800">
          <h2 class="eyebrow">Export</h2>
          <div class="flex gap-3">
            <button data-action="preview" class="btn-ghost flex-1 text-sm border border-slate-700">Preview</button>
            <button data-action="export" class="btn-primary flex-1 text-sm">Export JSON</button>
          </div>
        </section>
      </main>

      <!-- Export modal -->
      <div data-region="export-modal" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center">
        <div class="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="h-section">Export</h2>
            <button data-action="close-export" class="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors" aria-label="Close">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div data-region="export-content" class="space-y-4"></div>
        </div>
      </div>

      <!-- Exercise creation slide-over -->
      <div data-region="exercise-slideover" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center">
        <div class="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-5">
          <div class="flex items-center justify-between">
            <h2 class="h-section">New Exercise</h2>
            <button data-action="close-exercise" class="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors" aria-label="Close">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="space-y-3">
            <div>
              <label class="text-xs text-slate-400 mb-1 block">Exercise Name *</label>
              <input data-exfield="name" type="text" placeholder="e.g. Backward Treadmill Walk" class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"/>
              <p data-region="ex-id-preview" class="text-[11px] text-slate-500 mt-1 font-mono"></p>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Reps</label>
                <input data-exfield="reps" type="text" placeholder="10" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
              <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Sets</label>
                <input data-exfield="sets" type="text" placeholder="3" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
              <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Units</label>
                <select data-exfield="repUnits" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500">
                  <option value="reps">reps</option><option value="secs">secs</option><option value="min">min</option><option value="yd">yd</option><option value="rep">rep</option><option value="reps (each side)">reps (each side)</option><option value="secs (each side)">secs (each side)</option>
                </select></div>
            </div>
            <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Note</label>
              <input data-exfield="note" type="text" placeholder="Form cues, weight, etc." class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/></div>
          </div>
          <div data-region="demo-manager"></div>
          <div class="flex gap-3 pt-2">
            <button data-action="cancel-exercise" class="btn-ghost flex-1 text-sm">Cancel</button>
            <button data-action="save-exercise" class="btn-primary flex-1 text-sm">Save Exercise</button>
          </div>
        </div>
      </div>
    </div>
  `,At(e),Bt(e),Nt(e),L(e),Ot(e),zt(),t&&_t(e,t,s)}function At(e){e.querySelector('[data-action="back"]')?.addEventListener("click",()=>h("/studio"))}function Bt(e){const t=e.querySelector('[data-field="title"]'),s=e.querySelector('[data-field="requirements"]'),r=e.querySelector('[data-region="id-preview"]'),n=e.querySelector('[data-region="export-section"]');t?.addEventListener("input",()=>{m.meta.title=t.value,m.meta.id=Pt(t.value),r.textContent=m.meta.id?`id: ${m.meta.id}`:"",n?.classList.toggle("hidden",!m.meta.title.trim()||m.items.length===0)}),s?.addEventListener("input",()=>{m.meta.requirements=s.value})}function Nt(e){const t=e.querySelector('[data-region="picker"]');wt(t,{onSelect:s=>{m.items.push({type:"single",exerciseId:s.id,exerciseName:s.name,exerciseNote:s.recommendations?.note||"",reps:s.recommendations?.reps||"",sets:s.recommendations?.sets||"",repUnits:s.recommendations?.repUnits||"reps",note:"",tags:[]}),L(e)},onCreateNew:s=>{Rt(e,s)}})}function L(e){const t=e.querySelector('[data-region="timeline"]'),s=e.querySelector('[data-region="empty-timeline"]'),r=e.querySelector('[data-region="item-count"]'),n=e.querySelector('[data-region="export-section"]');if(t){if(r.textContent=`${m.items.length} item${m.items.length!==1?"s":""}`,m.items.length===0){t.classList.add("hidden"),s.classList.remove("hidden"),n?.classList.add("hidden");return}if(t.classList.remove("hidden"),s.classList.add("hidden"),n?.classList.toggle("hidden",!m.meta.title.trim()),Et(t,{items:m.items,expandedIndex:b},{onEdit:a=>{b=b===a?-1:a,L(e)},onRemove:a=>{m.items.splice(a,1),b===a?b=-1:b>a&&b--,L(e)},onMove:(a,o)=>{const[i]=m.items.splice(a,1);m.items.splice(o,0,i),b===a?b=o:a<b&&o>=b?b--:a>b&&o<=b&&b++,L(e)},onGroup:(a,o,i)=>{const d=o==="above"?a-1:a+1,l=Math.min(a,d),u=[m.items[l],m.items[l+1]],p={type:"group",kind:i,note:"",tags:[],members:u};m.items.splice(l,2,p),b=-1,L(e)},onJoinGroup:(a,o)=>{const i=m.items[a];m.items[o].members.push(i),m.items.splice(a,1),b=-1,L(e)},onAbsorbIntoGroup:(a,o)=>{const i=m.items[o],d=m.items[a];o<a?d.members.unshift(i):d.members.push(i),m.items.splice(o,1),b=-1,L(e)},onMemberMove:(a,o,i)=>{const d=m.items[a];if(!d||d.type!=="group")return;const[l]=d.members.splice(o,1);d.members.splice(i,0,l),L(e)},onMemberRemove:(a,o)=>{const i=m.items[a];if(!i||i.type!=="group")return;const[d]=i.members.splice(o,1);if(i.members.length<=1){const l=i.members[0]||d;l.type="single",m.items.splice(a,1,l)}b=-1,L(e)},onUngroup:a=>{const o=m.items[a];if(o.type!=="group")return;const i=o.members.map(d=>({...d,type:"single"}));m.items.splice(a,1,...i),b=-1,L(e)}}),b>=0&&b<m.items.length){const a=t.querySelector(`[data-region="edit-form"][data-idx="${b}"]`);a&&Ut(a,m.items[b],b,e)}}}function Ut(e,t,s,r){const n=["reps","secs","min","yd","rep","reps (each side)","secs (each side)"],a=["warmup","stretch"];e.innerHTML=`
    <div class="px-4 pb-4 pt-3 space-y-3 bg-slate-900/40">
      <div data-demo-preview="${s}"></div>
      <div class="grid grid-cols-3 gap-2">
        <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Reps</label>
          <input data-edit="reps" value="${q(t.reps||"")}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
        <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Sets</label>
          <input data-edit="sets" value="${q(t.sets||"")}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
        <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Units</label>
          <select data-edit="repUnits" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500">
            ${n.map(i=>`<option value="${i}"${(t.repUnits||"reps")===i?" selected":""}>${i}</option>`).join("")}
          </select></div>
      </div>
      <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Note</label>
        <input data-edit="note" value="${q(t.note||"")}" placeholder="Form cues, weight, etc." class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/></div>
      <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Tags</label>
        <div class="flex gap-2">${a.map(i=>`
          <button type="button" data-pill="${i}" class="px-3 py-1.5 rounded-full text-xs font-medium transition-all ${(t.tags||[]).includes(i)?"bg-brand-500 text-white":"bg-slate-800 text-slate-400 hover:bg-slate-700"}">${i}</button>`).join("")}
        </div></div>
    </div>
  `,e.querySelectorAll("[data-edit]").forEach(i=>{const d=()=>{t[i.dataset.edit]=i.value};i.addEventListener("input",d),i.addEventListener("change",d)}),e.querySelectorAll("[data-pill]").forEach(i=>{i.addEventListener("click",()=>{t.tags||(t.tags=[]);const d=i.dataset.pill;t.tags.includes(d)?t.tags=t.tags.filter(l=>l!==d):t.tags.push(d),L(r)})});const o=e.querySelector(`[data-demo-preview="${s}"]`);o&&t.exerciseId&&Ht(o,t.exerciseId)}function q(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Ht(e,t){const{exercises:s}=await N(),r=s.find(o=>o.id===t),n=m.newExercises.find(o=>o.id===t),a=r?.demos||n?.demos||[];if(a.length===0){e.innerHTML='<p class="text-[11px] text-slate-600 italic">No demos available</p>';return}z(e,a)}async function xe(){const{programs:e}=await R(),t=prompt(`Type part of a program name:

`+e.map(r=>`• ${r.title}`).join(`
`));if(!t)return null;const s=e.find(r=>r.title.toLowerCase().includes(t.toLowerCase()));return s||(alert('No program found matching "'+t+'"'),null)}function _t(e,t,s){m.meta.title=s?t.title:"",m.meta.id=s?t.id:"",m.meta.requirements=t.requirements||"",m.items=(t.items||[]).map(n=>n.kind?{type:"group",kind:n.kind,note:n.note||"",tags:n.tags||[],members:n.exercises.map(a=>({type:"single",exerciseId:a.exerciseId,exerciseName:a.exerciseId,reps:a.reps||"",sets:a.sets||"",repUnits:a.repUnits||"reps",note:a.note||"",tags:[]}))}:{type:"single",exerciseId:n.exerciseId,exerciseName:n.exerciseId,exerciseNote:n.note||"",reps:n.reps||"",sets:n.sets||"",repUnits:n.repUnits||"reps",note:n.note||"",tags:n.tags||[]}),b=-1;const r=e.querySelector('[data-field="title"]');r.value=m.meta.title,r.dispatchEvent(new Event("input")),e.querySelector('[data-field="requirements"]').value=m.meta.requirements,s&&(e.querySelector('[data-region="header-title"]').textContent=`Edit: ${t.title}`),L(e)}let ee=!1;function zt(){if(ee)return;ee=!0;const e=s=>{(m.items.length>0||m.meta.title)&&(s.preventDefault(),s.returnValue="")};window.addEventListener("beforeunload",e);const t=()=>{window.removeEventListener("beforeunload",e),window.removeEventListener("hashchange",t),ee=!1};window.addEventListener("hashchange",t)}let te=[];function Rt(e,t=""){const s=e.querySelector('[data-region="exercise-slideover"]');if(!s)return;te=[],s.querySelector('[data-exfield="name"]').value=t,s.querySelector('[data-exfield="reps"]').value="",s.querySelector('[data-exfield="sets"]').value="",s.querySelector('[data-exfield="repUnits"]').value="reps",s.querySelector('[data-exfield="note"]').value="";const r=t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,"");s.querySelector('[data-region="ex-id-preview"]').textContent=r?`id: ${r}`:"";const n=s.querySelector('[data-region="demo-manager"]');oe(n,te);const a=s.querySelector('[data-exfield="name"]'),o=s.querySelector('[data-region="ex-id-preview"]');a.addEventListener("input",()=>{const d=a.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,"");o.textContent=d?`id: ${d}`:""}),s.querySelector('[data-action="save-exercise"]')?.addEventListener("click",async()=>{const d=a.value.trim();if(!d){a.focus();return}const l=d.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,""),{exercises:u}=await N(),p=u.find(x=>x.id===l||x.name.toLowerCase()===d.toLowerCase());if(p&&!confirm(`An exercise named "${p.name}" already exists (id: ${p.id}).

Do you still want to create "${d}"?`))return;const c=s.querySelector('[data-exfield="reps"]').value,f=s.querySelector('[data-exfield="sets"]').value,g=s.querySelector('[data-exfield="repUnits"]').value,v=s.querySelector('[data-exfield="note"]').value,$={id:l,name:d,demos:te.filter(x=>x.url),recommendations:{}};c&&($.recommendations.reps=c),f&&($.recommendations.sets=f),g&&g!=="reps"&&($.recommendations.repUnits=g),v&&($.recommendations.note=v),m.newExercises.push($),yt($),m.items.push({type:"single",exerciseId:l,exerciseName:d,exerciseNote:v||"",reps:c||"",sets:f||"",repUnits:g||"reps",note:"",tags:[]}),s.classList.add("hidden"),L(e)},{once:!0});const i=()=>s.classList.add("hidden");s.querySelector('[data-action="cancel-exercise"]')?.addEventListener("click",i,{once:!0}),s.querySelector('[data-action="close-exercise"]')?.addEventListener("click",i,{once:!0}),s.classList.remove("hidden")}function Ot(e){const t=e.querySelector('[data-region="export-modal"]');e.querySelector('[data-action="export"]')?.addEventListener("click",()=>{Gt(e)}),e.querySelector('[data-action="close-export"]')?.addEventListener("click",()=>{t?.classList.add("hidden")}),t?.addEventListener("click",s=>{s.target===t&&t.classList.add("hidden")}),e.querySelector('[data-action="preview"]')?.addEventListener("click",()=>{Dt(e)})}function Dt(e){const t=Me(),s=t.items||[],r=`
    <div class="fixed inset-0 z-50 bg-slate-950 overflow-y-auto">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="close-preview" class="btn-ghost -ml-2 px-3" aria-label="Close preview">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400">Preview</span>
      </header>
      <div class="px-6 pt-4 pb-3">
        <h1 class="h-page">${q(t.title||"Untitled")}</h1>
        ${t.requirements?`<p class="text-sm text-slate-400 mt-1.5">${q(t.requirements)}</p>`:""}
      </div>
      <div class="px-6 pb-24 pt-2">
        <ul class="space-y-2.5">
          ${s.map((a,o)=>Ft(a)).join("")}
        </ul>
      </div>
    </div>
  `,n=document.createElement("div");n.innerHTML=r,e.appendChild(n.firstElementChild),e.querySelector('[data-action="close-preview"]')?.addEventListener("click",()=>{e.querySelector(".fixed.inset-0.z-50.bg-slate-950")?.remove()})}function Ft(e,t){if(e.kind)return`<li class="card p-4 space-y-2">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-brand-500/20 text-brand-300">${{superset:"Super Set",compound:"Compound",circuit:"Circuit"}[e.kind]||e.kind}</span>
      </div>
      <p class="text-sm font-semibold text-slate-100">${q(e.exercises.map(n=>n.exerciseId).join(" + "))}</p>
      <div class="space-y-1.5 pl-3 border-l-2 border-slate-700">
        ${e.exercises.map((n,a)=>`
          <div class="text-xs text-slate-300">${a+1}. ${q(n.exerciseId)} — ${n.reps||"—"} ${n.repUnits||"reps"} · ${n.sets||"—"} sets</div>
        `).join("")}
      </div>
    </li>`;const s=e.tags?.length?e.tags.map(r=>`<span class="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">${r}</span>`).join(""):"";return`<li class="card px-4 py-3">
    ${s?`<div class="flex gap-1.5 mb-1">${s}</div>`:""}
    <p class="text-sm font-semibold text-slate-100">${q(e.exerciseId)}</p>
    <p class="text-xs text-slate-400 num mt-0.5">${e.reps||"—"} ${e.repUnits||"reps"} · ${e.sets||"—"} sets</p>
    ${e.note?`<p class="text-xs text-slate-500 mt-1">${q(e.note)}</p>`:""}
  </li>`}function Gt(e){const t=e.querySelector('[data-region="export-modal"]'),s=e.querySelector('[data-region="export-content"]');if(!t||!s)return;const r=Me(),n=[];m.newExercises.length>0&&n.push({label:"New Exercises (append to exercises.json → exercises[])",json:m.newExercises}),n.push({label:"Program (append to workouts.json → programs[])",json:r}),s.innerHTML=n.map((a,o)=>`
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-xs text-slate-400 font-medium">${a.label}</p>
        <button data-action="copy-json" data-section="${o}" class="text-xs text-brand-400 hover:text-brand-300 transition-colors">Copy</button>
      </div>
      <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono leading-relaxed"><code>${q(JSON.stringify(a.json,null,2))}</code></pre>
    </div>
  `).join(""),s.querySelectorAll('[data-action="copy-json"]').forEach(a=>{a.addEventListener("click",()=>{const o=+a.dataset.section,i=JSON.stringify(n[o].json,null,2);navigator.clipboard?.writeText(i).then(()=>{a.textContent="✓ Copied",setTimeout(()=>{a.textContent="Copy"},2e3)}).catch(()=>{prompt("Copy:",i)})})}),t.classList.remove("hidden")}function Me(){const e={id:m.meta.id,title:m.meta.title};return m.meta.requirements&&(e.requirements=m.meta.requirements),m.meta.description&&(e.description=m.meta.description),m.meta.difficulty&&(e.difficulty=m.meta.difficulty),m.meta.duration&&(e.duration=Number(m.meta.duration)),e.items=m.items.map(t=>{if(t.type==="group"){const r={kind:t.kind,exercises:t.members.map(n=>{const a={exerciseId:n.exerciseId};return n.reps&&(a.reps=n.reps),n.sets&&(a.sets=n.sets),n.repUnits&&n.repUnits!=="reps"&&(a.repUnits=n.repUnits),n.note&&(a.note=n.note),a})};return t.note&&(r.note=t.note),t.tags?.length&&(r.tags=t.tags),r}const s={exerciseId:t.exerciseId};return t.reps&&(s.reps=t.reps),t.sets&&(s.sets=t.sets),t.repUnits&&t.repUnits!=="reps"&&(s.repUnits=t.repUnits),t.note&&(s.note=t.note),t.tags.length&&(s.tags=t.tags),s}),e}let F=[],G=!1,J="";function Jt(e){F=[],G=!1,J="",e.innerHTML=`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span data-region="header-title" class="text-sm font-medium text-slate-400">New Exercise</span>
      </header>
      <main class="flex-1 px-6 pb-32 pt-6 space-y-6">

        <!-- Search existing to edit -->
        <section class="space-y-3">
          <h2 class="eyebrow">Find exercise to edit</h2>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input data-input="edit-search" type="text" placeholder="Search to edit an existing exercise..."
              class="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"/>
          </div>
          <ul data-region="edit-results" class="space-y-1 max-h-[200px] overflow-y-auto hidden"></ul>
          <div class="text-center">
            <p class="text-[11px] text-slate-600">or create a new one below</p>
          </div>
        </section>

        <!-- Exercise form -->
        <section class="space-y-3">
          <h2 class="eyebrow" data-region="form-label">Exercise Details</h2>
          <div>
            <label class="text-xs text-slate-400 mb-1 block">Name *</label>
            <input data-field="name" type="text" placeholder="e.g. Backward Treadmill Walk"
              class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"/>
            <p data-region="id-preview" class="text-[11px] text-slate-500 mt-1 font-mono"></p>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Reps</label>
              <input data-field="reps" type="text" placeholder="10" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
            <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Sets</label>
              <input data-field="sets" type="text" placeholder="3" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
            <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Units</label>
              <select data-field="repUnits" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500">
                <option value="reps">reps</option><option value="secs">secs</option><option value="min">min</option><option value="yd">yd</option><option value="reps (each side)">reps (each side)</option><option value="secs (each side)">secs (each side)</option>
              </select></div>
          </div>
          <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Note</label>
            <input data-field="note" type="text" placeholder="Form cues, weight, etc." class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/></div>
        </section>
        <section>
          <div data-region="demos"></div>
        </section>
        <section data-region="export-section" class="hidden space-y-3 pt-4 border-t border-slate-800">
          <button data-action="export" class="btn-primary w-full text-sm">Export Exercise JSON</button>
        </section>
      </main>
      <!-- Export modal -->
      <div data-region="export-modal" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center">
        <div class="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="h-section">Export</h2>
            <button data-action="close-export" class="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white" aria-label="Close">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div data-region="export-content"></div>
        </div>
      </div>
    </div>
  `,Vt(e),Wt(e),Kt(e),Zt(e)}function Vt(e){e.querySelector('[data-action="back"]')?.addEventListener("click",()=>h("/studio"))}function Wt(e){const t=e.querySelector('[data-input="edit-search"]'),s=e.querySelector('[data-region="edit-results"]');let r=null;t?.addEventListener("input",()=>{clearTimeout(r),r=setTimeout(async()=>{const n=t.value.trim();if(!n){s.classList.add("hidden");return}const a=await Z(n,8);if(a.length===0){s.classList.add("hidden");return}s.classList.remove("hidden"),s.innerHTML=a.map(o=>`
        <li><button data-load-exercise="${o.id}" class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800/60 active:bg-slate-800 transition-colors flex items-center gap-3 touch-manipulation">
          <span class="text-sm font-medium text-slate-100 truncate">${je(o.name)}</span>
          ${o.hasDemos?'<span class="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-sm">demo</span>':""}
        </button></li>
      `).join(""),s.querySelectorAll("[data-load-exercise]").forEach(o=>{o.addEventListener("click",()=>{const i=a.find(d=>d.id===o.dataset.loadExercise);i&&Yt(e,i.exercise),s.classList.add("hidden"),t.value=""})})},150)})}function Yt(e,t){G=!0,J=t.id,F=JSON.parse(JSON.stringify(t.demos||[])),e.querySelector('[data-region="header-title"]').textContent=`Edit: ${t.name}`,e.querySelector('[data-region="form-label"]').textContent="Editing Exercise";const s=e.querySelector('[data-field="name"]');s.value=t.name,s.dispatchEvent(new Event("input"));const r=t.recommendations||{};e.querySelector('[data-field="reps"]').value=r.reps||"",e.querySelector('[data-field="sets"]').value=r.sets||"",e.querySelector('[data-field="repUnits"]').value=r.repUnits||"reps",e.querySelector('[data-field="note"]').value=r.note||"",oe(e.querySelector('[data-region="demos"]'),F),e.querySelector('[data-region="export-section"]')?.classList.remove("hidden")}function Kt(e){const t=e.querySelector('[data-field="name"]'),s=e.querySelector('[data-region="id-preview"]'),r=e.querySelector('[data-region="export-section"]');t?.addEventListener("input",()=>{if(G)s.textContent=`id: ${J} (existing)`;else{const n=t.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,"");s.textContent=n?`id: ${n}`:""}r?.classList.toggle("hidden",!t.value.trim())}),oe(e.querySelector('[data-region="demos"]'),F)}function Zt(e){const t=e.querySelector('[data-region="export-modal"]');e.querySelector('[data-action="export"]')?.addEventListener("click",()=>{const s=e.querySelector('[data-field="name"]'),r=s.value.trim();if(!r){s.focus();return}const a={id:G?J:r.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,""),name:r,demos:F.filter(f=>f.url),recommendations:{}},o=e.querySelector('[data-field="reps"]').value,i=e.querySelector('[data-field="sets"]').value,d=e.querySelector('[data-field="repUnits"]').value,l=e.querySelector('[data-field="note"]').value;o&&(a.recommendations.reps=o),i&&(a.recommendations.sets=i),d&&d!=="reps"&&(a.recommendations.repUnits=d),l&&(a.recommendations.note=l);const u=e.querySelector('[data-region="export-content"]'),p=JSON.stringify(a,null,2),c=G?`Replace entry with id "${J}" in exercises.json`:"Append to exercises.json → exercises[]";u.innerHTML=`
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-slate-400">${c}</p>
          <button data-action="copy" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
        </div>
        <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono leading-relaxed"><code>${je(p)}</code></pre>
      </div>`,u.querySelector('[data-action="copy"]')?.addEventListener("click",f=>{navigator.clipboard?.writeText(p).then(()=>{f.target.textContent="✓ Copied",setTimeout(()=>{f.target.textContent="Copy"},2e3)})}),t.classList.remove("hidden")}),e.querySelector('[data-action="close-export"]')?.addEventListener("click",()=>t?.classList.add("hidden")),t?.addEventListener("click",s=>{s.target===t&&t.classList.add("hidden")})}function je(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const Qt="https://api.openai.com/v1/chat/completions",Xt="gpt-4o-mini",Te="action-app:openai-key";function ie(){return localStorage.getItem(Te)||""}function es(e){localStorage.setItem(Te,e)}function fe(){return!!ie()}function ts(){return{meta:{title:"",id:"",requirements:"",description:""},items:[],newExercises:[]}}const ss=[{type:"function",function:{name:"search_exercises",description:"Search the exercise library by name, alias, or keyword. Always call this before adding an exercise.",parameters:{type:"object",properties:{query:{type:"string",description:"Search query (exercise name or keyword)"},limit:{type:"number",description:"Max results to return (default 5)"}},required:["query"]}}},{type:"function",function:{name:"add_exercise",description:"Add an exercise to the program timeline.",parameters:{type:"object",properties:{exerciseId:{type:"string",description:"Exercise ID from search results"},reps:{type:"string",description:'Number of reps (e.g. "10", "30", "AMRAP")'},sets:{type:"string",description:'Number of sets (e.g. "3", "4")'},repUnits:{type:"string",description:"Unit type: reps, secs, min, yd"},note:{type:"string",description:"Form cues or notes"},tags:{type:"array",items:{type:"string"},description:"Tags like warmup, stretch"}},required:["exerciseId"]}}},{type:"function",function:{name:"create_exercise",description:"Create a new exercise that does not exist in the library.",parameters:{type:"object",properties:{name:{type:"string",description:"Exercise name"},reps:{type:"string"},sets:{type:"string"},repUnits:{type:"string"},note:{type:"string"}},required:["name"]}}},{type:"function",function:{name:"remove_exercise",description:"Remove an exercise from the program by its position (0-based index).",parameters:{type:"object",properties:{index:{type:"number",description:"0-based position in the timeline"}},required:["index"]}}},{type:"function",function:{name:"group_exercises",description:"Group exercises into a superset, compound set, or circuit.",parameters:{type:"object",properties:{indices:{type:"array",items:{type:"number"},description:"0-based positions to group"},kind:{type:"string",enum:["superset","compound","circuit"]}},required:["indices","kind"]}}},{type:"function",function:{name:"set_metadata",description:"Set program title, requirements, or description.",parameters:{type:"object",properties:{title:{type:"string"},requirements:{type:"string"},description:{type:"string"}}}}},{type:"function",function:{name:"update_exercise",description:"Update reps, sets, note, or tags of an exercise at a given position.",parameters:{type:"object",properties:{index:{type:"number",description:"0-based position"},reps:{type:"string"},sets:{type:"string"},repUnits:{type:"string"},note:{type:"string"},tags:{type:"array",items:{type:"string"}}},required:["index"]}}}];async function as(e,t,s){switch(e){case"search_exercises":return(await Z(t.query,t.limit||5)).map(n=>({id:n.id,name:n.name,hasDemos:n.hasDemos,reps:n.exercise?.recommendations?.reps,sets:n.exercise?.recommendations?.sets,repUnits:n.exercise?.recommendations?.repUnits}));case"add_exercise":{const r={exerciseId:t.exerciseId};return t.reps&&(r.reps=t.reps),t.sets&&(r.sets=t.sets),t.repUnits&&t.repUnits!=="reps"&&(r.repUnits=t.repUnits),t.note&&(r.note=t.note),t.tags?.length&&(r.tags=t.tags),s.items.push(r),{success:!0,index:s.items.length-1,total:s.items.length}}case"create_exercise":{const r=t.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/,""),n={id:r,name:t.name,demos:[],recommendations:{}};return t.reps&&(n.recommendations.reps=t.reps),t.sets&&(n.recommendations.sets=t.sets),t.repUnits&&(n.recommendations.repUnits=t.repUnits),t.note&&(n.recommendations.note=t.note),s.newExercises.push(n),{success:!0,id:r,name:t.name}}case"remove_exercise":return t.index>=0&&t.index<s.items.length?(s.items.splice(t.index,1),{success:!0,remaining:s.items.length}):{success:!1,error:"Invalid index"};case"group_exercises":{const r=[...t.indices].sort((o,i)=>o-i),n=r.map(o=>s.items[o]).filter(Boolean);if(n.length<2)return{success:!1,error:"Need at least 2 exercises to group"};for(let o=r.length-1;o>=0;o--)s.items.splice(r[o],1);const a={kind:t.kind,exercises:n};return s.items.splice(r[0],0,a),{success:!0,groupIndex:r[0]}}case"set_metadata":return t.title&&(s.meta.title=t.title),t.requirements&&(s.meta.requirements=t.requirements),t.description&&(s.meta.description=t.description),t.title&&(s.meta.id=t.title.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/_+$/,"")),{success:!0,meta:s.meta};case"update_exercise":{const r=s.items[t.index];return r?(t.reps&&(r.reps=t.reps),t.sets&&(r.sets=t.sets),t.repUnits&&(r.repUnits=t.repUnits),t.note&&(r.note=t.note),t.tags&&(r.tags=t.tags),{success:!0}):{success:!1,error:"Invalid index"}}default:return{error:`Unknown tool: ${e}`}}}function rs(e){return`You are a fitness programming assistant for the Action App. You help users build workout programs through conversation.

## Your Capabilities
- Search the exercise library (${e.length} exercises) using the search_exercises tool
- Add exercises to the program timeline using add_exercise
- Create new exercises when nothing in the library matches using create_exercise
- Group exercises into supersets, compounds, or circuits using group_exercises
- Set program metadata (title, requirements) using set_metadata
- Update or remove exercises

## Rules
1. ALWAYS call search_exercises before add_exercise — never guess exercise IDs
2. Use the user's exact reps/sets if specified; otherwise use exercise defaults from search results
3. Tag warmup exercises with ["warmup"] and cooldown/stretches with ["stretch"]
4. If the user's request is ambiguous, ask a clarifying question
5. After adding exercises, briefly confirm what was added
6. When creating new exercises, the ID will be auto-generated from the name

## Fitness Knowledge
- Balanced lower body: quads, hamstrings, glutes, calves
- Balanced upper body: chest, back, shoulders, arms
- Warmups: 2-4 exercises, low intensity, movement-specific
- Rep ranges: strength (3-6), hypertrophy (8-12), endurance (15-20), rehab (12-20 slow)
- Supersets pair opposing muscles or same muscle for intensity
- Rehab: higher reps, slower tempo, isometric holds, avoid impact

## Exercise Library (${e.length} exercises, format: id | name):
${e.map(t=>`${t.id} | ${t.name}`).join(`
`)}
`}function ns(e){if(e.items.length===0&&!e.meta.title)return`
[Program is empty — no exercises added yet]`;let t=`
## Current Program State
`;return e.meta.title&&(t+=`Title: ${e.meta.title}
`),e.meta.requirements&&(t+=`Requirements: ${e.meta.requirements}
`),t+=`
Timeline (${e.items.length} items):
`,e.items.forEach((s,r)=>{s.kind?t+=`${r}. [${s.kind}] ${s.exercises.map(n=>n.exerciseId).join(" + ")}
`:t+=`${r}. ${s.exerciseId} — ${s.reps||"?"} ${s.repUnits||"reps"} × ${s.sets||"?"} sets${s.tags?.length?` [${s.tags.join(", ")}]`:""}
`}),e.newExercises.length>0&&(t+=`
New exercises created this session: ${e.newExercises.map(s=>s.name).join(", ")}
`),t}async function os(e,t,s,r,n){const a=ie();if(!a)throw new Error("No API key configured");const i=[{role:"system",content:rs(r)+ns(s)},...t.slice(-20),{role:"user",content:e}];let d=await ge(a,i),l=d.choices[0].message,u=0;for(;l.tool_calls&&u<5;){u++;const p=[];for(const c of l.tool_calls){const f=JSON.parse(c.function.arguments),g=await as(c.function.name,f,s);p.push({role:"tool",tool_call_id:c.id,content:JSON.stringify(g)}),n?.({type:"tool",name:c.function.name,args:f,result:g})}i.push(l),i.push(...p),d=await ge(a,i),l=d.choices[0].message}return l.content||""}async function ge(e,t){const s=await fetch(Qt,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({model:Xt,messages:t,tools:ss,tool_choice:"auto",temperature:.3})});if(!s.ok){const r=await s.text();throw new Error(`OpenAI API error (${s.status}): ${r}`)}return s.json()}function is(e){const t={id:e.meta.id||"untitled",title:e.meta.title||"Untitled Program"};return e.meta.requirements&&(t.requirements=e.meta.requirements),t.items=e.items,{program:t,newExercises:e.newExercises}}async function ls(e){const t=ts(),s=[];let r=!1;const{exercises:n}=await N(),a=n.map(x=>({id:x.id,name:x.name}));e.innerHTML=`
    <div class="flex-1 flex flex-col h-screen">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400 flex-1">AI Program Builder</span>
        <button data-action="export" class="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors hidden">Export</button>
        <button data-action="settings" class="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors" aria-label="Settings">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </header>

      <!-- Program preview (collapsible) -->
      <div data-region="program-preview" class="px-6 py-3 border-b border-slate-900 bg-slate-900/30 hidden">
        <div class="flex items-center justify-between mb-2">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Program</p>
          <span data-region="item-count" class="text-[10px] text-slate-500 num">0 items</span>
        </div>
        <div data-region="program-items" class="space-y-1 max-h-[200px] overflow-y-auto"></div>
      </div>

      <!-- Chat messages -->
      <main data-region="messages" class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <div class="text-center py-8">
          <p class="text-2xl mb-2">🏋️</p>
          <p class="text-sm text-slate-400">Tell me what kind of program you want to build.</p>
          <p class="text-xs text-slate-500 mt-1">e.g. "I need a knee-friendly lower body session with dumbbells"</p>
        </div>
      </main>

      <!-- Input -->
      <div class="px-6 py-4 border-t border-slate-900 bg-slate-950">
        <div class="flex gap-2">
          <input
            data-input="message"
            type="text"
            placeholder="Type a message..."
            class="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"
          />
          <button data-action="send" class="btn-primary px-4 py-3 rounded-xl" aria-label="Send">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Settings modal -->
      <div data-region="settings-modal" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center">
        <div class="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 space-y-4">
          <h2 class="h-section">AI Settings</h2>
          <div>
            <label class="text-xs text-slate-400 mb-1 block">OpenAI API Key</label>
            <input data-input="api-key" type="password" placeholder="sk-..."
              class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-mono"/>
          </div>
          <p class="text-[11px] text-slate-500">Stored in localStorage. Never sent anywhere except OpenAI.</p>
          <div class="flex gap-3">
            <button data-action="close-settings" class="btn-ghost flex-1 text-sm">Cancel</button>
            <button data-action="save-settings" class="btn-primary flex-1 text-sm">Save</button>
          </div>
        </div>
      </div>

      <!-- Export modal -->
      <div data-region="export-modal" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center">
        <div class="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="h-section">Export Program</h2>
            <button data-action="close-export" class="p-2 rounded-lg hover:bg-white/5 text-slate-400" aria-label="Close">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div data-region="export-content" class="space-y-4"></div>
        </div>
      </div>
    </div>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>h("/studio"));const o=e.querySelector('[data-region="messages"]'),i=e.querySelector('[data-input="message"]'),d=e.querySelector('[data-action="send"]'),l=e.querySelector('[data-action="export"]'),u=e.querySelector('[data-region="settings-modal"]'),p=e.querySelector('[data-region="export-modal"]');e.querySelector('[data-action="settings"]')?.addEventListener("click",()=>{e.querySelector('[data-input="api-key"]').value=ie(),u.classList.remove("hidden")}),e.querySelector('[data-action="close-settings"]')?.addEventListener("click",()=>u.classList.add("hidden")),e.querySelector('[data-action="save-settings"]')?.addEventListener("click",()=>{const x=e.querySelector('[data-input="api-key"]').value.trim();es(x),u.classList.add("hidden")}),u?.addEventListener("click",x=>{x.target===u&&u.classList.add("hidden")}),l?.addEventListener("click",()=>$()),e.querySelector('[data-action="close-export"]')?.addEventListener("click",()=>p.classList.add("hidden")),p?.addEventListener("click",x=>{x.target===p&&p.classList.add("hidden")}),fe()||u.classList.remove("hidden");async function c(){const x=i.value.trim();if(!x||r)return;if(!fe()){u.classList.remove("hidden");return}i.value="",r=!0,d.disabled=!0,f("user",x),s.push({role:"user",content:x});const k=f("assistant","...");k.dataset.loading="true";try{const S=await os(x,s,t,a,y=>{y.type==="tool"&&g(y)});k.remove(),f("assistant",S),s.push({role:"assistant",content:S}),v()}catch(S){k.remove(),f("error",S.message)}finally{r=!1,d.disabled=!1,i.focus()}}d?.addEventListener("click",c),i?.addEventListener("keydown",x=>{x.key==="Enter"&&!x.shiftKey&&(x.preventDefault(),c())});function f(x,k){const S=o.querySelector(".text-center.py-8");S&&x!=="error"&&S.remove();const y=document.createElement("div");y.className=x==="user"?"flex justify-end":"flex justify-start";const M=document.createElement("div");return x==="user"?M.className="bg-brand-500/20 text-slate-100 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%] text-sm leading-relaxed":x==="error"?M.className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] text-sm leading-relaxed":M.className="bg-slate-800/60 text-slate-200 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] text-sm leading-relaxed",M.textContent=k,y.appendChild(M),o.appendChild(y),o.scrollTop=o.scrollHeight,y}function g(x){const k=document.createElement("div");k.className="flex justify-start";const S={search_exercises:`🔍 Searching: "${x.args.query}"`,add_exercise:`✓ Added: ${x.args.exerciseId}`,create_exercise:`✓ Created: ${x.args.name}`,remove_exercise:`✗ Removed item at position ${x.args.index}`,group_exercises:`⚡ Grouped as ${x.args.kind}`,set_metadata:`📝 Updated: ${x.args.title||x.args.requirements||"metadata"}`,update_exercise:`✏️ Updated item at position ${x.args.index}`}[x.name]||`🔧 ${x.name}`;k.innerHTML=`<span class="text-[11px] text-slate-500 italic px-2 py-1">${H(S)}</span>`,o.appendChild(k),o.scrollTop=o.scrollHeight}function v(){const x=e.querySelector('[data-region="program-preview"]'),k=e.querySelector('[data-region="program-items"]'),S=e.querySelector('[data-region="item-count"]');if(t.items.length===0){x.classList.add("hidden"),l.classList.add("hidden");return}x.classList.remove("hidden"),l.classList.remove("hidden"),S.textContent=`${t.items.length} item${t.items.length!==1?"s":""}`,k.innerHTML=t.items.map((y,M)=>{if(y.kind)return`<div class="text-xs text-slate-400 pl-2 border-l-2 border-brand-500"><span class="text-brand-300 font-medium">${y.kind}</span>: ${y.exercises.map(Pe=>Pe.exerciseId).join(" + ")}</div>`;const T=y.tags?.length?`<span class="text-brand-300">[${y.tags.join(", ")}]</span> `:"";return`<div class="text-xs text-slate-300">${M+1}. ${T}${H(y.exerciseId)} — ${y.reps||"?"} ${y.repUnits||"reps"} × ${y.sets||"?"}</div>`}).join("")}function $(){const{program:x,newExercises:k}=is(t),S=e.querySelector('[data-region="export-content"]');let y="";if(k.length>0){const T=JSON.stringify(k,null,2);y+=`
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs text-slate-400">New Exercises (append to exercises.json)</p>
            <button data-copy="${H(T)}" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
          </div>
          <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[200px] overflow-y-auto font-mono">${H(T)}</pre>
        </div>
      `}const M=JSON.stringify(x,null,2);y+=`
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-slate-400">Program (append to workouts.json)</p>
          <button data-copy="${H(M)}" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
        </div>
        <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono">${H(M)}</pre>
      </div>
    `,S.innerHTML=y,S.querySelectorAll("[data-copy]").forEach(T=>{T.addEventListener("click",()=>{navigator.clipboard?.writeText(T.dataset.copy).then(()=>{T.textContent="✓ Copied",setTimeout(()=>{T.textContent="Copy"},2e3)})})}),p.classList.remove("hidden")}}function H(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function ds(e){e.innerHTML=`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="h-page">Exercises</h1>
        <span data-region="count" class="text-[11px] text-slate-500 num ml-auto"></span>
      </header>
      <div class="px-6 pt-4 pb-2">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input data-input="search" type="text" placeholder="Search exercises..."
            class="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"/>
        </div>
      </div>
      <main class="flex-1 px-6 pb-24 pt-2">
        <ul data-region="list" class="space-y-2"></ul>
        <div data-region="empty" class="hidden text-center py-12">
          <p class="text-slate-400 text-sm">No exercises match your search.</p>
        </div>
      </main>
    </div>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>h("/"));const{exercises:t}=await N(),s=e.querySelector('[data-region="count"]');s.textContent=`${t.length} total`;let r=null;const n=l=>{const u=e.querySelector('[data-region="list"]'),p=e.querySelector('[data-region="empty"]');if(l.length===0){u.classList.add("hidden"),p.classList.remove("hidden");return}if(u.classList.remove("hidden"),p.classList.add("hidden"),u.innerHTML=l.map(c=>`
      <li>
        <article class="card overflow-hidden" data-exercise-id="${c.id}">
          <button data-action="expand" data-id="${c.id}" class="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold tracking-tight text-slate-100 truncate">${D(c.name)}</h3>
              <p class="text-xs text-slate-400 mt-0.5 num">${c.demos.length} demo${c.demos.length!==1?"s":""}${c.recommendations?.reps?` · ${c.recommendations.reps} ${c.recommendations.repUnits||"reps"}`:""}</p>
            </div>
            <svg class="w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${r===c.id?"rotate-180":""}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          ${r===c.id?a(c):""}
        </article>
      </li>
    `).join(""),u.querySelectorAll('[data-action="expand"]').forEach(c=>{c.addEventListener("click",()=>{if(r=r===c.dataset.id?null:c.dataset.id,n(l),r){const f=u.querySelector(`[data-demo-slot="${r}"]`),g=l.find(v=>v.id===r);f&&g&&g.demos.length>0&&z(f,g.demos)}})}),r){const c=u.querySelector(`[data-demo-slot="${r}"]`),f=l.find(g=>g.id===r);c&&f&&f.demos.length>0&&z(c,f.demos)}};function a(l){return`
      <div class="px-4 pb-4 pt-1 space-y-3 border-t border-slate-800 bg-slate-900/40 animate-fade-in">
        <div data-demo-slot="${l.id}">
          ${l.demos.length===0?'<p class="text-xs text-slate-500 italic py-2">No demos available</p>':""}
        </div>
        ${l.recommendations?`
          <div class="flex gap-3">
            ${l.recommendations.reps?`<div class="bg-slate-800/50 rounded-lg px-3 py-2 text-center flex-1"><p class="text-lg font-extrabold text-brand-400 num">${D(l.recommendations.reps)}</p><p class="label-meta mt-0.5">${D(l.recommendations.repUnits||"reps")}</p></div>`:""}
            ${l.recommendations.sets?`<div class="bg-slate-800/50 rounded-lg px-3 py-2 text-center flex-1"><p class="text-lg font-extrabold text-brand-400 num">${D(l.recommendations.sets)}</p><p class="label-meta mt-0.5">sets</p></div>`:""}
          </div>
        `:""}
        ${l.recommendations?.note?`<div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2 rounded-r-lg"><p class="text-xs text-slate-300 leading-relaxed">${D(l.recommendations.note)}</p></div>`:""}
        ${l.aliases?.length?`<p class="text-[11px] text-slate-500">Also known as: ${l.aliases.join(", ")}</p>`:""}
        <a href="/exercise/${l.id}" class="inline-block text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">View full page →</a>
      </div>
    `}const o=[...t].sort((l,u)=>l.name.localeCompare(u.name));n(o);const i=e.querySelector('[data-input="search"]');let d=null;i?.addEventListener("input",()=>{clearTimeout(d),d=setTimeout(async()=>{const l=i.value.trim();if(!l){n(o),s.textContent=`${o.length} total`;return}const p=(await Z(l,50)).map(c=>c.exercise);n(p),s.textContent=`${p.length} result${p.length!==1?"s":""}`},150)})}function D(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function cs(e,t){e.innerHTML=`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-4 flex items-center gap-3">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="h-page flex-1 min-w-0 truncate">Exercise</h1>
      </header>
      <main class="flex-1 px-6 pb-24 flex items-center justify-center">
        <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    </div>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>window.history.back());const s=await ze(t);if(!s){us(e,t);return}const{programs:r}=await R(),n=ms(r,t);ps(e,s,n)}function ps(e,t,s){const r=t.demos||[],n=t.recommendations||{},a=t.aliases||[];if(e.innerHTML=`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-4 flex items-center gap-3">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="h-page flex-1 min-w-0 truncate">${P(t.name)}</h1>
      </header>

      <main class="flex-1 px-6 pb-24 space-y-6 animate-slide-up">
        <!-- Demo carousel -->
        <section data-region="demos">
          ${r.length===0?'<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No demos available</div>':""}
        </section>

        <!-- Recommendations -->
        ${n.reps||n.sets?`
        <section class="space-y-3">
          <h2 class="eyebrow">Recommendations</h2>
          <div class="grid grid-cols-2 gap-3">
            ${n.reps?`
            <div class="card p-4 text-center">
              <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${P(n.reps)}</p>
              <p class="label-meta mt-1.5">${P(n.repUnits||"reps")}</p>
            </div>`:""}
            ${n.sets?`
            <div class="card p-4 text-center">
              <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${P(n.sets)}</p>
              <p class="label-meta mt-1.5">sets</p>
            </div>`:""}
          </div>
          ${n.note?`
          <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
            <p class="text-sm text-slate-300 leading-relaxed">${P(n.note)}</p>
          </div>`:""}
        </section>`:""}

        <!-- Aliases -->
        ${a.length>0?`
        <section class="space-y-2">
          <h2 class="eyebrow">Also known as</h2>
          <div class="flex flex-wrap gap-2">
            ${a.map(o=>`<span class="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">${P(o)}</span>`).join("")}
          </div>
        </section>`:""}

        <!-- Used in programs -->
        ${s.length>0?`
        <section class="space-y-3">
          <h2 class="eyebrow">Used in ${s.length} program${s.length!==1?"s":""}</h2>
          <ul class="space-y-2">
            ${s.map(o=>`
            <li>
              <button data-program-id="${o.id}" class="w-full card p-3 text-left active:scale-[0.98] transition-transform">
                <div class="flex items-center gap-3">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-sm font-semibold tracking-tight truncate">${P(o.title)}</h3>
                  </div>
                  <svg class="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </button>
            </li>`).join("")}
          </ul>
        </section>`:""}

        <!-- Metadata -->
        <section class="space-y-2 pt-2 border-t border-slate-800">
          <p class="text-[11px] text-slate-500 font-mono">${P(t.id)}</p>
          <p class="text-[11px] text-slate-500">${r.length} demo${r.length!==1?"s":""}</p>
        </section>
      </main>
    </div>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>window.history.back()),e.querySelectorAll("[data-program-id]").forEach(o=>{o.addEventListener("click",()=>h(`/program/${o.dataset.programId}`))}),r.length>0){const o=e.querySelector('[data-region="demos"]');z(o,r)}}function us(e,t){e.innerHTML=`
    <div class="flex-1 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p class="text-6xl mb-4">🤷</p>
      <h1 class="text-2xl font-bold mb-2">Exercise not found</h1>
      <p class="text-slate-400 mb-6 text-sm font-mono">${P(t)}</p>
      <a href="/exercises" class="btn-primary">Browse exercises</a>
    </div>
  `}function ms(e,t){return e.filter(s=>{for(const r of s.items||[]){if(r.exerciseId===t)return!0;if(r.exercises){for(const n of r.exercises)if(n.exerciseId===t)return!0}}return!1})}function P(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function xs(e){e.innerHTML=`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="h-page">Search</h1>
      </header>
      <div class="px-6 pt-4 pb-2">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input data-input="search" type="text" placeholder="Search programs..."
            autofocus
            class="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"/>
        </div>
      </div>
      <main class="flex-1 px-6 pb-24 pt-2">
        <div data-region="results" class="space-y-2"></div>
        <div data-region="empty" class="hidden text-center py-12">
          <p class="text-slate-400 text-sm">No programs match your search.</p>
        </div>
        <div data-region="initial" class="text-center py-12">
          <p class="text-slate-500 text-sm">Type to search across all programs.</p>
        </div>
      </main>
    </div>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>h("/"));const[{programs:t},{plans:s}]=await Promise.all([R(),$e()]),r=t.map(p=>({id:p.id,title:p.title,requirements:p.requirements||"",itemCount:p.items?.length||p.exercises?.length||0,tokens:V(p.title).concat(V(p.requirements||"")).concat(V(p.id.replace(/[-_]/g," "))),program:p})),n=new Map;for(const p of s)for(const c of p.subPlans||[])for(const f of c.programs||[])n.set(f,`${p.name} · ${c.name}`);const a=e.querySelector('[data-region="results"]'),o=e.querySelector('[data-region="empty"]'),i=e.querySelector('[data-region="initial"]');function d(p){if(p===null){a.classList.add("hidden"),o.classList.add("hidden"),i.classList.remove("hidden");return}if(i.classList.add("hidden"),p.length===0){a.classList.add("hidden"),o.classList.remove("hidden");return}o.classList.add("hidden"),a.classList.remove("hidden"),a.innerHTML=p.map(c=>fs(c,n.get(c.id))).join(""),a.querySelectorAll("[data-program-id]").forEach(c=>{c.addEventListener("click",()=>h(`/program/${c.dataset.programId}`))})}const l=e.querySelector('[data-input="search"]');let u=null;l?.addEventListener("input",()=>{clearTimeout(u),u=setTimeout(()=>{const p=l.value.trim();if(!p){d(null);return}const c=V(p),f=r.map(g=>({...g,score:gs(g.tokens,c)})).filter(g=>g.score>0).sort((g,v)=>v.score-g.score);d(f)},150)}),d(null)}function fs(e,t){return`
    <button
      data-program-id="${e.id}"
      class="w-full card p-4 text-left active:scale-[0.98] transition-transform"
    >
      <div class="flex items-center gap-3">
        <div class="flex-1 min-w-0">
          ${t?`<p class="text-[10px] font-medium uppercase tracking-wider text-slate-500 mb-1">${se(t)}</p>`:""}
          <h3 class="font-semibold tracking-tight truncate">${se(e.title)}</h3>
          <p class="text-xs text-slate-400 mt-1 truncate">
            <span class="num">${e.itemCount}</span> exercise${e.itemCount!==1?"s":""}${e.requirements?` · ${se(e.requirements)}`:""}
          </p>
        </div>
        <svg class="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </button>
  `}function V(e){return e?e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().split(/[^a-z0-9]+/).filter(t=>t.length>0):[]}function gs(e,t){let s=0;for(const r of t){let n=0;for(const a of e)a===r?n=Math.max(n,10):a.startsWith(r)?n=Math.max(n,7):a.includes(r)&&(n=Math.max(n,4));if(n===0)return 0;s+=n}return s}function se(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const C=document.getElementById("app");j("/",()=>De(C));j("/programs",()=>Ve(C));j("/program/:id",({id:e})=>xt(C,e));j("/exercises",()=>ds(C));j("/exercise/:id",({id:e})=>cs(C,e));j("/search",()=>xs(C));const bs=["localhost","127.0.0.1"].includes(window.location.hostname);bs&&(j("/studio",()=>ht(C)),j("/studio/program",()=>It(C)),j("/studio/exercise",()=>Jt(C)),j("/studio/ai",()=>ls(C)));Ie(e=>{C.innerHTML=`
    <div class="flex-1 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p class="text-6xl mb-4">🤔</p>
      <h1 class="text-2xl font-bold mb-2">Page not found</h1>
      <p class="text-slate-400 mb-6 text-sm">${e}</p>
      <a href="/" class="btn-primary">Back home</a>
    </div>
  `});Ae();console.log("🚀 Action App V2 ready");
