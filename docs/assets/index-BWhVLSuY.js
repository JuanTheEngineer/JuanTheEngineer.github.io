(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function s(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=s(n);fetch(n.href,r)}})();const fe=[];let se=null;function j(e,t){const s=[],a=new RegExp("^"+e.replace(/:([^/]+)/g,(n,r)=>(s.push(r),"([^/]+)"))+"$");fe.push({pattern:e,regex:a,keys:s,handler:t})}function je(e){se=e}function w(e){window.location.hash=e.startsWith("#")?e:`#${e}`}function oe(){const e=window.location.hash.slice(1)||"/";for(const t of fe){const s=e.match(t.regex);if(s){const a={};t.keys.forEach((n,r)=>{a[n]=decodeURIComponent(s[r+1])}),t.handler(a);return}}se&&se(e)}function Te(){window.addEventListener("hashchange",oe),window.location.hash?oe():window.location.hash="#/"}const ge="action-app:progress",be="action-app:recent-programs",Pe=5;function ae(){try{return JSON.parse(localStorage.getItem(ge)||"{}")}catch{return{}}}function ve(e){try{localStorage.setItem(ge,JSON.stringify(e))}catch{}}function he(e){const t=ae();return new Set(t[e]||[])}function Ae(e,t){const s=ae(),a=new Set(s[e]||[]);return a.has(t)?a.delete(t):a.add(t),s[e]=Array.from(a),ve(s),a}function Ie(e){const t=ae();delete t[e],ve(t)}function ye(){try{const e=JSON.parse(localStorage.getItem(be)||"[]");return Array.isArray(e)?e:[]}catch{return[]}}function Be(e){if(e)try{const t=ye().filter(s=>s.id!==e);t.unshift({id:e,visitedAt:Date.now()}),localStorage.setItem(be,JSON.stringify(t.slice(0,Pe)))}catch{}}const S={workouts:null,exercises:null,plans:null,exerciseMap:null};async function _(){if(S.workouts)return S.workouts;const e=await fetch("./workouts.json");if(!e.ok)throw new Error(`Failed to load workouts.json: ${e.status}`);return S.workouts=await e.json(),S.workouts}async function I(){if(S.exercises)return S.exercises;const e=await fetch("./exercises.json");if(!e.ok)throw new Error(`Failed to load exercises.json: ${e.status}`);return S.exercises=await e.json(),S.exerciseMap=new Map(S.exercises.exercises.map(t=>[t.id,t])),S.exercises}async function we(){if(S.plans)return S.plans;const e=await fetch("./plans.json");if(!e.ok)throw new Error(`Failed to load plans.json: ${e.status}`);return S.plans=await e.json(),S.plans}async function Ne(e){return(await _()).programs.find(s=>s.id===e)||null}async function Ue(e){return await I(),S.exerciseMap?.get(e)||null}async function He(e){const[t]=await Promise.all([Ne(e),I()]);if(!t)return null;const s=r=>{const o=S.exerciseMap.get(r.exerciseId)||null;return{kind:"single",exerciseId:r.exerciseId,exercise:o,name:o?.name||r.exerciseId,reps:r.reps??o?.recommendations?.reps,sets:r.sets??o?.recommendations?.sets,repUnits:r.repUnits??o?.recommendations?.repUnits,note:r.note??o?.recommendations?.note,tags:r.tags||[]}},a=r=>({kind:r.kind,note:r.note,tags:r.tags||[],exercises:r.exercises.map(o=>{const i=S.exerciseMap.get(o.exerciseId)||null;return{exerciseId:o.exerciseId,exercise:i,name:i?.name||o.exerciseId,reps:o.reps??i?.recommendations?.reps,sets:o.sets??i?.recommendations?.sets,repUnits:o.repUnits??i?.recommendations?.repUnits,note:o.note??i?.recommendations?.note}})}),n=(t.items||[]).map(r=>r.kind?a(r):s(r));return{...t,resolvedItems:n}}function _e(){return["localhost","127.0.0.1"].includes(window.location.hostname)}function ze(e){e.innerHTML=`
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
          ${_e()?`<button
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
        <a href="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform" target="_blank" rel="noopener"
          class="text-xs text-slate-500 hover:text-brand-400 transition-colors">
          Send feedback →
        </a>
      </footer>
    </div>
  `,e.querySelector('[data-action="create"]')?.addEventListener("click",()=>w("/studio")),e.querySelector('[data-action="search"]')?.addEventListener("click",()=>w("/search")),e.querySelector('[data-action="programs"]')?.addEventListener("click",()=>w("/programs")),e.querySelector('[data-action="exercises"]')?.addEventListener("click",()=>w("/exercises")),Re(e).catch(t=>console.warn("[recent] skipped",t))}async function Re(e){const t=ye();if(t.length===0)return;const s=e.querySelector('[data-region="recent"]');if(!s)return;const{programs:a}=await _(),n=new Map(a.map(o=>[o.id,o])),r=t.map(o=>({...o,program:n.get(o.id)})).filter(o=>o.program).slice(0,3);r.length!==0&&(s.classList.remove("hidden"),s.innerHTML=`
    <div class="flex items-baseline justify-between">
      <h2 class="eyebrow">Pick up where you left off</h2>
      ${r.length===3&&t.length>3?'<button data-action="all-recent" class="text-xs text-slate-400 hover:text-brand-400 transition-colors">All</button>':""}
    </div>
    <ul class="space-y-2">
      ${r.map(o=>De(o.program)).join("")}
    </ul>
  `,s.querySelectorAll("[data-program-id]").forEach(o=>{o.addEventListener("click",()=>w(`/program/${o.dataset.programId}`))}),s.querySelector('[data-action="all-recent"]')?.addEventListener("click",()=>w("/programs")))}function De(e){const t=e.items?.length||e.exercises?.length||0,s=he(e.id).size,a=t>0?Math.round(s/t*100):0,n=s===0?"Not started":s>=t?"Complete":`${s} of ${t} done`;return`
    <li>
      <button
        data-program-id="${e.id}"
        class="w-full card p-4 text-left active:scale-[0.98] transition-transform"
      >
        <div class="flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold tracking-tight truncate">${Oe(e.title)}</h3>
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
  `}function Oe(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Fe(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>w("/"));try{const[t,s]=await Promise.all([_(),we()]);Ge(e,t.programs,s.plans)}catch(t){Ye(e,t)}}function Ge(e,t,s){const a=new Map(t.map(r=>[r.id,r])),n=[];for(const r of s)for(const o of r.subPlans||[]){const i=(o.programs||[]).map(d=>a.get(d)).filter(Boolean);i.length!==0&&n.push({category:r.name,title:o.name,description:o.description,programs:i})}e.innerHTML=`
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
            ${r.programs.map(i=>Je(i)).join("")}
          </ul>
        </section>
      `).join("")}
    </main>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>w("/")),e.querySelectorAll("[data-program-id]").forEach(r=>{r.addEventListener("click",()=>{w(`/program/${r.dataset.programId}`)})})}function Je(e){const t=e.items?.length||e.exercises?.length||0;return`
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
  `}function Ye(e,t){e.innerHTML=`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold text-red-400 mb-2">Couldn't load programs</h2>
        <p class="text-sm text-slate-400">${t?.message||t}</p>
      </div>
    </main>
  `}function ke(e){if(!e)return null;const t=[/youtube\.com\/watch\?v=([^&]+)/,/youtube\.com\/shorts\/([^?&/]+)/,/youtube\.com\/embed\/([^?&/]+)/,/youtu\.be\/([^?&/]+)/];for(const s of t){const a=e.match(s);if(a)return a[1]}return null}function Ve(e,t="hqdefault"){const s=ke(e);return s?`https://i.ytimg.com/vi/${s}/${t}.jpg`:null}function Ke(e,t={}){const s=ke(e);if(!s)return null;const a=new URLSearchParams({autoplay:"1",rel:"0",modestbranding:"1",playsinline:"1"});return t.startTime&&a.set("start",String(Math.floor(t.startTime))),t.endTime&&a.set("end",String(Math.floor(t.endTime))),`https://www.youtube.com/embed/${s}?${a.toString()}`}function $e(e,t="w_800,q_auto,f_auto"){return!e||!e.includes("cloudinary.com")?e:e.replace("/upload/",`/upload/${t}/`)}function We(e){if(!e||!e.type)return"unknown";if(["youtube","tiktok","vimeo"].includes(e.type))return"embed";const t=e.mediaType==="video"||["mp4","webm","mov"].includes(e.format);return e.format==="gif"?"image":t?"video":"image"}function Ze(e,t,s={}){if(!t){e.innerHTML='<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No media</div>';return}const a=We(t),n=s.className||"w-full max-h-[60vh] object-contain rounded-2xl bg-slate-800";switch(e.classList.add("animate-fade-in"),a){case"image":Qe(e,t,n,s.onError);break;case"video":Xe(e,t,n,s.autoplay,s.onError);break;case"embed":et(e,t,n,s.onEmbedPlay);break;default:e.innerHTML=`<div class="${n} flex items-center justify-center text-slate-500 text-sm">Unsupported media type</div>`}}function Qe(e,t,s,a){const n=t.type==="cloudinary"?$e(t.url,"w_800,q_auto,f_auto"):t.url;e.innerHTML=`
    <img
      src="${n}"
      alt="Exercise demonstration"
      class="${s}"
      loading="lazy"
      decoding="async"
    />
  `,a&&e.querySelector("img")?.addEventListener("error",()=>a(),{once:!0})}function Xe(e,t,s,a=!0,n){const r=t.type==="cloudinary"?$e(t.url,"w_800,q_auto,f_auto"):t.url,o=t.startTime?`#t=${t.startTime}`:"";e.innerHTML=`
    <video
      src="${r}${o}"
      class="${s} cursor-pointer"
      ${a?"autoplay":""}
      loop
      muted
      playsinline
      preload="metadata"
    ></video>
  `;const i=e.querySelector("video");i?.addEventListener("click",()=>{i.paused?i.play():i.pause()}),n&&i?.addEventListener("error",()=>n(),{once:!0})}function et(e,t,s,a){const o=`${(t.url||"").includes("/shorts/")?"aspect-9/16 max-h-[70vh] mx-auto":"aspect-video"} w-full rounded-2xl overflow-hidden bg-slate-900`,i=t.type==="youtube"?Ve(t.url,"hqdefault"):null;e.innerHTML=`
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
  `;const d=e.querySelector('[data-action="play-embed"]');d&&d.addEventListener("click",()=>{const l=t.type==="youtube"?Ke(t.url,{startTime:t.startTime,endTime:t.endTime}):t.url;e.innerHTML=`
        <div class="${o} relative">
          <iframe
            src="${l}"
            class="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      `,a?.()},{once:!0})}function H(e,t,s={}){let a=(t||[]).filter(Boolean);if(a.length===0){e.innerHTML='<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No demos available</div>';return}a=st(a);let n=tt(s.startIndex??0,a.length);e.innerHTML=`
    <div class="relative">
      <div
        data-region="track"
        class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 gap-3 pb-1"
        style="scroll-snap-stop: always;"
      ></div>
      ${a.length>1?`
        <div class="flex items-center justify-center gap-1.5 mt-3" data-region="dots"></div>
        <p data-region="caption" class="text-xs text-slate-400 text-center px-2 mt-2 leading-relaxed min-h-4"></p>
      `:""}
    </div>
  `;const r=e.querySelector('[data-region="track"]'),o=e.querySelector('[data-region="dots"]'),i=e.querySelector('[data-region="caption"]');r.style.scrollbarWidth="none",a.forEach((f,b)=>{const h=document.createElement("div");h.className="shrink-0 w-full snap-center",h.dataset.slideIndex=String(b),r.appendChild(h)});const d=new Set,l=new Set,p=f=>{if(d.has(f))return;const b=r.children[f];if(!b)return;const h=a[f];Ze(b,h,{onError:()=>u(f),onEmbedPlay:()=>l.add(f)}),d.add(f)},c=f=>{!l.has(f)||!r.children[f]||(l.delete(f),d.delete(f),p(f))},u=f=>{const b=r.children[f];b&&(b.innerHTML=`<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">Couldn't load demo</div>`)},g=()=>{o&&(o.innerHTML=a.map((f,b)=>`
      <button
        data-dot-index="${b}"
        aria-label="Go to demo ${b+1}"
        class="p-1.5 -m-1.5 group touch-manipulation"
      >
        <span class="block w-1 h-1 rounded-full transition-colors
          ${b===n?"bg-brand-400":"bg-slate-600 group-hover:bg-slate-500"}"
        ></span>
      </button>
    `).join(""),o.querySelectorAll("[data-dot-index]").forEach(f=>{f.addEventListener("click",()=>k(Number(f.dataset.dotIndex)))}))},v=()=>{i&&(i.textContent=at(a[n]))};function k(f){const b=r.children[f];b&&r.scrollTo({left:b.offsetLeft-r.offsetLeft,behavior:"smooth"})}let $=!1;const x=()=>{$||($=!0,requestAnimationFrame(()=>{$=!1;const f=r.children[0]?.offsetWidth||1,b=Math.round(r.scrollLeft/f);if(b!==n&&b>=0&&b<a.length){const h=n;n=b,c(h),g(),v(),p(n),n+1<a.length&&p(n+1),n-1>=0&&p(n-1)}}))};r.addEventListener("scroll",x,{passive:!0}),p(n),n+1<a.length&&p(n+1),n-1>=0&&p(n-1),requestAnimationFrame(()=>{const f=r.children[n];f&&(r.scrollLeft=f.offsetLeft-r.offsetLeft)}),g(),v()}function tt(e,t){return Math.max(0,Math.min(t-1,e))}function st(e){const t={cloudinary:0,youtube:1,vimeo:2,tiktok:2,url:3,local:4};return[...e].sort((s,a)=>s.isPrimary&&!a.isPrimary?-1:a.isPrimary&&!s.isPrimary?1:(t[s.type]??99)-(t[a.type]??99))}function at(e){const t={cloudinary:e.format==="mp4"?"Video":"Demo",youtube:"YouTube",tiktok:"TikTok",vimeo:"Vimeo",local:"Demo",url:"External"}[e.type]||e.type;return e.notes?`${t} · ${e.notes}`:t}function rt(e,t){const s=document.createElement("article");s.className=`card overflow-hidden transition-all ${t.isCompleted?"opacity-60":""}`,s.dataset.itemIndex=String(t.index);const a=e.exercise?.demos||[],r=`${t.index+1}. ${e.name}`;if(s.innerHTML=`
    <div class="flex items-stretch">
      <button
        data-action="toggle"
        class="flex-1 min-w-0 px-4 py-4 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation"
      >
        <div class="flex-1 min-w-0">
          ${ot(e.tags)}
          <h3 class="font-semibold tracking-tight leading-tight ${t.isCompleted?"line-through text-slate-500":"text-slate-100"}">
            ${N(r)}
          </h3>
          <p class="text-sm text-slate-400 mt-1 num">
            ${nt(e)}
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
          <div class="bg-slate-800/50 rounded-xl p-3 text-center">
            <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${N(e.reps||"—")}</p>
            <p class="label-meta mt-1.5">${N(e.repUnits||"reps")}</p>
          </div>
          <div class="bg-slate-800/50 rounded-xl p-3 text-center">
            <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${N(e.sets||"—")}</p>
            <p class="label-meta mt-1.5">sets</p>
          </div>
        </div>
        ${e.note?`
          <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
            <p class="text-sm text-slate-300 leading-relaxed">${N(e.note)}</p>
          </div>
        `:""}
      </div>
    </div>
  `,t.isExpanded&&a.length>0){const o=s.querySelector("[data-media-slot]");o&&H(o,a)}return s.querySelector('[data-action="toggle"]')?.addEventListener("click",()=>{t.onToggle?.(t.index)}),s.querySelector('[data-action="complete"]')?.addEventListener("click",o=>{o.stopPropagation(),t.onComplete?.(t.index)}),s}function nt(e){const t=e.reps||"—",s=e.sets||"—";return`${t} · ${s} sets`}function ot(e=[]){return e.length?`
    <div class="flex gap-1.5 mb-1.5">
      ${e.map(t=>`
        <span class="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">${N(t)}</span>
      `).join("")}
    </div>
  `:""}function N(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const it={superset:"Super Set",compound:"Compound",circuit:"Circuit"};function lt(e,t){const s=document.createElement("article");s.className=`transition-all ${t.isCompleted?"opacity-60":""}`,s.dataset.itemIndex=String(t.index);const a=it[e.kind]||e.kind,n=t.index+1,r=e.exercises.map((o,i)=>{const d=String.fromCharCode(97+i),l=`${n}${d}. ${z(o.name)}`,p=i===0,c=i===e.exercises.length-1;return`
      <div class="card ${p?"rounded-t-2xl":"rounded-t-none"} ${c?"rounded-b-2xl":"rounded-b-none"} overflow-hidden ${p?"":"border-t-0"}">
        ${p?"":'<div class="h-px bg-slate-700/50"></div>'}
        <div class="flex items-stretch">
          <button
            data-action="toggle-member"
            data-member-idx="${i}"
            class="flex-1 min-w-0 px-4 py-4 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation"
          >
            <div class="flex-1 min-w-0">
              ${p?`<div class="flex gap-1.5 mb-1.5"><span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300">${a}</span></div>`:""}
              <h3 class="font-semibold tracking-tight leading-tight ${t.isCompleted?"line-through text-slate-500":"text-slate-100"}">
                ${l}
              </h3>
              <p class="text-sm text-slate-400 mt-1 num">
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
              <div class="bg-slate-800/50 rounded-xl p-3 text-center">
                <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${z(o.reps||"—")}</p>
                <p class="label-meta mt-1.5">${z(o.repUnits||"reps")}</p>
              </div>
              <div class="bg-slate-800/50 rounded-xl p-3 text-center">
                <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${z(o.sets||"—")}</p>
                <p class="label-meta mt-1.5">sets</p>
              </div>
            </div>
            ${o.note?`
            <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
              <p class="text-sm text-slate-300 leading-relaxed">${z(o.note)}</p>
            </div>`:""}
          </div>
        </div>
      </div>
    `}).join("");return s.innerHTML=r,s.querySelectorAll('[data-action="toggle-member"]').forEach(o=>{o.addEventListener("click",()=>{t.onToggle?.(t.index)})}),s.querySelectorAll('[data-action="complete"]').forEach(o=>{o.addEventListener("click",i=>{i.stopPropagation(),t.onComplete?.(t.index)})}),t.isExpanded&&e.exercises.forEach((o,i)=>{const d=s.querySelector(`[data-member-media="${i}"]`),l=o.exercise?.demos||[];d&&l.length>0&&H(d,l)}),s}function z(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const ie=["Nice work!","Killer moves!","Awesome job!","Crushed it!","You did it!","Beast mode!","On fire!","Way to go!","Strengthened and Conditioned!"];let le=0;function dt(){const e=Date.now();if(e-le<5e3)return;le=e;const t=ie[Math.floor(Math.random()*ie.length)],s=document.createElement("div");s.className="celebration-flash";const a=document.createElement("div");a.className="celebration-text",a.textContent=t,document.body.appendChild(s),document.body.appendChild(a),setTimeout(()=>s.remove(),700),setTimeout(()=>a.remove(),3100)}async function ct(e,t){e.innerHTML=V(`
    <main class="flex-1 px-6 pb-24 flex items-center justify-center">
      <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </main>
  `),K(e);try{const s=await He(t);if(!s){ut(e,t);return}Be(s.id),pt(e,s)}catch(s){mt(e,s)}}function pt(e,t){const s=he(t.id),a=t.resolvedItems.length;let n=-1;e.innerHTML=V(`
    <div class="sticky top-15 z-10 px-6 pt-2 pb-3 bg-slate-950/85 backdrop-blur-md border-b border-slate-900">
      <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div data-region="progress-bar" class="h-full bg-linear-to-r from-brand-500 to-brand-400 transition-all duration-500" style="width: ${s.size/a*100}%"></div>
      </div>
      <p class="text-[11px] text-slate-500 mt-1.5 font-medium num">
        <span data-region="completed-count">${s.size}</span> of ${a} complete
      </p>
    </div>

    <header class="px-6 pt-4 pb-3">
      <h1 class="h-page">${D(t.title)}</h1>
      ${t.requirements?`
        <p class="text-sm text-slate-400 mt-1.5">${D(t.requirements)}</p>
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
  `,t.title),K(e);const r=e.querySelector('[data-region="items"]'),o=e.querySelector('[data-region="actions"]'),i=()=>{r.innerHTML="",t.resolvedItems.forEach((p,c)=>{const u=document.createElement("li"),g={index:c,isExpanded:c===n,isCompleted:s.has(c),onToggle:k=>{n=n===k?-1:k,l(),n===k&&requestAnimationFrame(()=>{const $=r.querySelector(`[data-item-index="${k}"]`);if($){const x=window.scrollY+$.getBoundingClientRect().top-130;window.scrollTo({top:Math.max(0,x),behavior:"smooth"})}})},onComplete:k=>{const $=s.size===a,x=Ae(t.id,k);s.clear(),x.forEach(f=>s.add(f)),x.has(k)&&n===k&&(n=-1),l(),!$&&s.size===a&&setTimeout(dt,250)}},v=p.kind==="single"?rt(p,g):lt(p,g);u.appendChild(v),r.appendChild(u)})},d=()=>{const p=e.querySelector('[data-region="progress-bar"]');p&&(p.style.width=`${s.size/a*100}%`);const c=e.querySelector('[data-region="completed-count"]');c&&(c.textContent=String(s.size)),o.classList.toggle("hidden",s.size===0)},l=()=>{i(),d()};l(),e.querySelector('[data-action="reset"]')?.addEventListener("click",()=>{confirm("Reset progress for this program?")&&(Ie(t.id),s.clear(),l())}),e.querySelector('[data-action="share"]')?.addEventListener("click",()=>{const p=window.location.href;navigator.share?navigator.share({title:t.title,text:`Check out: ${t.title}`,url:p}).catch(()=>{}):navigator.clipboard?.writeText(p).then(()=>alert("Link copied!")).catch(()=>prompt("Copy:",p))})}function V(e,t="Program"){return`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400 truncate">${D(t)}</span>
      </header>
      ${e}
    </div>
  `}function K(e){e.querySelector('[data-action="back"]')?.addEventListener("click",()=>w("/programs"))}function ut(e,t){e.innerHTML=V(`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold mb-2">Program not found</h2>
        <p class="text-sm text-slate-400">No program with id <code class="text-slate-300">${D(t)}</code>.</p>
      </div>
    </main>
  `),K(e)}function mt(e,t){e.innerHTML=V(`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold text-red-400 mb-2">Couldn't load program</h2>
        <p class="text-sm text-slate-400">${D(t?.message||String(t))}</p>
      </div>
    </main>
  `),K(e)}function D(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function xt(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>w("/")),e.querySelector('[data-action="new-program"]')?.addEventListener("click",()=>w("/studio/program")),e.querySelector('[data-action="new-exercise"]')?.addEventListener("click",()=>w("/studio/exercise")),e.querySelector('[data-action="ai-builder"]')?.addEventListener("click",()=>w("/studio/ai"))}let U=null;async function ft(){if(U)return U;const{exercises:e}=await I();return U=e.map(t=>({id:t.id,name:t.name,hasDemos:(t.demos||[]).length>0,tokens:A(t.name).concat((t.aliases||[]).flatMap(s=>A(s))).concat(A(t.id.replace(/[-_]/g," "))),exercise:t})),U}function gt(e){U&&U.push({id:e.id,name:e.name,hasDemos:(e.demos||[]).length>0,tokens:A(e.name).concat((e.aliases||[]).flatMap(t=>A(t))).concat(A(e.id.replace(/[-_]/g," "))),exercise:e})}async function W(e,t=10){const s=await ft();if(!e||!e.trim())return s.slice(0,t);const a=A(e);return s.map(n=>({...n,score:vt(n.tokens,a)})).filter(n=>n.score>0).sort((n,r)=>r.score-n.score).slice(0,t)}function bt(e,t={}){e.innerHTML=`
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
  `;const s=e.querySelector('[data-input="search"]'),a=e.querySelector('[data-region="results"]'),n=e.querySelector('[data-region="empty"]'),r=e.querySelector('[data-action="create-new"]');let o=null;const i=(l,p)=>{if(!p||!p.trim()){a.classList.add("hidden"),n.classList.add("hidden"),r.classList.add("hidden");return}if(r.classList.remove("hidden"),l.length===0){a.classList.add("hidden"),n.classList.remove("hidden");return}n.classList.add("hidden"),a.classList.remove("hidden"),a.innerHTML=l.map(c=>`
      <li>
        <button
          data-exercise-id="${c.id}"
          class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800/60 active:bg-slate-800 transition-colors flex items-center gap-3 touch-manipulation"
        >
          <span class="flex-1 min-w-0">
            <span class="text-sm font-medium text-slate-100 block truncate">${ht(c.name)}</span>
          </span>
          ${c.hasDemos?`
            <span class="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-sm">demo</span>
          `:""}
        </button>
      </li>
    `).join(""),a.querySelectorAll("[data-exercise-id]").forEach(c=>{c.addEventListener("click",()=>{const u=l.find(g=>g.id===c.dataset.exerciseId);u&&t.onSelect?.(u.exercise)})})},d=async()=>{const l=s.value,p=await W(l);i(p,l)};s.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(d,150)}),i([],""),r?.addEventListener("click",()=>t.onCreateNew?.(s.value.trim()))}function A(e){return e?e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().split(/[^a-z0-9]+/).filter(t=>t.length>0):[]}function vt(e,t){let s=0;for(const a of t){let n=0;for(const r of e)r===a?n=Math.max(n,10):r.startsWith(a)?n=Math.max(n,7):r.includes(a)&&(n=Math.max(n,4));if(n===0)return 0;s+=n}return s}function ht(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const Z=[{value:"youtube",label:"YouTube",fields:["url","startTime","endTime","notes"]},{value:"cloudinary",label:"Cloudinary",fields:["url","startTime","endTime","notes"]},{value:"local",label:"Local file",fields:["url","notes"]},{value:"url",label:"URL (external)",fields:["url","notes"]},{value:"tiktok",label:"TikTok",fields:["url","notes"]},{value:"vimeo",label:"Vimeo",fields:["url","startTime","endTime","notes"]}];function re(e,t){s();function s(){e.innerHTML=`
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
    `,n()}function a(r,o){const d=(Z.find(p=>p.value===r.type)||Z[0]).fields.includes("startTime"),l=r.type==="youtube"?yt(r.url):null;return`
      <div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 space-y-2.5" data-demo-index="${o}">
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-slate-500 font-bold num">#${o+1}</span>
          <select data-demo-field="type" data-index="${o}" class="flex-1 bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-brand-500">
            ${Z.map(p=>`<option value="${p.value}"${r.type===p.value?" selected":""}>${p.label}</option>`).join("")}
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
          <input data-demo-field="url" data-index="${o}" value="${ce(r.url||"")}" placeholder="https://..." class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500 font-mono"/>
        </div>
        ${l?`<img src="${l}" alt="Thumbnail" class="w-full h-20 object-cover rounded-lg bg-slate-900"/>`:""}
        ${d?`
          <div class="grid grid-cols-2 gap-2">
            <div><label class="text-[10px] text-slate-500 block mb-0.5">Start (sec)</label>
              <input data-demo-field="startTime" data-index="${o}" type="number" min="0" value="${r.startTime||0}" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-brand-500 num"/></div>
            <div><label class="text-[10px] text-slate-500 block mb-0.5">End (sec)</label>
              <input data-demo-field="endTime" data-index="${o}" type="number" min="0" value="${r.endTime||0}" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-brand-500 num"/></div>
          </div>
        `:""}
        <div>
          <input data-demo-field="notes" data-index="${o}" value="${ce(r.notes||"")}" placeholder="Notes (optional)" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/>
        </div>
      </div>
    `}function n(){e.querySelector('[data-action="add-demo"]')?.addEventListener("click",()=>{t.push({type:"youtube",mediaType:"video",format:"youtube",url:"",startTime:0,endTime:0,isPrimary:t.length===0,notes:""}),s()}),e.querySelectorAll('[data-action="remove-demo"]').forEach(r=>{r.addEventListener("click",()=>{const o=+r.dataset.index,i=t[o].isPrimary;t.splice(o,1),i&&t.length>0&&(t[0].isPrimary=!0),s()})}),e.querySelectorAll('input[name="primary-demo"]').forEach(r=>{r.addEventListener("change",()=>{const o=+r.dataset.index;t.forEach((i,d)=>{i.isPrimary=d===o})})}),e.querySelectorAll('[data-demo-field="type"]').forEach(r=>{r.addEventListener("change",()=>{const o=+r.dataset.index;t[o].type=r.value,t[o].format=r.value==="youtube"?"youtube":r.value==="cloudinary"?de(t[o].url):r.value,t[o].mediaType="video",s()})}),e.querySelectorAll("[data-demo-field]").forEach(r=>{if(r.tagName==="SELECT")return;const o=()=>{const i=+r.dataset.index,d=r.dataset.demoField;d==="startTime"||d==="endTime"?t[i][d]=Number(r.value)||0:t[i][d]=r.value,d==="url"&&t[i].type==="cloudinary"&&(t[i].format=de(r.value))};r.addEventListener("input",o),r.addEventListener("change",o)})}}function yt(e){if(!e)return null;const t=e.match(/(?:v=|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);return t?`https://img.youtube.com/vi/${t[1]}/hqdefault.jpg`:null}function de(e){return e&&/\.(mp4|webm|mov)(\?|$)/i.test(e)?"mp4":"gif"}function ce(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function wt(e,t,s){const{items:a}=t;if(a.length===0){e.innerHTML="";return}e.innerHTML=a.map((n,r)=>n.type==="group"?$t(n,r,t):kt(n,r,t)).join(""),qt(e,t,s)}function kt(e,t,s){const a=s.expandedIndex===t,n=e.exerciseNote||"",r=n.length>50?n.substring(0,50)+"…":n,o=(e.tags||[]).map(i=>`<span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-300">${i}</span>`).join("");return`<li class="card" data-idx="${t}" data-type="single">
  <div class="flex items-center px-4 py-3 gap-2 relative">
    <div class="flex-1 min-w-0 cursor-pointer" data-action="expand" data-idx="${t}">
      ${o?`<div class="flex gap-1 mb-1">${o}</div>`:""}
      <p class="text-sm font-medium text-slate-100 truncate">${Y(e.exerciseName)}</p>
      <p class="text-xs text-slate-400 num mt-0.5">${e.reps||"—"} ${e.repUnits||"reps"} · ${e.sets||"—"} sets</p>
      ${r?`<p class="text-[11px] text-slate-500 truncate mt-0.5 italic">${Y(r)}</p>`:""}
    </div>
    ${Se(t)}
  </div>
  ${a?`<div class="border-t border-slate-800" data-region="edit-form" data-idx="${t}"></div>`:""}
</li>`}function $t(e,t,s){const a=s.expandedIndex===t,n={superset:"Superset",compound:"Compound",circuit:"Circuit"}[e.kind]||e.kind,r=e.members.map((o,i)=>`
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
      <span class="text-[10px] font-bold uppercase tracking-wide text-brand-300">${n}</span>
      <span class="text-[10px] text-slate-500 num ml-2">${e.members.length} exercises</span>
    </div>
    ${Se(t)}
  </div>
  ${r}
  ${a?`<div class="border-t border-slate-800" data-region="edit-form" data-idx="${t}"></div>`:""}
</li>`}function Se(e){return`<button data-action="menu" data-idx="${e}" class="relative z-10 p-3 -mr-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation shrink-0" aria-label="Actions">
    <svg class="w-5 h-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
  </button>`}function St(e,t,s,a){Et();const n=s.items[t],r=n.type==="group",o=s.items.length,i=t>0?s.items[t-1]:null,d=t<o-1?s.items[t+1]:null;let l="";r?(l+=E("edit","Edit group"),t>0&&(l+=E("move-up","Move up")),t<o-1&&(l+=E("move-down","Move down")),i?.type==="single"&&(l+=E("group-above","Add above to group")),d?.type==="single"&&(l+=E("group-below","Add below to group")),l+=E("ungroup","Ungroup")):(l+=E("edit","Edit"),t>0&&(l+=E("move-up","Move up")),t<o-1&&(l+=E("move-down","Move down")),i?.type==="single"?l+=E("group-above","Group with above"):i?.type==="group"&&(l+=E("group-above","Join group above")),d?.type==="single"?l+=E("group-below","Group with below"):d?.type==="group"&&(l+=E("group-below","Join group below"))),l+=E("remove","Remove","text-red-400");const p=r?n.members.map(u=>u.exerciseName).join(" + "):n.exerciseName||"Item",c=document.createElement("div");c.dataset.region="action-menu",c.className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-fade-in",c.innerHTML=`
    <div class="bg-slate-900 border-t border-slate-700 rounded-t-2xl w-full max-w-sm pb-8 pt-3 px-2">
      <div class="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-3"></div>
      <p class="text-xs text-slate-500 text-center mb-2 px-4 truncate">${Y(p)}</p>
      <div class="space-y-0.5">${l}</div>
      <button data-menu-action="cancel" class="w-full mt-2 py-3 text-sm text-slate-500 hover:text-slate-300 transition-colors">Cancel</button>
    </div>
  `,document.body.appendChild(c),c.querySelectorAll("[data-menu-action]").forEach(u=>{u.addEventListener("click",g=>{g.stopPropagation();const v=u.dataset.menuAction;c.remove(),v!=="cancel"&&Lt(v,t,s,a)})}),c.addEventListener("click",u=>{u.target===c&&c.remove()})}function E(e,t,s=""){return`<button data-menu-action="${e}" class="w-full text-left px-5 py-3 text-sm font-medium rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors ${s}">${t}</button>`}function Et(){document.querySelectorAll('[data-region="action-menu"]').forEach(e=>e.remove())}function Lt(e,t,s,a,n){const r=s.items[t],o=t>0?s.items[t-1]:null,i=t<s.items.length-1?s.items[t+1]:null;switch(e){case"edit":a.onEdit?.(t);break;case"move-up":a.onMove?.(t,t-1);break;case"move-down":a.onMove?.(t,t+1);break;case"group-above":o?.type==="group"?a.onJoinGroup?.(t,t-1):r.type==="group"&&o?.type==="single"?a.onAbsorbIntoGroup?.(t,t-1):pe(t,"above",a);break;case"group-below":i?.type==="group"?a.onJoinGroup?.(t,t+1):r.type==="group"&&i?.type==="single"?a.onAbsorbIntoGroup?.(t,t+1):pe(t,"below",a);break;case"ungroup":a.onUngroup?.(t);break;case"remove":a.onRemove?.(t);break}}function pe(e,t,s){const a=document.createElement("div");a.dataset.region="kind-picker",a.className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in",a.innerHTML=`
    <div class="bg-slate-900 border-t border-slate-700 rounded-t-2xl w-full max-w-sm p-5 space-y-4 pb-8">
      <p class="text-sm font-medium text-slate-200 text-center">Group type</p>
      <div class="flex gap-2">
        <button data-kind="superset" class="flex-1 py-3 rounded-xl text-sm font-medium bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 active:scale-95 transition-all">Superset</button>
        <button data-kind="compound" class="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all">Compound</button>
        <button data-kind="circuit" class="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all">Circuit</button>
      </div>
      <button data-action="cancel-kind" class="w-full py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">Cancel</button>
    </div>
  `,document.body.appendChild(a),a.querySelectorAll("[data-kind]").forEach(n=>{n.addEventListener("click",()=>{a.remove(),s.onGroup?.(e,t,n.dataset.kind)})}),a.querySelector('[data-action="cancel-kind"]')?.addEventListener("click",()=>a.remove()),a.addEventListener("click",n=>{n.target===a&&a.remove()})}function qt(e,t,s){e.querySelectorAll('[data-action="expand"]').forEach(a=>{a.addEventListener("click",()=>s.onEdit?.(+a.dataset.idx))}),e.querySelectorAll('[data-action="menu"]').forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation(),St(e,+a.dataset.idx,t,s)})}),e.querySelectorAll('[data-action="member-up"]').forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation(),s.onMemberMove?.(+a.dataset.idx,+a.dataset.mi,+a.dataset.mi-1)})}),e.querySelectorAll('[data-action="member-down"]').forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation(),s.onMemberMove?.(+a.dataset.idx,+a.dataset.mi,+a.dataset.mi+1)})}),e.querySelectorAll('[data-action="member-remove"]').forEach(a=>{a.addEventListener("click",n=>{n.stopPropagation(),s.onMemberRemove?.(+a.dataset.idx,+a.dataset.mi)})})}function Y(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let m=Ee(),y=-1;function Ee(){return{meta:{title:"",id:"",requirements:"",description:"",difficulty:"",duration:""},items:[],newExercises:[]}}function Ct(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/_+$/g,"")}function Mt(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>w("/studio")),e.querySelector('[data-action="start-fresh"]')?.addEventListener("click",()=>{Q(e,null,!1)}),e.querySelector('[data-action="edit-existing"]')?.addEventListener("click",async()=>{const t=await ue();t&&Q(e,t,!0)}),e.querySelector('[data-action="clone-existing"]')?.addEventListener("click",async()=>{const t=await ue();t&&Q(e,t,!1)})}function Q(e,t,s){m=Ee(),y=-1,e.innerHTML=`
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
  `,jt(e),Tt(e),Pt(e),L(e),Ht(e),Nt(),t&&Bt(e,t,s)}function jt(e){e.querySelector('[data-action="back"]')?.addEventListener("click",()=>w("/studio"))}function Tt(e){const t=e.querySelector('[data-field="title"]'),s=e.querySelector('[data-field="requirements"]'),a=e.querySelector('[data-region="id-preview"]'),n=e.querySelector('[data-region="export-section"]');t?.addEventListener("input",()=>{m.meta.title=t.value,m.meta.id=Ct(t.value),a.textContent=m.meta.id?`id: ${m.meta.id}`:"",n?.classList.toggle("hidden",!m.meta.title.trim()||m.items.length===0)}),s?.addEventListener("input",()=>{m.meta.requirements=s.value})}function Pt(e){const t=e.querySelector('[data-region="picker"]');bt(t,{onSelect:s=>{m.items.push({type:"single",exerciseId:s.id,exerciseName:s.name,exerciseNote:s.recommendations?.note||"",reps:s.recommendations?.reps||"",sets:s.recommendations?.sets||"",repUnits:s.recommendations?.repUnits||"reps",note:"",tags:[]}),L(e)},onCreateNew:s=>{Ut(e,s)}})}function L(e){const t=e.querySelector('[data-region="timeline"]'),s=e.querySelector('[data-region="empty-timeline"]'),a=e.querySelector('[data-region="item-count"]'),n=e.querySelector('[data-region="export-section"]');if(t){if(a.textContent=`${m.items.length} item${m.items.length!==1?"s":""}`,m.items.length===0){t.classList.add("hidden"),s.classList.remove("hidden"),n?.classList.add("hidden");return}if(t.classList.remove("hidden"),s.classList.add("hidden"),n?.classList.toggle("hidden",!m.meta.title.trim()),wt(t,{items:m.items,expandedIndex:y},{onEdit:r=>{y=y===r?-1:r,L(e)},onRemove:r=>{m.items.splice(r,1),y===r?y=-1:y>r&&y--,L(e)},onMove:(r,o)=>{const[i]=m.items.splice(r,1);m.items.splice(o,0,i),y===r?y=o:r<y&&o>=y?y--:r>y&&o<=y&&y++,L(e)},onGroup:(r,o,i)=>{const d=o==="above"?r-1:r+1,l=Math.min(r,d),p=[m.items[l],m.items[l+1]],c={type:"group",kind:i,note:"",tags:[],members:p};m.items.splice(l,2,c),y=-1,L(e)},onJoinGroup:(r,o)=>{const i=m.items[r];m.items[o].members.push(i),m.items.splice(r,1),y=-1,L(e)},onAbsorbIntoGroup:(r,o)=>{const i=m.items[o],d=m.items[r];o<r?d.members.unshift(i):d.members.push(i),m.items.splice(o,1),y=-1,L(e)},onMemberMove:(r,o,i)=>{const d=m.items[r];if(!d||d.type!=="group")return;const[l]=d.members.splice(o,1);d.members.splice(i,0,l),L(e)},onMemberRemove:(r,o)=>{const i=m.items[r];if(!i||i.type!=="group")return;const[d]=i.members.splice(o,1);if(i.members.length<=1){const l=i.members[0]||d;l.type="single",m.items.splice(r,1,l)}y=-1,L(e)},onUngroup:r=>{const o=m.items[r];if(o.type!=="group")return;const i=o.members.map(d=>({...d,type:"single"}));m.items.splice(r,1,...i),y=-1,L(e)}}),y>=0&&y<m.items.length){const r=t.querySelector(`[data-region="edit-form"][data-idx="${y}"]`);r&&At(r,m.items[y],y,e)}}}function At(e,t,s,a){const n=["reps","secs","min","yd","rep","reps (each side)","secs (each side)"],r=["warmup","stretch"];e.innerHTML=`
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
        <div class="flex gap-2">${r.map(i=>`
          <button type="button" data-pill="${i}" class="px-3 py-1.5 rounded-full text-xs font-medium transition-all ${(t.tags||[]).includes(i)?"bg-brand-500 text-white":"bg-slate-800 text-slate-400 hover:bg-slate-700"}">${i}</button>`).join("")}
        </div></div>
    </div>
  `,e.querySelectorAll("[data-edit]").forEach(i=>{const d=()=>{t[i.dataset.edit]=i.value};i.addEventListener("input",d),i.addEventListener("change",d)}),e.querySelectorAll("[data-pill]").forEach(i=>{i.addEventListener("click",()=>{t.tags||(t.tags=[]);const d=i.dataset.pill;t.tags.includes(d)?t.tags=t.tags.filter(l=>l!==d):t.tags.push(d),L(a)})});const o=e.querySelector(`[data-demo-preview="${s}"]`);o&&t.exerciseId&&It(o,t.exerciseId)}function q(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function It(e,t){const{exercises:s}=await I(),a=s.find(o=>o.id===t),n=m.newExercises.find(o=>o.id===t),r=a?.demos||n?.demos||[];if(r.length===0){e.innerHTML='<p class="text-[11px] text-slate-600 italic">No demos available</p>';return}H(e,r)}async function ue(){const{programs:e}=await _(),t=prompt(`Type part of a program name:

`+e.map(a=>`• ${a.title}`).join(`
`));if(!t)return null;const s=e.find(a=>a.title.toLowerCase().includes(t.toLowerCase()));return s||(alert('No program found matching "'+t+'"'),null)}function Bt(e,t,s){m.meta.title=s?t.title:"",m.meta.id=s?t.id:"",m.meta.requirements=t.requirements||"",m.items=(t.items||[]).map(n=>n.kind?{type:"group",kind:n.kind,note:n.note||"",tags:n.tags||[],members:n.exercises.map(r=>({type:"single",exerciseId:r.exerciseId,exerciseName:r.exerciseId,reps:r.reps||"",sets:r.sets||"",repUnits:r.repUnits||"reps",note:r.note||"",tags:[]}))}:{type:"single",exerciseId:n.exerciseId,exerciseName:n.exerciseId,exerciseNote:n.note||"",reps:n.reps||"",sets:n.sets||"",repUnits:n.repUnits||"reps",note:n.note||"",tags:n.tags||[]}),y=-1;const a=e.querySelector('[data-field="title"]');a.value=m.meta.title,a.dispatchEvent(new Event("input")),e.querySelector('[data-field="requirements"]').value=m.meta.requirements,s&&(e.querySelector('[data-region="header-title"]').textContent=`Edit: ${t.title}`),L(e)}let X=!1;function Nt(){if(X)return;X=!0;const e=s=>{(m.items.length>0||m.meta.title)&&(s.preventDefault(),s.returnValue="")};window.addEventListener("beforeunload",e);const t=()=>{window.removeEventListener("beforeunload",e),window.removeEventListener("hashchange",t),X=!1};window.addEventListener("hashchange",t)}let ee=[];function Ut(e,t=""){const s=e.querySelector('[data-region="exercise-slideover"]');if(!s)return;ee=[],s.querySelector('[data-exfield="name"]').value=t,s.querySelector('[data-exfield="reps"]').value="",s.querySelector('[data-exfield="sets"]').value="",s.querySelector('[data-exfield="repUnits"]').value="reps",s.querySelector('[data-exfield="note"]').value="";const a=t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,"");s.querySelector('[data-region="ex-id-preview"]').textContent=a?`id: ${a}`:"";const n=s.querySelector('[data-region="demo-manager"]');re(n,ee);const r=s.querySelector('[data-exfield="name"]'),o=s.querySelector('[data-region="ex-id-preview"]');r.addEventListener("input",()=>{const d=r.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,"");o.textContent=d?`id: ${d}`:""}),s.querySelector('[data-action="save-exercise"]')?.addEventListener("click",async()=>{const d=r.value.trim();if(!d){r.focus();return}const l=d.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,""),{exercises:p}=await I(),c=p.find(x=>x.id===l||x.name.toLowerCase()===d.toLowerCase());if(c&&!confirm(`An exercise named "${c.name}" already exists (id: ${c.id}).

Do you still want to create "${d}"?`))return;const u=s.querySelector('[data-exfield="reps"]').value,g=s.querySelector('[data-exfield="sets"]').value,v=s.querySelector('[data-exfield="repUnits"]').value,k=s.querySelector('[data-exfield="note"]').value,$={id:l,name:d,demos:ee.filter(x=>x.url),recommendations:{}};u&&($.recommendations.reps=u),g&&($.recommendations.sets=g),v&&v!=="reps"&&($.recommendations.repUnits=v),k&&($.recommendations.note=k),m.newExercises.push($),gt($),m.items.push({type:"single",exerciseId:l,exerciseName:d,exerciseNote:k||"",reps:u||"",sets:g||"",repUnits:v||"reps",note:"",tags:[]}),s.classList.add("hidden"),L(e)},{once:!0});const i=()=>s.classList.add("hidden");s.querySelector('[data-action="cancel-exercise"]')?.addEventListener("click",i,{once:!0}),s.querySelector('[data-action="close-exercise"]')?.addEventListener("click",i,{once:!0}),s.classList.remove("hidden")}function Ht(e){const t=e.querySelector('[data-region="export-modal"]');e.querySelector('[data-action="export"]')?.addEventListener("click",()=>{Rt(e)}),e.querySelector('[data-action="close-export"]')?.addEventListener("click",()=>{t?.classList.add("hidden")}),t?.addEventListener("click",s=>{s.target===t&&t.classList.add("hidden")}),e.querySelector('[data-action="preview"]')?.addEventListener("click",()=>{_t(e)})}function _t(e){const t=Le(),s=t.items||[],a=`
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
          ${s.map((r,o)=>zt(r)).join("")}
        </ul>
      </div>
    </div>
  `,n=document.createElement("div");n.innerHTML=a,e.appendChild(n.firstElementChild),e.querySelector('[data-action="close-preview"]')?.addEventListener("click",()=>{e.querySelector(".fixed.inset-0.z-50.bg-slate-950")?.remove()})}function zt(e,t){if(e.kind)return`<li class="card p-4 space-y-2">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-brand-500/20 text-brand-300">${{superset:"Super Set",compound:"Compound",circuit:"Circuit"}[e.kind]||e.kind}</span>
      </div>
      <p class="text-sm font-semibold text-slate-100">${q(e.exercises.map(n=>n.exerciseId).join(" + "))}</p>
      <div class="space-y-1.5 pl-3 border-l-2 border-slate-700">
        ${e.exercises.map((n,r)=>`
          <div class="text-xs text-slate-300">${r+1}. ${q(n.exerciseId)} — ${n.reps||"—"} ${n.repUnits||"reps"} · ${n.sets||"—"} sets</div>
        `).join("")}
      </div>
    </li>`;const s=e.tags?.length?e.tags.map(a=>`<span class="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">${a}</span>`).join(""):"";return`<li class="card px-4 py-3">
    ${s?`<div class="flex gap-1.5 mb-1">${s}</div>`:""}
    <p class="text-sm font-semibold text-slate-100">${q(e.exerciseId)}</p>
    <p class="text-xs text-slate-400 num mt-0.5">${e.reps||"—"} ${e.repUnits||"reps"} · ${e.sets||"—"} sets</p>
    ${e.note?`<p class="text-xs text-slate-500 mt-1">${q(e.note)}</p>`:""}
  </li>`}function Rt(e){const t=e.querySelector('[data-region="export-modal"]'),s=e.querySelector('[data-region="export-content"]');if(!t||!s)return;const a=Le(),n=[];m.newExercises.length>0&&n.push({label:"New Exercises (append to exercises.json → exercises[])",json:m.newExercises}),n.push({label:"Program (append to workouts.json → programs[])",json:a}),s.innerHTML=n.map((r,o)=>`
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-xs text-slate-400 font-medium">${r.label}</p>
        <button data-action="copy-json" data-section="${o}" class="text-xs text-brand-400 hover:text-brand-300 transition-colors">Copy</button>
      </div>
      <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono leading-relaxed"><code>${q(JSON.stringify(r.json,null,2))}</code></pre>
    </div>
  `).join(""),s.querySelectorAll('[data-action="copy-json"]').forEach(r=>{r.addEventListener("click",()=>{const o=+r.dataset.section,i=JSON.stringify(n[o].json,null,2);navigator.clipboard?.writeText(i).then(()=>{r.textContent="✓ Copied",setTimeout(()=>{r.textContent="Copy"},2e3)}).catch(()=>{prompt("Copy:",i)})})}),t.classList.remove("hidden")}function Le(){const e={id:m.meta.id,title:m.meta.title};return m.meta.requirements&&(e.requirements=m.meta.requirements),m.meta.description&&(e.description=m.meta.description),m.meta.difficulty&&(e.difficulty=m.meta.difficulty),m.meta.duration&&(e.duration=Number(m.meta.duration)),e.items=m.items.map(t=>{if(t.type==="group"){const a={kind:t.kind,exercises:t.members.map(n=>{const r={exerciseId:n.exerciseId};return n.reps&&(r.reps=n.reps),n.sets&&(r.sets=n.sets),n.repUnits&&n.repUnits!=="reps"&&(r.repUnits=n.repUnits),n.note&&(r.note=n.note),r})};return t.note&&(a.note=t.note),t.tags?.length&&(a.tags=t.tags),a}const s={exerciseId:t.exerciseId};return t.reps&&(s.reps=t.reps),t.sets&&(s.sets=t.sets),t.repUnits&&t.repUnits!=="reps"&&(s.repUnits=t.repUnits),t.note&&(s.note=t.note),t.tags.length&&(s.tags=t.tags),s}),e}let O=[],F=!1,G="";function Dt(e){O=[],F=!1,G="",e.innerHTML=`
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
  `,Ot(e),Ft(e),Jt(e),Yt(e)}function Ot(e){e.querySelector('[data-action="back"]')?.addEventListener("click",()=>w("/studio"))}function Ft(e){const t=e.querySelector('[data-input="edit-search"]'),s=e.querySelector('[data-region="edit-results"]');let a=null;t?.addEventListener("input",()=>{clearTimeout(a),a=setTimeout(async()=>{const n=t.value.trim();if(!n){s.classList.add("hidden");return}const r=await W(n,8);if(r.length===0){s.classList.add("hidden");return}s.classList.remove("hidden"),s.innerHTML=r.map(o=>`
        <li><button data-load-exercise="${o.id}" class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800/60 active:bg-slate-800 transition-colors flex items-center gap-3 touch-manipulation">
          <span class="text-sm font-medium text-slate-100 truncate">${qe(o.name)}</span>
          ${o.hasDemos?'<span class="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-sm">demo</span>':""}
        </button></li>
      `).join(""),s.querySelectorAll("[data-load-exercise]").forEach(o=>{o.addEventListener("click",()=>{const i=r.find(d=>d.id===o.dataset.loadExercise);i&&Gt(e,i.exercise),s.classList.add("hidden"),t.value=""})})},150)})}function Gt(e,t){F=!0,G=t.id,O=JSON.parse(JSON.stringify(t.demos||[])),e.querySelector('[data-region="header-title"]').textContent=`Edit: ${t.name}`,e.querySelector('[data-region="form-label"]').textContent="Editing Exercise";const s=e.querySelector('[data-field="name"]');s.value=t.name,s.dispatchEvent(new Event("input"));const a=t.recommendations||{};e.querySelector('[data-field="reps"]').value=a.reps||"",e.querySelector('[data-field="sets"]').value=a.sets||"",e.querySelector('[data-field="repUnits"]').value=a.repUnits||"reps",e.querySelector('[data-field="note"]').value=a.note||"",re(e.querySelector('[data-region="demos"]'),O),e.querySelector('[data-region="export-section"]')?.classList.remove("hidden")}function Jt(e){const t=e.querySelector('[data-field="name"]'),s=e.querySelector('[data-region="id-preview"]'),a=e.querySelector('[data-region="export-section"]');t?.addEventListener("input",()=>{if(F)s.textContent=`id: ${G} (existing)`;else{const n=t.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,"");s.textContent=n?`id: ${n}`:""}a?.classList.toggle("hidden",!t.value.trim())}),re(e.querySelector('[data-region="demos"]'),O)}function Yt(e){const t=e.querySelector('[data-region="export-modal"]');e.querySelector('[data-action="export"]')?.addEventListener("click",()=>{const s=e.querySelector('[data-field="name"]'),a=s.value.trim();if(!a){s.focus();return}const r={id:F?G:a.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,""),name:a,demos:O.filter(g=>g.url),recommendations:{}},o=e.querySelector('[data-field="reps"]').value,i=e.querySelector('[data-field="sets"]').value,d=e.querySelector('[data-field="repUnits"]').value,l=e.querySelector('[data-field="note"]').value;o&&(r.recommendations.reps=o),i&&(r.recommendations.sets=i),d&&d!=="reps"&&(r.recommendations.repUnits=d),l&&(r.recommendations.note=l);const p=e.querySelector('[data-region="export-content"]'),c=JSON.stringify(r,null,2),u=F?`Replace entry with id "${G}" in exercises.json`:"Append to exercises.json → exercises[]";p.innerHTML=`
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-slate-400">${u}</p>
          <button data-action="copy" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
        </div>
        <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono leading-relaxed"><code>${qe(c)}</code></pre>
      </div>`,p.querySelector('[data-action="copy"]')?.addEventListener("click",g=>{navigator.clipboard?.writeText(c).then(()=>{g.target.textContent="✓ Copied",setTimeout(()=>{g.target.textContent="Copy"},2e3)})}),t.classList.remove("hidden")}),e.querySelector('[data-action="close-export"]')?.addEventListener("click",()=>t?.classList.add("hidden")),t?.addEventListener("click",s=>{s.target===t&&t.classList.add("hidden")})}function qe(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const Vt="https://api.openai.com/v1/chat/completions",Kt="gpt-4o-mini",Ce="action-app:openai-key";function ne(){return localStorage.getItem(Ce)||""}function Wt(e){localStorage.setItem(Ce,e)}function me(){return!!ne()}function Zt(){return{meta:{title:"",id:"",requirements:"",description:""},items:[],newExercises:[]}}const Qt=[{type:"function",function:{name:"search_exercises",description:"Search the exercise library by name, alias, or keyword. Always call this before adding an exercise.",parameters:{type:"object",properties:{query:{type:"string",description:"Search query (exercise name or keyword)"},limit:{type:"number",description:"Max results to return (default 5)"}},required:["query"]}}},{type:"function",function:{name:"add_exercise",description:"Add an exercise to the program timeline.",parameters:{type:"object",properties:{exerciseId:{type:"string",description:"Exercise ID from search results"},reps:{type:"string",description:'Number of reps (e.g. "10", "30", "AMRAP")'},sets:{type:"string",description:'Number of sets (e.g. "3", "4")'},repUnits:{type:"string",description:"Unit type: reps, secs, min, yd"},note:{type:"string",description:"Form cues or notes"},tags:{type:"array",items:{type:"string"},description:"Tags like warmup, stretch"}},required:["exerciseId"]}}},{type:"function",function:{name:"create_exercise",description:"Create a new exercise that does not exist in the library.",parameters:{type:"object",properties:{name:{type:"string",description:"Exercise name"},reps:{type:"string"},sets:{type:"string"},repUnits:{type:"string"},note:{type:"string"}},required:["name"]}}},{type:"function",function:{name:"remove_exercise",description:"Remove an exercise from the program by its position (0-based index).",parameters:{type:"object",properties:{index:{type:"number",description:"0-based position in the timeline"}},required:["index"]}}},{type:"function",function:{name:"group_exercises",description:"Group exercises into a superset, compound set, or circuit.",parameters:{type:"object",properties:{indices:{type:"array",items:{type:"number"},description:"0-based positions to group"},kind:{type:"string",enum:["superset","compound","circuit"]}},required:["indices","kind"]}}},{type:"function",function:{name:"set_metadata",description:"Set program title, requirements, or description.",parameters:{type:"object",properties:{title:{type:"string"},requirements:{type:"string"},description:{type:"string"}}}}},{type:"function",function:{name:"update_exercise",description:"Update reps, sets, note, or tags of an exercise at a given position.",parameters:{type:"object",properties:{index:{type:"number",description:"0-based position"},reps:{type:"string"},sets:{type:"string"},repUnits:{type:"string"},note:{type:"string"},tags:{type:"array",items:{type:"string"}}},required:["index"]}}}];async function Xt(e,t,s){switch(e){case"search_exercises":return(await W(t.query,t.limit||5)).map(n=>({id:n.id,name:n.name,hasDemos:n.hasDemos,reps:n.exercise?.recommendations?.reps,sets:n.exercise?.recommendations?.sets,repUnits:n.exercise?.recommendations?.repUnits}));case"add_exercise":{const a={exerciseId:t.exerciseId};return t.reps&&(a.reps=t.reps),t.sets&&(a.sets=t.sets),t.repUnits&&t.repUnits!=="reps"&&(a.repUnits=t.repUnits),t.note&&(a.note=t.note),t.tags?.length&&(a.tags=t.tags),s.items.push(a),{success:!0,index:s.items.length-1,total:s.items.length}}case"create_exercise":{const a=t.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/,""),n={id:a,name:t.name,demos:[],recommendations:{}};return t.reps&&(n.recommendations.reps=t.reps),t.sets&&(n.recommendations.sets=t.sets),t.repUnits&&(n.recommendations.repUnits=t.repUnits),t.note&&(n.recommendations.note=t.note),s.newExercises.push(n),{success:!0,id:a,name:t.name}}case"remove_exercise":return t.index>=0&&t.index<s.items.length?(s.items.splice(t.index,1),{success:!0,remaining:s.items.length}):{success:!1,error:"Invalid index"};case"group_exercises":{const a=[...t.indices].sort((o,i)=>o-i),n=a.map(o=>s.items[o]).filter(Boolean);if(n.length<2)return{success:!1,error:"Need at least 2 exercises to group"};for(let o=a.length-1;o>=0;o--)s.items.splice(a[o],1);const r={kind:t.kind,exercises:n};return s.items.splice(a[0],0,r),{success:!0,groupIndex:a[0]}}case"set_metadata":return t.title&&(s.meta.title=t.title),t.requirements&&(s.meta.requirements=t.requirements),t.description&&(s.meta.description=t.description),t.title&&(s.meta.id=t.title.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/_+$/,"")),{success:!0,meta:s.meta};case"update_exercise":{const a=s.items[t.index];return a?(t.reps&&(a.reps=t.reps),t.sets&&(a.sets=t.sets),t.repUnits&&(a.repUnits=t.repUnits),t.note&&(a.note=t.note),t.tags&&(a.tags=t.tags),{success:!0}):{success:!1,error:"Invalid index"}}default:return{error:`Unknown tool: ${e}`}}}function es(e){return`You are a fitness programming assistant for the Action App. You help users build workout programs through conversation.

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
`}function ts(e){if(e.items.length===0&&!e.meta.title)return`
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
`),t}async function ss(e,t,s,a,n){const r=ne();if(!r)throw new Error("No API key configured");const i=[{role:"system",content:es(a)+ts(s)},...t.slice(-20),{role:"user",content:e}];let d=await xe(r,i),l=d.choices[0].message,p=0;for(;l.tool_calls&&p<5;){p++;const c=[];for(const u of l.tool_calls){const g=JSON.parse(u.function.arguments),v=await Xt(u.function.name,g,s);c.push({role:"tool",tool_call_id:u.id,content:JSON.stringify(v)}),n?.({type:"tool",name:u.function.name,args:g,result:v})}i.push(l),i.push(...c),d=await xe(r,i),l=d.choices[0].message}return l.content||""}async function xe(e,t){const s=await fetch(Vt,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({model:Kt,messages:t,tools:Qt,tool_choice:"auto",temperature:.3})});if(!s.ok){const a=await s.text();throw new Error(`OpenAI API error (${s.status}): ${a}`)}return s.json()}function as(e){const t={id:e.meta.id||"untitled",title:e.meta.title||"Untitled Program"};return e.meta.requirements&&(t.requirements=e.meta.requirements),t.items=e.items,{program:t,newExercises:e.newExercises}}async function rs(e){const t=Zt(),s=[];let a=!1;const{exercises:n}=await I(),r=n.map(x=>({id:x.id,name:x.name}));e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>w("/studio"));const o=e.querySelector('[data-region="messages"]'),i=e.querySelector('[data-input="message"]'),d=e.querySelector('[data-action="send"]'),l=e.querySelector('[data-action="export"]'),p=e.querySelector('[data-region="settings-modal"]'),c=e.querySelector('[data-region="export-modal"]');e.querySelector('[data-action="settings"]')?.addEventListener("click",()=>{e.querySelector('[data-input="api-key"]').value=ne(),p.classList.remove("hidden")}),e.querySelector('[data-action="close-settings"]')?.addEventListener("click",()=>p.classList.add("hidden")),e.querySelector('[data-action="save-settings"]')?.addEventListener("click",()=>{const x=e.querySelector('[data-input="api-key"]').value.trim();Wt(x),p.classList.add("hidden")}),p?.addEventListener("click",x=>{x.target===p&&p.classList.add("hidden")}),l?.addEventListener("click",()=>$()),e.querySelector('[data-action="close-export"]')?.addEventListener("click",()=>c.classList.add("hidden")),c?.addEventListener("click",x=>{x.target===c&&c.classList.add("hidden")}),me()||p.classList.remove("hidden");async function u(){const x=i.value.trim();if(!x||a)return;if(!me()){p.classList.remove("hidden");return}i.value="",a=!0,d.disabled=!0,g("user",x),s.push({role:"user",content:x});const f=g("assistant","...");f.dataset.loading="true";try{const b=await ss(x,s,t,r,h=>{h.type==="tool"&&v(h)});f.remove(),g("assistant",b),s.push({role:"assistant",content:b}),k()}catch(b){f.remove(),g("error",b.message)}finally{a=!1,d.disabled=!1,i.focus()}}d?.addEventListener("click",u),i?.addEventListener("keydown",x=>{x.key==="Enter"&&!x.shiftKey&&(x.preventDefault(),u())});function g(x,f){const b=o.querySelector(".text-center.py-8");b&&x!=="error"&&b.remove();const h=document.createElement("div");h.className=x==="user"?"flex justify-end":"flex justify-start";const M=document.createElement("div");return x==="user"?M.className="bg-brand-500/20 text-slate-100 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%] text-sm leading-relaxed":x==="error"?M.className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] text-sm leading-relaxed":M.className="bg-slate-800/60 text-slate-200 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] text-sm leading-relaxed",M.textContent=f,h.appendChild(M),o.appendChild(h),o.scrollTop=o.scrollHeight,h}function v(x){const f=document.createElement("div");f.className="flex justify-start";const b={search_exercises:`🔍 Searching: "${x.args.query}"`,add_exercise:`✓ Added: ${x.args.exerciseId}`,create_exercise:`✓ Created: ${x.args.name}`,remove_exercise:`✗ Removed item at position ${x.args.index}`,group_exercises:`⚡ Grouped as ${x.args.kind}`,set_metadata:`📝 Updated: ${x.args.title||x.args.requirements||"metadata"}`,update_exercise:`✏️ Updated item at position ${x.args.index}`}[x.name]||`🔧 ${x.name}`;f.innerHTML=`<span class="text-[11px] text-slate-500 italic px-2 py-1">${B(b)}</span>`,o.appendChild(f),o.scrollTop=o.scrollHeight}function k(){const x=e.querySelector('[data-region="program-preview"]'),f=e.querySelector('[data-region="program-items"]'),b=e.querySelector('[data-region="item-count"]');if(t.items.length===0){x.classList.add("hidden"),l.classList.add("hidden");return}x.classList.remove("hidden"),l.classList.remove("hidden"),b.textContent=`${t.items.length} item${t.items.length!==1?"s":""}`,f.innerHTML=t.items.map((h,M)=>{if(h.kind)return`<div class="text-xs text-slate-400 pl-2 border-l-2 border-brand-500"><span class="text-brand-300 font-medium">${h.kind}</span>: ${h.exercises.map(Me=>Me.exerciseId).join(" + ")}</div>`;const T=h.tags?.length?`<span class="text-brand-300">[${h.tags.join(", ")}]</span> `:"";return`<div class="text-xs text-slate-300">${M+1}. ${T}${B(h.exerciseId)} — ${h.reps||"?"} ${h.repUnits||"reps"} × ${h.sets||"?"}</div>`}).join("")}function $(){const{program:x,newExercises:f}=as(t),b=e.querySelector('[data-region="export-content"]');let h="";if(f.length>0){const T=JSON.stringify(f,null,2);h+=`
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs text-slate-400">New Exercises (append to exercises.json)</p>
            <button data-copy="${B(T)}" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
          </div>
          <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[200px] overflow-y-auto font-mono">${B(T)}</pre>
        </div>
      `}const M=JSON.stringify(x,null,2);h+=`
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-slate-400">Program (append to workouts.json)</p>
          <button data-copy="${B(M)}" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
        </div>
        <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono">${B(M)}</pre>
      </div>
    `,b.innerHTML=h,b.querySelectorAll("[data-copy]").forEach(T=>{T.addEventListener("click",()=>{navigator.clipboard?.writeText(T.dataset.copy).then(()=>{T.textContent="✓ Copied",setTimeout(()=>{T.textContent="Copy"},2e3)})})}),c.classList.remove("hidden")}}function B(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function ns(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>w("/"));const{exercises:t}=await I(),s=e.querySelector('[data-region="count"]');s.textContent=`${t.length} total`;let a=null;const n=l=>{const p=e.querySelector('[data-region="list"]'),c=e.querySelector('[data-region="empty"]');if(l.length===0){p.classList.add("hidden"),c.classList.remove("hidden");return}if(p.classList.remove("hidden"),c.classList.add("hidden"),p.innerHTML=l.map(u=>`
      <li>
        <article class="card overflow-hidden" data-exercise-id="${u.id}">
          <button data-action="expand" data-id="${u.id}" class="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold tracking-tight text-slate-100 truncate">${R(u.name)}</h3>
              <p class="text-xs text-slate-400 mt-0.5 num">${u.demos.length} demo${u.demos.length!==1?"s":""}${u.recommendations?.reps?` · ${u.recommendations.reps} ${u.recommendations.repUnits||"reps"}`:""}</p>
            </div>
            <svg class="w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${a===u.id?"rotate-180":""}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          ${a===u.id?r(u):""}
        </article>
      </li>
    `).join(""),p.querySelectorAll('[data-action="expand"]').forEach(u=>{u.addEventListener("click",()=>{if(a=a===u.dataset.id?null:u.dataset.id,n(l),a){const g=p.querySelector(`[data-demo-slot="${a}"]`),v=l.find(k=>k.id===a);g&&v&&v.demos.length>0&&H(g,v.demos)}})}),a){const u=p.querySelector(`[data-demo-slot="${a}"]`),g=l.find(v=>v.id===a);u&&g&&g.demos.length>0&&H(u,g.demos)}};function r(l){return`
      <div class="px-4 pb-4 pt-1 space-y-3 border-t border-slate-800 bg-slate-900/40 animate-fade-in">
        <div data-demo-slot="${l.id}">
          ${l.demos.length===0?'<p class="text-xs text-slate-500 italic py-2">No demos available</p>':""}
        </div>
        ${l.recommendations?`
          <div class="flex gap-3">
            ${l.recommendations.reps?`<div class="bg-slate-800/50 rounded-lg px-3 py-2 text-center flex-1"><p class="text-lg font-extrabold text-brand-400 num">${R(l.recommendations.reps)}</p><p class="label-meta mt-0.5">${R(l.recommendations.repUnits||"reps")}</p></div>`:""}
            ${l.recommendations.sets?`<div class="bg-slate-800/50 rounded-lg px-3 py-2 text-center flex-1"><p class="text-lg font-extrabold text-brand-400 num">${R(l.recommendations.sets)}</p><p class="label-meta mt-0.5">sets</p></div>`:""}
          </div>
        `:""}
        ${l.recommendations?.note?`<div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2 rounded-r-lg"><p class="text-xs text-slate-300 leading-relaxed">${R(l.recommendations.note)}</p></div>`:""}
        ${l.aliases?.length?`<p class="text-[11px] text-slate-500">Also known as: ${l.aliases.join(", ")}</p>`:""}
        <a href="#/exercise/${l.id}" class="inline-block text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">View full page →</a>
      </div>
    `}const o=[...t].sort((l,p)=>l.name.localeCompare(p.name));n(o);const i=e.querySelector('[data-input="search"]');let d=null;i?.addEventListener("input",()=>{clearTimeout(d),d=setTimeout(async()=>{const l=i.value.trim();if(!l){n(o),s.textContent=`${o.length} total`;return}const c=(await W(l,50)).map(u=>u.exercise);n(c),s.textContent=`${c.length} result${c.length!==1?"s":""}`},150)})}function R(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function os(e,t){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>window.history.back());const s=await Ue(t);if(!s){ls(e,t);return}const{programs:a}=await _(),n=ds(a,t);is(e,s,n)}function is(e,t,s){const a=t.demos||[],n=t.recommendations||{},r=t.aliases||[];if(e.innerHTML=`
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
        ${r.length>0?`
        <section class="space-y-2">
          <h2 class="eyebrow">Also known as</h2>
          <div class="flex flex-wrap gap-2">
            ${r.map(o=>`<span class="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">${P(o)}</span>`).join("")}
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>window.history.back()),e.querySelectorAll("[data-program-id]").forEach(o=>{o.addEventListener("click",()=>w(`/program/${o.dataset.programId}`))}),a.length>0){const o=e.querySelector('[data-region="demos"]');H(o,a)}}function ls(e,t){e.innerHTML=`
    <div class="flex-1 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p class="text-6xl mb-4">🤷</p>
      <h1 class="text-2xl font-bold mb-2">Exercise not found</h1>
      <p class="text-slate-400 mb-6 text-sm font-mono">${P(t)}</p>
      <a href="#/exercises" class="btn-primary">Browse exercises</a>
    </div>
  `}function ds(e,t){return e.filter(s=>{for(const a of s.items||[]){if(a.exerciseId===t)return!0;if(a.exercises){for(const n of a.exercises)if(n.exerciseId===t)return!0}}return!1})}function P(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function cs(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>w("/"));const[{programs:t},{plans:s}]=await Promise.all([_(),we()]),a=t.map(c=>({id:c.id,title:c.title,requirements:c.requirements||"",itemCount:c.items?.length||c.exercises?.length||0,tokens:J(c.title).concat(J(c.requirements||"")).concat(J(c.id.replace(/[-_]/g," "))),program:c})),n=new Map;for(const c of s)for(const u of c.subPlans||[])for(const g of u.programs||[])n.set(g,`${c.name} · ${u.name}`);const r=e.querySelector('[data-region="results"]'),o=e.querySelector('[data-region="empty"]'),i=e.querySelector('[data-region="initial"]');function d(c){if(c===null){r.classList.add("hidden"),o.classList.add("hidden"),i.classList.remove("hidden");return}if(i.classList.add("hidden"),c.length===0){r.classList.add("hidden"),o.classList.remove("hidden");return}o.classList.add("hidden"),r.classList.remove("hidden"),r.innerHTML=c.map(u=>ps(u,n.get(u.id))).join(""),r.querySelectorAll("[data-program-id]").forEach(u=>{u.addEventListener("click",()=>w(`/program/${u.dataset.programId}`))})}const l=e.querySelector('[data-input="search"]');let p=null;l?.addEventListener("input",()=>{clearTimeout(p),p=setTimeout(()=>{const c=l.value.trim();if(!c){d(null);return}const u=J(c),g=a.map(v=>({...v,score:us(v.tokens,u)})).filter(v=>v.score>0).sort((v,k)=>k.score-v.score);d(g)},150)}),d(null)}function ps(e,t){return`
    <button
      data-program-id="${e.id}"
      class="w-full card p-4 text-left active:scale-[0.98] transition-transform"
    >
      <div class="flex items-center gap-3">
        <div class="flex-1 min-w-0">
          ${t?`<p class="text-[10px] font-medium uppercase tracking-wider text-slate-500 mb-1">${te(t)}</p>`:""}
          <h3 class="font-semibold tracking-tight truncate">${te(e.title)}</h3>
          <p class="text-xs text-slate-400 mt-1 truncate">
            <span class="num">${e.itemCount}</span> exercise${e.itemCount!==1?"s":""}${e.requirements?` · ${te(e.requirements)}`:""}
          </p>
        </div>
        <svg class="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </button>
  `}function J(e){return e?e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().split(/[^a-z0-9]+/).filter(t=>t.length>0):[]}function us(e,t){let s=0;for(const a of t){let n=0;for(const r of e)r===a?n=Math.max(n,10):r.startsWith(a)?n=Math.max(n,7):r.includes(a)&&(n=Math.max(n,4));if(n===0)return 0;s+=n}return s}function te(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const C=document.getElementById("app");j("/",()=>ze(C));j("/programs",()=>Fe(C));j("/program/:id",({id:e})=>ct(C,e));j("/exercises",()=>ns(C));j("/exercise/:id",({id:e})=>os(C,e));j("/search",()=>cs(C));const ms=["localhost","127.0.0.1"].includes(window.location.hostname);ms&&(j("/studio",()=>xt(C)),j("/studio/program",()=>Mt(C)),j("/studio/exercise",()=>Dt(C)),j("/studio/ai",()=>rs(C)));je(e=>{C.innerHTML=`
    <div class="flex-1 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p class="text-6xl mb-4">🤔</p>
      <h1 class="text-2xl font-bold mb-2">Page not found</h1>
      <p class="text-slate-400 mb-6 text-sm">${e}</p>
      <a href="#/" class="btn-primary">Back home</a>
    </div>
  `});Te();console.log("🚀 Action App V2 ready");
