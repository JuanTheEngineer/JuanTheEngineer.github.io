(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function s(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=s(n);fetch(n.href,r)}})();const Ue=[];let pe=null;function A(e,t){const s=[],a=new RegExp("^"+e.replace(/:([^/]+)/g,(n,r)=>(s.push(r),"([^/]+)"))+"$");Ue.push({pattern:e,regex:a,keys:s,handler:t})}function ct(e){pe=e}function k(e){window.history.pushState(null,"",e),me()}function me(){const e=window.location.pathname||"/";for(const t of Ue){const s=e.match(t.regex);if(s){const a={};t.keys.forEach((n,r)=>{a[n]=decodeURIComponent(s[r+1])}),t.handler(a);return}}pe&&pe(e)}function ut(){if(window.addEventListener("popstate",me),document.addEventListener("click",e=>{const t=e.target.closest("a[href]");if(!t)return;const s=t.getAttribute("href");s&&s.startsWith("/")&&!s.startsWith("//")&&(e.preventDefault(),k(s))}),window.location.hash&&window.location.hash.startsWith("#/")){const e=window.location.hash.slice(1);window.history.replaceState(null,"",e)}me()}const He="action-app:progress",_e="action-app:sets",ze="action-app:recent-programs",pt=5;function fe(){try{return JSON.parse(localStorage.getItem(He)||"{}")}catch{return{}}}function Re(e){try{localStorage.setItem(He,JSON.stringify(e))}catch{}}function Oe(e){const t=fe();return new Set(t[e]||[])}function ne(e,t){const s=fe(),a=new Set(s[e]||[]);return a.has(t)?a.delete(t):a.add(t),s[e]=Array.from(a),Re(s),a}function mt(e){const t=fe();delete t[e],Re(t);const s=be();let a=!1;for(const n of Object.keys(s))n.startsWith(`${e}:`)&&(delete s[n],a=!0);a&&De(s)}function be(){try{return JSON.parse(localStorage.getItem(_e)||"{}")}catch{return{}}}function De(e){try{localStorage.setItem(_e,JSON.stringify(e))}catch{}}function ke(e,t){const a=be()[`${e}:${t}`];return Number.isInteger(a)&&a>=0?a:0}function Z(e,t,s){const a=be(),n=`${e}:${t}`;return s>0?a[n]=s:delete a[n],De(a),s>0?s:0}function Ge(){try{const e=JSON.parse(localStorage.getItem(ze)||"[]");return Array.isArray(e)?e:[]}catch{return[]}}function xt(e){if(e)try{const t=Ge().filter(s=>s.id!==e);t.unshift({id:e,visitedAt:Date.now()}),localStorage.setItem(ze,JSON.stringify(t.slice(0,pt)))}catch{}}const E={workouts:null,exercises:null,plans:null,exerciseMap:null,dataModel:null};async function z(){if(E.workouts)return E.workouts;const e=await fetch("/workouts.json");if(!e.ok)throw new Error(`Failed to load workouts.json: ${e.status}`);return E.workouts=await e.json(),E.workouts}async function U(){if(E.exercises)return E.exercises;const e=await fetch("/exercises.json");if(!e.ok)throw new Error(`Failed to load exercises.json: ${e.status}`);return E.exercises=await e.json(),E.exerciseMap=new Map(E.exercises.exercises.map(t=>[t.id,t])),E.exercises}async function Je(){if(E.plans)return E.plans;const e=await fetch("/plans.json");if(!e.ok)throw new Error(`Failed to load plans.json: ${e.status}`);return E.plans=await e.json(),E.plans}async function ft(){if(E.dataModel)return E.dataModel;const e=await fetch("/data-model.json");if(!e.ok)throw new Error(`Failed to load data-model.json: ${e.status}`);return E.dataModel=await e.json(),E.dataModel}async function bt(e){return(await z()).programs.find(s=>s.id===e)||null}async function gt(e){return await U(),E.exerciseMap?.get(e)||null}async function ht(e){const[t]=await Promise.all([bt(e),U()]);if(!t)return null;const s=r=>{const o=E.exerciseMap.get(r.exerciseId)||null;return{kind:"single",exerciseId:r.exerciseId,exercise:o,name:o?.name||r.exerciseId,reps:r.reps??o?.recommendations?.reps,sets:r.sets??o?.recommendations?.sets,repUnits:r.repUnits??o?.recommendations?.repUnits,note:r.note??o?.recommendations?.note,tags:r.tags||[]}},a=r=>({kind:r.kind,note:r.note,tags:r.tags||[],exercises:r.exercises.map(o=>{const i=E.exerciseMap.get(o.exerciseId)||null;return{exerciseId:o.exerciseId,exercise:i,name:i?.name||o.exerciseId,reps:o.reps??i?.recommendations?.reps,sets:o.sets??i?.recommendations?.sets,repUnits:o.repUnits??i?.recommendations?.repUnits,note:o.note??i?.recommendations?.note}})}),n=(t.items||[]).map(r=>r.kind?a(r):s(r));return{...t,resolvedItems:n}}function vt(){return["localhost","127.0.0.1"].includes(window.location.hostname)}function yt(e){e.innerHTML=`
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
          ${vt()?`<button
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

      <footer class="px-6 pb-8 text-center flex items-center justify-center gap-4">
        <a href="https://forms.gle/QWEpe3gCLZWDiJjR8" target="_blank" rel="noopener"
          class="text-xs text-slate-500 hover:text-brand-400 transition-colors">
          Send feedback →
        </a>
        <span class="text-xs text-slate-700" aria-hidden="true">·</span>
        <a href="/submit"
          class="text-xs text-slate-500 hover:text-brand-400 transition-colors">
          Submit an exercise →
        </a>
      </footer>
    </div>
  `,e.querySelector('[data-action="create"]')?.addEventListener("click",()=>k("/studio")),e.querySelector('[data-action="search"]')?.addEventListener("click",()=>k("/search")),e.querySelector('[data-action="programs"]')?.addEventListener("click",()=>k("/programs")),e.querySelector('[data-action="exercises"]')?.addEventListener("click",()=>k("/exercises")),wt(e).catch(t=>console.warn("[recent] skipped",t))}async function wt(e){const t=Ge();if(t.length===0)return;const s=e.querySelector('[data-region="recent"]');if(!s)return;const{programs:a}=await z(),n=new Map(a.map(o=>[o.id,o])),r=t.map(o=>({...o,program:n.get(o.id)})).filter(o=>o.program).slice(0,3);r.length!==0&&(s.classList.remove("hidden"),s.innerHTML=`
    <div class="flex items-baseline justify-between">
      <h2 class="eyebrow">Pick up where you left off</h2>
      ${r.length===3&&t.length>3?'<button data-action="all-recent" class="text-xs text-slate-400 hover:text-brand-400 transition-colors">All</button>':""}
    </div>
    <ul class="space-y-2">
      ${r.map(o=>kt(o.program)).join("")}
    </ul>
  `,s.querySelectorAll("[data-program-id]").forEach(o=>{o.addEventListener("click",()=>k(`/program/${o.dataset.programId}`))}),s.querySelector('[data-action="all-recent"]')?.addEventListener("click",()=>k("/programs")))}function kt(e){const t=e.items?.length||e.exercises?.length||0,s=Oe(e.id).size,a=t>0?Math.round(s/t*100):0,n=s===0?"Not started":s>=t?"Complete":`${s} of ${t} done`;return`
    <li>
      <button
        data-program-id="${e.id}"
        class="w-full card p-4 text-left active:scale-[0.98] transition-transform"
      >
        <div class="flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold tracking-tight truncate">${$t(e.title)}</h3>
            <div class="flex items-center gap-2 mt-2">
              <div class="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-linear-to-r from-brand-500 to-brand-400 transition-all" style="width: ${a}%"></div>
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
  `}function $t(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function St(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/"));try{const[t,s]=await Promise.all([z(),Je()]);Lt(e,t.programs,s.plans)}catch(t){qt(e,t)}}function Lt(e,t,s){const a=new Map(t.map(r=>[r.id,r])),n=[];for(const r of s)for(const o of r.subPlans||[]){const i=(o.programs||[]).map(l=>a.get(l)).filter(Boolean);i.length!==0&&n.push({category:r.name,title:o.name,description:o.description,programs:i})}e.innerHTML=`
    <header class="px-6 pt-12 pb-4 flex items-center gap-3">
      <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="h-page">Programs</h1>
    </header>

    <main class="flex-1 px-6 pb-24 space-y-8">
      ${n.map((r,o)=>`
        <section class="space-y-3 animate-slide-up" style="animation-delay: ${o*30}ms">
          <div>
            <p class="eyebrow">${r.category}</p>
            <h2 class="h-section mt-1">${r.title}</h2>
            ${r.description?`<p class="text-sm text-slate-400 mt-1 leading-relaxed">${r.description}</p>`:""}
          </div>
          <ul class="space-y-2">
            ${r.programs.map(i=>Et(i)).join("")}
          </ul>
        </section>
      `).join("")}
    </main>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/")),e.querySelectorAll("[data-program-id]").forEach(r=>{r.addEventListener("click",()=>{k(`/program/${r.dataset.programId}`)})})}function Et(e){const t=e.items?.length||e.exercises?.length||0;return`
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
  `}function qt(e,t){e.innerHTML=`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold text-red-400 mb-2">Couldn't load programs</h2>
        <p class="text-sm text-slate-400">${t?.message||t}</p>
      </div>
    </main>
  `}function Fe(e){if(!e)return null;const t=[/youtube\.com\/watch\?v=([^&]+)/,/youtube\.com\/shorts\/([^?&/]+)/,/youtube\.com\/embed\/([^?&/]+)/,/youtu\.be\/([^?&/]+)/];for(const s of t){const a=e.match(s);if(a)return a[1]}return null}function Ct(e,t="hqdefault"){const s=Fe(e);return s?`https://i.ytimg.com/vi/${s}/${t}.jpg`:null}function Mt(e,t={}){const s=Fe(e);if(!s)return null;const a=new URLSearchParams({autoplay:"1",rel:"0",modestbranding:"1",playsinline:"1"}),n=Math.floor(t.startTime||0),r=Math.floor(t.endTime||0),o=!(n>0&&r>0&&n>=r);return o&&n>0&&a.set("start",String(n)),o&&r>0&&a.set("end",String(r)),`https://www.youtube.com/embed/${s}?${a.toString()}`}function We(e,t="w_800,q_auto,f_auto"){return!e||!e.includes("cloudinary.com")?e:e.replace("/upload/",`/upload/${t}/`)}function jt(e){if(!e||!e.type)return"unknown";if(["youtube","tiktok","vimeo"].includes(e.type))return"embed";const t=e.mediaType==="video"||["mp4","webm","mov"].includes(e.format);return e.format==="gif"?"image":t?"video":"image"}function $e(e,t,s={}){if(!t){e.innerHTML='<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No media</div>';return}const a=jt(t),n=s.className||"w-full max-h-[60vh] object-contain rounded-2xl bg-slate-800";switch(e.classList.add("animate-fade-in"),a){case"image":Tt(e,t,n,s.onError);break;case"video":Pt(e,t,n,s.autoplay,s.onError);break;case"embed":At(e,t,n,s.onEmbedPlay);break;default:e.innerHTML=`<div class="${n} flex items-center justify-center text-slate-500 text-sm">Unsupported media type</div>`}}function Tt(e,t,s,a){const n=t.type==="cloudinary"?We(t.url,"w_800,q_auto,f_auto"):t.url;e.innerHTML=`
    <img
      src="${n}"
      alt="Exercise demonstration"
      class="${s}"
      loading="lazy"
      decoding="async"
    />
  `,a&&e.querySelector("img")?.addEventListener("error",()=>a(),{once:!0})}function Pt(e,t,s,a=!0,n){const r=t.type==="cloudinary"?We(t.url,"w_800,q_auto,f_auto"):t.url;let o="";if(t.format==="mp4"){const l=t.startTime||0,d=t.endTime||0,u=!(l>0&&d>0&&l>=d);u&&l>0&&d>0?o=`#t=${l},${d}`:u&&l>0&&(o=`#t=${l}`)}e.innerHTML=`
    <video
      src="${r}${o}"
      class="${s} cursor-pointer"
      ${a?"autoplay":""}
      loop
      muted
      playsinline
      preload="metadata"
    ></video>
  `;const i=e.querySelector("video");i?.addEventListener("click",()=>{i.paused?i.play():i.pause()}),n&&i?.addEventListener("error",()=>n(),{once:!0})}function At(e,t,s,a){const o=`${(t.url||"").includes("/shorts/")?"aspect-9/16 max-h-[70vh] mx-auto":"aspect-video"} w-full rounded-2xl overflow-hidden bg-slate-900`,i=t.type==="youtube"?Ct(t.url,"hqdefault"):null;e.innerHTML=`
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
  `;const l=e.querySelector('[data-action="play-embed"]');l&&l.addEventListener("click",()=>{const d=t.type==="youtube"?Mt(t.url,{startTime:t.startTime,endTime:t.endTime}):t.url;e.innerHTML=`
        <div class="${o} relative">
          <iframe
            src="${d}"
            class="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      `,a?.()},{once:!0})}function G(e,t){const s=Ut((t||[]).filter(Boolean));if(s.length===0){e.innerHTML='<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No demos available</div>';return}const a=new Set;let n=!1;const r=new Set(["youtube","tiktok","vimeo"]);s.forEach((i,l)=>{r.has(i.type)&&a.add(l)}),a.size>0?o():e.innerHTML=`
      <div data-region="loader" class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center">
        <div class="demo-loader" aria-label="Loading demo"></div>
      </div>
    `,s.forEach((i,l)=>{r.has(i.type)||Bt(i,d=>{d&&(a.add(l),o())})}),setTimeout(()=>{a.size===0&&(s.forEach((i,l)=>a.add(l)),o())},6e3);function o(){const i=s.filter((u,c)=>a.has(c));if(i.length===0)return;const l=s.findIndex((u,c)=>a.has(c)),d=n?-1:i.indexOf(s[l]);Nt(e,i,d>=0?d:0,u=>{n=n||u})}}function Bt(e,t){const s=e.url;if(!s){t(!1);return}if(!(e.format==="gif")&&(e.mediaType==="video"||["mp4","webm","mov"].includes(e.format))){const r=document.createElement("video");r.preload="metadata",r.src=s,r.addEventListener("loadeddata",()=>t(!0),{once:!0}),r.addEventListener("error",()=>t(!1),{once:!0})}else{const r=new Image;if(r.src=s,r.complete&&r.naturalWidth>0){t(!0);return}r.addEventListener("load",()=>t(!0),{once:!0}),r.addEventListener("error",()=>t(!1),{once:!0})}}function Nt(e,t,s,a){let n=It(s,t.length);e.innerHTML=`
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
  `;const r=e.querySelector('[data-region="track"]'),o=e.querySelector('[data-region="dots"]'),i=e.querySelector('[data-region="caption"]');r.style.scrollbarWidth="none";const l=new Set;t.forEach((p,m)=>{const b=document.createElement("div");b.className="shrink-0 w-full snap-center",$e(b,p,{onError:()=>{b.innerHTML=`<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">Couldn't load</div>`},onEmbedPlay:()=>l.add(m)}),r.appendChild(b)});const d=()=>{o&&(o.innerHTML=t.map((p,m)=>`
        <button data-dot-index="${m}" aria-label="Demo ${m+1}" class="p-1.5 -m-1.5 group touch-manipulation">
          <span class="block w-1 h-1 rounded-full transition-colors ${m===n?"bg-brand-400":"bg-slate-600 group-hover:bg-slate-500"}"></span>
        </button>`).join(""),o.querySelectorAll("[data-dot-index]").forEach(p=>{p.addEventListener("click",()=>{a(!0);const m=Number(p.dataset.dotIndex),b=r.children[m];b&&r.scrollTo({left:b.offsetLeft-r.offsetLeft,behavior:"smooth"})})}))},u=()=>{if(!i)return;const p=t[n],m=Ht(p),b=p.metadata?.creatorUrl,g=p.url;if(b){const y=Ve(p),x=p.metadata?.channel;x?i.innerHTML=`${R(y)} · <a href="${R(b)}" target="_blank" rel="noopener" class="hover:text-brand-400 transition-colors">${R(x)} ↗</a>`:i.innerHTML=`<a href="${R(b)}" target="_blank" rel="noopener" class="hover:text-brand-400 transition-colors">${R(m)} ↗</a>`}else g&&(p.type==="youtube"||p.type==="tiktok"||p.type==="vimeo")?i.innerHTML=`<a href="${g}" target="_blank" rel="noopener" class="hover:text-brand-400 transition-colors">${R(m)} ↗</a>`:i.textContent=m};let c=!1;r.addEventListener("scroll",()=>{c||(c=!0,requestAnimationFrame(()=>{c=!1;const p=r.children[0]?.offsetWidth||1,m=Math.round(r.scrollLeft/p);if(m!==n&&m>=0&&m<t.length){if(a(!0),l.has(n)){const b=r.children[n];b&&(l.delete(n),$e(b,t[n],{onError:()=>{},onEmbedPlay:()=>l.add(n)}))}n=m,d(),u()}}))},{passive:!0}),requestAnimationFrame(()=>{const p=r.children[n];p&&(r.scrollLeft=p.offsetLeft-r.offsetLeft)}),d(),u()}function It(e,t){return Math.max(0,Math.min(t-1,e))}function Ut(e){const t={cloudinary:0,youtube:1,vimeo:2,tiktok:2,url:3,local:4};return[...e].sort((s,a)=>s.isPrimary&&!a.isPrimary?-1:a.isPrimary&&!s.isPrimary?1:(t[s.type]??99)-(t[a.type]??99))}function Ve(e){return{cloudinary:e.format==="mp4"?"Video":"Demo",youtube:"YouTube",tiktok:"TikTok",vimeo:"Vimeo",local:"Demo",url:"External"}[e.type]||e.type}function Ht(e){const t=Ve(e),s=e.metadata?.channel;return s?`${t} · ${s}`:e.notes?`${t} · ${e.notes}`:t}function R(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Ye(e){const t=String(e?.sets??"").trim(),s=String(e?.reps??"").trim();if(/^decrement/i.test(t)){const n=s.match(/^(\d+)\s*(?:->|→|-)\s*(\d+)$/);if(n){const r=parseInt(n[1],10),o=parseInt(n[2],10);if(r>o&&r>=1&&o>=1&&r<=50)return{kind:"decrement",total:r-o+1,start:r,end:o}}return{kind:"plain"}}const a=t.match(/^(\d+)\s*-\s*(\d+)$/);if(a){const n=parseInt(a[1],10),r=parseInt(a[2],10);return n>=1&&r>n&&r<=50?{kind:"range",min:n,max:r}:{kind:"plain"}}if(/^\d+$/.test(t)){const n=parseInt(t,10);if(n>=1&&n<=50)return{kind:"integer",total:n}}return{kind:"plain"}}const _t='<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h5M20 20v-5h-5M5 9a7 7 0 0111-3m3 8a7 7 0 01-11 3"/></svg>';function Ke(e,t,s){const a=e.reps||"—",n=e.repUnits||"reps",r=String(a).length>5;if(t.kind==="plain")return`
      ${Q(a,n,r)}
      ${Q(e.sets||"—","sets",String(e.sets||"").length>5)}
    `;if(t.kind==="decrement"){const o=t.total-s,i=s>=t.total?"✓":String(o);return`
      <div class="bg-slate-800/50 rounded-xl p-3 text-center overflow-hidden">
        <p class="text-3xl font-extrabold leading-none num tracking-tight ${s>=t.total?"text-emerald-400":"text-brand-400"}" data-set="reps">${i}</p>
        <p class="label-meta mt-1.5">reps this set</p>
      </div>
      ${Se(t.total,s,"sets")}
    `}if(t.kind==="range"){const o=Math.max(0,s-t.min),i=s>=t.min;return`
      ${Q(a,n,r)}
      ${zt(t,s,o,i)}
    `}return`
    ${Q(a,n,r)}
    ${Se(t.total,s,"sets")}
  `}function Q(e,t,s){return`
    <div class="bg-slate-800/50 rounded-xl p-3 text-center overflow-hidden">
      <p class="${s?"text-lg":"text-3xl"} font-extrabold text-brand-400 leading-none num tracking-tight">${xe(String(e))}</p>
      <p class="label-meta mt-1.5">${xe(t)}</p>
    </div>
  `}function Se(e,t,s){const a=t>=e;return`
    <div class="relative">
      <div class="set-tile p-3 text-center h-full" data-set="tile" role="button" tabindex="0" aria-label="Log a set">
        <div class="set-fill" data-set="fill" style="transform:scaleX(${Math.min(t,e)/e})"></div>
        <div class="set-content">
          <p class="leading-none num"><span class="text-3xl font-extrabold" data-set="done">${t}</span><span class="text-lg font-bold text-slate-300">/${e}</span></p>
          <p class="label-meta mt-1.5" data-set="cap">${a?"complete":xe(s)}</p>
        </div>
      </div>
      <button data-set="undo" class="set-nub ${t===0?"set-hide":""} absolute -top-2 -left-2 w-7 h-7 rounded-full bg-slate-700 border border-slate-600 text-slate-200 text-lg font-bold flex items-center justify-center shadow-lg active:bg-slate-600" aria-label="Remove last set">−</button>
      <button data-set="reset" class="set-nub ${a?"":"set-hide"} absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-800 border border-slate-600 text-slate-400 flex items-center justify-center shadow-lg active:bg-slate-700" aria-label="Reset sets">${_t}</button>
    </div>
  `}function zt(e,t,s,a){const n=Math.min(t,e.min)/e.min,r=a&&s<e.max-e.min,o=a?s?`${t} done · nice`:"complete":"sets";return`
    <div class="relative">
      <div class="set-tile p-3 text-center h-full ${a?"set-done":""}" data-set="tile" role="button" tabindex="0" aria-label="Log a set">
        <div class="set-fill" data-set="fill" style="transform:scaleX(${n})"></div>
        <div class="set-content">
          <p class="leading-none num"><span class="text-3xl font-extrabold" data-set="done">${t}</span>${a?"":`<span class="text-lg font-bold text-slate-300">/${e.min}</span>`}</p>
          <p class="label-meta mt-1.5 ${a?"text-emerald-200":""}" data-set="cap">${o}</p>
        </div>
      </div>
      <button data-set="undo" class="set-nub ${t===0?"set-hide":""} absolute -top-2 -left-2 w-7 h-7 rounded-full bg-slate-700 border border-slate-600 text-slate-200 text-lg font-bold flex items-center justify-center shadow-lg active:bg-slate-600" aria-label="Remove last set">−</button>
      <button data-set="bonus" class="set-nub ${r?"":"set-hide"} absolute -bottom-2 -right-2 h-7 px-2.5 rounded-full bg-emerald-600 border border-emerald-400/40 text-white text-xs font-bold flex items-center justify-center shadow-lg" aria-label="Log a bonus set">+${e.max-e.min-s} bonus</button>
    </div>
  `}function Xe(e,t,s){if(t.kind==="plain")return;const a=e.querySelector('[data-set="tile"]');if(!a)return;const n=e.querySelector('[data-set="undo"]'),r=e.querySelector('[data-set="reset"]'),o=e.querySelector('[data-set="bonus"]'),i=t.kind==="range"?t.min:t.total,l=t.kind==="range"?t.max:t.total,d=u=>{const c=Math.max(0,Math.min(l,u)),p=s.count>=i,m=c>=i;s.onCount(c),m!==p&&s.onSetsDone?.(m)};a.addEventListener("click",()=>{s.count<l&&d(s.count+1)}),a.addEventListener("keydown",u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),s.count<l&&d(s.count+1))}),n?.addEventListener("click",u=>{u.stopPropagation(),s.count>0&&d(s.count-1)}),r?.addEventListener("click",u=>{u.stopPropagation(),d(0)}),o?.addEventListener("click",u=>{u.stopPropagation(),s.count<l&&d(s.count+1)})}function xe(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Rt(e,t){const s=document.createElement("article");s.className=`card overflow-hidden transition-all ${t.isCompleted?"opacity-60":""}`,s.dataset.itemIndex=String(t.index);const a=e.exercise?.demos||[],r=`${t.index+1}. ${e.name}`,o=Ye(e),i=t.setCount||0;if(s.innerHTML=`
    <div class="flex items-stretch">
      <button
        data-action="toggle"
        class="flex-1 min-w-0 px-4 py-4 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation"
      >
        <div class="flex-1 min-w-0">
          ${Dt(e.tags)}
          <h3 class="font-semibold tracking-tight leading-tight ${t.isCompleted?"line-through text-slate-500":"text-slate-100"}">
            ${F(r)}
          </h3>
          <p class="text-sm text-slate-400 mt-1 num truncate">
            ${Ot(e)}
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
          ${Ke(e,o,i)}
        </div>
        ${e.note?`
          <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
            <p class="text-sm text-slate-300 leading-relaxed">${F(e.note)}</p>
          </div>
        `:""}
        ${e.exercise?.purpose?.trim()?`
          <div class="text-sm text-slate-300 leading-relaxed">
            <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">Purpose</p>
            <p>${F(e.exercise.purpose)}</p>
          </div>
        `:""}
        ${e.exercise?.how_to?.trim()?`
          <div class="text-sm text-slate-300 leading-relaxed">
            <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">How to perform</p>
            <p class="whitespace-pre-line">${F(e.exercise.how_to)}</p>
          </div>
        `:""}
      </div>
    </div>
  `,t.isExpanded&&a.length>0){const l=s.querySelector("[data-media-slot]");l&&G(l,a)}return t.isExpanded&&o.kind!=="plain"&&Xe(s,o,{count:i,onCount:l=>t.onSetCount?.(t.index,l),isCompleted:t.isCompleted,onSetsDone:l=>t.onSetsDone?.(t.index,l)}),s.querySelector('[data-action="toggle"]')?.addEventListener("click",()=>{t.onToggle?.(t.index)}),s.querySelector('[data-action="complete"]')?.addEventListener("click",l=>{l.stopPropagation(),t.onComplete?.(t.index)}),s}function Ot(e){const t=e.reps||"—",s=e.sets||"—";return`${t} · ${s} sets`}function Dt(e=[]){return e.length?`
    <div class="flex gap-1.5 mb-1.5">
      ${e.map(t=>`
        <span class="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">${F(t)}</span>
      `).join("")}
    </div>
  `:""}function F(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const Gt={superset:"Super Set",compound:"Compound",circuit:"Circuit"};function Jt(e,t){const s=document.createElement("article");s.className=`transition-all ${t.isCompleted?"opacity-60":""}`,s.dataset.itemIndex=String(t.index);const a=Gt[e.kind]||e.kind,n=t.index+1,r=e.exercises.map(u=>Ye(u)),o=e.exercises.map((u,c)=>t.getMemberSetCount?.(c)||0),i=e.exercises.map((u,c)=>Le(r[c],o[c])),l=e.exercises.map((u,c)=>{const p=String.fromCharCode(97+c),m=`${n}${p}. ${Ee(u.name)}`,b=c===0,g=c===e.exercises.length-1,y=t.isCompleted||i[c];return`
      <div class="card ${b?"rounded-t-2xl":"rounded-t-none"} ${g?"rounded-b-2xl":"rounded-b-none"} overflow-hidden ${b?"":"border-t-0"}">
        ${b?"":'<div class="h-px bg-slate-700/50"></div>'}
        <div class="flex items-stretch">
          <button
            data-action="toggle-member"
            data-member-idx="${c}"
            class="flex-1 min-w-0 px-4 py-4 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation"
          >
            <div class="flex-1 min-w-0">
              ${b?`<div class="flex gap-1.5 mb-1.5"><span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300">${a}</span></div>`:""}
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
              ${Ke(u,r[c],o[c])}
            </div>
            ${u.note?`
            <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
              <p class="text-sm text-slate-300 leading-relaxed">${Ee(u.note)}</p>
            </div>`:""}
          </div>
        </div>
      </div>
    `}).join("");s.innerHTML=l,s.querySelectorAll('[data-action="toggle-member"]').forEach(u=>{u.addEventListener("click",()=>{t.onToggle?.(t.index)})}),s.querySelectorAll('[data-action="complete"]').forEach(u=>{u.addEventListener("click",c=>{c.stopPropagation(),t.onComplete?.(t.index)})}),t.isExpanded&&e.exercises.forEach((u,c)=>{const p=s.querySelector(`[data-member-media="${c}"]`),m=u.exercise?.demos||[];p&&m.length>0&&G(p,m);const b=r[c];if(b.kind==="plain")return;const g=s.querySelector(`[data-member-tracker="${c}"]`);g&&Xe(g,b,{count:o[c],onCount:y=>t.onMemberSetCount?.(t.index,c,y,d(c,y)),isCompleted:t.isCompleted,onSetsDone:()=>{}})});function d(u,c){return e.exercises.every((p,m)=>{const b=r[m],g=m===u?c:o[m];return Le(b,g)})}return s}function Le(e,t){if(!e||e.kind==="plain")return!1;const s=e.kind==="range"?e.min:e.total;return t>=s}function Ee(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const qe=["Nice work!","Killer moves!","Awesome job!","Crushed it!","You did it!","Beast mode!","On fire!","Way to go!","Strengthened and Conditioned!"];let Ce=0;function oe(){const e=Date.now();if(e-Ce<5e3)return;Ce=e;const t=qe[Math.floor(Math.random()*qe.length)],s=document.createElement("div");s.className="celebration-flash";const a=document.createElement("div");a.className="celebration-text",a.textContent=t,document.body.appendChild(s),document.body.appendChild(a),setTimeout(()=>s.remove(),700),setTimeout(()=>a.remove(),3100)}async function Ft(e,t){e.innerHTML=se(`
    <main class="flex-1 px-6 pb-24 flex items-center justify-center">
      <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </main>
  `),ae(e);try{const s=await ht(t);if(!s){Vt(e,t);return}xt(s.id),Wt(e,s)}catch(s){Yt(e,s)}}function Wt(e,t){const s=Oe(t.id),a=t.resolvedItems.length;let n=-1;e.innerHTML=se(`
    <div class="sticky top-15 z-10 px-6 pt-2 pb-3 bg-slate-950/85 backdrop-blur-md border-b border-slate-900">
      <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div data-region="progress-bar" class="h-full bg-linear-to-r from-brand-500 to-brand-400 transition-all duration-500" style="width: ${s.size/a*100}%"></div>
      </div>
      <p class="text-[11px] text-slate-500 mt-1.5 font-medium num">
        <span data-region="completed-count">${s.size}</span> of ${a} complete
      </p>
    </div>

    <header class="px-6 pt-4 pb-3">
      <h1 class="h-page">${N(t.title)}</h1>
      ${t.requirements?`
        <p class="text-sm text-slate-400 mt-1.5">${N(t.requirements)}</p>
      `:""}
      ${t.source?`
        <p class="text-xs text-slate-500 mt-2">
          Program by ${t.source.url?`<a href="${N(t.source.url)}" target="_blank" rel="noopener" class="text-slate-400 hover:text-brand-400 transition-colors">${N(t.source.name)} ↗</a>`:`<span class="text-slate-400">${N(t.source.name)}</span>`}${t.source.organization?` · ${N(t.source.organization)}`:""}
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
  `,t.title),ae(e);const r=e.querySelector('[data-region="items"]'),o=e.querySelector('[data-region="actions"]'),i=()=>{r.innerHTML="",t.resolvedItems.forEach((u,c)=>{const p=document.createElement("li"),m={index:c,isExpanded:c===n,isCompleted:s.has(c),setCount:ke(t.id,c),getMemberSetCount:g=>ke(t.id,`${c}:${g}`),onToggle:g=>{n=n===g?-1:g,d(),n===g&&requestAnimationFrame(()=>{const y=r.querySelector(`[data-item-index="${g}"]`);if(y){const x=window.scrollY+y.getBoundingClientRect().top-130;window.scrollTo({top:Math.max(0,x),behavior:"smooth"})}})},onSetCount:(g,y)=>{Z(t.id,g,y),d()},onMemberSetCount:(g,y,x,$)=>{Z(t.id,`${g}:${y}`,x);const L=s.has(g);if($!==L){const h=s.size===a,M=ne(t.id,g);s.clear(),M.forEach(P=>s.add(P)),!h&&s.size===a&&setTimeout(oe,250)}d()},onSetsDone:(g,y)=>{const x=s.has(g);if(y===x)return;const $=s.size===a,L=ne(t.id,g);s.clear(),L.forEach(h=>s.add(h)),d(),!$&&s.size===a&&setTimeout(oe,250)},onComplete:g=>{const y=s.size===a,x=ne(t.id,g);s.clear(),x.forEach(L=>s.add(L)),Z(t.id,g,0);const $=t.resolvedItems[g];$&&Array.isArray($.exercises)&&$.exercises.forEach((L,h)=>Z(t.id,`${g}:${h}`,0)),x.has(g)&&n===g&&(n=-1),d(),!y&&s.size===a&&setTimeout(oe,250)}},b=u.kind==="single"?Rt(u,m):Jt(u,m);p.appendChild(b),r.appendChild(p)})},l=()=>{const u=e.querySelector('[data-region="progress-bar"]');u&&(u.style.width=`${s.size/a*100}%`);const c=e.querySelector('[data-region="completed-count"]');c&&(c.textContent=String(s.size)),o.classList.toggle("hidden",s.size===0)},d=()=>{i(),l()};d(),e.querySelector('[data-action="reset"]')?.addEventListener("click",()=>{confirm("Reset progress for this program?")&&(mt(t.id),s.clear(),d())}),e.querySelector('[data-action="share"]')?.addEventListener("click",()=>{const u=window.location.href;navigator.share?navigator.share({title:t.title,text:`Check out: ${t.title}`,url:u}).catch(()=>{}):navigator.clipboard?.writeText(u).then(()=>alert("Link copied!")).catch(()=>prompt("Copy:",u))})}function se(e,t="Program"){return`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400 truncate">${N(t)}</span>
      </header>
      ${e}
    </div>
  `}function ae(e){e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/programs"))}function Vt(e,t){e.innerHTML=se(`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold mb-2">Program not found</h2>
        <p class="text-sm text-slate-400">No program with id <code class="text-slate-300">${N(t)}</code>.</p>
      </div>
    </main>
  `),ae(e)}function Yt(e,t){e.innerHTML=se(`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold text-red-400 mb-2">Couldn't load program</h2>
        <p class="text-sm text-slate-400">${N(t?.message||String(t))}</p>
      </div>
    </main>
  `),ae(e)}function N(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Kt(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/")),e.querySelector('[data-action="new-program"]')?.addEventListener("click",()=>k("/studio/program")),e.querySelector('[data-action="new-exercise"]')?.addEventListener("click",()=>k("/studio/exercise")),e.querySelector('[data-action="ai-builder"]')?.addEventListener("click",()=>k("/studio/ai"))}let D=null;async function Xt(){if(D)return D;const{exercises:e}=await U();return D=e.map(t=>({id:t.id,name:t.name,hasDemos:(t.demos||[]).length>0,tokens:_(t.name).concat((t.aliases||[]).flatMap(s=>_(s))).concat(_(t.id.replace(/[-_]/g," "))),exercise:t})),D}function Zt(e){D&&D.push({id:e.id,name:e.name,hasDemos:(e.demos||[]).length>0,tokens:_(e.name).concat((e.aliases||[]).flatMap(t=>_(t))).concat(_(e.id.replace(/[-_]/g," "))),exercise:e})}async function re(e,t=10){const s=await Xt();if(!e||!e.trim())return s.slice(0,t);const a=_(e);return s.map(n=>({...n,score:es(n.tokens,a)})).filter(n=>n.score>0).sort((n,r)=>r.score-n.score).slice(0,t)}function Qt(e,t={}){e.innerHTML=`
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
  `;const s=e.querySelector('[data-input="search"]'),a=e.querySelector('[data-region="results"]'),n=e.querySelector('[data-region="empty"]'),r=e.querySelector('[data-action="create-new"]');let o=null;const i=(d,u)=>{if(!u||!u.trim()){a.classList.add("hidden"),n.classList.add("hidden"),r.classList.add("hidden");return}if(r.classList.remove("hidden"),d.length===0){a.classList.add("hidden"),n.classList.remove("hidden");return}n.classList.add("hidden"),a.classList.remove("hidden"),a.innerHTML=d.map(c=>`
      <li>
        <button
          data-exercise-id="${c.id}"
          class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800/60 active:bg-slate-800 transition-colors flex items-center gap-3 touch-manipulation"
        >
          <span class="flex-1 min-w-0">
            <span class="text-sm font-medium text-slate-100 block truncate">${ts(c.name)}</span>
          </span>
          ${c.hasDemos?`
            <span class="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-sm">demo</span>
          `:""}
        </button>
      </li>
    `).join(""),a.querySelectorAll("[data-exercise-id]").forEach(c=>{c.addEventListener("click",()=>{const p=d.find(m=>m.id===c.dataset.exerciseId);p&&t.onSelect?.(p.exercise)})})},l=async()=>{const d=s.value,u=await re(d);i(u,d)};s.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(l,150)}),i([],""),r?.addEventListener("click",()=>t.onCreateNew?.(s.value.trim()))}function _(e){return e?e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().split(/[^a-z0-9]+/).filter(t=>t.length>0):[]}function es(e,t){let s=0;for(const a of t){let n=0;for(const r of e)r===a?n=Math.max(n,10):r.startsWith(a)?n=Math.max(n,7):r.includes(a)&&(n=Math.max(n,4));if(n===0)return 0;s+=n}return s}function ts(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const ie=[{value:"youtube",label:"YouTube",fields:["url","startTime","endTime","notes"]},{value:"cloudinary",label:"Cloudinary",fields:["url","startTime","endTime","notes"]},{value:"local",label:"Local file",fields:["url","notes"]},{value:"url",label:"URL (external)",fields:["url","notes"]},{value:"tiktok",label:"TikTok",fields:["url","notes"]},{value:"vimeo",label:"Vimeo",fields:["url","startTime","endTime","notes"]}];function ge(e,t){s();function s(){e.innerHTML=`
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-[10px] text-slate-500 uppercase font-semibold">Demo Sources</label>
          <span class="text-[10px] text-slate-500 num">${t.length} demo${t.length!==1?"s":""}</span>
        </div>
        ${t.length===0?'<p class="text-xs text-slate-500 italic">No demos yet. Add one below.</p>':""}
        <div class="space-y-3">
          ${t.map((r,o)=>a(r,o)).join("")}
        </div>
        <button data-action="add-demo" class="w-full border border-dashed border-slate-700 rounded-xl py-2.5 text-sm text-slate-400 hover:text-brand-400 hover:border-brand-500/50 transition-colors touch-manipulation">
          + Add demo
        </button>
      </div>
    `,n()}function a(r,o){const l=(ie.find(u=>u.value===r.type)||ie[0]).fields.includes("startTime"),d=r.type==="youtube"?ss(r.url):null;return`
      <div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 space-y-2.5" data-demo-index="${o}">
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-slate-500 font-bold num">#${o+1}</span>
          <select data-demo-field="type" data-index="${o}" class="flex-1 bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-brand-500">
            ${ie.map(u=>`<option value="${u.value}"${r.type===u.value?" selected":""}>${u.label}</option>`).join("")}
          </select>
          <label class="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer select-none">
            <input type="radio" name="primary-demo" data-index="${o}" ${r.isPrimary?"checked":""} class="w-3 h-3 text-brand-500"/>
            <span>Primary</span>
          </label>
          <button data-action="remove-demo" data-index="${o}" class="p-1 rounded-sm hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors" aria-label="Remove demo">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div>
          <input data-demo-field="url" data-index="${o}" value="${je(r.url||"")}" placeholder="https://..." class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500 font-mono"/>
        </div>
        ${d?`<img src="${d}" alt="Thumbnail" class="w-full h-20 object-cover rounded-lg bg-slate-900"/>`:""}
        ${l?`
          <div class="grid grid-cols-2 gap-2">
            <div><label class="text-[10px] text-slate-500 block mb-0.5">Start (sec)</label>
              <input data-demo-field="startTime" data-index="${o}" type="number" min="0" value="${r.startTime||0}" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-brand-500 num"/></div>
            <div><label class="text-[10px] text-slate-500 block mb-0.5">End (sec)</label>
              <input data-demo-field="endTime" data-index="${o}" type="number" min="0" value="${r.endTime||0}" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-brand-500 num"/></div>
          </div>
        `:""}
        <div>
          <input data-demo-field="notes" data-index="${o}" value="${je(r.notes||"")}" placeholder="Notes (optional)" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/>
        </div>
      </div>
    `}function n(){e.querySelector('[data-action="add-demo"]')?.addEventListener("click",()=>{t.push({type:"youtube",mediaType:"video",format:"youtube",url:"",startTime:0,endTime:0,isPrimary:t.length===0,notes:""}),s()}),e.querySelectorAll('[data-action="remove-demo"]').forEach(r=>{r.addEventListener("click",()=>{const o=+r.dataset.index,i=t[o].isPrimary;t.splice(o,1),i&&t.length>0&&(t[0].isPrimary=!0),s()})}),e.querySelectorAll('input[name="primary-demo"]').forEach(r=>{r.addEventListener("change",()=>{const o=+r.dataset.index;t.forEach((i,l)=>{i.isPrimary=l===o})})}),e.querySelectorAll('[data-demo-field="type"]').forEach(r=>{r.addEventListener("change",()=>{const o=+r.dataset.index;t[o].type=r.value,t[o].format=r.value==="youtube"?"youtube":r.value==="cloudinary"?Me(t[o].url):r.value,t[o].mediaType="video",s()})}),e.querySelectorAll("[data-demo-field]").forEach(r=>{if(r.tagName==="SELECT")return;const o=()=>{const i=+r.dataset.index,l=r.dataset.demoField;l==="startTime"||l==="endTime"?t[i][l]=Number(r.value)||0:t[i][l]=r.value,l==="url"&&t[i].type==="cloudinary"&&(t[i].format=Me(r.value))};r.addEventListener("input",o),r.addEventListener("change",o)})}}function ss(e){if(!e)return null;const t=e.match(/(?:v=|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);return t?`https://img.youtube.com/vi/${t[1]}/hqdefault.jpg`:null}function Me(e){return e&&/\.(mp4|webm|mov)(\?|$)/i.test(e)?"mp4":"gif"}function je(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function as(e,t,s){const{items:a}=t;if(a.length===0){e.innerHTML="";return}e.innerHTML=a.map((n,r)=>n.type==="group"?ns(n,r,t):rs(n,r,t)).join(""),ds(e,t,s)}function rs(e,t,s){const a=s.expandedIndex===t,n=e.exerciseNote||"",r=n.length>50?n.substring(0,50)+"…":n,o=(e.tags||[]).map(i=>`<span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-300">${i}</span>`).join("");return`<li class="card" data-idx="${t}" data-type="single">
  <div class="flex items-center px-4 py-3 gap-2 relative">
    <div class="flex-1 min-w-0 cursor-pointer" data-action="expand" data-idx="${t}">
      ${o?`<div class="flex gap-1 mb-1">${o}</div>`:""}
      <p class="text-sm font-medium text-slate-100 truncate">${te(e.exerciseName)}</p>
      <p class="text-xs text-slate-400 num mt-0.5">${e.reps||"—"} ${e.repUnits||"reps"} · ${e.sets||"—"} sets</p>
      ${r?`<p class="text-[11px] text-slate-500 truncate mt-0.5 italic">${te(r)}</p>`:""}
    </div>
    ${Ze(t)}
  </div>
  ${a?`<div class="border-t border-slate-800" data-region="edit-form" data-idx="${t}"></div>`:""}
</li>`}function ns(e,t,s){const a=s.expandedIndex===t,n={superset:"Superset",compound:"Compound",circuit:"Circuit"}[e.kind]||e.kind,r=e.members.map((o,i)=>`
    <div class="flex items-center px-4 py-2.5 gap-2 ${i>0?"border-t border-slate-800/50":""}">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-100 truncate">${te(o.exerciseName)}</p>
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
      <span class="text-[10px] font-bold uppercase tracking-wide text-brand-300">${n}</span>
      <span class="text-[10px] text-slate-500 num ml-2">${e.members.length} exercises</span>
    </div>
    ${Ze(t)}
  </div>
  ${r}
  ${a?`<div class="border-t border-slate-800" data-region="edit-form" data-idx="${t}"></div>`:""}
</li>`}function Ze(e){return`<button data-action="menu" data-idx="${e}" class="relative z-10 p-3 -mr-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation shrink-0" aria-label="Actions">
    <svg class="w-5 h-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
  </button>`}function os(e,t,s,a){is();const n=s.items[t],r=n.type==="group",o=s.items.length,i=t>0?s.items[t-1]:null,l=t<o-1?s.items[t+1]:null;let d="";r?(d+=q("edit","Edit group"),t>0&&(d+=q("move-up","Move up")),t<o-1&&(d+=q("move-down","Move down")),i?.type==="single"&&(d+=q("group-above","Add above to group")),l?.type==="single"&&(d+=q("group-below","Add below to group")),d+=q("ungroup","Ungroup")):(d+=q("edit","Edit"),t>0&&(d+=q("move-up","Move up")),t<o-1&&(d+=q("move-down","Move down")),i?.type==="single"?d+=q("group-above","Group with above"):i?.type==="group"&&(d+=q("group-above","Join group above")),l?.type==="single"?d+=q("group-below","Group with below"):l?.type==="group"&&(d+=q("group-below","Join group below"))),d+=q("remove","Remove","text-red-400");const u=r?n.members.map(p=>p.exerciseName).join(" + "):n.exerciseName||"Item",c=document.createElement("div");c.dataset.region="action-menu",c.className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-fade-in",c.innerHTML=`
    <div class="bg-slate-900 border-t border-slate-700 rounded-t-2xl w-full max-w-sm pb-8 pt-3 px-2">
      <div class="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-3"></div>
      <p class="text-xs text-slate-500 text-center mb-2 px-4 truncate">${te(u)}</p>
      <div class="space-y-0.5">${d}</div>
      <button data-menu-action="cancel" class="w-full mt-2 py-3 text-sm text-slate-500 hover:text-slate-300 transition-colors">Cancel</button>
    </div>
  `,document.body.appendChild(c),c.querySelectorAll("[data-menu-action]").forEach(p=>{p.addEventListener("click",m=>{m.stopPropagation();const b=p.dataset.menuAction;c.remove(),b!=="cancel"&&ls(b,t,s,a)})}),c.addEventListener("click",p=>{p.target===c&&c.remove()})}function q(e,t,s=""){return`<button data-menu-action="${e}" class="w-full text-left px-5 py-3 text-sm font-medium rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors ${s}">${t}</button>`}function is(){document.querySelectorAll('[data-region="action-menu"]').forEach(e=>e.remove())}function ls(e,t,s,a,n){const r=s.items[t],o=t>0?s.items[t-1]:null,i=t<s.items.length-1?s.items[t+1]:null;switch(e){case"edit":a.onEdit?.(t);break;case"move-up":a.onMove?.(t,t-1);break;case"move-down":a.onMove?.(t,t+1);break;case"group-above":o?.type==="group"?a.onJoinGroup?.(t,t-1):r.type==="group"&&o?.type==="single"?a.onAbsorbIntoGroup?.(t,t-1):Te(t,"above",a);break;case"group-below":i?.type==="group"?a.onJoinGroup?.(t,t+1):r.type==="group"&&i?.type==="single"?a.onAbsorbIntoGroup?.(t,t+1):Te(t,"below",a);break;case"ungroup":a.onUngroup?.(t);break;case"remove":a.onRemove?.(t);break}}function Te(e,t,s){const a=document.createElement("div");a.dataset.region="kind-picker",a.className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in",a.innerHTML=`
    <div class="bg-slate-900 border-t border-slate-700 rounded-t-2xl w-full max-w-sm p-5 space-y-4 pb-8">
      <p class="text-sm font-medium text-slate-200 text-center">Group type</p>
      <div class="flex gap-2">
        <button data-kind="superset" class="flex-1 py-3 rounded-xl text-sm font-medium bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 active:scale-95 transition-all">Superset</button>
        <button data-kind="compound" class="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all">Compound</button>
        <button data-kind="circuit" class="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all">Circuit</button>
      </div>
      <button data-action="cancel-kind" class="w-full py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">Cancel</button>
    </div>
  `,document.body.appendChild(a),a.querySelectorAll("[data-kind]").forEach(n=>{n.addEventListener("click",()=>{a.remove(),s.onGroup?.(e,t,n.dataset.kind)})}),a.querySelector('[data-action="cancel-kind"]')?.addEventListener("click",()=>a.remove()),a.addEventListener("click",n=>{n.target===a&&a.remove()})}function ds(e,t,s){e.querySelectorAll('[data-action="expand"]').forEach(a=>{a.addEventListener("click",()=>s.onEdit?.(+a.dataset.idx))}),e.querySelectorAll('[data-action="menu"]').forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation(),os(e,+a.dataset.idx,t,s)})}),e.querySelectorAll('[data-action="member-up"]').forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation(),s.onMemberMove?.(+a.dataset.idx,+a.dataset.mi,+a.dataset.mi-1)})}),e.querySelectorAll('[data-action="member-down"]').forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation(),s.onMemberMove?.(+a.dataset.idx,+a.dataset.mi,+a.dataset.mi+1)})}),e.querySelectorAll('[data-action="member-remove"]').forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation(),s.onMemberRemove?.(+a.dataset.idx,+a.dataset.mi)})})}function te(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let f=Qe(),v=-1;function Qe(){return{meta:{title:"",id:"",requirements:"",description:"",difficulty:"",duration:""},items:[],newExercises:[]}}function cs(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/_+$/g,"")}function us(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/studio")),e.querySelector('[data-action="start-fresh"]')?.addEventListener("click",()=>{le(e,null,!1)}),e.querySelector('[data-action="edit-existing"]')?.addEventListener("click",async()=>{const t=await Pe();t&&le(e,t,!0)}),e.querySelector('[data-action="clone-existing"]')?.addEventListener("click",async()=>{const t=await Pe();t&&le(e,t,!1)})}function le(e,t,s){f=Qe(),v=-1,e.innerHTML=`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span data-region="header-title" class="text-sm font-medium text-slate-400 flex-1">${t?s?"Edit: "+j(t.title):"New (from "+j(t.title)+")":"New Program"}</span>
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
  `,ps(e),ms(e),xs(e),C(e),ys(e),hs(),t&&gs(e,t,s)}function ps(e){e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/studio"))}function ms(e){const t=e.querySelector('[data-field="title"]'),s=e.querySelector('[data-field="requirements"]'),a=e.querySelector('[data-region="id-preview"]'),n=e.querySelector('[data-region="export-section"]');t?.addEventListener("input",()=>{f.meta.title=t.value,f.meta.id=cs(t.value),a.textContent=f.meta.id?`id: ${f.meta.id}`:"",n?.classList.toggle("hidden",!f.meta.title.trim()||f.items.length===0)}),s?.addEventListener("input",()=>{f.meta.requirements=s.value})}function xs(e){const t=e.querySelector('[data-region="picker"]');Qt(t,{onSelect:s=>{f.items.push({type:"single",exerciseId:s.id,exerciseName:s.name,exerciseNote:s.recommendations?.note||"",reps:s.recommendations?.reps||"",sets:s.recommendations?.sets||"",repUnits:s.recommendations?.repUnits||"reps",note:"",tags:[]}),C(e)},onCreateNew:s=>{vs(e,s)}})}function C(e){const t=e.querySelector('[data-region="timeline"]'),s=e.querySelector('[data-region="empty-timeline"]'),a=e.querySelector('[data-region="item-count"]'),n=e.querySelector('[data-region="export-section"]');if(t){if(a.textContent=`${f.items.length} item${f.items.length!==1?"s":""}`,f.items.length===0){t.classList.add("hidden"),s.classList.remove("hidden"),n?.classList.add("hidden");return}if(t.classList.remove("hidden"),s.classList.add("hidden"),n?.classList.toggle("hidden",!f.meta.title.trim()),as(t,{items:f.items,expandedIndex:v},{onEdit:r=>{v=v===r?-1:r,C(e)},onRemove:r=>{f.items.splice(r,1),v===r?v=-1:v>r&&v--,C(e)},onMove:(r,o)=>{const[i]=f.items.splice(r,1);f.items.splice(o,0,i),v===r?v=o:r<v&&o>=v?v--:r>v&&o<=v&&v++,C(e)},onGroup:(r,o,i)=>{const l=o==="above"?r-1:r+1,d=Math.min(r,l),u=[f.items[d],f.items[d+1]],c={type:"group",kind:i,note:"",tags:[],members:u};f.items.splice(d,2,c),v=-1,C(e)},onJoinGroup:(r,o)=>{const i=f.items[r];f.items[o].members.push(i),f.items.splice(r,1),v=-1,C(e)},onAbsorbIntoGroup:(r,o)=>{const i=f.items[o],l=f.items[r];o<r?l.members.unshift(i):l.members.push(i),f.items.splice(o,1),v=-1,C(e)},onMemberMove:(r,o,i)=>{const l=f.items[r];if(!l||l.type!=="group")return;const[d]=l.members.splice(o,1);l.members.splice(i,0,d),C(e)},onMemberRemove:(r,o)=>{const i=f.items[r];if(!i||i.type!=="group")return;const[l]=i.members.splice(o,1);if(i.members.length<=1){const d=i.members[0]||l;d.type="single",f.items.splice(r,1,d)}v=-1,C(e)},onUngroup:r=>{const o=f.items[r];if(o.type!=="group")return;const i=o.members.map(l=>({...l,type:"single"}));f.items.splice(r,1,...i),v=-1,C(e)}}),v>=0&&v<f.items.length){const r=t.querySelector(`[data-region="edit-form"][data-idx="${v}"]`);r&&fs(r,f.items[v],v,e)}}}function fs(e,t,s,a){const n=["reps","secs","min","yd","rep","reps (each side)","secs (each side)"],r=["warmup","stretch"];e.innerHTML=`
    <div class="px-4 pb-4 pt-3 space-y-3 bg-slate-900/40">
      <div data-demo-preview="${s}"></div>
      <div class="grid grid-cols-3 gap-2">
        <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Reps</label>
          <input data-edit="reps" value="${j(t.reps||"")}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
        <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Sets</label>
          <input data-edit="sets" value="${j(t.sets||"")}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
        <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Units</label>
          <select data-edit="repUnits" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500">
            ${n.map(i=>`<option value="${i}"${(t.repUnits||"reps")===i?" selected":""}>${i}</option>`).join("")}
          </select></div>
      </div>
      <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Note</label>
        <input data-edit="note" value="${j(t.note||"")}" placeholder="Form cues, weight, etc." class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/></div>
      <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Tags</label>
        <div class="flex gap-2">${r.map(i=>`
          <button type="button" data-pill="${i}" class="px-3 py-1.5 rounded-full text-xs font-medium transition-all ${(t.tags||[]).includes(i)?"bg-brand-500 text-white":"bg-slate-800 text-slate-400 hover:bg-slate-700"}">${i}</button>`).join("")}
        </div></div>
    </div>
  `,e.querySelectorAll("[data-edit]").forEach(i=>{const l=()=>{t[i.dataset.edit]=i.value};i.addEventListener("input",l),i.addEventListener("change",l)}),e.querySelectorAll("[data-pill]").forEach(i=>{i.addEventListener("click",()=>{t.tags||(t.tags=[]);const l=i.dataset.pill;t.tags.includes(l)?t.tags=t.tags.filter(d=>d!==l):t.tags.push(l),C(a)})});const o=e.querySelector(`[data-demo-preview="${s}"]`);o&&t.exerciseId&&bs(o,t.exerciseId)}function j(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function bs(e,t){const{exercises:s}=await U(),a=s.find(o=>o.id===t),n=f.newExercises.find(o=>o.id===t),r=a?.demos||n?.demos||[];if(r.length===0){e.innerHTML='<p class="text-[11px] text-slate-600 italic">No demos available</p>';return}G(e,r)}async function Pe(){const{programs:e}=await z(),t=prompt(`Type part of a program name:

`+e.map(a=>`• ${a.title}`).join(`
`));if(!t)return null;const s=e.find(a=>a.title.toLowerCase().includes(t.toLowerCase()));return s||(alert('No program found matching "'+t+'"'),null)}function gs(e,t,s){f.meta.title=s?t.title:"",f.meta.id=s?t.id:"",f.meta.requirements=t.requirements||"",f.items=(t.items||[]).map(n=>n.kind?{type:"group",kind:n.kind,note:n.note||"",tags:n.tags||[],members:n.exercises.map(r=>({type:"single",exerciseId:r.exerciseId,exerciseName:r.exerciseId,reps:r.reps||"",sets:r.sets||"",repUnits:r.repUnits||"reps",note:r.note||"",tags:[]}))}:{type:"single",exerciseId:n.exerciseId,exerciseName:n.exerciseId,exerciseNote:n.note||"",reps:n.reps||"",sets:n.sets||"",repUnits:n.repUnits||"reps",note:n.note||"",tags:n.tags||[]}),v=-1;const a=e.querySelector('[data-field="title"]');a.value=f.meta.title,a.dispatchEvent(new Event("input")),e.querySelector('[data-field="requirements"]').value=f.meta.requirements,s&&(e.querySelector('[data-region="header-title"]').textContent=`Edit: ${t.title}`),C(e)}let de=!1;function hs(){if(de)return;de=!0;const e=s=>{(f.items.length>0||f.meta.title)&&(s.preventDefault(),s.returnValue="")};window.addEventListener("beforeunload",e);const t=()=>{window.removeEventListener("beforeunload",e),window.removeEventListener("hashchange",t),de=!1};window.addEventListener("hashchange",t)}let ce=[];function vs(e,t=""){const s=e.querySelector('[data-region="exercise-slideover"]');if(!s)return;ce=[],s.querySelector('[data-exfield="name"]').value=t,s.querySelector('[data-exfield="reps"]').value="",s.querySelector('[data-exfield="sets"]').value="",s.querySelector('[data-exfield="repUnits"]').value="reps",s.querySelector('[data-exfield="note"]').value="";const a=t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,"");s.querySelector('[data-region="ex-id-preview"]').textContent=a?`id: ${a}`:"";const n=s.querySelector('[data-region="demo-manager"]');ge(n,ce);const r=s.querySelector('[data-exfield="name"]'),o=s.querySelector('[data-region="ex-id-preview"]');r.addEventListener("input",()=>{const l=r.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,"");o.textContent=l?`id: ${l}`:""}),s.querySelector('[data-action="save-exercise"]')?.addEventListener("click",async()=>{const l=r.value.trim();if(!l){r.focus();return}const d=l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,""),{exercises:u}=await U(),c=u.find(x=>x.id===d||x.name.toLowerCase()===l.toLowerCase());if(c&&!confirm(`An exercise named "${c.name}" already exists (id: ${c.id}).

Do you still want to create "${l}"?`))return;const p=s.querySelector('[data-exfield="reps"]').value,m=s.querySelector('[data-exfield="sets"]').value,b=s.querySelector('[data-exfield="repUnits"]').value,g=s.querySelector('[data-exfield="note"]').value,y={id:d,name:l,demos:ce.filter(x=>x.url),recommendations:{}};p&&(y.recommendations.reps=p),m&&(y.recommendations.sets=m),b&&b!=="reps"&&(y.recommendations.repUnits=b),g&&(y.recommendations.note=g),f.newExercises.push(y),Zt(y),f.items.push({type:"single",exerciseId:d,exerciseName:l,exerciseNote:g||"",reps:p||"",sets:m||"",repUnits:b||"reps",note:"",tags:[]}),s.classList.add("hidden"),C(e)},{once:!0});const i=()=>s.classList.add("hidden");s.querySelector('[data-action="cancel-exercise"]')?.addEventListener("click",i,{once:!0}),s.querySelector('[data-action="close-exercise"]')?.addEventListener("click",i,{once:!0}),s.classList.remove("hidden")}function ys(e){const t=e.querySelector('[data-region="export-modal"]');e.querySelector('[data-action="export"]')?.addEventListener("click",()=>{$s(e)}),e.querySelector('[data-action="close-export"]')?.addEventListener("click",()=>{t?.classList.add("hidden")}),t?.addEventListener("click",s=>{s.target===t&&t.classList.add("hidden")}),e.querySelector('[data-action="preview"]')?.addEventListener("click",()=>{ws(e)})}function ws(e){const t=et(),s=t.items||[],a=`
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
        <h1 class="h-page">${j(t.title||"Untitled")}</h1>
        ${t.requirements?`<p class="text-sm text-slate-400 mt-1.5">${j(t.requirements)}</p>`:""}
      </div>
      <div class="px-6 pb-24 pt-2">
        <ul class="space-y-2.5">
          ${s.map((r,o)=>ks(r)).join("")}
        </ul>
      </div>
    </div>
  `,n=document.createElement("div");n.innerHTML=a,e.appendChild(n.firstElementChild),e.querySelector('[data-action="close-preview"]')?.addEventListener("click",()=>{e.querySelector(".fixed.inset-0.z-50.bg-slate-950")?.remove()})}function ks(e,t){if(e.kind)return`<li class="card p-4 space-y-2">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-brand-500/20 text-brand-300">${{superset:"Super Set",compound:"Compound",circuit:"Circuit"}[e.kind]||e.kind}</span>
      </div>
      <p class="text-sm font-semibold text-slate-100">${j(e.exercises.map(n=>n.exerciseId).join(" + "))}</p>
      <div class="space-y-1.5 pl-3 border-l-2 border-slate-700">
        ${e.exercises.map((n,r)=>`
          <div class="text-xs text-slate-300">${r+1}. ${j(n.exerciseId)} — ${n.reps||"—"} ${n.repUnits||"reps"} · ${n.sets||"—"} sets</div>
        `).join("")}
      </div>
    </li>`;const s=e.tags?.length?e.tags.map(a=>`<span class="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">${a}</span>`).join(""):"";return`<li class="card px-4 py-3">
    ${s?`<div class="flex gap-1.5 mb-1">${s}</div>`:""}
    <p class="text-sm font-semibold text-slate-100">${j(e.exerciseId)}</p>
    <p class="text-xs text-slate-400 num mt-0.5">${e.reps||"—"} ${e.repUnits||"reps"} · ${e.sets||"—"} sets</p>
    ${e.note?`<p class="text-xs text-slate-500 mt-1">${j(e.note)}</p>`:""}
  </li>`}function $s(e){const t=e.querySelector('[data-region="export-modal"]'),s=e.querySelector('[data-region="export-content"]');if(!t||!s)return;const a=et(),n=[];f.newExercises.length>0&&n.push({label:"New Exercises (append to exercises.json → exercises[])",json:f.newExercises}),n.push({label:"Program (append to workouts.json → programs[])",json:a}),s.innerHTML=n.map((r,o)=>`
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-xs text-slate-400 font-medium">${r.label}</p>
        <button data-action="copy-json" data-section="${o}" class="text-xs text-brand-400 hover:text-brand-300 transition-colors">Copy</button>
      </div>
      <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono leading-relaxed"><code>${j(JSON.stringify(r.json,null,2))}</code></pre>
    </div>
  `).join(""),s.querySelectorAll('[data-action="copy-json"]').forEach(r=>{r.addEventListener("click",()=>{const o=+r.dataset.section,i=JSON.stringify(n[o].json,null,2);navigator.clipboard?.writeText(i).then(()=>{r.textContent="✓ Copied",setTimeout(()=>{r.textContent="Copy"},2e3)}).catch(()=>{prompt("Copy:",i)})})}),t.classList.remove("hidden")}function et(){const e={id:f.meta.id,title:f.meta.title};return f.meta.requirements&&(e.requirements=f.meta.requirements),f.meta.description&&(e.description=f.meta.description),f.meta.difficulty&&(e.difficulty=f.meta.difficulty),f.meta.duration&&(e.duration=Number(f.meta.duration)),e.items=f.items.map(t=>{if(t.type==="group"){const a={kind:t.kind,exercises:t.members.map(n=>{const r={exerciseId:n.exerciseId};return n.reps&&(r.reps=n.reps),n.sets&&(r.sets=n.sets),n.repUnits&&n.repUnits!=="reps"&&(r.repUnits=n.repUnits),n.note&&(r.note=n.note),r})};return t.note&&(a.note=t.note),t.tags?.length&&(a.tags=t.tags),a}const s={exerciseId:t.exerciseId};return t.reps&&(s.reps=t.reps),t.sets&&(s.sets=t.sets),t.repUnits&&t.repUnits!=="reps"&&(s.repUnits=t.repUnits),t.note&&(s.note=t.note),t.tags.length&&(s.tags=t.tags),s}),e}let W=[],V=!1,Y="";function Ss(e){W=[],V=!1,Y="",e.innerHTML=`
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
  `,Ls(e),Es(e),Cs(e),Ms(e)}function Ls(e){e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/studio"))}function Es(e){const t=e.querySelector('[data-input="edit-search"]'),s=e.querySelector('[data-region="edit-results"]');let a=null;t?.addEventListener("input",()=>{clearTimeout(a),a=setTimeout(async()=>{const n=t.value.trim();if(!n){s.classList.add("hidden");return}const r=await re(n,8);if(r.length===0){s.classList.add("hidden");return}s.classList.remove("hidden"),s.innerHTML=r.map(o=>`
        <li><button data-load-exercise="${o.id}" class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800/60 active:bg-slate-800 transition-colors flex items-center gap-3 touch-manipulation">
          <span class="text-sm font-medium text-slate-100 truncate">${tt(o.name)}</span>
          ${o.hasDemos?'<span class="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-sm">demo</span>':""}
        </button></li>
      `).join(""),s.querySelectorAll("[data-load-exercise]").forEach(o=>{o.addEventListener("click",()=>{const i=r.find(l=>l.id===o.dataset.loadExercise);i&&qs(e,i.exercise),s.classList.add("hidden"),t.value=""})})},150)})}function qs(e,t){V=!0,Y=t.id,W=JSON.parse(JSON.stringify(t.demos||[])),e.querySelector('[data-region="header-title"]').textContent=`Edit: ${t.name}`,e.querySelector('[data-region="form-label"]').textContent="Editing Exercise";const s=e.querySelector('[data-field="name"]');s.value=t.name,s.dispatchEvent(new Event("input"));const a=t.recommendations||{};e.querySelector('[data-field="reps"]').value=a.reps||"",e.querySelector('[data-field="sets"]').value=a.sets||"",e.querySelector('[data-field="repUnits"]').value=a.repUnits||"reps",e.querySelector('[data-field="note"]').value=a.note||"",ge(e.querySelector('[data-region="demos"]'),W),e.querySelector('[data-region="export-section"]')?.classList.remove("hidden")}function Cs(e){const t=e.querySelector('[data-field="name"]'),s=e.querySelector('[data-region="id-preview"]'),a=e.querySelector('[data-region="export-section"]');t?.addEventListener("input",()=>{if(V)s.textContent=`id: ${Y} (existing)`;else{const n=t.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,"");s.textContent=n?`id: ${n}`:""}a?.classList.toggle("hidden",!t.value.trim())}),ge(e.querySelector('[data-region="demos"]'),W)}function Ms(e){const t=e.querySelector('[data-region="export-modal"]');e.querySelector('[data-action="export"]')?.addEventListener("click",()=>{const s=e.querySelector('[data-field="name"]'),a=s.value.trim();if(!a){s.focus();return}const r={id:V?Y:a.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,""),name:a,demos:W.filter(m=>m.url),recommendations:{}},o=e.querySelector('[data-field="reps"]').value,i=e.querySelector('[data-field="sets"]').value,l=e.querySelector('[data-field="repUnits"]').value,d=e.querySelector('[data-field="note"]').value;o&&(r.recommendations.reps=o),i&&(r.recommendations.sets=i),l&&l!=="reps"&&(r.recommendations.repUnits=l),d&&(r.recommendations.note=d);const u=e.querySelector('[data-region="export-content"]'),c=JSON.stringify(r,null,2),p=V?`Replace entry with id "${Y}" in exercises.json`:"Append to exercises.json → exercises[]";u.innerHTML=`
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-slate-400">${p}</p>
          <button data-action="copy" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
        </div>
        <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono leading-relaxed"><code>${tt(c)}</code></pre>
      </div>`,u.querySelector('[data-action="copy"]')?.addEventListener("click",m=>{navigator.clipboard?.writeText(c).then(()=>{m.target.textContent="✓ Copied",setTimeout(()=>{m.target.textContent="Copy"},2e3)})}),t.classList.remove("hidden")}),e.querySelector('[data-action="close-export"]')?.addEventListener("click",()=>t?.classList.add("hidden")),t?.addEventListener("click",s=>{s.target===t&&t.classList.add("hidden")})}function tt(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const js="https://api.openai.com/v1/chat/completions",Ts="gpt-4o-mini",st="action-app:openai-key";function he(){return localStorage.getItem(st)||""}function Ps(e){localStorage.setItem(st,e)}function Ae(){return!!he()}function As(){return{meta:{title:"",id:"",requirements:"",description:""},items:[],newExercises:[]}}const Bs=[{type:"function",function:{name:"search_exercises",description:"Search the exercise library by name, alias, or keyword. Always call this before adding an exercise.",parameters:{type:"object",properties:{query:{type:"string",description:"Search query (exercise name or keyword)"},limit:{type:"number",description:"Max results to return (default 5)"}},required:["query"]}}},{type:"function",function:{name:"add_exercise",description:"Add an exercise to the program timeline.",parameters:{type:"object",properties:{exerciseId:{type:"string",description:"Exercise ID from search results"},reps:{type:"string",description:'Number of reps (e.g. "10", "30", "AMRAP")'},sets:{type:"string",description:'Number of sets (e.g. "3", "4")'},repUnits:{type:"string",description:"Unit type: reps, secs, min, yd"},note:{type:"string",description:"Form cues or notes"},tags:{type:"array",items:{type:"string"},description:"Tags like warmup, stretch"}},required:["exerciseId"]}}},{type:"function",function:{name:"create_exercise",description:"Create a new exercise that does not exist in the library.",parameters:{type:"object",properties:{name:{type:"string",description:"Exercise name"},reps:{type:"string"},sets:{type:"string"},repUnits:{type:"string"},note:{type:"string"}},required:["name"]}}},{type:"function",function:{name:"remove_exercise",description:"Remove an exercise from the program by its position (0-based index).",parameters:{type:"object",properties:{index:{type:"number",description:"0-based position in the timeline"}},required:["index"]}}},{type:"function",function:{name:"group_exercises",description:"Group exercises into a superset, compound set, or circuit.",parameters:{type:"object",properties:{indices:{type:"array",items:{type:"number"},description:"0-based positions to group"},kind:{type:"string",enum:["superset","compound","circuit"]}},required:["indices","kind"]}}},{type:"function",function:{name:"set_metadata",description:"Set program title, requirements, or description.",parameters:{type:"object",properties:{title:{type:"string"},requirements:{type:"string"},description:{type:"string"}}}}},{type:"function",function:{name:"update_exercise",description:"Update reps, sets, note, or tags of an exercise at a given position.",parameters:{type:"object",properties:{index:{type:"number",description:"0-based position"},reps:{type:"string"},sets:{type:"string"},repUnits:{type:"string"},note:{type:"string"},tags:{type:"array",items:{type:"string"}}},required:["index"]}}}];async function Ns(e,t,s){switch(e){case"search_exercises":return(await re(t.query,t.limit||5)).map(n=>({id:n.id,name:n.name,hasDemos:n.hasDemos,reps:n.exercise?.recommendations?.reps,sets:n.exercise?.recommendations?.sets,repUnits:n.exercise?.recommendations?.repUnits}));case"add_exercise":{const a={exerciseId:t.exerciseId};return t.reps&&(a.reps=t.reps),t.sets&&(a.sets=t.sets),t.repUnits&&t.repUnits!=="reps"&&(a.repUnits=t.repUnits),t.note&&(a.note=t.note),t.tags?.length&&(a.tags=t.tags),s.items.push(a),{success:!0,index:s.items.length-1,total:s.items.length}}case"create_exercise":{const a=t.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/,""),n={id:a,name:t.name,demos:[],recommendations:{}};return t.reps&&(n.recommendations.reps=t.reps),t.sets&&(n.recommendations.sets=t.sets),t.repUnits&&(n.recommendations.repUnits=t.repUnits),t.note&&(n.recommendations.note=t.note),s.newExercises.push(n),{success:!0,id:a,name:t.name}}case"remove_exercise":return t.index>=0&&t.index<s.items.length?(s.items.splice(t.index,1),{success:!0,remaining:s.items.length}):{success:!1,error:"Invalid index"};case"group_exercises":{const a=[...t.indices].sort((o,i)=>o-i),n=a.map(o=>s.items[o]).filter(Boolean);if(n.length<2)return{success:!1,error:"Need at least 2 exercises to group"};for(let o=a.length-1;o>=0;o--)s.items.splice(a[o],1);const r={kind:t.kind,exercises:n};return s.items.splice(a[0],0,r),{success:!0,groupIndex:a[0]}}case"set_metadata":return t.title&&(s.meta.title=t.title),t.requirements&&(s.meta.requirements=t.requirements),t.description&&(s.meta.description=t.description),t.title&&(s.meta.id=t.title.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/_+$/,"")),{success:!0,meta:s.meta};case"update_exercise":{const a=s.items[t.index];return a?(t.reps&&(a.reps=t.reps),t.sets&&(a.sets=t.sets),t.repUnits&&(a.repUnits=t.repUnits),t.note&&(a.note=t.note),t.tags&&(a.tags=t.tags),{success:!0}):{success:!1,error:"Invalid index"}}default:return{error:`Unknown tool: ${e}`}}}function Is(e){return`You are a fitness programming assistant for the Action App. You help users build workout programs through conversation.

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
`}function Us(e){if(e.items.length===0&&!e.meta.title)return`
[Program is empty — no exercises added yet]`;let t=`
## Current Program State
`;return e.meta.title&&(t+=`Title: ${e.meta.title}
`),e.meta.requirements&&(t+=`Requirements: ${e.meta.requirements}
`),t+=`
Timeline (${e.items.length} items):
`,e.items.forEach((s,a)=>{s.kind?t+=`${a}. [${s.kind}] ${s.exercises.map(n=>n.exerciseId).join(" + ")}
`:t+=`${a}. ${s.exerciseId} — ${s.reps||"?"} ${s.repUnits||"reps"} × ${s.sets||"?"} sets${s.tags?.length?` [${s.tags.join(", ")}]`:""}
`}),e.newExercises.length>0&&(t+=`
New exercises created this session: ${e.newExercises.map(s=>s.name).join(", ")}
`),t}async function Hs(e,t,s,a,n){const r=he();if(!r)throw new Error("No API key configured");const i=[{role:"system",content:Is(a)+Us(s)},...t.slice(-20),{role:"user",content:e}];let l=await Be(r,i),d=l.choices[0].message,u=0;for(;d.tool_calls&&u<5;){u++;const c=[];for(const p of d.tool_calls){const m=JSON.parse(p.function.arguments),b=await Ns(p.function.name,m,s);c.push({role:"tool",tool_call_id:p.id,content:JSON.stringify(b)}),n?.({type:"tool",name:p.function.name,args:m,result:b})}i.push(d),i.push(...c),l=await Be(r,i),d=l.choices[0].message}return d.content||""}async function Be(e,t){const s=await fetch(js,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({model:Ts,messages:t,tools:Bs,tool_choice:"auto",temperature:.3})});if(!s.ok){const a=await s.text();throw new Error(`OpenAI API error (${s.status}): ${a}`)}return s.json()}function _s(e){const t={id:e.meta.id||"untitled",title:e.meta.title||"Untitled Program"};return e.meta.requirements&&(t.requirements=e.meta.requirements),t.items=e.items,{program:t,newExercises:e.newExercises}}async function zs(e){const t=As(),s=[];let a=!1;const{exercises:n}=await U(),r=n.map(x=>({id:x.id,name:x.name}));e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/studio"));const o=e.querySelector('[data-region="messages"]'),i=e.querySelector('[data-input="message"]'),l=e.querySelector('[data-action="send"]'),d=e.querySelector('[data-action="export"]'),u=e.querySelector('[data-region="settings-modal"]'),c=e.querySelector('[data-region="export-modal"]');e.querySelector('[data-action="settings"]')?.addEventListener("click",()=>{e.querySelector('[data-input="api-key"]').value=he(),u.classList.remove("hidden")}),e.querySelector('[data-action="close-settings"]')?.addEventListener("click",()=>u.classList.add("hidden")),e.querySelector('[data-action="save-settings"]')?.addEventListener("click",()=>{const x=e.querySelector('[data-input="api-key"]').value.trim();Ps(x),u.classList.add("hidden")}),u?.addEventListener("click",x=>{x.target===u&&u.classList.add("hidden")}),d?.addEventListener("click",()=>y()),e.querySelector('[data-action="close-export"]')?.addEventListener("click",()=>c.classList.add("hidden")),c?.addEventListener("click",x=>{x.target===c&&c.classList.add("hidden")}),Ae()||u.classList.remove("hidden");async function p(){const x=i.value.trim();if(!x||a)return;if(!Ae()){u.classList.remove("hidden");return}i.value="",a=!0,l.disabled=!0,m("user",x),s.push({role:"user",content:x});const $=m("assistant","...");$.dataset.loading="true";try{const L=await Hs(x,s,t,r,h=>{h.type==="tool"&&b(h)});$.remove(),m("assistant",L),s.push({role:"assistant",content:L}),g()}catch(L){$.remove(),m("error",L.message)}finally{a=!1,l.disabled=!1,i.focus()}}l?.addEventListener("click",p),i?.addEventListener("keydown",x=>{x.key==="Enter"&&!x.shiftKey&&(x.preventDefault(),p())});function m(x,$){const L=o.querySelector(".text-center.py-8");L&&x!=="error"&&L.remove();const h=document.createElement("div");h.className=x==="user"?"flex justify-end":"flex justify-start";const M=document.createElement("div");return x==="user"?M.className="bg-brand-500/20 text-slate-100 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%] text-sm leading-relaxed":x==="error"?M.className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] text-sm leading-relaxed":M.className="bg-slate-800/60 text-slate-200 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] text-sm leading-relaxed",M.textContent=$,h.appendChild(M),o.appendChild(h),o.scrollTop=o.scrollHeight,h}function b(x){const $=document.createElement("div");$.className="flex justify-start";const L={search_exercises:`🔍 Searching: "${x.args.query}"`,add_exercise:`✓ Added: ${x.args.exerciseId}`,create_exercise:`✓ Created: ${x.args.name}`,remove_exercise:`✗ Removed item at position ${x.args.index}`,group_exercises:`⚡ Grouped as ${x.args.kind}`,set_metadata:`📝 Updated: ${x.args.title||x.args.requirements||"metadata"}`,update_exercise:`✏️ Updated item at position ${x.args.index}`}[x.name]||`🔧 ${x.name}`;$.innerHTML=`<span class="text-[11px] text-slate-500 italic px-2 py-1">${O(L)}</span>`,o.appendChild($),o.scrollTop=o.scrollHeight}function g(){const x=e.querySelector('[data-region="program-preview"]'),$=e.querySelector('[data-region="program-items"]'),L=e.querySelector('[data-region="item-count"]');if(t.items.length===0){x.classList.add("hidden"),d.classList.add("hidden");return}x.classList.remove("hidden"),d.classList.remove("hidden"),L.textContent=`${t.items.length} item${t.items.length!==1?"s":""}`,$.innerHTML=t.items.map((h,M)=>{if(h.kind)return`<div class="text-xs text-slate-400 pl-2 border-l-2 border-brand-500"><span class="text-brand-300 font-medium">${h.kind}</span>: ${h.exercises.map(dt=>dt.exerciseId).join(" + ")}</div>`;const P=h.tags?.length?`<span class="text-brand-300">[${h.tags.join(", ")}]</span> `:"";return`<div class="text-xs text-slate-300">${M+1}. ${P}${O(h.exerciseId)} — ${h.reps||"?"} ${h.repUnits||"reps"} × ${h.sets||"?"}</div>`}).join("")}function y(){const{program:x,newExercises:$}=_s(t),L=e.querySelector('[data-region="export-content"]');let h="";if($.length>0){const P=JSON.stringify($,null,2);h+=`
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs text-slate-400">New Exercises (append to exercises.json)</p>
            <button data-copy="${O(P)}" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
          </div>
          <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[200px] overflow-y-auto font-mono">${O(P)}</pre>
        </div>
      `}const M=JSON.stringify(x,null,2);h+=`
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-slate-400">Program (append to workouts.json)</p>
          <button data-copy="${O(M)}" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
        </div>
        <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono">${O(M)}</pre>
      </div>
    `,L.innerHTML=h,L.querySelectorAll("[data-copy]").forEach(P=>{P.addEventListener("click",()=>{navigator.clipboard?.writeText(P.dataset.copy).then(()=>{P.textContent="✓ Copied",setTimeout(()=>{P.textContent="Copy"},2e3)})})}),c.classList.remove("hidden")}}function O(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Rs(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/"));const{exercises:t}=await U(),s=e.querySelector('[data-region="count"]');s.textContent=`${t.length} total`;let a=null;const n=d=>{const u=e.querySelector('[data-region="list"]'),c=e.querySelector('[data-region="empty"]');if(d.length===0){u.classList.add("hidden"),c.classList.remove("hidden");return}if(u.classList.remove("hidden"),c.classList.add("hidden"),u.innerHTML=d.map(p=>`
      <li>
        <article class="card overflow-hidden" data-exercise-id="${p.id}">
          <button data-action="expand" data-id="${p.id}" class="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold tracking-tight text-slate-100 truncate">${J(p.name)}</h3>
              <p class="text-xs text-slate-400 mt-0.5 num">${p.demos.length} demo${p.demos.length!==1?"s":""}${p.recommendations?.reps?` · ${p.recommendations.reps} ${p.recommendations.repUnits||"reps"}`:""}</p>
            </div>
            <svg class="w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${a===p.id?"rotate-180":""}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          ${a===p.id?r(p):""}
        </article>
      </li>
    `).join(""),u.querySelectorAll('[data-action="expand"]').forEach(p=>{p.addEventListener("click",()=>{if(a=a===p.dataset.id?null:p.dataset.id,n(d),a){const m=u.querySelector(`[data-demo-slot="${a}"]`),b=d.find(g=>g.id===a);m&&b&&b.demos.length>0&&G(m,b.demos)}})}),a){const p=u.querySelector(`[data-demo-slot="${a}"]`),m=d.find(b=>b.id===a);p&&m&&m.demos.length>0&&G(p,m.demos)}};function r(d){return`
      <div class="px-4 pb-4 pt-1 space-y-3 border-t border-slate-800 bg-slate-900/40 animate-fade-in">
        <div data-demo-slot="${d.id}">
          ${d.demos.length===0?'<p class="text-xs text-slate-500 italic py-2">No demos available</p>':""}
        </div>
        ${d.recommendations?`
          <div class="flex gap-3">
            ${d.recommendations.reps?`<div class="bg-slate-800/50 rounded-lg px-3 py-2 text-center flex-1"><p class="text-lg font-extrabold text-brand-400 num">${J(d.recommendations.reps)}</p><p class="label-meta mt-0.5">${J(d.recommendations.repUnits||"reps")}</p></div>`:""}
            ${d.recommendations.sets?`<div class="bg-slate-800/50 rounded-lg px-3 py-2 text-center flex-1"><p class="text-lg font-extrabold text-brand-400 num">${J(d.recommendations.sets)}</p><p class="label-meta mt-0.5">sets</p></div>`:""}
          </div>
        `:""}
        ${d.recommendations?.note?`<div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2 rounded-r-lg"><p class="text-xs text-slate-300 leading-relaxed">${J(d.recommendations.note)}</p></div>`:""}
        ${d.aliases?.length?`<p class="text-[11px] text-slate-500">Also known as: ${d.aliases.join(", ")}</p>`:""}
        <a href="/exercise/${d.id}" class="inline-block text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">View full page →</a>
      </div>
    `}const o=[...t].sort((d,u)=>d.name.localeCompare(u.name));n(o);const i=e.querySelector('[data-input="search"]');let l=null;i?.addEventListener("input",()=>{clearTimeout(l),l=setTimeout(async()=>{const d=i.value.trim();if(!d){n(o),s.textContent=`${o.length} total`;return}const c=(await re(d,50)).map(p=>p.exercise);n(c),s.textContent=`${c.length} result${c.length!==1?"s":""}`},150)})}function J(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Os(e,t){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>window.history.back());const s=await gt(t);if(!s){Gs(e,t);return}const{programs:a}=await z(),n=Js(a,t);Ds(e,s,n)}function Ds(e,t,s){const a=t.demos||[],n=t.recommendations||{},r=t.aliases||[];if(e.innerHTML=`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-4 flex items-center gap-3">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="h-page flex-1 min-w-0 truncate">${B(t.name)}</h1>
      </header>

      <main class="flex-1 px-6 pb-24 space-y-6 animate-slide-up">
        <!-- Demo carousel -->
        <section data-region="demos">
          ${a.length===0?'<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No demos available</div>':""}
        </section>

        <!-- Recommendations -->
        ${n.reps||n.sets?`
        <section class="space-y-3">
          <h2 class="eyebrow">Recommendations</h2>
          <div class="grid grid-cols-2 gap-3">
            ${n.reps?`
            <div class="card p-4 text-center">
              <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${B(n.reps)}</p>
              <p class="label-meta mt-1.5">${B(n.repUnits||"reps")}</p>
            </div>`:""}
            ${n.sets?`
            <div class="card p-4 text-center">
              <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${B(n.sets)}</p>
              <p class="label-meta mt-1.5">sets</p>
            </div>`:""}
          </div>
          ${n.note?`
          <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
            <p class="text-sm text-slate-300 leading-relaxed">${B(n.note)}</p>
          </div>`:""}
        </section>`:""}

        <!-- Aliases -->
        ${r.length>0?`
        <section class="space-y-2">
          <h2 class="eyebrow">Also known as</h2>
          <div class="flex flex-wrap gap-2">
            ${r.map(o=>`<span class="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">${B(o)}</span>`).join("")}
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
                    <h3 class="text-sm font-semibold tracking-tight truncate">${B(o.title)}</h3>
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
          <p class="text-[11px] text-slate-500 font-mono">${B(t.id)}</p>
          <p class="text-[11px] text-slate-500">${a.length} demo${a.length!==1?"s":""}</p>
        </section>
      </main>
    </div>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>window.history.back()),e.querySelectorAll("[data-program-id]").forEach(o=>{o.addEventListener("click",()=>k(`/program/${o.dataset.programId}`))}),a.length>0){const o=e.querySelector('[data-region="demos"]');G(o,a)}}function Gs(e,t){e.innerHTML=`
    <div class="flex-1 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p class="text-6xl mb-4">🤷</p>
      <h1 class="text-2xl font-bold mb-2">Exercise not found</h1>
      <p class="text-slate-400 mb-6 text-sm font-mono">${B(t)}</p>
      <a href="/exercises" class="btn-primary">Browse exercises</a>
    </div>
  `}function Js(e,t){return e.filter(s=>{for(const a of s.items||[]){if(a.exerciseId===t)return!0;if(a.exercises){for(const n of a.exercises)if(n.exerciseId===t)return!0}}return!1})}function B(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Fs(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>k("/"));const[{programs:t},{plans:s}]=await Promise.all([z(),Je()]),a=t.map(c=>({id:c.id,title:c.title,requirements:c.requirements||"",itemCount:c.items?.length||c.exercises?.length||0,tokens:ee(c.title).concat(ee(c.requirements||"")).concat(ee(c.id.replace(/[-_]/g," "))),program:c})),n=new Map;for(const c of s)for(const p of c.subPlans||[])for(const m of p.programs||[])n.set(m,`${c.name} · ${p.name}`);const r=e.querySelector('[data-region="results"]'),o=e.querySelector('[data-region="empty"]'),i=e.querySelector('[data-region="initial"]');function l(c){if(c===null){r.classList.add("hidden"),o.classList.add("hidden"),i.classList.remove("hidden");return}if(i.classList.add("hidden"),c.length===0){r.classList.add("hidden"),o.classList.remove("hidden");return}o.classList.add("hidden"),r.classList.remove("hidden"),r.innerHTML=c.map(p=>Ws(p,n.get(p.id))).join(""),r.querySelectorAll("[data-program-id]").forEach(p=>{p.addEventListener("click",()=>k(`/program/${p.dataset.programId}`))})}const d=e.querySelector('[data-input="search"]');let u=null;d?.addEventListener("input",()=>{clearTimeout(u),u=setTimeout(()=>{const c=d.value.trim();if(!c){l(null);return}const p=ee(c),m=a.map(b=>({...b,score:Vs(b.tokens,p)})).filter(b=>b.score>0).sort((b,g)=>g.score-b.score);l(m)},150)}),l(null)}function Ws(e,t){return`
    <button
      data-program-id="${e.id}"
      class="w-full card p-4 text-left active:scale-[0.98] transition-transform"
    >
      <div class="flex items-center gap-3">
        <div class="flex-1 min-w-0">
          ${t?`<p class="text-[10px] font-medium uppercase tracking-wider text-slate-500 mb-1">${ue(t)}</p>`:""}
          <h3 class="font-semibold tracking-tight truncate">${ue(e.title)}</h3>
          <p class="text-xs text-slate-400 mt-1 truncate">
            <span class="num">${e.itemCount}</span> exercise${e.itemCount!==1?"s":""}${e.requirements?` · ${ue(e.requirements)}`:""}
          </p>
        </div>
        <svg class="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </button>
  `}function ee(e){return e?e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().split(/[^a-z0-9]+/).filter(t=>t.length>0):[]}function Vs(e,t){let s=0;for(const a of t){let n=0;for(const r of e)r===a?n=Math.max(n,10):r.startsWith(a)?n=Math.max(n,7):r.includes(a)&&(n=Math.max(n,4));if(n===0)return 0;s+=n}return s}function ue(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const Ys="JuanTheEngineer/JuanTheEngineer.github.io",S={title:"",items:[],muscleGroups:[],stage:"build"};let at=0;const ve=()=>`slot_${++at}`;function w(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Ks(e){return String(e||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function rt(e){const t=e?.demos||[];return(t.find(a=>a.isPrimary)||t[0])?.metadata?.thumbnail||null}function K(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}function nt(e,t){const s=K(e),a=K(t);if(!s||!a)return 0;if(s===a)return 1;if(a.includes(s)||s.includes(a))return .85;const n=new Set(s.split(" ")),r=new Set(a.split(" "));let o=0;for(const l of n)r.has(l)&&o++;const i=Math.max(n.size,r.size);return i?o/i:0}let I={exercises:[],muscleOptions:[]};async function Xs(){if(I.exercises.length)return I;const[e,t]=await Promise.all([U(),ft()]);return z().catch(()=>{}),I={exercises:e.exercises||[],muscleOptions:(t.muscleGroups?.values||[]).map(s=>({id:s.id,label:s.label}))},I}function Zs(e,t=8){const s=K(e);if(!s)return[];const a=[];for(const n of I.exercises){const r=nt(s,n.name),o=(n.muscleGroups||[]).some(l=>K(l).includes(s)),i=Math.max(r,o?.5:0);i>.05&&a.push({ex:n,score:i})}return a.sort((n,r)=>r.score-n.score),a.slice(0,t).map(n=>n.ex)}function Qs(e){const t=K(e);if(t.length<3)return null;let s=null;for(const a of I.exercises){const n=nt(t,a.name);n>=.6&&(!s||n>s.score)&&(s={ex:a,score:n})}return s?.ex||null}function ea(){const e=[],t=new Set,s=S.items.map(n=>{const r={reps:n.reps||"",sets:n.sets||"",repUnits:n.repUnits||"reps"};if(n.mode==="existing"&&n.exercise)return{exerciseId:n.exercise.id,...r};const o=n.draft||{},i=Ks(o.name);return i&&!t.has(i)&&(t.add(i),e.push({name:o.name||"",demoUrl:o.demoUrl||"",muscleGroups:o.muscleGroups||[],description:o.description||"",suggested:{sets:o.sets||"",reps:o.reps||""}})),{exerciseId:`NEW:${i}`,...r}});return{type:s.length===1?"exercise":"workout",workout:{title:S.title||(s.length===1?"Single exercise":"Untitled workout"),items:s},newExercises:e}}function ta(e){const t=e.type==="exercise"?`Submission: ${e.workout.title}`:`Workout submission: ${e.workout.title}`,s=["A community submission from the Submission Builder.","","```json",JSON.stringify(e,null,2),"```","","_Review the JSON above, then author trainer-voice prose at ingest time._"].join(`
`),a=new URLSearchParams({title:t,labels:"submission",body:s});return`https://github.com/${Ys}/issues/new?${a.toString()}`}let H=null;function ot(e){H=e,S.title="",S.items=[],S.muscleGroups=[],S.stage="build",at=0,e.innerHTML=`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="home" class="btn-ghost -ml-2 px-3" aria-label="Back to home">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400">Submission Builder</span>
      </header>
      <main class="flex-1 px-6 pb-28 pt-7" data-region="body"></main>
    </div>
  `,e.querySelector('[data-action="home"]').addEventListener("click",()=>k("/")),Xs().then(()=>ye()).catch(t=>{console.error("[submit] library load failed",t),e.querySelector('[data-region="body"]').innerHTML=`
        <div class="card p-6 text-center">
          <p class="text-sm text-slate-300">Couldn't load the exercise library.</p>
          <button data-action="retry" class="btn-primary mt-4">Try again</button>
        </div>`,e.querySelector('[data-action="retry"]')?.addEventListener("click",()=>ot(e))})}function it(){return H.querySelector('[data-region="body"]')}function ye(){return S.stage==="review"?na():X()}function X(){const e=it(),t=S.items.length;e.innerHTML=`
    <p class="eyebrow">Share with the community</p>
    <h1 class="h-page mt-2">Build a submission</h1>
    <p class="text-[15px] text-slate-400 mt-3 leading-relaxed max-w-md">
      Everything is a workout. Add one exercise or many — a single exercise is just
      a one-item workout.
    </p>

    <label class="block mt-7">
      <span class="label-meta">Workout name</span>
      <input data-field="title" type="text" value="${w(S.title)}"
        placeholder="e.g. Lower body power"
        class="mt-2 w-full bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 text-[15px]
               placeholder:text-slate-600 focus:border-brand-500 focus:outline-none" />
    </label>

    <section data-region="items" class="mt-6 space-y-3"></section>

    <section data-region="adder" class="mt-3"></section>

    <div class="mt-8 flex items-center gap-3">
      <button data-action="review" class="btn-primary flex-1 ${t?"":"opacity-40 pointer-events-none"}">
        Review ${t?`· ${t} exercise${t===1?"":"s"}`:""}
      </button>
    </div>
  `,e.querySelector('[data-field="title"]').addEventListener("input",s=>{S.title=s.target.value}),e.querySelector('[data-action="review"]').addEventListener("click",()=>{S.items.length&&(S.stage="review",ye())}),sa(),lt()}function sa(){const e=H.querySelector('[data-region="items"]');if(e){if(!S.items.length){e.innerHTML=`
      <p class="text-sm text-slate-500 border border-dashed border-slate-800 rounded-2xl px-4 py-6 text-center">
        No exercises yet. Add your first below.
      </p>`;return}e.innerHTML=S.items.map((t,s)=>aa(t,s)).join(""),S.items.forEach(t=>{e.querySelector(`[data-remove="${t.uid}"]`)?.addEventListener("click",()=>{S.items=S.items.filter(s=>s.uid!==t.uid),X()}),["reps","sets"].forEach(s=>{e.querySelector(`[data-edit="${t.uid}:${s}"]`)?.addEventListener("input",a=>{t[s]=a.target.value})})})}}function aa(e,t){const s=e.mode==="new",a=s?e.draft?.name||"New exercise":e.exercise?.name||e.exercise?.id,n=s?null:rt(e.exercise),r=s?'<span class="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">New</span>':'<span class="text-[10px] font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">Library</span>',o=n?`<img src="${w(n)}" alt="" class="w-14 h-14 rounded-xl object-cover shrink-0" loading="lazy" />`:`<div class="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-slate-500">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7"/></svg>
       </div>`;return`
    <div class="card p-4">
      <div class="flex items-center gap-3">
        <span class="num text-xs text-slate-500 w-5 text-right">${t+1}</span>
        ${o}
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">${r}</div>
          <h3 class="font-semibold tracking-tight truncate mt-1">${w(a)}</h3>
        </div>
        <button data-remove="${e.uid}" class="btn-ghost px-2 text-slate-500 hover:text-red-400" aria-label="Remove">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="flex items-center gap-2 mt-3 pl-8">
        <label class="flex-1">
          <span class="label-meta">Sets</span>
          <input data-edit="${e.uid}:sets" value="${w(e.sets)}" inputmode="numeric" placeholder="3"
            class="mt-1 w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-sm num focus:border-brand-500 focus:outline-none" />
        </label>
        <span class="text-slate-600 mt-5">×</span>
        <label class="flex-1">
          <span class="label-meta">Reps</span>
          <input data-edit="${e.uid}:reps" value="${w(e.reps)}" placeholder="10-12"
            class="mt-1 w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-sm num focus:border-brand-500 focus:outline-none" />
        </label>
      </div>
    </div>
  `}function lt(){const e=H.querySelector('[data-region="adder"]');if(!e)return;e.innerHTML=`
    <div class="card p-4">
      <label class="block">
        <span class="eyebrow">Add an exercise</span>
        <div class="relative mt-2">
          <svg class="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.3-4.3"/></svg>
          <input data-field="search" type="text" autocomplete="off"
            placeholder="Search the library…"
            class="w-full bg-slate-900/80 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-[15px]
                   placeholder:text-slate-600 focus:border-brand-500 focus:outline-none" />
        </div>
      </label>
      <div data-region="results" class="mt-3 space-y-2"></div>
    </div>
  `,e.querySelector('[data-field="search"]').addEventListener("input",s=>Ne(s.target.value)),Ne("")}function Ne(e){const t=H.querySelector('[data-region="results"]');if(!t)return;const s=Zs(e),a=e.trim(),n=s.map(o=>{const i=rt(o),l=i?`<img src="${w(i)}" alt="" class="w-11 h-11 rounded-lg object-cover shrink-0" loading="lazy" />`:'<div class="w-11 h-11 rounded-lg bg-slate-800 shrink-0"></div>',d=(o.muscleGroups||[]).slice(0,2).join(" · ");return`
        <button data-add-existing="${w(o.id)}" class="w-full flex items-center gap-3 text-left p-2 rounded-xl hover:bg-white/5 active:scale-[0.99] transition">
          ${l}
          <div class="flex-1 min-w-0">
            <p class="font-medium truncate">${w(o.name)}</p>
            ${d?`<p class="text-xs text-slate-500 truncate">${w(d)}</p>`:""}
          </div>
          <svg class="w-5 h-5 text-brand-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
        </button>`}).join(""),r=a?`<button data-create-new class="w-full flex items-center gap-3 text-left p-3 mt-1 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/5 active:scale-[0.99] transition">
         <div class="w-11 h-11 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
         </div>
         <div class="flex-1 min-w-0">
           <p class="font-medium">Add "<span class="text-emerald-400">${w(a)}</span>" as new</p>
           <p class="text-xs text-slate-500">Not in the library yet</p>
         </div>
       </button>`:'<p class="text-sm text-slate-500 px-2 py-1">Type to search, or add a brand-new exercise.</p>';t.innerHTML=n+r,t.querySelectorAll("[data-add-existing]").forEach(o=>{o.addEventListener("click",()=>{const i=I.exercises.find(l=>l.id===o.dataset.addExisting);i&&(S.items.push({uid:ve(),mode:"existing",exercise:i,reps:i.recommendations?.reps||"",sets:i.recommendations?.sets||"",repUnits:i.recommendations?.repUnits||"reps"}),X())})}),t.querySelector("[data-create-new]")?.addEventListener("click",()=>ra(a))}function ra(e){const t=H.querySelector('[data-region="adder"]');if(!t)return;const s={name:e||"",demoUrl:"",muscleGroups:[],description:"",sets:"",reps:""};t.innerHTML=`
    <div class="card p-4 animate-slide-up">
      <div class="flex items-center justify-between">
        <span class="eyebrow text-emerald-400">New exercise</span>
        <button data-action="cancel-new" class="btn-ghost px-2 text-slate-500" aria-label="Cancel">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <label class="block mt-3">
        <span class="label-meta">Name</span>
        <input data-nf="name" type="text" value="${w(s.name)}" placeholder="e.g. Banded knee drive"
          class="mt-1 w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2.5 text-[15px] focus:border-brand-500 focus:outline-none" />
      </label>
      <div data-region="dupe" class="mt-2"></div>

      <label class="block mt-3">
        <span class="label-meta">Demo video URL</span>
        <input data-nf="demoUrl" type="url" value="${w(s.demoUrl)}" placeholder="https://youtube.com/watch?v=…"
          class="mt-1 w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2.5 text-[15px] focus:border-brand-500 focus:outline-none" />
      </label>

      <div class="mt-3">
        <span class="label-meta">Primary muscle</span>
        <div data-region="muscles" class="mt-2 flex flex-wrap gap-2"></div>
      </div>

      <div class="flex items-center gap-2 mt-3">
        <label class="flex-1">
          <span class="label-meta">Suggested sets</span>
          <input data-nf="sets" inputmode="numeric" value="${w(s.sets)}" placeholder="3"
            class="mt-1 w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-sm num focus:border-brand-500 focus:outline-none" />
        </label>
        <span class="text-slate-600 mt-5">×</span>
        <label class="flex-1">
          <span class="label-meta">Reps</span>
          <input data-nf="reps" value="${w(s.reps)}" placeholder="10-12"
            class="mt-1 w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-sm num focus:border-brand-500 focus:outline-none" />
        </label>
      </div>

      <label class="block mt-3">
        <span class="label-meta">One-line description <span class="text-slate-600 normal-case">(optional)</span></span>
        <input data-nf="description" type="text" value="${w(s.description)}" placeholder="A short cue in your own words"
          class="mt-1 w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2.5 text-[15px] focus:border-brand-500 focus:outline-none" />
      </label>

      <button data-action="save-new" class="btn-primary w-full mt-5 opacity-40 pointer-events-none">Add to workout</button>
    </div>
  `;const a=t.querySelector('[data-region="muscles"]');a.innerHTML=I.muscleOptions.map(o=>`
    <button type="button" data-muscle="${w(o.id)}"
      class="text-sm px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:border-brand-500 transition">
      ${w(o.label)}
    </button>`).join("");const n=t.querySelector('[data-action="save-new"]'),r=()=>{const o=s.name.trim()&&s.demoUrl.trim()&&s.muscleGroups.length>0;n.classList.toggle("opacity-40",!o),n.classList.toggle("pointer-events-none",!o)};["name","demoUrl","sets","reps","description"].forEach(o=>{t.querySelector(`[data-nf="${o}"]`).addEventListener("input",i=>{s[o]=i.target.value,o==="name"&&Ie(s),r()})}),a.querySelectorAll("[data-muscle]").forEach(o=>{o.addEventListener("click",()=>{const i=o.dataset.muscle;s.muscleGroups.includes(i)?(s.muscleGroups=s.muscleGroups.filter(l=>l!==i),o.classList.remove("bg-brand-500","border-brand-500","text-white"),o.classList.add("border-slate-700","text-slate-300")):(s.muscleGroups.push(i),o.classList.add("bg-brand-500","border-brand-500","text-white"),o.classList.remove("border-slate-700","text-slate-300")),r()})}),t.querySelector('[data-action="cancel-new"]').addEventListener("click",()=>lt()),t.querySelector('[data-action="save-new"]').addEventListener("click",()=>{s.name.trim()&&s.demoUrl.trim()&&s.muscleGroups.length&&(S.items.push({uid:ve(),mode:"new",draft:{...s},reps:s.reps||"",sets:s.sets||"",repUnits:"reps"}),X())}),Ie(s)}function Ie(e){const t=H.querySelector('[data-region="dupe"]');if(!t)return;const s=Qs(e.name);if(!s){t.innerHTML="";return}t.innerHTML=`
    <button data-use-existing="${w(s.id)}"
      class="w-full flex items-center gap-2 text-left text-sm bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-xl px-3 py-2 hover:bg-amber-500/15 transition">
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <span>Already exists: <b>${w(s.name)}</b> — use it instead?</span>
    </button>`,t.querySelector("[data-use-existing]").addEventListener("click",()=>{S.items.push({uid:ve(),mode:"existing",exercise:s,reps:s.recommendations?.reps||"",sets:s.recommendations?.sets||"",repUnits:s.recommendations?.repUnits||"reps"}),X()})}function na(){const e=ea(),t=it();t.innerHTML=`
    <button data-action="back-build" class="btn-ghost -ml-2 px-3 inline-flex items-center gap-1 text-sm">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
      Keep editing
    </button>

    <p class="eyebrow mt-4">Review & submit</p>
    <h1 class="h-page mt-2">${w(e.workout.title)}</h1>
    <p class="text-sm text-slate-400 mt-2">
      ${e.workout.items.length} exercise${e.workout.items.length===1?"":"s"}
      · ${e.newExercises.length} new
    </p>

    <ol class="mt-6 space-y-2">
      ${S.items.map((s,a)=>oa(s,a)).join("")}
    </ol>

    <details class="mt-6 card p-4">
      <summary class="eyebrow cursor-pointer select-none">Submission JSON</summary>
      <pre class="mt-3 text-xs text-slate-400 overflow-x-auto no-scrollbar whitespace-pre-wrap">${w(JSON.stringify(e,null,2))}</pre>
    </details>

    <button data-action="submit" class="btn-primary w-full mt-7">Submit via GitHub issue</button>
    <p data-region="fallback" class="text-xs text-slate-500 text-center mt-3"></p>
  `,t.querySelector('[data-action="back-build"]').addEventListener("click",()=>{S.stage="build",ye()}),t.querySelector('[data-action="submit"]').addEventListener("click",()=>ia(e))}function oa(e,t){const s=e.mode==="new",a=s?e.draft?.name:e.exercise?.name,n=[e.sets,e.reps].filter(Boolean).join(" × "),r=s?"New":"Library",o=s?"text-emerald-400":"text-brand-400";return`
    <li class="card p-3 flex items-center gap-3">
      <span class="num text-xs text-slate-500 w-5 text-right">${t+1}</span>
      <div class="flex-1 min-w-0">
        <p class="font-medium truncate">${w(a)}</p>
        <p class="text-xs text-slate-500">
          <span class="${o} font-semibold uppercase tracking-wider text-[10px]">${r}</span>
          ${n?` · <span class="num">${w(n)}</span>`:""}
        </p>
      </div>
    </li>`}function ia(e){const t=ta(e),s=H.querySelector('[data-region="fallback"]');if(window.open(t,"_blank","noopener")){s&&(s.textContent="Opened a prefilled GitHub issue in a new tab.");return}const n=JSON.stringify(e,null,2),r=o=>{s&&(s.innerHTML=`${w(o)} <a href="${w(t)}" target="_blank" rel="noopener" class="text-brand-400 underline">Open issue</a>`)};navigator.clipboard?.writeText?navigator.clipboard.writeText(n).then(()=>r("Popup blocked — JSON copied to clipboard.")).catch(()=>r("Popup blocked — copy the JSON above.")):r("Popup blocked — copy the JSON above.")}const T=document.getElementById("app");A("/",()=>yt(T));A("/programs",()=>St(T));A("/program/:id",({id:e})=>Ft(T,e));A("/exercises",()=>Rs(T));A("/exercise/:id",({id:e})=>Os(T,e));A("/search",()=>Fs(T));A("/submit",()=>ot(T));const la=["localhost","127.0.0.1"].includes(window.location.hostname);la&&(A("/studio",()=>Kt(T)),A("/studio/program",()=>us(T)),A("/studio/exercise",()=>Ss(T)),A("/studio/ai",()=>zs(T)));ct(e=>{T.innerHTML=`
    <div class="flex-1 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p class="text-6xl mb-4">🤔</p>
      <h1 class="text-2xl font-bold mb-2">Page not found</h1>
      <p class="text-slate-400 mb-6 text-sm">${e}</p>
      <a href="/" class="btn-primary">Back home</a>
    </div>
  `});function we(){const e=document.getElementById("submit-pill");e&&(e.hidden=window.location.pathname==="/submit")}window.addEventListener("popstate",we);document.addEventListener("click",()=>requestAnimationFrame(we));we();ut();console.log("🚀 Action App V2 ready");
