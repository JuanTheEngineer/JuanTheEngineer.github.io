(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function s(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=s(r);fetch(r.href,n)}})();const Le=[];let oe=null;function T(e,t){const s=[],a=new RegExp("^"+e.replace(/:([^/]+)/g,(r,n)=>(s.push(n),"([^/]+)"))+"$");Le.push({pattern:e,regex:a,keys:s,handler:t})}function Ve(e){oe=e}function k(e){window.history.pushState(null,"",e),ie()}function ie(){const e=window.location.pathname||"/";for(const t of Le){const s=e.match(t.regex);if(s){const a={};t.keys.forEach((r,n)=>{a[r]=decodeURIComponent(s[n+1])}),t.handler(a);return}}oe&&oe(e)}function We(){if(window.addEventListener("popstate",ie),document.addEventListener("click",e=>{const t=e.target.closest("a[href]");if(!t)return;const s=t.getAttribute("href");s&&s.startsWith("/")&&!s.startsWith("//")&&(e.preventDefault(),k(s))}),window.location.hash&&window.location.hash.startsWith("#/")){const e=window.location.hash.slice(1);window.history.replaceState(null,"",e)}ie()}const qe="action-app:progress",Ce="action-app:sets",Me="action-app:recent-programs",Ye=5;function de(){try{return JSON.parse(localStorage.getItem(qe)||"{}")}catch{return{}}}function je(e){try{localStorage.setItem(qe,JSON.stringify(e))}catch{}}function Te(e){const t=de();return new Set(t[e]||[])}function Q(e,t){const s=de(),a=new Set(s[e]||[]);return a.has(t)?a.delete(t):a.add(t),s[e]=Array.from(a),je(s),a}function Ke(e){const t=de();delete t[e],je(t);const s=ce();let a=!1;for(const r of Object.keys(s))r.startsWith(`${e}:`)&&(delete s[r],a=!0);a&&Pe(s)}function ce(){try{return JSON.parse(localStorage.getItem(Ce)||"{}")}catch{return{}}}function Pe(e){try{localStorage.setItem(Ce,JSON.stringify(e))}catch{}}function me(e,t){const a=ce()[`${e}:${t}`];return Number.isInteger(a)&&a>=0?a:0}function G(e,t,s){const a=ce(),r=`${e}:${t}`;return s>0?a[r]=s:delete a[r],Pe(a),s>0?s:0}function Ie(){try{const e=JSON.parse(localStorage.getItem(Me)||"[]");return Array.isArray(e)?e:[]}catch{return[]}}function Xe(e){if(e)try{const t=Ie().filter(s=>s.id!==e);t.unshift({id:e,visitedAt:Date.now()}),localStorage.setItem(Me,JSON.stringify(t.slice(0,Ye)))}catch{}}const S={workouts:null,exercises:null,plans:null,exerciseMap:null};async function z(){if(S.workouts)return S.workouts;const e=await fetch("/workouts.json");if(!e.ok)throw new Error(`Failed to load workouts.json: ${e.status}`);return S.workouts=await e.json(),S.workouts}async function B(){if(S.exercises)return S.exercises;const e=await fetch("/exercises.json");if(!e.ok)throw new Error(`Failed to load exercises.json: ${e.status}`);return S.exercises=await e.json(),S.exerciseMap=new Map(S.exercises.exercises.map(t=>[t.id,t])),S.exercises}async function Ae(){if(S.plans)return S.plans;const e=await fetch("/plans.json");if(!e.ok)throw new Error(`Failed to load plans.json: ${e.status}`);return S.plans=await e.json(),S.plans}async function Ze(e){return(await z()).programs.find(s=>s.id===e)||null}async function Qe(e){return await B(),S.exerciseMap?.get(e)||null}async function et(e){const[t]=await Promise.all([Ze(e),B()]);if(!t)return null;const s=n=>{const o=S.exerciseMap.get(n.exerciseId)||null;return{kind:"single",exerciseId:n.exerciseId,exercise:o,name:o?.name||n.exerciseId,reps:n.reps??o?.recommendations?.reps,sets:n.sets??o?.recommendations?.sets,repUnits:n.repUnits??o?.recommendations?.repUnits,note:n.note??o?.recommendations?.note,tags:n.tags||[]}},a=n=>({kind:n.kind,note:n.note,tags:n.tags||[],exercises:n.exercises.map(o=>{const i=S.exerciseMap.get(o.exerciseId)||null;return{exerciseId:o.exerciseId,exercise:i,name:i?.name||o.exerciseId,reps:o.reps??i?.recommendations?.reps,sets:o.sets??i?.recommendations?.sets,repUnits:o.repUnits??i?.recommendations?.repUnits,note:o.note??i?.recommendations?.note}})}),r=(t.items||[]).map(n=>n.kind?a(n):s(n));return{...t,resolvedItems:r}}function tt(){return["localhost","127.0.0.1"].includes(window.location.hostname)}function st(e){e.innerHTML=`
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
          ${tt()?`<button
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
  `,e.querySelector('[data-action="create"]')?.addEventListener("click",()=>k("/studio")),e.querySelector('[data-action="search"]')?.addEventListener("click",()=>k("/search")),e.querySelector('[data-action="programs"]')?.addEventListener("click",()=>k("/programs")),e.querySelector('[data-action="exercises"]')?.addEventListener("click",()=>k("/exercises")),at(e).catch(t=>console.warn("[recent] skipped",t))}async function at(e){const t=Ie();if(t.length===0)return;const s=e.querySelector('[data-region="recent"]');if(!s)return;const{programs:a}=await z(),r=new Map(a.map(o=>[o.id,o])),n=t.map(o=>({...o,program:r.get(o.id)})).filter(o=>o.program).slice(0,3);n.length!==0&&(s.classList.remove("hidden"),s.innerHTML=`
    <div class="flex items-baseline justify-between">
      <h2 class="eyebrow">Pick up where you left off</h2>
      ${n.length===3&&t.length>3?'<button data-action="all-recent" class="text-xs text-slate-400 hover:text-brand-400 transition-colors">All</button>':""}
    </div>
    <ul class="space-y-2">
      ${n.map(o=>nt(o.program)).join("")}
    </ul>
  `,s.querySelectorAll("[data-program-id]").forEach(o=>{o.addEventListener("click",()=>k(`/program/${o.dataset.programId}`))}),s.querySelector('[data-action="all-recent"]')?.addEventListener("click",()=>k("/programs")))}function nt(e){const t=e.items?.length||e.exercises?.length||0,s=Te(e.id).size,a=t>0?Math.round(s/t*100):0,r=s===0?"Not started":s>=t?"Complete":`${s} of ${t} done`;return`
    <li>
      <button
        data-program-id="${e.id}"
        class="w-full card p-4 text-left active:scale-[0.98] transition-transform"
      >
        <div class="flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold tracking-tight truncate">${rt(e.title)}</h3>
            <div class="flex items-center gap-2 mt-2">
              <div class="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-linear-to-r from-brand-500 to-brand-400 transition-all" style="width: ${a}%"></div>
              </div>
              <span class="text-[11px] text-slate-400 num font-medium whitespace-nowrap">${r}</span>
            </div>
          </div>
          <svg class="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </button>
    </li>
  `}function rt(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function ot(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/"));try{const[t,s]=await Promise.all([z(),Ae()]);it(e,t.programs,s.plans)}catch(t){dt(e,t)}}function it(e,t,s){const a=new Map(t.map(n=>[n.id,n])),r=[];for(const n of s)for(const o of n.subPlans||[]){const i=(o.programs||[]).map(l=>a.get(l)).filter(Boolean);i.length!==0&&r.push({category:n.name,title:o.name,description:o.description,programs:i})}e.innerHTML=`
    <header class="px-6 pt-12 pb-4 flex items-center gap-3">
      <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="h-page">Programs</h1>
    </header>

    <main class="flex-1 px-6 pb-24 space-y-8">
      ${r.map((n,o)=>`
        <section class="space-y-3 animate-slide-up" style="animation-delay: ${o*30}ms">
          <div>
            <p class="eyebrow">${n.category}</p>
            <h2 class="h-section mt-1">${n.title}</h2>
            ${n.description?`<p class="text-sm text-slate-400 mt-1 leading-relaxed">${n.description}</p>`:""}
          </div>
          <ul class="space-y-2">
            ${n.programs.map(i=>lt(i)).join("")}
          </ul>
        </section>
      `).join("")}
    </main>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/")),e.querySelectorAll("[data-program-id]").forEach(n=>{n.addEventListener("click",()=>{k(`/program/${n.dataset.programId}`)})})}function lt(e){const t=e.items?.length||e.exercises?.length||0;return`
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
  `}function dt(e,t){e.innerHTML=`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold text-red-400 mb-2">Couldn't load programs</h2>
        <p class="text-sm text-slate-400">${t?.message||t}</p>
      </div>
    </main>
  `}function Be(e){if(!e)return null;const t=[/youtube\.com\/watch\?v=([^&]+)/,/youtube\.com\/shorts\/([^?&/]+)/,/youtube\.com\/embed\/([^?&/]+)/,/youtu\.be\/([^?&/]+)/];for(const s of t){const a=e.match(s);if(a)return a[1]}return null}function ct(e,t="hqdefault"){const s=Be(e);return s?`https://i.ytimg.com/vi/${s}/${t}.jpg`:null}function ut(e,t={}){const s=Be(e);if(!s)return null;const a=new URLSearchParams({autoplay:"1",rel:"0",modestbranding:"1",playsinline:"1"}),r=Math.floor(t.startTime||0),n=Math.floor(t.endTime||0),o=!(r>0&&n>0&&r>=n);return o&&r>0&&a.set("start",String(r)),o&&n>0&&a.set("end",String(n)),`https://www.youtube.com/embed/${s}?${a.toString()}`}function Ne(e,t="w_800,q_auto,f_auto"){return!e||!e.includes("cloudinary.com")?e:e.replace("/upload/",`/upload/${t}/`)}function pt(e){if(!e||!e.type)return"unknown";if(["youtube","tiktok","vimeo"].includes(e.type))return"embed";const t=e.mediaType==="video"||["mp4","webm","mov"].includes(e.format);return e.format==="gif"?"image":t?"video":"image"}function xe(e,t,s={}){if(!t){e.innerHTML='<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No media</div>';return}const a=pt(t),r=s.className||"w-full max-h-[60vh] object-contain rounded-2xl bg-slate-800";switch(e.classList.add("animate-fade-in"),a){case"image":mt(e,t,r,s.onError);break;case"video":xt(e,t,r,s.autoplay,s.onError);break;case"embed":ft(e,t,r,s.onEmbedPlay);break;default:e.innerHTML=`<div class="${r} flex items-center justify-center text-slate-500 text-sm">Unsupported media type</div>`}}function mt(e,t,s,a){const r=t.type==="cloudinary"?Ne(t.url,"w_800,q_auto,f_auto"):t.url;e.innerHTML=`
    <img
      src="${r}"
      alt="Exercise demonstration"
      class="${s}"
      loading="lazy"
      decoding="async"
    />
  `,a&&e.querySelector("img")?.addEventListener("error",()=>a(),{once:!0})}function xt(e,t,s,a=!0,r){const n=t.type==="cloudinary"?Ne(t.url,"w_800,q_auto,f_auto"):t.url;let o="";if(t.format==="mp4"){const l=t.startTime||0,d=t.endTime||0,u=!(l>0&&d>0&&l>=d);u&&l>0&&d>0?o=`#t=${l},${d}`:u&&l>0&&(o=`#t=${l}`)}e.innerHTML=`
    <video
      src="${n}${o}"
      class="${s} cursor-pointer"
      ${a?"autoplay":""}
      loop
      muted
      playsinline
      preload="metadata"
    ></video>
  `;const i=e.querySelector("video");i?.addEventListener("click",()=>{i.paused?i.play():i.pause()}),r&&i?.addEventListener("error",()=>r(),{once:!0})}function ft(e,t,s,a){const o=`${(t.url||"").includes("/shorts/")?"aspect-9/16 max-h-[70vh] mx-auto":"aspect-video"} w-full rounded-2xl overflow-hidden bg-slate-900`,i=t.type==="youtube"?ct(t.url,"hqdefault"):null;e.innerHTML=`
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
  `;const l=e.querySelector('[data-action="play-embed"]');l&&l.addEventListener("click",()=>{const d=t.type==="youtube"?ut(t.url,{startTime:t.startTime,endTime:t.endTime}):t.url;e.innerHTML=`
        <div class="${o} relative">
          <iframe
            src="${d}"
            class="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      `,a?.()},{once:!0})}function _(e,t){const s=vt((t||[]).filter(Boolean));if(s.length===0){e.innerHTML='<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No demos available</div>';return}const a=new Set;let r=!1;const n=new Set(["youtube","tiktok","vimeo"]);s.forEach((i,l)=>{n.has(i.type)&&a.add(l)}),a.size>0?o():e.innerHTML=`
      <div data-region="loader" class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center">
        <div class="demo-loader" aria-label="Loading demo"></div>
      </div>
    `,s.forEach((i,l)=>{n.has(i.type)||gt(i,d=>{d&&(a.add(l),o())})}),setTimeout(()=>{a.size===0&&(s.forEach((i,l)=>a.add(l)),o())},6e3);function o(){const i=s.filter((u,c)=>a.has(c));if(i.length===0)return;const l=s.findIndex((u,c)=>a.has(c)),d=r?-1:i.indexOf(s[l]);bt(e,i,d>=0?d:0,u=>{r=r||u})}}function gt(e,t){const s=e.url;if(!s){t(!1);return}if(!(e.format==="gif")&&(e.mediaType==="video"||["mp4","webm","mov"].includes(e.format))){const n=document.createElement("video");n.preload="metadata",n.src=s,n.addEventListener("loadeddata",()=>t(!0),{once:!0}),n.addEventListener("error",()=>t(!1),{once:!0})}else{const n=new Image;if(n.src=s,n.complete&&n.naturalWidth>0){t(!0);return}n.addEventListener("load",()=>t(!0),{once:!0}),n.addEventListener("error",()=>t(!1),{once:!0})}}function bt(e,t,s,a){let r=ht(s,t.length);e.innerHTML=`
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
  `;const n=e.querySelector('[data-region="track"]'),o=e.querySelector('[data-region="dots"]'),i=e.querySelector('[data-region="caption"]');n.style.scrollbarWidth="none";const l=new Set;t.forEach((p,m)=>{const g=document.createElement("div");g.className="shrink-0 w-full snap-center",xe(g,p,{onError:()=>{g.innerHTML=`<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">Couldn't load</div>`},onEmbedPlay:()=>l.add(m)}),n.appendChild(g)});const d=()=>{o&&(o.innerHTML=t.map((p,m)=>`
        <button data-dot-index="${m}" aria-label="Demo ${m+1}" class="p-1.5 -m-1.5 group touch-manipulation">
          <span class="block w-1 h-1 rounded-full transition-colors ${m===r?"bg-brand-400":"bg-slate-600 group-hover:bg-slate-500"}"></span>
        </button>`).join(""),o.querySelectorAll("[data-dot-index]").forEach(p=>{p.addEventListener("click",()=>{a(!0);const m=Number(p.dataset.dotIndex),g=n.children[m];g&&n.scrollTo({left:g.offsetLeft-n.offsetLeft,behavior:"smooth"})})}))},u=()=>{if(!i)return;const p=t[r],m=yt(p),g=p.metadata?.creatorUrl,b=p.url;if(g){const y=Ue(p),x=p.metadata?.channel;x?i.innerHTML=`${N(y)} · <a href="${N(g)}" target="_blank" rel="noopener" class="hover:text-brand-400 transition-colors">${N(x)} ↗</a>`:i.innerHTML=`<a href="${N(g)}" target="_blank" rel="noopener" class="hover:text-brand-400 transition-colors">${N(m)} ↗</a>`}else b&&(p.type==="youtube"||p.type==="tiktok"||p.type==="vimeo")?i.innerHTML=`<a href="${b}" target="_blank" rel="noopener" class="hover:text-brand-400 transition-colors">${N(m)} ↗</a>`:i.textContent=m};let c=!1;n.addEventListener("scroll",()=>{c||(c=!0,requestAnimationFrame(()=>{c=!1;const p=n.children[0]?.offsetWidth||1,m=Math.round(n.scrollLeft/p);if(m!==r&&m>=0&&m<t.length){if(a(!0),l.has(r)){const g=n.children[r];g&&(l.delete(r),xe(g,t[r],{onError:()=>{},onEmbedPlay:()=>l.add(r)}))}r=m,d(),u()}}))},{passive:!0}),requestAnimationFrame(()=>{const p=n.children[r];p&&(n.scrollLeft=p.offsetLeft-n.offsetLeft)}),d(),u()}function ht(e,t){return Math.max(0,Math.min(t-1,e))}function vt(e){const t={cloudinary:0,youtube:1,vimeo:2,tiktok:2,url:3,local:4};return[...e].sort((s,a)=>s.isPrimary&&!a.isPrimary?-1:a.isPrimary&&!s.isPrimary?1:(t[s.type]??99)-(t[a.type]??99))}function Ue(e){return{cloudinary:e.format==="mp4"?"Video":"Demo",youtube:"YouTube",tiktok:"TikTok",vimeo:"Vimeo",local:"Demo",url:"External"}[e.type]||e.type}function yt(e){const t=Ue(e),s=e.metadata?.channel;return s?`${t} · ${s}`:e.notes?`${t} · ${e.notes}`:t}function N(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function He(e){const t=String(e?.sets??"").trim(),s=String(e?.reps??"").trim();if(/^decrement/i.test(t)){const r=s.match(/^(\d+)\s*(?:->|→|-)\s*(\d+)$/);if(r){const n=parseInt(r[1],10),o=parseInt(r[2],10);if(n>o&&n>=1&&o>=1&&n<=50)return{kind:"decrement",total:n-o+1,start:n,end:o}}return{kind:"plain"}}const a=t.match(/^(\d+)\s*-\s*(\d+)$/);if(a){const r=parseInt(a[1],10),n=parseInt(a[2],10);return r>=1&&n>r&&n<=50?{kind:"range",min:r,max:n}:{kind:"plain"}}if(/^\d+$/.test(t)){const r=parseInt(t,10);if(r>=1&&r<=50)return{kind:"integer",total:r}}return{kind:"plain"}}const wt='<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h5M20 20v-5h-5M5 9a7 7 0 0111-3m3 8a7 7 0 01-11 3"/></svg>';function _e(e,t,s){const a=e.reps||"—",r=e.repUnits||"reps",n=String(a).length>5;if(t.kind==="plain")return`
      ${V(a,r,n)}
      ${V(e.sets||"—","sets",String(e.sets||"").length>5)}
    `;if(t.kind==="decrement"){const o=t.total-s,i=s>=t.total?"✓":String(o);return`
      <div class="bg-slate-800/50 rounded-xl p-3 text-center overflow-hidden">
        <p class="text-3xl font-extrabold leading-none num tracking-tight ${s>=t.total?"text-emerald-400":"text-brand-400"}" data-set="reps">${i}</p>
        <p class="label-meta mt-1.5">reps this set</p>
      </div>
      ${fe(t.total,s,"sets")}
    `}if(t.kind==="range"){const o=Math.max(0,s-t.min),i=s>=t.min;return`
      ${V(a,r,n)}
      ${kt(t,s,o,i)}
    `}return`
    ${V(a,r,n)}
    ${fe(t.total,s,"sets")}
  `}function V(e,t,s){return`
    <div class="bg-slate-800/50 rounded-xl p-3 text-center overflow-hidden">
      <p class="${s?"text-lg":"text-3xl"} font-extrabold text-brand-400 leading-none num tracking-tight">${le(String(e))}</p>
      <p class="label-meta mt-1.5">${le(t)}</p>
    </div>
  `}function fe(e,t,s){const a=t>=e;return`
    <div class="relative">
      <div class="set-tile p-3 text-center h-full" data-set="tile" role="button" tabindex="0" aria-label="Log a set">
        <div class="set-fill" data-set="fill" style="transform:scaleX(${Math.min(t,e)/e})"></div>
        <div class="set-content">
          <p class="leading-none num"><span class="text-3xl font-extrabold" data-set="done">${t}</span><span class="text-lg font-bold text-slate-300">/${e}</span></p>
          <p class="label-meta mt-1.5" data-set="cap">${a?"complete":le(s)}</p>
        </div>
      </div>
      <button data-set="undo" class="set-nub ${t===0?"set-hide":""} absolute -top-2 -left-2 w-7 h-7 rounded-full bg-slate-700 border border-slate-600 text-slate-200 text-lg font-bold flex items-center justify-center shadow-lg active:bg-slate-600" aria-label="Remove last set">−</button>
      <button data-set="reset" class="set-nub ${a?"":"set-hide"} absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-800 border border-slate-600 text-slate-400 flex items-center justify-center shadow-lg active:bg-slate-700" aria-label="Reset sets">${wt}</button>
    </div>
  `}function kt(e,t,s,a){const r=Math.min(t,e.min)/e.min,n=a&&s<e.max-e.min,o=a?s?`${t} done · nice`:"complete":"sets";return`
    <div class="relative">
      <div class="set-tile p-3 text-center h-full ${a?"set-done":""}" data-set="tile" role="button" tabindex="0" aria-label="Log a set">
        <div class="set-fill" data-set="fill" style="transform:scaleX(${r})"></div>
        <div class="set-content">
          <p class="leading-none num"><span class="text-3xl font-extrabold" data-set="done">${t}</span>${a?"":`<span class="text-lg font-bold text-slate-300">/${e.min}</span>`}</p>
          <p class="label-meta mt-1.5 ${a?"text-emerald-200":""}" data-set="cap">${o}</p>
        </div>
      </div>
      <button data-set="undo" class="set-nub ${t===0?"set-hide":""} absolute -top-2 -left-2 w-7 h-7 rounded-full bg-slate-700 border border-slate-600 text-slate-200 text-lg font-bold flex items-center justify-center shadow-lg active:bg-slate-600" aria-label="Remove last set">−</button>
      <button data-set="bonus" class="set-nub ${n?"":"set-hide"} absolute -bottom-2 -right-2 h-7 px-2.5 rounded-full bg-emerald-600 border border-emerald-400/40 text-white text-xs font-bold flex items-center justify-center shadow-lg" aria-label="Log a bonus set">+${e.max-e.min-s} bonus</button>
    </div>
  `}function ze(e,t,s){if(t.kind==="plain")return;const a=e.querySelector('[data-set="tile"]');if(!a)return;const r=e.querySelector('[data-set="undo"]'),n=e.querySelector('[data-set="reset"]'),o=e.querySelector('[data-set="bonus"]'),i=t.kind==="range"?t.min:t.total,l=t.kind==="range"?t.max:t.total,d=u=>{const c=Math.max(0,Math.min(l,u)),p=s.count>=i,m=c>=i;s.onCount(c),m!==p&&s.onSetsDone?.(m)};a.addEventListener("click",()=>{s.count<l&&d(s.count+1)}),a.addEventListener("keydown",u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),s.count<l&&d(s.count+1))}),r?.addEventListener("click",u=>{u.stopPropagation(),s.count>0&&d(s.count-1)}),n?.addEventListener("click",u=>{u.stopPropagation(),d(0)}),o?.addEventListener("click",u=>{u.stopPropagation(),s.count<l&&d(s.count+1)})}function le(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function $t(e,t){const s=document.createElement("article");s.className=`card overflow-hidden transition-all ${t.isCompleted?"opacity-60":""}`,s.dataset.itemIndex=String(t.index);const a=e.exercise?.demos||[],n=`${t.index+1}. ${e.name}`,o=He(e),i=t.setCount||0;if(s.innerHTML=`
    <div class="flex items-stretch">
      <button
        data-action="toggle"
        class="flex-1 min-w-0 px-4 py-4 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation"
      >
        <div class="flex-1 min-w-0">
          ${Et(e.tags)}
          <h3 class="font-semibold tracking-tight leading-tight ${t.isCompleted?"line-through text-slate-500":"text-slate-100"}">
            ${D(n)}
          </h3>
          <p class="text-sm text-slate-400 mt-1 num truncate">
            ${St(e)}
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
          ${_e(e,o,i)}
        </div>
        ${e.note?`
          <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
            <p class="text-sm text-slate-300 leading-relaxed">${D(e.note)}</p>
          </div>
        `:""}
        ${e.exercise?.purpose?.trim()?`
          <div class="text-sm text-slate-300 leading-relaxed">
            <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">Purpose</p>
            <p>${D(e.exercise.purpose)}</p>
          </div>
        `:""}
        ${e.exercise?.how_to?.trim()?`
          <div class="text-sm text-slate-300 leading-relaxed">
            <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">How to perform</p>
            <p class="whitespace-pre-line">${D(e.exercise.how_to)}</p>
          </div>
        `:""}
      </div>
    </div>
  `,t.isExpanded&&a.length>0){const l=s.querySelector("[data-media-slot]");l&&_(l,a)}return t.isExpanded&&o.kind!=="plain"&&ze(s,o,{count:i,onCount:l=>t.onSetCount?.(t.index,l),isCompleted:t.isCompleted,onSetsDone:l=>t.onSetsDone?.(t.index,l)}),s.querySelector('[data-action="toggle"]')?.addEventListener("click",()=>{t.onToggle?.(t.index)}),s.querySelector('[data-action="complete"]')?.addEventListener("click",l=>{l.stopPropagation(),t.onComplete?.(t.index)}),s}function St(e){const t=e.reps||"—",s=e.sets||"—";return`${t} · ${s} sets`}function Et(e=[]){return e.length?`
    <div class="flex gap-1.5 mb-1.5">
      ${e.map(t=>`
        <span class="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">${D(t)}</span>
      `).join("")}
    </div>
  `:""}function D(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const Lt={superset:"Super Set",compound:"Compound",circuit:"Circuit"};function qt(e,t){const s=document.createElement("article");s.className=`transition-all ${t.isCompleted?"opacity-60":""}`,s.dataset.itemIndex=String(t.index);const a=Lt[e.kind]||e.kind,r=t.index+1,n=e.exercises.map(u=>He(u)),o=e.exercises.map((u,c)=>t.getMemberSetCount?.(c)||0),i=e.exercises.map((u,c)=>ge(n[c],o[c])),l=e.exercises.map((u,c)=>{const p=String.fromCharCode(97+c),m=`${r}${p}. ${be(u.name)}`,g=c===0,b=c===e.exercises.length-1,y=t.isCompleted||i[c];return`
      <div class="card ${g?"rounded-t-2xl":"rounded-t-none"} ${b?"rounded-b-2xl":"rounded-b-none"} overflow-hidden ${g?"":"border-t-0"}">
        ${g?"":'<div class="h-px bg-slate-700/50"></div>'}
        <div class="flex items-stretch">
          <button
            data-action="toggle-member"
            data-member-idx="${c}"
            class="flex-1 min-w-0 px-4 py-4 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation"
          >
            <div class="flex-1 min-w-0">
              ${g?`<div class="flex gap-1.5 mb-1.5"><span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300">${a}</span></div>`:""}
              <h3 class="font-semibold tracking-tight leading-tight ${y?"line-through text-slate-500":"text-slate-100"}">
                ${m}
              </h3>
              <p class="text-sm text-slate-400 mt-1 num truncate">
                ${u.reps||"—"} · ${u.sets||"—"} sets
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
        <div data-region="member-content-${c}" class="${t.isExpanded?"":"hidden"}">
          <div class="px-4 pb-4 space-y-4">
            <div data-member-media="${c}"></div>
            <div class="grid grid-cols-2 gap-3" data-member-tracker="${c}">
              ${_e(u,n[c],o[c])}
            </div>
            ${u.note?`
            <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
              <p class="text-sm text-slate-300 leading-relaxed">${be(u.note)}</p>
            </div>`:""}
          </div>
        </div>
      </div>
    `}).join("");s.innerHTML=l,s.querySelectorAll('[data-action="toggle-member"]').forEach(u=>{u.addEventListener("click",()=>{t.onToggle?.(t.index)})}),s.querySelectorAll('[data-action="complete"]').forEach(u=>{u.addEventListener("click",c=>{c.stopPropagation(),t.onComplete?.(t.index)})}),t.isExpanded&&e.exercises.forEach((u,c)=>{const p=s.querySelector(`[data-member-media="${c}"]`),m=u.exercise?.demos||[];p&&m.length>0&&_(p,m);const g=n[c];if(g.kind==="plain")return;const b=s.querySelector(`[data-member-tracker="${c}"]`);b&&ze(b,g,{count:o[c],onCount:y=>t.onMemberSetCount?.(t.index,c,y,d(c,y)),isCompleted:t.isCompleted,onSetsDone:()=>{}})});function d(u,c){return e.exercises.every((p,m)=>{const g=n[m],b=m===u?c:o[m];return ge(g,b)})}return s}function ge(e,t){if(!e||e.kind==="plain")return!1;const s=e.kind==="range"?e.min:e.total;return t>=s}function be(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const he=["Nice work!","Killer moves!","Awesome job!","Crushed it!","You did it!","Beast mode!","On fire!","Way to go!","Strengthened and Conditioned!"];let ve=0;function ee(){const e=Date.now();if(e-ve<5e3)return;ve=e;const t=he[Math.floor(Math.random()*he.length)],s=document.createElement("div");s.className="celebration-flash";const a=document.createElement("div");a.className="celebration-text",a.textContent=t,document.body.appendChild(s),document.body.appendChild(a),setTimeout(()=>s.remove(),700),setTimeout(()=>a.remove(),3100)}async function Ct(e,t){e.innerHTML=K(`
    <main class="flex-1 px-6 pb-24 flex items-center justify-center">
      <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </main>
  `),X(e);try{const s=await et(t);if(!s){jt(e,t);return}Xe(s.id),Mt(e,s)}catch(s){Tt(e,s)}}function Mt(e,t){const s=Te(t.id),a=t.resolvedItems.length;let r=-1;e.innerHTML=K(`
    <div class="sticky top-15 z-10 px-6 pt-2 pb-3 bg-slate-950/85 backdrop-blur-md border-b border-slate-900">
      <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div data-region="progress-bar" class="h-full bg-linear-to-r from-brand-500 to-brand-400 transition-all duration-500" style="width: ${s.size/a*100}%"></div>
      </div>
      <p class="text-[11px] text-slate-500 mt-1.5 font-medium num">
        <span data-region="completed-count">${s.size}</span> of ${a} complete
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
  `,t.title),X(e);const n=e.querySelector('[data-region="items"]'),o=e.querySelector('[data-region="actions"]'),i=()=>{n.innerHTML="",t.resolvedItems.forEach((u,c)=>{const p=document.createElement("li"),m={index:c,isExpanded:c===r,isCompleted:s.has(c),setCount:me(t.id,c),getMemberSetCount:b=>me(t.id,`${c}:${b}`),onToggle:b=>{r=r===b?-1:b,d(),r===b&&requestAnimationFrame(()=>{const y=n.querySelector(`[data-item-index="${b}"]`);if(y){const x=window.scrollY+y.getBoundingClientRect().top-130;window.scrollTo({top:Math.max(0,x),behavior:"smooth"})}})},onSetCount:(b,y)=>{G(t.id,b,y),d()},onMemberSetCount:(b,y,x,w)=>{G(t.id,`${b}:${y}`,x);const $=s.has(b);if(w!==$){const h=s.size===a,q=Q(t.id,b);s.clear(),q.forEach(M=>s.add(M)),!h&&s.size===a&&setTimeout(ee,250)}d()},onSetsDone:(b,y)=>{const x=s.has(b);if(y===x)return;const w=s.size===a,$=Q(t.id,b);s.clear(),$.forEach(h=>s.add(h)),d(),!w&&s.size===a&&setTimeout(ee,250)},onComplete:b=>{const y=s.size===a,x=Q(t.id,b);s.clear(),x.forEach($=>s.add($)),G(t.id,b,0);const w=t.resolvedItems[b];w&&Array.isArray(w.exercises)&&w.exercises.forEach(($,h)=>G(t.id,`${b}:${h}`,0)),x.has(b)&&r===b&&(r=-1),d(),!y&&s.size===a&&setTimeout(ee,250)}},g=u.kind==="single"?$t(u,m):qt(u,m);p.appendChild(g),n.appendChild(p)})},l=()=>{const u=e.querySelector('[data-region="progress-bar"]');u&&(u.style.width=`${s.size/a*100}%`);const c=e.querySelector('[data-region="completed-count"]');c&&(c.textContent=String(s.size)),o.classList.toggle("hidden",s.size===0)},d=()=>{i(),l()};d(),e.querySelector('[data-action="reset"]')?.addEventListener("click",()=>{confirm("Reset progress for this program?")&&(Ke(t.id),s.clear(),d())}),e.querySelector('[data-action="share"]')?.addEventListener("click",()=>{const u=window.location.href;navigator.share?navigator.share({title:t.title,text:`Check out: ${t.title}`,url:u}).catch(()=>{}):navigator.clipboard?.writeText(u).then(()=>alert("Link copied!")).catch(()=>prompt("Copy:",u))})}function K(e,t="Program"){return`
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
  `}function X(e){e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/programs"))}function jt(e,t){e.innerHTML=K(`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold mb-2">Program not found</h2>
        <p class="text-sm text-slate-400">No program with id <code class="text-slate-300">${I(t)}</code>.</p>
      </div>
    </main>
  `),X(e)}function Tt(e,t){e.innerHTML=K(`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold text-red-400 mb-2">Couldn't load program</h2>
        <p class="text-sm text-slate-400">${I(t?.message||String(t))}</p>
      </div>
    </main>
  `),X(e)}function I(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Pt(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/")),e.querySelector('[data-action="new-program"]')?.addEventListener("click",()=>k("/studio/program")),e.querySelector('[data-action="new-exercise"]')?.addEventListener("click",()=>k("/studio/exercise")),e.querySelector('[data-action="ai-builder"]')?.addEventListener("click",()=>k("/studio/ai"))}let H=null;async function It(){if(H)return H;const{exercises:e}=await B();return H=e.map(t=>({id:t.id,name:t.name,hasDemos:(t.demos||[]).length>0,tokens:A(t.name).concat((t.aliases||[]).flatMap(s=>A(s))).concat(A(t.id.replace(/[-_]/g," "))),exercise:t})),H}function At(e){H&&H.push({id:e.id,name:e.name,hasDemos:(e.demos||[]).length>0,tokens:A(e.name).concat((e.aliases||[]).flatMap(t=>A(t))).concat(A(e.id.replace(/[-_]/g," "))),exercise:e})}async function Z(e,t=10){const s=await It();if(!e||!e.trim())return s.slice(0,t);const a=A(e);return s.map(r=>({...r,score:Nt(r.tokens,a)})).filter(r=>r.score>0).sort((r,n)=>n.score-r.score).slice(0,t)}function Bt(e,t={}){e.innerHTML=`
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
  `;const s=e.querySelector('[data-input="search"]'),a=e.querySelector('[data-region="results"]'),r=e.querySelector('[data-region="empty"]'),n=e.querySelector('[data-action="create-new"]');let o=null;const i=(d,u)=>{if(!u||!u.trim()){a.classList.add("hidden"),r.classList.add("hidden"),n.classList.add("hidden");return}if(n.classList.remove("hidden"),d.length===0){a.classList.add("hidden"),r.classList.remove("hidden");return}r.classList.add("hidden"),a.classList.remove("hidden"),a.innerHTML=d.map(c=>`
      <li>
        <button
          data-exercise-id="${c.id}"
          class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800/60 active:bg-slate-800 transition-colors flex items-center gap-3 touch-manipulation"
        >
          <span class="flex-1 min-w-0">
            <span class="text-sm font-medium text-slate-100 block truncate">${Ut(c.name)}</span>
          </span>
          ${c.hasDemos?`
            <span class="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-sm">demo</span>
          `:""}
        </button>
      </li>
    `).join(""),a.querySelectorAll("[data-exercise-id]").forEach(c=>{c.addEventListener("click",()=>{const p=d.find(m=>m.id===c.dataset.exerciseId);p&&t.onSelect?.(p.exercise)})})},l=async()=>{const d=s.value,u=await Z(d);i(u,d)};s.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(l,150)}),i([],""),n?.addEventListener("click",()=>t.onCreateNew?.(s.value.trim()))}function A(e){return e?e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().split(/[^a-z0-9]+/).filter(t=>t.length>0):[]}function Nt(e,t){let s=0;for(const a of t){let r=0;for(const n of e)n===a?r=Math.max(r,10):n.startsWith(a)?r=Math.max(r,7):n.includes(a)&&(r=Math.max(r,4));if(r===0)return 0;s+=r}return s}function Ut(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const te=[{value:"youtube",label:"YouTube",fields:["url","startTime","endTime","notes"]},{value:"cloudinary",label:"Cloudinary",fields:["url","startTime","endTime","notes"]},{value:"local",label:"Local file",fields:["url","notes"]},{value:"url",label:"URL (external)",fields:["url","notes"]},{value:"tiktok",label:"TikTok",fields:["url","notes"]},{value:"vimeo",label:"Vimeo",fields:["url","startTime","endTime","notes"]}];function ue(e,t){s();function s(){e.innerHTML=`
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-[10px] text-slate-500 uppercase font-semibold">Demo Sources</label>
          <span class="text-[10px] text-slate-500 num">${t.length} demo${t.length!==1?"s":""}</span>
        </div>
        ${t.length===0?'<p class="text-xs text-slate-500 italic">No demos yet. Add one below.</p>':""}
        <div class="space-y-3">
          ${t.map((n,o)=>a(n,o)).join("")}
        </div>
        <button data-action="add-demo" class="w-full border border-dashed border-slate-700 rounded-xl py-2.5 text-sm text-slate-400 hover:text-brand-400 hover:border-brand-500/50 transition-colors touch-manipulation">
          + Add demo
        </button>
      </div>
    `,r()}function a(n,o){const l=(te.find(u=>u.value===n.type)||te[0]).fields.includes("startTime"),d=n.type==="youtube"?Ht(n.url):null;return`
      <div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 space-y-2.5" data-demo-index="${o}">
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-slate-500 font-bold num">#${o+1}</span>
          <select data-demo-field="type" data-index="${o}" class="flex-1 bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-brand-500">
            ${te.map(u=>`<option value="${u.value}"${n.type===u.value?" selected":""}>${u.label}</option>`).join("")}
          </select>
          <label class="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer select-none">
            <input type="radio" name="primary-demo" data-index="${o}" ${n.isPrimary?"checked":""} class="w-3 h-3 text-brand-500"/>
            <span>Primary</span>
          </label>
          <button data-action="remove-demo" data-index="${o}" class="p-1 rounded-sm hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors" aria-label="Remove demo">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div>
          <input data-demo-field="url" data-index="${o}" value="${we(n.url||"")}" placeholder="https://..." class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500 font-mono"/>
        </div>
        ${d?`<img src="${d}" alt="Thumbnail" class="w-full h-20 object-cover rounded-lg bg-slate-900"/>`:""}
        ${l?`
          <div class="grid grid-cols-2 gap-2">
            <div><label class="text-[10px] text-slate-500 block mb-0.5">Start (sec)</label>
              <input data-demo-field="startTime" data-index="${o}" type="number" min="0" value="${n.startTime||0}" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-brand-500 num"/></div>
            <div><label class="text-[10px] text-slate-500 block mb-0.5">End (sec)</label>
              <input data-demo-field="endTime" data-index="${o}" type="number" min="0" value="${n.endTime||0}" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-brand-500 num"/></div>
          </div>
        `:""}
        <div>
          <input data-demo-field="notes" data-index="${o}" value="${we(n.notes||"")}" placeholder="Notes (optional)" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/>
        </div>
      </div>
    `}function r(){e.querySelector('[data-action="add-demo"]')?.addEventListener("click",()=>{t.push({type:"youtube",mediaType:"video",format:"youtube",url:"",startTime:0,endTime:0,isPrimary:t.length===0,notes:""}),s()}),e.querySelectorAll('[data-action="remove-demo"]').forEach(n=>{n.addEventListener("click",()=>{const o=+n.dataset.index,i=t[o].isPrimary;t.splice(o,1),i&&t.length>0&&(t[0].isPrimary=!0),s()})}),e.querySelectorAll('input[name="primary-demo"]').forEach(n=>{n.addEventListener("change",()=>{const o=+n.dataset.index;t.forEach((i,l)=>{i.isPrimary=l===o})})}),e.querySelectorAll('[data-demo-field="type"]').forEach(n=>{n.addEventListener("change",()=>{const o=+n.dataset.index;t[o].type=n.value,t[o].format=n.value==="youtube"?"youtube":n.value==="cloudinary"?ye(t[o].url):n.value,t[o].mediaType="video",s()})}),e.querySelectorAll("[data-demo-field]").forEach(n=>{if(n.tagName==="SELECT")return;const o=()=>{const i=+n.dataset.index,l=n.dataset.demoField;l==="startTime"||l==="endTime"?t[i][l]=Number(n.value)||0:t[i][l]=n.value,l==="url"&&t[i].type==="cloudinary"&&(t[i].format=ye(n.value))};n.addEventListener("input",o),n.addEventListener("change",o)})}}function Ht(e){if(!e)return null;const t=e.match(/(?:v=|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);return t?`https://img.youtube.com/vi/${t[1]}/hqdefault.jpg`:null}function ye(e){return e&&/\.(mp4|webm|mov)(\?|$)/i.test(e)?"mp4":"gif"}function we(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function _t(e,t,s){const{items:a}=t;if(a.length===0){e.innerHTML="";return}e.innerHTML=a.map((r,n)=>r.type==="group"?Rt(r,n,t):zt(r,n,t)).join(""),Jt(e,t,s)}function zt(e,t,s){const a=s.expandedIndex===t,r=e.exerciseNote||"",n=r.length>50?r.substring(0,50)+"…":r,o=(e.tags||[]).map(i=>`<span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-300">${i}</span>`).join("");return`<li class="card" data-idx="${t}" data-type="single">
  <div class="flex items-center px-4 py-3 gap-2 relative">
    <div class="flex-1 min-w-0 cursor-pointer" data-action="expand" data-idx="${t}">
      ${o?`<div class="flex gap-1 mb-1">${o}</div>`:""}
      <p class="text-sm font-medium text-slate-100 truncate">${Y(e.exerciseName)}</p>
      <p class="text-xs text-slate-400 num mt-0.5">${e.reps||"—"} ${e.repUnits||"reps"} · ${e.sets||"—"} sets</p>
      ${n?`<p class="text-[11px] text-slate-500 truncate mt-0.5 italic">${Y(n)}</p>`:""}
    </div>
    ${Re(t)}
  </div>
  ${a?`<div class="border-t border-slate-800" data-region="edit-form" data-idx="${t}"></div>`:""}
</li>`}function Rt(e,t,s){const a=s.expandedIndex===t,r={superset:"Superset",compound:"Compound",circuit:"Circuit"}[e.kind]||e.kind,n=e.members.map((o,i)=>`
    <div class="flex items-center px-4 py-2.5 gap-2 ${i>0?"border-t border-slate-800/50":""}">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-100 truncate">${Y(o.exerciseName)}</p>
        <p class="text-xs text-slate-400 num mt-0.5">${o.reps||"—"} ${o.repUnits||"reps"} · ${o.sets||"—"} sets</p>
      </div>
      ${a?`<div class="flex gap-0.5">
        <button data-action="member-up" data-idx="${t}" data-mi="${i}" class="p-1 rounded text-slate-600 hover:text-slate-300 ${i===0?"opacity-20 pointer-events-none":""}" aria-label="Move up"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg></button>
        <button data-action="member-down" data-idx="${t}" data-mi="${i}" class="p-1 rounded text-slate-600 hover:text-slate-300 ${i===e.members.length-1?"opacity-20 pointer-events-none":""}" aria-label="Move down"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></button>
        <button data-action="member-remove" data-idx="${t}" data-mi="${i}" class="p-1 rounded text-slate-600 hover:text-red-400" aria-label="Remove from group"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
      </div>`:""}
    </div>
  `).join("");return`<li class="card border-l-[3px] border-l-brand-500" data-idx="${t}" data-type="group">
  <div class="flex items-center px-4 py-2 gap-2 bg-brand-500/5 relative">
    <div class="flex-1 min-w-0 cursor-pointer" data-action="expand" data-idx="${t}">
      <span class="text-[10px] font-bold uppercase tracking-wide text-brand-300">${r}</span>
      <span class="text-[10px] text-slate-500 num ml-2">${e.members.length} exercises</span>
    </div>
    ${Re(t)}
  </div>
  ${n}
  ${a?`<div class="border-t border-slate-800" data-region="edit-form" data-idx="${t}"></div>`:""}
</li>`}function Re(e){return`<button data-action="menu" data-idx="${e}" class="relative z-10 p-3 -mr-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation shrink-0" aria-label="Actions">
    <svg class="w-5 h-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
  </button>`}function Dt(e,t,s,a){Ot();const r=s.items[t],n=r.type==="group",o=s.items.length,i=t>0?s.items[t-1]:null,l=t<o-1?s.items[t+1]:null;let d="";n?(d+=E("edit","Edit group"),t>0&&(d+=E("move-up","Move up")),t<o-1&&(d+=E("move-down","Move down")),i?.type==="single"&&(d+=E("group-above","Add above to group")),l?.type==="single"&&(d+=E("group-below","Add below to group")),d+=E("ungroup","Ungroup")):(d+=E("edit","Edit"),t>0&&(d+=E("move-up","Move up")),t<o-1&&(d+=E("move-down","Move down")),i?.type==="single"?d+=E("group-above","Group with above"):i?.type==="group"&&(d+=E("group-above","Join group above")),l?.type==="single"?d+=E("group-below","Group with below"):l?.type==="group"&&(d+=E("group-below","Join group below"))),d+=E("remove","Remove","text-red-400");const u=n?r.members.map(p=>p.exerciseName).join(" + "):r.exerciseName||"Item",c=document.createElement("div");c.dataset.region="action-menu",c.className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-fade-in",c.innerHTML=`
    <div class="bg-slate-900 border-t border-slate-700 rounded-t-2xl w-full max-w-sm pb-8 pt-3 px-2">
      <div class="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-3"></div>
      <p class="text-xs text-slate-500 text-center mb-2 px-4 truncate">${Y(u)}</p>
      <div class="space-y-0.5">${d}</div>
      <button data-menu-action="cancel" class="w-full mt-2 py-3 text-sm text-slate-500 hover:text-slate-300 transition-colors">Cancel</button>
    </div>
  `,document.body.appendChild(c),c.querySelectorAll("[data-menu-action]").forEach(p=>{p.addEventListener("click",m=>{m.stopPropagation();const g=p.dataset.menuAction;c.remove(),g!=="cancel"&&Ft(g,t,s,a)})}),c.addEventListener("click",p=>{p.target===c&&c.remove()})}function E(e,t,s=""){return`<button data-menu-action="${e}" class="w-full text-left px-5 py-3 text-sm font-medium rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors ${s}">${t}</button>`}function Ot(){document.querySelectorAll('[data-region="action-menu"]').forEach(e=>e.remove())}function Ft(e,t,s,a,r){const n=s.items[t],o=t>0?s.items[t-1]:null,i=t<s.items.length-1?s.items[t+1]:null;switch(e){case"edit":a.onEdit?.(t);break;case"move-up":a.onMove?.(t,t-1);break;case"move-down":a.onMove?.(t,t+1);break;case"group-above":o?.type==="group"?a.onJoinGroup?.(t,t-1):n.type==="group"&&o?.type==="single"?a.onAbsorbIntoGroup?.(t,t-1):ke(t,"above",a);break;case"group-below":i?.type==="group"?a.onJoinGroup?.(t,t+1):n.type==="group"&&i?.type==="single"?a.onAbsorbIntoGroup?.(t,t+1):ke(t,"below",a);break;case"ungroup":a.onUngroup?.(t);break;case"remove":a.onRemove?.(t);break}}function ke(e,t,s){const a=document.createElement("div");a.dataset.region="kind-picker",a.className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in",a.innerHTML=`
    <div class="bg-slate-900 border-t border-slate-700 rounded-t-2xl w-full max-w-sm p-5 space-y-4 pb-8">
      <p class="text-sm font-medium text-slate-200 text-center">Group type</p>
      <div class="flex gap-2">
        <button data-kind="superset" class="flex-1 py-3 rounded-xl text-sm font-medium bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 active:scale-95 transition-all">Superset</button>
        <button data-kind="compound" class="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all">Compound</button>
        <button data-kind="circuit" class="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all">Circuit</button>
      </div>
      <button data-action="cancel-kind" class="w-full py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">Cancel</button>
    </div>
  `,document.body.appendChild(a),a.querySelectorAll("[data-kind]").forEach(r=>{r.addEventListener("click",()=>{a.remove(),s.onGroup?.(e,t,r.dataset.kind)})}),a.querySelector('[data-action="cancel-kind"]')?.addEventListener("click",()=>a.remove()),a.addEventListener("click",r=>{r.target===a&&a.remove()})}function Jt(e,t,s){e.querySelectorAll('[data-action="expand"]').forEach(a=>{a.addEventListener("click",()=>s.onEdit?.(+a.dataset.idx))}),e.querySelectorAll('[data-action="menu"]').forEach(a=>{a.addEventListener("click",r=>{r.stopPropagation(),Dt(e,+a.dataset.idx,t,s)})}),e.querySelectorAll('[data-action="member-up"]').forEach(a=>{a.addEventListener("click",r=>{r.stopPropagation(),s.onMemberMove?.(+a.dataset.idx,+a.dataset.mi,+a.dataset.mi-1)})}),e.querySelectorAll('[data-action="member-down"]').forEach(a=>{a.addEventListener("click",r=>{r.stopPropagation(),s.onMemberMove?.(+a.dataset.idx,+a.dataset.mi,+a.dataset.mi+1)})}),e.querySelectorAll('[data-action="member-remove"]').forEach(a=>{a.addEventListener("click",r=>{r.stopPropagation(),s.onMemberRemove?.(+a.dataset.idx,+a.dataset.mi)})})}function Y(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let f=De(),v=-1;function De(){return{meta:{title:"",id:"",requirements:"",description:"",difficulty:"",duration:""},items:[],newExercises:[]}}function Gt(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/_+$/g,"")}function Vt(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/studio")),e.querySelector('[data-action="start-fresh"]')?.addEventListener("click",()=>{se(e,null,!1)}),e.querySelector('[data-action="edit-existing"]')?.addEventListener("click",async()=>{const t=await $e();t&&se(e,t,!0)}),e.querySelector('[data-action="clone-existing"]')?.addEventListener("click",async()=>{const t=await $e();t&&se(e,t,!1)})}function se(e,t,s){f=De(),v=-1,e.innerHTML=`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span data-region="header-title" class="text-sm font-medium text-slate-400 flex-1">${t?s?"Edit: "+C(t.title):"New (from "+C(t.title)+")":"New Program"}</span>
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
  `,Wt(e),Yt(e),Kt(e),L(e),ss(e),es(),t&&Qt(e,t,s)}function Wt(e){e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/studio"))}function Yt(e){const t=e.querySelector('[data-field="title"]'),s=e.querySelector('[data-field="requirements"]'),a=e.querySelector('[data-region="id-preview"]'),r=e.querySelector('[data-region="export-section"]');t?.addEventListener("input",()=>{f.meta.title=t.value,f.meta.id=Gt(t.value),a.textContent=f.meta.id?`id: ${f.meta.id}`:"",r?.classList.toggle("hidden",!f.meta.title.trim()||f.items.length===0)}),s?.addEventListener("input",()=>{f.meta.requirements=s.value})}function Kt(e){const t=e.querySelector('[data-region="picker"]');Bt(t,{onSelect:s=>{f.items.push({type:"single",exerciseId:s.id,exerciseName:s.name,exerciseNote:s.recommendations?.note||"",reps:s.recommendations?.reps||"",sets:s.recommendations?.sets||"",repUnits:s.recommendations?.repUnits||"reps",note:"",tags:[]}),L(e)},onCreateNew:s=>{ts(e,s)}})}function L(e){const t=e.querySelector('[data-region="timeline"]'),s=e.querySelector('[data-region="empty-timeline"]'),a=e.querySelector('[data-region="item-count"]'),r=e.querySelector('[data-region="export-section"]');if(t){if(a.textContent=`${f.items.length} item${f.items.length!==1?"s":""}`,f.items.length===0){t.classList.add("hidden"),s.classList.remove("hidden"),r?.classList.add("hidden");return}if(t.classList.remove("hidden"),s.classList.add("hidden"),r?.classList.toggle("hidden",!f.meta.title.trim()),_t(t,{items:f.items,expandedIndex:v},{onEdit:n=>{v=v===n?-1:n,L(e)},onRemove:n=>{f.items.splice(n,1),v===n?v=-1:v>n&&v--,L(e)},onMove:(n,o)=>{const[i]=f.items.splice(n,1);f.items.splice(o,0,i),v===n?v=o:n<v&&o>=v?v--:n>v&&o<=v&&v++,L(e)},onGroup:(n,o,i)=>{const l=o==="above"?n-1:n+1,d=Math.min(n,l),u=[f.items[d],f.items[d+1]],c={type:"group",kind:i,note:"",tags:[],members:u};f.items.splice(d,2,c),v=-1,L(e)},onJoinGroup:(n,o)=>{const i=f.items[n];f.items[o].members.push(i),f.items.splice(n,1),v=-1,L(e)},onAbsorbIntoGroup:(n,o)=>{const i=f.items[o],l=f.items[n];o<n?l.members.unshift(i):l.members.push(i),f.items.splice(o,1),v=-1,L(e)},onMemberMove:(n,o,i)=>{const l=f.items[n];if(!l||l.type!=="group")return;const[d]=l.members.splice(o,1);l.members.splice(i,0,d),L(e)},onMemberRemove:(n,o)=>{const i=f.items[n];if(!i||i.type!=="group")return;const[l]=i.members.splice(o,1);if(i.members.length<=1){const d=i.members[0]||l;d.type="single",f.items.splice(n,1,d)}v=-1,L(e)},onUngroup:n=>{const o=f.items[n];if(o.type!=="group")return;const i=o.members.map(l=>({...l,type:"single"}));f.items.splice(n,1,...i),v=-1,L(e)}}),v>=0&&v<f.items.length){const n=t.querySelector(`[data-region="edit-form"][data-idx="${v}"]`);n&&Xt(n,f.items[v],v,e)}}}function Xt(e,t,s,a){const r=["reps","secs","min","yd","rep","reps (each side)","secs (each side)"],n=["warmup","stretch"];e.innerHTML=`
    <div class="px-4 pb-4 pt-3 space-y-3 bg-slate-900/40">
      <div data-demo-preview="${s}"></div>
      <div class="grid grid-cols-3 gap-2">
        <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Reps</label>
          <input data-edit="reps" value="${C(t.reps||"")}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
        <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Sets</label>
          <input data-edit="sets" value="${C(t.sets||"")}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
        <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Units</label>
          <select data-edit="repUnits" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500">
            ${r.map(i=>`<option value="${i}"${(t.repUnits||"reps")===i?" selected":""}>${i}</option>`).join("")}
          </select></div>
      </div>
      <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Note</label>
        <input data-edit="note" value="${C(t.note||"")}" placeholder="Form cues, weight, etc." class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/></div>
      <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Tags</label>
        <div class="flex gap-2">${n.map(i=>`
          <button type="button" data-pill="${i}" class="px-3 py-1.5 rounded-full text-xs font-medium transition-all ${(t.tags||[]).includes(i)?"bg-brand-500 text-white":"bg-slate-800 text-slate-400 hover:bg-slate-700"}">${i}</button>`).join("")}
        </div></div>
    </div>
  `,e.querySelectorAll("[data-edit]").forEach(i=>{const l=()=>{t[i.dataset.edit]=i.value};i.addEventListener("input",l),i.addEventListener("change",l)}),e.querySelectorAll("[data-pill]").forEach(i=>{i.addEventListener("click",()=>{t.tags||(t.tags=[]);const l=i.dataset.pill;t.tags.includes(l)?t.tags=t.tags.filter(d=>d!==l):t.tags.push(l),L(a)})});const o=e.querySelector(`[data-demo-preview="${s}"]`);o&&t.exerciseId&&Zt(o,t.exerciseId)}function C(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Zt(e,t){const{exercises:s}=await B(),a=s.find(o=>o.id===t),r=f.newExercises.find(o=>o.id===t),n=a?.demos||r?.demos||[];if(n.length===0){e.innerHTML='<p class="text-[11px] text-slate-600 italic">No demos available</p>';return}_(e,n)}async function $e(){const{programs:e}=await z(),t=prompt(`Type part of a program name:

`+e.map(a=>`• ${a.title}`).join(`
`));if(!t)return null;const s=e.find(a=>a.title.toLowerCase().includes(t.toLowerCase()));return s||(alert('No program found matching "'+t+'"'),null)}function Qt(e,t,s){f.meta.title=s?t.title:"",f.meta.id=s?t.id:"",f.meta.requirements=t.requirements||"",f.items=(t.items||[]).map(r=>r.kind?{type:"group",kind:r.kind,note:r.note||"",tags:r.tags||[],members:r.exercises.map(n=>({type:"single",exerciseId:n.exerciseId,exerciseName:n.exerciseId,reps:n.reps||"",sets:n.sets||"",repUnits:n.repUnits||"reps",note:n.note||"",tags:[]}))}:{type:"single",exerciseId:r.exerciseId,exerciseName:r.exerciseId,exerciseNote:r.note||"",reps:r.reps||"",sets:r.sets||"",repUnits:r.repUnits||"reps",note:r.note||"",tags:r.tags||[]}),v=-1;const a=e.querySelector('[data-field="title"]');a.value=f.meta.title,a.dispatchEvent(new Event("input")),e.querySelector('[data-field="requirements"]').value=f.meta.requirements,s&&(e.querySelector('[data-region="header-title"]').textContent=`Edit: ${t.title}`),L(e)}let ae=!1;function es(){if(ae)return;ae=!0;const e=s=>{(f.items.length>0||f.meta.title)&&(s.preventDefault(),s.returnValue="")};window.addEventListener("beforeunload",e);const t=()=>{window.removeEventListener("beforeunload",e),window.removeEventListener("hashchange",t),ae=!1};window.addEventListener("hashchange",t)}let ne=[];function ts(e,t=""){const s=e.querySelector('[data-region="exercise-slideover"]');if(!s)return;ne=[],s.querySelector('[data-exfield="name"]').value=t,s.querySelector('[data-exfield="reps"]').value="",s.querySelector('[data-exfield="sets"]').value="",s.querySelector('[data-exfield="repUnits"]').value="reps",s.querySelector('[data-exfield="note"]').value="";const a=t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,"");s.querySelector('[data-region="ex-id-preview"]').textContent=a?`id: ${a}`:"";const r=s.querySelector('[data-region="demo-manager"]');ue(r,ne);const n=s.querySelector('[data-exfield="name"]'),o=s.querySelector('[data-region="ex-id-preview"]');n.addEventListener("input",()=>{const l=n.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,"");o.textContent=l?`id: ${l}`:""}),s.querySelector('[data-action="save-exercise"]')?.addEventListener("click",async()=>{const l=n.value.trim();if(!l){n.focus();return}const d=l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,""),{exercises:u}=await B(),c=u.find(x=>x.id===d||x.name.toLowerCase()===l.toLowerCase());if(c&&!confirm(`An exercise named "${c.name}" already exists (id: ${c.id}).

Do you still want to create "${l}"?`))return;const p=s.querySelector('[data-exfield="reps"]').value,m=s.querySelector('[data-exfield="sets"]').value,g=s.querySelector('[data-exfield="repUnits"]').value,b=s.querySelector('[data-exfield="note"]').value,y={id:d,name:l,demos:ne.filter(x=>x.url),recommendations:{}};p&&(y.recommendations.reps=p),m&&(y.recommendations.sets=m),g&&g!=="reps"&&(y.recommendations.repUnits=g),b&&(y.recommendations.note=b),f.newExercises.push(y),At(y),f.items.push({type:"single",exerciseId:d,exerciseName:l,exerciseNote:b||"",reps:p||"",sets:m||"",repUnits:g||"reps",note:"",tags:[]}),s.classList.add("hidden"),L(e)},{once:!0});const i=()=>s.classList.add("hidden");s.querySelector('[data-action="cancel-exercise"]')?.addEventListener("click",i,{once:!0}),s.querySelector('[data-action="close-exercise"]')?.addEventListener("click",i,{once:!0}),s.classList.remove("hidden")}function ss(e){const t=e.querySelector('[data-region="export-modal"]');e.querySelector('[data-action="export"]')?.addEventListener("click",()=>{rs(e)}),e.querySelector('[data-action="close-export"]')?.addEventListener("click",()=>{t?.classList.add("hidden")}),t?.addEventListener("click",s=>{s.target===t&&t.classList.add("hidden")}),e.querySelector('[data-action="preview"]')?.addEventListener("click",()=>{as(e)})}function as(e){const t=Oe(),s=t.items||[],a=`
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
        <h1 class="h-page">${C(t.title||"Untitled")}</h1>
        ${t.requirements?`<p class="text-sm text-slate-400 mt-1.5">${C(t.requirements)}</p>`:""}
      </div>
      <div class="px-6 pb-24 pt-2">
        <ul class="space-y-2.5">
          ${s.map((n,o)=>ns(n)).join("")}
        </ul>
      </div>
    </div>
  `,r=document.createElement("div");r.innerHTML=a,e.appendChild(r.firstElementChild),e.querySelector('[data-action="close-preview"]')?.addEventListener("click",()=>{e.querySelector(".fixed.inset-0.z-50.bg-slate-950")?.remove()})}function ns(e,t){if(e.kind)return`<li class="card p-4 space-y-2">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-brand-500/20 text-brand-300">${{superset:"Super Set",compound:"Compound",circuit:"Circuit"}[e.kind]||e.kind}</span>
      </div>
      <p class="text-sm font-semibold text-slate-100">${C(e.exercises.map(r=>r.exerciseId).join(" + "))}</p>
      <div class="space-y-1.5 pl-3 border-l-2 border-slate-700">
        ${e.exercises.map((r,n)=>`
          <div class="text-xs text-slate-300">${n+1}. ${C(r.exerciseId)} — ${r.reps||"—"} ${r.repUnits||"reps"} · ${r.sets||"—"} sets</div>
        `).join("")}
      </div>
    </li>`;const s=e.tags?.length?e.tags.map(a=>`<span class="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">${a}</span>`).join(""):"";return`<li class="card px-4 py-3">
    ${s?`<div class="flex gap-1.5 mb-1">${s}</div>`:""}
    <p class="text-sm font-semibold text-slate-100">${C(e.exerciseId)}</p>
    <p class="text-xs text-slate-400 num mt-0.5">${e.reps||"—"} ${e.repUnits||"reps"} · ${e.sets||"—"} sets</p>
    ${e.note?`<p class="text-xs text-slate-500 mt-1">${C(e.note)}</p>`:""}
  </li>`}function rs(e){const t=e.querySelector('[data-region="export-modal"]'),s=e.querySelector('[data-region="export-content"]');if(!t||!s)return;const a=Oe(),r=[];f.newExercises.length>0&&r.push({label:"New Exercises (append to exercises.json → exercises[])",json:f.newExercises}),r.push({label:"Program (append to workouts.json → programs[])",json:a}),s.innerHTML=r.map((n,o)=>`
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-xs text-slate-400 font-medium">${n.label}</p>
        <button data-action="copy-json" data-section="${o}" class="text-xs text-brand-400 hover:text-brand-300 transition-colors">Copy</button>
      </div>
      <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono leading-relaxed"><code>${C(JSON.stringify(n.json,null,2))}</code></pre>
    </div>
  `).join(""),s.querySelectorAll('[data-action="copy-json"]').forEach(n=>{n.addEventListener("click",()=>{const o=+n.dataset.section,i=JSON.stringify(r[o].json,null,2);navigator.clipboard?.writeText(i).then(()=>{n.textContent="✓ Copied",setTimeout(()=>{n.textContent="Copy"},2e3)}).catch(()=>{prompt("Copy:",i)})})}),t.classList.remove("hidden")}function Oe(){const e={id:f.meta.id,title:f.meta.title};return f.meta.requirements&&(e.requirements=f.meta.requirements),f.meta.description&&(e.description=f.meta.description),f.meta.difficulty&&(e.difficulty=f.meta.difficulty),f.meta.duration&&(e.duration=Number(f.meta.duration)),e.items=f.items.map(t=>{if(t.type==="group"){const a={kind:t.kind,exercises:t.members.map(r=>{const n={exerciseId:r.exerciseId};return r.reps&&(n.reps=r.reps),r.sets&&(n.sets=r.sets),r.repUnits&&r.repUnits!=="reps"&&(n.repUnits=r.repUnits),r.note&&(n.note=r.note),n})};return t.note&&(a.note=t.note),t.tags?.length&&(a.tags=t.tags),a}const s={exerciseId:t.exerciseId};return t.reps&&(s.reps=t.reps),t.sets&&(s.sets=t.sets),t.repUnits&&t.repUnits!=="reps"&&(s.repUnits=t.repUnits),t.note&&(s.note=t.note),t.tags.length&&(s.tags=t.tags),s}),e}let O=[],F=!1,J="";function os(e){O=[],F=!1,J="",e.innerHTML=`
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
  `,is(e),ls(e),cs(e),us(e)}function is(e){e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/studio"))}function ls(e){const t=e.querySelector('[data-input="edit-search"]'),s=e.querySelector('[data-region="edit-results"]');let a=null;t?.addEventListener("input",()=>{clearTimeout(a),a=setTimeout(async()=>{const r=t.value.trim();if(!r){s.classList.add("hidden");return}const n=await Z(r,8);if(n.length===0){s.classList.add("hidden");return}s.classList.remove("hidden"),s.innerHTML=n.map(o=>`
        <li><button data-load-exercise="${o.id}" class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800/60 active:bg-slate-800 transition-colors flex items-center gap-3 touch-manipulation">
          <span class="text-sm font-medium text-slate-100 truncate">${Fe(o.name)}</span>
          ${o.hasDemos?'<span class="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-sm">demo</span>':""}
        </button></li>
      `).join(""),s.querySelectorAll("[data-load-exercise]").forEach(o=>{o.addEventListener("click",()=>{const i=n.find(l=>l.id===o.dataset.loadExercise);i&&ds(e,i.exercise),s.classList.add("hidden"),t.value=""})})},150)})}function ds(e,t){F=!0,J=t.id,O=JSON.parse(JSON.stringify(t.demos||[])),e.querySelector('[data-region="header-title"]').textContent=`Edit: ${t.name}`,e.querySelector('[data-region="form-label"]').textContent="Editing Exercise";const s=e.querySelector('[data-field="name"]');s.value=t.name,s.dispatchEvent(new Event("input"));const a=t.recommendations||{};e.querySelector('[data-field="reps"]').value=a.reps||"",e.querySelector('[data-field="sets"]').value=a.sets||"",e.querySelector('[data-field="repUnits"]').value=a.repUnits||"reps",e.querySelector('[data-field="note"]').value=a.note||"",ue(e.querySelector('[data-region="demos"]'),O),e.querySelector('[data-region="export-section"]')?.classList.remove("hidden")}function cs(e){const t=e.querySelector('[data-field="name"]'),s=e.querySelector('[data-region="id-preview"]'),a=e.querySelector('[data-region="export-section"]');t?.addEventListener("input",()=>{if(F)s.textContent=`id: ${J} (existing)`;else{const r=t.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,"");s.textContent=r?`id: ${r}`:""}a?.classList.toggle("hidden",!t.value.trim())}),ue(e.querySelector('[data-region="demos"]'),O)}function us(e){const t=e.querySelector('[data-region="export-modal"]');e.querySelector('[data-action="export"]')?.addEventListener("click",()=>{const s=e.querySelector('[data-field="name"]'),a=s.value.trim();if(!a){s.focus();return}const n={id:F?J:a.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,""),name:a,demos:O.filter(m=>m.url),recommendations:{}},o=e.querySelector('[data-field="reps"]').value,i=e.querySelector('[data-field="sets"]').value,l=e.querySelector('[data-field="repUnits"]').value,d=e.querySelector('[data-field="note"]').value;o&&(n.recommendations.reps=o),i&&(n.recommendations.sets=i),l&&l!=="reps"&&(n.recommendations.repUnits=l),d&&(n.recommendations.note=d);const u=e.querySelector('[data-region="export-content"]'),c=JSON.stringify(n,null,2),p=F?`Replace entry with id "${J}" in exercises.json`:"Append to exercises.json → exercises[]";u.innerHTML=`
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-slate-400">${p}</p>
          <button data-action="copy" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
        </div>
        <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono leading-relaxed"><code>${Fe(c)}</code></pre>
      </div>`,u.querySelector('[data-action="copy"]')?.addEventListener("click",m=>{navigator.clipboard?.writeText(c).then(()=>{m.target.textContent="✓ Copied",setTimeout(()=>{m.target.textContent="Copy"},2e3)})}),t.classList.remove("hidden")}),e.querySelector('[data-action="close-export"]')?.addEventListener("click",()=>t?.classList.add("hidden")),t?.addEventListener("click",s=>{s.target===t&&t.classList.add("hidden")})}function Fe(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const ps="https://api.openai.com/v1/chat/completions",ms="gpt-4o-mini",Je="action-app:openai-key";function pe(){return localStorage.getItem(Je)||""}function xs(e){localStorage.setItem(Je,e)}function Se(){return!!pe()}function fs(){return{meta:{title:"",id:"",requirements:"",description:""},items:[],newExercises:[]}}const gs=[{type:"function",function:{name:"search_exercises",description:"Search the exercise library by name, alias, or keyword. Always call this before adding an exercise.",parameters:{type:"object",properties:{query:{type:"string",description:"Search query (exercise name or keyword)"},limit:{type:"number",description:"Max results to return (default 5)"}},required:["query"]}}},{type:"function",function:{name:"add_exercise",description:"Add an exercise to the program timeline.",parameters:{type:"object",properties:{exerciseId:{type:"string",description:"Exercise ID from search results"},reps:{type:"string",description:'Number of reps (e.g. "10", "30", "AMRAP")'},sets:{type:"string",description:'Number of sets (e.g. "3", "4")'},repUnits:{type:"string",description:"Unit type: reps, secs, min, yd"},note:{type:"string",description:"Form cues or notes"},tags:{type:"array",items:{type:"string"},description:"Tags like warmup, stretch"}},required:["exerciseId"]}}},{type:"function",function:{name:"create_exercise",description:"Create a new exercise that does not exist in the library.",parameters:{type:"object",properties:{name:{type:"string",description:"Exercise name"},reps:{type:"string"},sets:{type:"string"},repUnits:{type:"string"},note:{type:"string"}},required:["name"]}}},{type:"function",function:{name:"remove_exercise",description:"Remove an exercise from the program by its position (0-based index).",parameters:{type:"object",properties:{index:{type:"number",description:"0-based position in the timeline"}},required:["index"]}}},{type:"function",function:{name:"group_exercises",description:"Group exercises into a superset, compound set, or circuit.",parameters:{type:"object",properties:{indices:{type:"array",items:{type:"number"},description:"0-based positions to group"},kind:{type:"string",enum:["superset","compound","circuit"]}},required:["indices","kind"]}}},{type:"function",function:{name:"set_metadata",description:"Set program title, requirements, or description.",parameters:{type:"object",properties:{title:{type:"string"},requirements:{type:"string"},description:{type:"string"}}}}},{type:"function",function:{name:"update_exercise",description:"Update reps, sets, note, or tags of an exercise at a given position.",parameters:{type:"object",properties:{index:{type:"number",description:"0-based position"},reps:{type:"string"},sets:{type:"string"},repUnits:{type:"string"},note:{type:"string"},tags:{type:"array",items:{type:"string"}}},required:["index"]}}}];async function bs(e,t,s){switch(e){case"search_exercises":return(await Z(t.query,t.limit||5)).map(r=>({id:r.id,name:r.name,hasDemos:r.hasDemos,reps:r.exercise?.recommendations?.reps,sets:r.exercise?.recommendations?.sets,repUnits:r.exercise?.recommendations?.repUnits}));case"add_exercise":{const a={exerciseId:t.exerciseId};return t.reps&&(a.reps=t.reps),t.sets&&(a.sets=t.sets),t.repUnits&&t.repUnits!=="reps"&&(a.repUnits=t.repUnits),t.note&&(a.note=t.note),t.tags?.length&&(a.tags=t.tags),s.items.push(a),{success:!0,index:s.items.length-1,total:s.items.length}}case"create_exercise":{const a=t.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/,""),r={id:a,name:t.name,demos:[],recommendations:{}};return t.reps&&(r.recommendations.reps=t.reps),t.sets&&(r.recommendations.sets=t.sets),t.repUnits&&(r.recommendations.repUnits=t.repUnits),t.note&&(r.recommendations.note=t.note),s.newExercises.push(r),{success:!0,id:a,name:t.name}}case"remove_exercise":return t.index>=0&&t.index<s.items.length?(s.items.splice(t.index,1),{success:!0,remaining:s.items.length}):{success:!1,error:"Invalid index"};case"group_exercises":{const a=[...t.indices].sort((o,i)=>o-i),r=a.map(o=>s.items[o]).filter(Boolean);if(r.length<2)return{success:!1,error:"Need at least 2 exercises to group"};for(let o=a.length-1;o>=0;o--)s.items.splice(a[o],1);const n={kind:t.kind,exercises:r};return s.items.splice(a[0],0,n),{success:!0,groupIndex:a[0]}}case"set_metadata":return t.title&&(s.meta.title=t.title),t.requirements&&(s.meta.requirements=t.requirements),t.description&&(s.meta.description=t.description),t.title&&(s.meta.id=t.title.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/_+$/,"")),{success:!0,meta:s.meta};case"update_exercise":{const a=s.items[t.index];return a?(t.reps&&(a.reps=t.reps),t.sets&&(a.sets=t.sets),t.repUnits&&(a.repUnits=t.repUnits),t.note&&(a.note=t.note),t.tags&&(a.tags=t.tags),{success:!0}):{success:!1,error:"Invalid index"}}default:return{error:`Unknown tool: ${e}`}}}function hs(e){return`You are a fitness programming assistant for the Action App. You help users build workout programs through conversation.

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
`}function vs(e){if(e.items.length===0&&!e.meta.title)return`
[Program is empty — no exercises added yet]`;let t=`
## Current Program State
`;return e.meta.title&&(t+=`Title: ${e.meta.title}
`),e.meta.requirements&&(t+=`Requirements: ${e.meta.requirements}
`),t+=`
Timeline (${e.items.length} items):
`,e.items.forEach((s,a)=>{s.kind?t+=`${a}. [${s.kind}] ${s.exercises.map(r=>r.exerciseId).join(" + ")}
`:t+=`${a}. ${s.exerciseId} — ${s.reps||"?"} ${s.repUnits||"reps"} × ${s.sets||"?"} sets${s.tags?.length?` [${s.tags.join(", ")}]`:""}
`}),e.newExercises.length>0&&(t+=`
New exercises created this session: ${e.newExercises.map(s=>s.name).join(", ")}
`),t}async function ys(e,t,s,a,r){const n=pe();if(!n)throw new Error("No API key configured");const i=[{role:"system",content:hs(a)+vs(s)},...t.slice(-20),{role:"user",content:e}];let l=await Ee(n,i),d=l.choices[0].message,u=0;for(;d.tool_calls&&u<5;){u++;const c=[];for(const p of d.tool_calls){const m=JSON.parse(p.function.arguments),g=await bs(p.function.name,m,s);c.push({role:"tool",tool_call_id:p.id,content:JSON.stringify(g)}),r?.({type:"tool",name:p.function.name,args:m,result:g})}i.push(d),i.push(...c),l=await Ee(n,i),d=l.choices[0].message}return d.content||""}async function Ee(e,t){const s=await fetch(ps,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({model:ms,messages:t,tools:gs,tool_choice:"auto",temperature:.3})});if(!s.ok){const a=await s.text();throw new Error(`OpenAI API error (${s.status}): ${a}`)}return s.json()}function ws(e){const t={id:e.meta.id||"untitled",title:e.meta.title||"Untitled Program"};return e.meta.requirements&&(t.requirements=e.meta.requirements),t.items=e.items,{program:t,newExercises:e.newExercises}}async function ks(e){const t=fs(),s=[];let a=!1;const{exercises:r}=await B(),n=r.map(x=>({id:x.id,name:x.name}));e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/studio"));const o=e.querySelector('[data-region="messages"]'),i=e.querySelector('[data-input="message"]'),l=e.querySelector('[data-action="send"]'),d=e.querySelector('[data-action="export"]'),u=e.querySelector('[data-region="settings-modal"]'),c=e.querySelector('[data-region="export-modal"]');e.querySelector('[data-action="settings"]')?.addEventListener("click",()=>{e.querySelector('[data-input="api-key"]').value=pe(),u.classList.remove("hidden")}),e.querySelector('[data-action="close-settings"]')?.addEventListener("click",()=>u.classList.add("hidden")),e.querySelector('[data-action="save-settings"]')?.addEventListener("click",()=>{const x=e.querySelector('[data-input="api-key"]').value.trim();xs(x),u.classList.add("hidden")}),u?.addEventListener("click",x=>{x.target===u&&u.classList.add("hidden")}),d?.addEventListener("click",()=>y()),e.querySelector('[data-action="close-export"]')?.addEventListener("click",()=>c.classList.add("hidden")),c?.addEventListener("click",x=>{x.target===c&&c.classList.add("hidden")}),Se()||u.classList.remove("hidden");async function p(){const x=i.value.trim();if(!x||a)return;if(!Se()){u.classList.remove("hidden");return}i.value="",a=!0,l.disabled=!0,m("user",x),s.push({role:"user",content:x});const w=m("assistant","...");w.dataset.loading="true";try{const $=await ys(x,s,t,n,h=>{h.type==="tool"&&g(h)});w.remove(),m("assistant",$),s.push({role:"assistant",content:$}),b()}catch($){w.remove(),m("error",$.message)}finally{a=!1,l.disabled=!1,i.focus()}}l?.addEventListener("click",p),i?.addEventListener("keydown",x=>{x.key==="Enter"&&!x.shiftKey&&(x.preventDefault(),p())});function m(x,w){const $=o.querySelector(".text-center.py-8");$&&x!=="error"&&$.remove();const h=document.createElement("div");h.className=x==="user"?"flex justify-end":"flex justify-start";const q=document.createElement("div");return x==="user"?q.className="bg-brand-500/20 text-slate-100 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%] text-sm leading-relaxed":x==="error"?q.className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] text-sm leading-relaxed":q.className="bg-slate-800/60 text-slate-200 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] text-sm leading-relaxed",q.textContent=w,h.appendChild(q),o.appendChild(h),o.scrollTop=o.scrollHeight,h}function g(x){const w=document.createElement("div");w.className="flex justify-start";const $={search_exercises:`🔍 Searching: "${x.args.query}"`,add_exercise:`✓ Added: ${x.args.exerciseId}`,create_exercise:`✓ Created: ${x.args.name}`,remove_exercise:`✗ Removed item at position ${x.args.index}`,group_exercises:`⚡ Grouped as ${x.args.kind}`,set_metadata:`📝 Updated: ${x.args.title||x.args.requirements||"metadata"}`,update_exercise:`✏️ Updated item at position ${x.args.index}`}[x.name]||`🔧 ${x.name}`;w.innerHTML=`<span class="text-[11px] text-slate-500 italic px-2 py-1">${U($)}</span>`,o.appendChild(w),o.scrollTop=o.scrollHeight}function b(){const x=e.querySelector('[data-region="program-preview"]'),w=e.querySelector('[data-region="program-items"]'),$=e.querySelector('[data-region="item-count"]');if(t.items.length===0){x.classList.add("hidden"),d.classList.add("hidden");return}x.classList.remove("hidden"),d.classList.remove("hidden"),$.textContent=`${t.items.length} item${t.items.length!==1?"s":""}`,w.innerHTML=t.items.map((h,q)=>{if(h.kind)return`<div class="text-xs text-slate-400 pl-2 border-l-2 border-brand-500"><span class="text-brand-300 font-medium">${h.kind}</span>: ${h.exercises.map(Ge=>Ge.exerciseId).join(" + ")}</div>`;const M=h.tags?.length?`<span class="text-brand-300">[${h.tags.join(", ")}]</span> `:"";return`<div class="text-xs text-slate-300">${q+1}. ${M}${U(h.exerciseId)} — ${h.reps||"?"} ${h.repUnits||"reps"} × ${h.sets||"?"}</div>`}).join("")}function y(){const{program:x,newExercises:w}=ws(t),$=e.querySelector('[data-region="export-content"]');let h="";if(w.length>0){const M=JSON.stringify(w,null,2);h+=`
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs text-slate-400">New Exercises (append to exercises.json)</p>
            <button data-copy="${U(M)}" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
          </div>
          <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[200px] overflow-y-auto font-mono">${U(M)}</pre>
        </div>
      `}const q=JSON.stringify(x,null,2);h+=`
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-slate-400">Program (append to workouts.json)</p>
          <button data-copy="${U(q)}" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
        </div>
        <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono">${U(q)}</pre>
      </div>
    `,$.innerHTML=h,$.querySelectorAll("[data-copy]").forEach(M=>{M.addEventListener("click",()=>{navigator.clipboard?.writeText(M.dataset.copy).then(()=>{M.textContent="✓ Copied",setTimeout(()=>{M.textContent="Copy"},2e3)})})}),c.classList.remove("hidden")}}function U(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function $s(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/"));const{exercises:t}=await B(),s=e.querySelector('[data-region="count"]');s.textContent=`${t.length} total`;let a=null;const r=d=>{const u=e.querySelector('[data-region="list"]'),c=e.querySelector('[data-region="empty"]');if(d.length===0){u.classList.add("hidden"),c.classList.remove("hidden");return}if(u.classList.remove("hidden"),c.classList.add("hidden"),u.innerHTML=d.map(p=>`
      <li>
        <article class="card overflow-hidden" data-exercise-id="${p.id}">
          <button data-action="expand" data-id="${p.id}" class="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold tracking-tight text-slate-100 truncate">${R(p.name)}</h3>
              <p class="text-xs text-slate-400 mt-0.5 num">${p.demos.length} demo${p.demos.length!==1?"s":""}${p.recommendations?.reps?` · ${p.recommendations.reps} ${p.recommendations.repUnits||"reps"}`:""}</p>
            </div>
            <svg class="w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${a===p.id?"rotate-180":""}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          ${a===p.id?n(p):""}
        </article>
      </li>
    `).join(""),u.querySelectorAll('[data-action="expand"]').forEach(p=>{p.addEventListener("click",()=>{if(a=a===p.dataset.id?null:p.dataset.id,r(d),a){const m=u.querySelector(`[data-demo-slot="${a}"]`),g=d.find(b=>b.id===a);m&&g&&g.demos.length>0&&_(m,g.demos)}})}),a){const p=u.querySelector(`[data-demo-slot="${a}"]`),m=d.find(g=>g.id===a);p&&m&&m.demos.length>0&&_(p,m.demos)}};function n(d){return`
      <div class="px-4 pb-4 pt-1 space-y-3 border-t border-slate-800 bg-slate-900/40 animate-fade-in">
        <div data-demo-slot="${d.id}">
          ${d.demos.length===0?'<p class="text-xs text-slate-500 italic py-2">No demos available</p>':""}
        </div>
        ${d.recommendations?`
          <div class="flex gap-3">
            ${d.recommendations.reps?`<div class="bg-slate-800/50 rounded-lg px-3 py-2 text-center flex-1"><p class="text-lg font-extrabold text-brand-400 num">${R(d.recommendations.reps)}</p><p class="label-meta mt-0.5">${R(d.recommendations.repUnits||"reps")}</p></div>`:""}
            ${d.recommendations.sets?`<div class="bg-slate-800/50 rounded-lg px-3 py-2 text-center flex-1"><p class="text-lg font-extrabold text-brand-400 num">${R(d.recommendations.sets)}</p><p class="label-meta mt-0.5">sets</p></div>`:""}
          </div>
        `:""}
        ${d.recommendations?.note?`<div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2 rounded-r-lg"><p class="text-xs text-slate-300 leading-relaxed">${R(d.recommendations.note)}</p></div>`:""}
        ${d.aliases?.length?`<p class="text-[11px] text-slate-500">Also known as: ${d.aliases.join(", ")}</p>`:""}
        <a href="/exercise/${d.id}" class="inline-block text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">View full page →</a>
      </div>
    `}const o=[...t].sort((d,u)=>d.name.localeCompare(u.name));r(o);const i=e.querySelector('[data-input="search"]');let l=null;i?.addEventListener("input",()=>{clearTimeout(l),l=setTimeout(async()=>{const d=i.value.trim();if(!d){r(o),s.textContent=`${o.length} total`;return}const c=(await Z(d,50)).map(p=>p.exercise);r(c),s.textContent=`${c.length} result${c.length!==1?"s":""}`},150)})}function R(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Ss(e,t){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>window.history.back());const s=await Qe(t);if(!s){Ls(e,t);return}const{programs:a}=await z(),r=qs(a,t);Es(e,s,r)}function Es(e,t,s){const a=t.demos||[],r=t.recommendations||{},n=t.aliases||[];if(e.innerHTML=`
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
          ${a.length===0?'<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No demos available</div>':""}
        </section>

        <!-- Recommendations -->
        ${r.reps||r.sets?`
        <section class="space-y-3">
          <h2 class="eyebrow">Recommendations</h2>
          <div class="grid grid-cols-2 gap-3">
            ${r.reps?`
            <div class="card p-4 text-center">
              <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${P(r.reps)}</p>
              <p class="label-meta mt-1.5">${P(r.repUnits||"reps")}</p>
            </div>`:""}
            ${r.sets?`
            <div class="card p-4 text-center">
              <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${P(r.sets)}</p>
              <p class="label-meta mt-1.5">sets</p>
            </div>`:""}
          </div>
          ${r.note?`
          <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
            <p class="text-sm text-slate-300 leading-relaxed">${P(r.note)}</p>
          </div>`:""}
        </section>`:""}

        <!-- Aliases -->
        ${n.length>0?`
        <section class="space-y-2">
          <h2 class="eyebrow">Also known as</h2>
          <div class="flex flex-wrap gap-2">
            ${n.map(o=>`<span class="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">${P(o)}</span>`).join("")}
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
          <p class="text-[11px] text-slate-500">${a.length} demo${a.length!==1?"s":""}</p>
        </section>
      </main>
    </div>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>window.history.back()),e.querySelectorAll("[data-program-id]").forEach(o=>{o.addEventListener("click",()=>k(`/program/${o.dataset.programId}`))}),a.length>0){const o=e.querySelector('[data-region="demos"]');_(o,a)}}function Ls(e,t){e.innerHTML=`
    <div class="flex-1 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p class="text-6xl mb-4">🤷</p>
      <h1 class="text-2xl font-bold mb-2">Exercise not found</h1>
      <p class="text-slate-400 mb-6 text-sm font-mono">${P(t)}</p>
      <a href="/exercises" class="btn-primary">Browse exercises</a>
    </div>
  `}function qs(e,t){return e.filter(s=>{for(const a of s.items||[]){if(a.exerciseId===t)return!0;if(a.exercises){for(const r of a.exercises)if(r.exerciseId===t)return!0}}return!1})}function P(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Cs(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/"));const[{programs:t},{plans:s}]=await Promise.all([z(),Ae()]),a=t.map(c=>({id:c.id,title:c.title,requirements:c.requirements||"",itemCount:c.items?.length||c.exercises?.length||0,tokens:W(c.title).concat(W(c.requirements||"")).concat(W(c.id.replace(/[-_]/g," "))),program:c})),r=new Map;for(const c of s)for(const p of c.subPlans||[])for(const m of p.programs||[])r.set(m,`${c.name} · ${p.name}`);const n=e.querySelector('[data-region="results"]'),o=e.querySelector('[data-region="empty"]'),i=e.querySelector('[data-region="initial"]');function l(c){if(c===null){n.classList.add("hidden"),o.classList.add("hidden"),i.classList.remove("hidden");return}if(i.classList.add("hidden"),c.length===0){n.classList.add("hidden"),o.classList.remove("hidden");return}o.classList.add("hidden"),n.classList.remove("hidden"),n.innerHTML=c.map(p=>Ms(p,r.get(p.id))).join(""),n.querySelectorAll("[data-program-id]").forEach(p=>{p.addEventListener("click",()=>k(`/program/${p.dataset.programId}`))})}const d=e.querySelector('[data-input="search"]');let u=null;d?.addEventListener("input",()=>{clearTimeout(u),u=setTimeout(()=>{const c=d.value.trim();if(!c){l(null);return}const p=W(c),m=a.map(g=>({...g,score:js(g.tokens,p)})).filter(g=>g.score>0).sort((g,b)=>b.score-g.score);l(m)},150)}),l(null)}function Ms(e,t){return`
    <button
      data-program-id="${e.id}"
      class="w-full card p-4 text-left active:scale-[0.98] transition-transform"
    >
      <div class="flex items-center gap-3">
        <div class="flex-1 min-w-0">
          ${t?`<p class="text-[10px] font-medium uppercase tracking-wider text-slate-500 mb-1">${re(t)}</p>`:""}
          <h3 class="font-semibold tracking-tight truncate">${re(e.title)}</h3>
          <p class="text-xs text-slate-400 mt-1 truncate">
            <span class="num">${e.itemCount}</span> exercise${e.itemCount!==1?"s":""}${e.requirements?` · ${re(e.requirements)}`:""}
          </p>
        </div>
        <svg class="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </button>
  `}function W(e){return e?e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().split(/[^a-z0-9]+/).filter(t=>t.length>0):[]}function js(e,t){let s=0;for(const a of t){let r=0;for(const n of e)n===a?r=Math.max(r,10):n.startsWith(a)?r=Math.max(r,7):n.includes(a)&&(r=Math.max(r,4));if(r===0)return 0;s+=r}return s}function re(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const j=document.getElementById("app");T("/",()=>st(j));T("/programs",()=>ot(j));T("/program/:id",({id:e})=>Ct(j,e));T("/exercises",()=>$s(j));T("/exercise/:id",({id:e})=>Ss(j,e));T("/search",()=>Cs(j));const Ts=["localhost","127.0.0.1"].includes(window.location.hostname);Ts&&(T("/studio",()=>Pt(j)),T("/studio/program",()=>Vt(j)),T("/studio/exercise",()=>os(j)),T("/studio/ai",()=>ks(j)));Ve(e=>{j.innerHTML=`
    <div class="flex-1 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p class="text-6xl mb-4">🤔</p>
      <h1 class="text-2xl font-bold mb-2">Page not found</h1>
      <p class="text-slate-400 mb-6 text-sm">${e}</p>
      <a href="/" class="btn-primary">Back home</a>
    </div>
  `});We();console.log("🚀 Action App V2 ready");
