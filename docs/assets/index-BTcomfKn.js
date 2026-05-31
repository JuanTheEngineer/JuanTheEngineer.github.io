(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function s(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(n){if(n.ep)return;n.ep=!0;const a=s(n);fetch(n.href,a)}})();const ue=[];let X=null;function M(e,t){const s=[],r=new RegExp("^"+e.replace(/:([^/]+)/g,(n,a)=>(s.push(a),"([^/]+)"))+"$");ue.push({pattern:e,regex:r,keys:s,handler:t})}function Se(e){X=e}function b(e){window.location.hash=e.startsWith("#")?e:`#${e}`}function ae(){const e=window.location.hash.slice(1)||"/";for(const t of ue){const s=e.match(t.regex);if(s){const r={};t.keys.forEach((n,a)=>{r[n]=decodeURIComponent(s[a+1])}),t.handler(r);return}}X&&X(e)}function Ee(){window.addEventListener("hashchange",ae),window.location.hash?ae():window.location.hash="#/"}const pe="action-app:progress",me="action-app:recent-programs",Le=5;function ee(){try{return JSON.parse(localStorage.getItem(pe)||"{}")}catch{return{}}}function xe(e){try{localStorage.setItem(pe,JSON.stringify(e))}catch{}}function fe(e){const t=ee();return new Set(t[e]||[])}function qe(e,t){const s=ee(),r=new Set(s[e]||[]);return r.has(t)?r.delete(t):r.add(t),s[e]=Array.from(r),xe(s),r}function Ce(e){const t=ee();delete t[e],xe(t)}function ge(){try{const e=JSON.parse(localStorage.getItem(me)||"[]");return Array.isArray(e)?e:[]}catch{return[]}}function Me(e){if(e)try{const t=ge().filter(s=>s.id!==e);t.unshift({id:e,visitedAt:Date.now()}),localStorage.setItem(me,JSON.stringify(t.slice(0,Le)))}catch{}}const w={workouts:null,exercises:null,plans:null,exerciseMap:null};async function A(){if(w.workouts)return w.workouts;const e=await fetch("./workouts.json");if(!e.ok)throw new Error(`Failed to load workouts.json: ${e.status}`);return w.workouts=await e.json(),w.workouts}async function H(){if(w.exercises)return w.exercises;const e=await fetch("./exercises.json");if(!e.ok)throw new Error(`Failed to load exercises.json: ${e.status}`);return w.exercises=await e.json(),w.exerciseMap=new Map(w.exercises.exercises.map(t=>[t.id,t])),w.exercises}async function ve(){if(w.plans)return w.plans;const e=await fetch("./plans.json");if(!e.ok)throw new Error(`Failed to load plans.json: ${e.status}`);return w.plans=await e.json(),w.plans}async function je(e){return(await A()).programs.find(s=>s.id===e)||null}async function Te(e){return await H(),w.exerciseMap?.get(e)||null}async function Pe(e){const[t]=await Promise.all([je(e),H()]);if(!t)return null;const s=a=>{const o=w.exerciseMap.get(a.exerciseId)||null;return{kind:"single",exerciseId:a.exerciseId,exercise:o,name:o?.name||a.exerciseId,reps:a.reps??o?.recommendations?.reps,sets:a.sets??o?.recommendations?.sets,repUnits:a.repUnits??o?.recommendations?.repUnits,note:a.note??o?.recommendations?.note,tags:a.tags||[]}},r=a=>({kind:a.kind,note:a.note,tags:a.tags||[],exercises:a.exercises.map(o=>{const l=w.exerciseMap.get(o.exerciseId)||null;return{exerciseId:o.exerciseId,exercise:l,name:l?.name||o.exerciseId,reps:o.reps??l?.recommendations?.reps,sets:o.sets??l?.recommendations?.sets,repUnits:o.repUnits??l?.recommendations?.repUnits,note:o.note??l?.recommendations?.note}})}),n=(t.items||[]).map(a=>a.kind?r(a):s(a));return{...t,resolvedItems:n}}function Be(){return["localhost","127.0.0.1"].includes(window.location.hostname)}function Ne(e){e.innerHTML=`
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
          ${Be()?`<button
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
    </div>
  `,e.querySelector('[data-action="create"]')?.addEventListener("click",()=>b("/studio")),e.querySelector('[data-action="search"]')?.addEventListener("click",()=>b("/search")),e.querySelector('[data-action="programs"]')?.addEventListener("click",()=>b("/programs")),e.querySelector('[data-action="exercises"]')?.addEventListener("click",()=>b("/exercises")),Ie(e).catch(t=>console.warn("[recent] skipped",t))}async function Ie(e){const t=ge();if(t.length===0)return;const s=e.querySelector('[data-region="recent"]');if(!s)return;const{programs:r}=await A(),n=new Map(r.map(o=>[o.id,o])),a=t.map(o=>({...o,program:n.get(o.id)})).filter(o=>o.program).slice(0,3);a.length!==0&&(s.classList.remove("hidden"),s.innerHTML=`
    <div class="flex items-baseline justify-between">
      <h2 class="eyebrow">Pick up where you left off</h2>
      ${a.length===3&&t.length>3?'<button data-action="all-recent" class="text-xs text-slate-400 hover:text-brand-400 transition-colors">All</button>':""}
    </div>
    <ul class="space-y-2">
      ${a.map(o=>Ae(o.program)).join("")}
    </ul>
  `,s.querySelectorAll("[data-program-id]").forEach(o=>{o.addEventListener("click",()=>b(`/program/${o.dataset.programId}`))}),s.querySelector('[data-action="all-recent"]')?.addEventListener("click",()=>b("/programs")))}function Ae(e){const t=e.items?.length||e.exercises?.length||0,s=fe(e.id).size,r=t>0?Math.round(s/t*100):0,n=s===0?"Not started":s>=t?"Complete":`${s} of ${t} done`;return`
    <li>
      <button
        data-program-id="${e.id}"
        class="w-full card p-4 text-left active:scale-[0.98] transition-transform"
      >
        <div class="flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold tracking-tight truncate">${He(e.title)}</h3>
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
  `}function He(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Ue(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>b("/"));try{const[t,s]=await Promise.all([A(),ve()]);ze(e,t.programs,s.plans)}catch(t){De(e,t)}}function ze(e,t,s){const r=new Map(t.map(a=>[a.id,a])),n=[];for(const a of s)for(const o of a.subPlans||[]){const l=(o.programs||[]).map(d=>r.get(d)).filter(Boolean);l.length!==0&&n.push({category:a.name,title:o.name,description:o.description,programs:l})}e.innerHTML=`
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
            ${a.programs.map(l=>Re(l)).join("")}
          </ul>
        </section>
      `).join("")}
    </main>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>b("/")),e.querySelectorAll("[data-program-id]").forEach(a=>{a.addEventListener("click",()=>{b(`/program/${a.dataset.programId}`)})})}function Re(e){const t=e.items?.length||e.exercises?.length||0;return`
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
  `}function De(e,t){e.innerHTML=`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold text-red-400 mb-2">Couldn't load programs</h2>
        <p class="text-sm text-slate-400">${t?.message||t}</p>
      </div>
    </main>
  `}function be(e){if(!e)return null;const t=[/youtube\.com\/watch\?v=([^&]+)/,/youtube\.com\/shorts\/([^?&/]+)/,/youtube\.com\/embed\/([^?&/]+)/,/youtu\.be\/([^?&/]+)/];for(const s of t){const r=e.match(s);if(r)return r[1]}return null}function Fe(e,t="hqdefault"){const s=be(e);return s?`https://i.ytimg.com/vi/${s}/${t}.jpg`:null}function Oe(e,t={}){const s=be(e);if(!s)return null;const r=new URLSearchParams({autoplay:"1",rel:"0",modestbranding:"1",playsinline:"1"});return t.startTime&&r.set("start",String(Math.floor(t.startTime))),t.endTime&&r.set("end",String(Math.floor(t.endTime))),`https://www.youtube.com/embed/${s}?${r.toString()}`}function he(e,t="w_800,q_auto,f_auto"){return!e||!e.includes("cloudinary.com")?e:e.replace("/upload/",`/upload/${t}/`)}function _e(e){if(!e||!e.type)return"unknown";if(["youtube","tiktok","vimeo"].includes(e.type))return"embed";const t=e.mediaType==="video"||["mp4","webm","mov"].includes(e.format);return e.format==="gif"?"image":t?"video":"image"}function Ge(e,t,s={}){if(!t){e.innerHTML='<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No media</div>';return}const r=_e(t),n=s.className||"w-full max-h-[60vh] object-contain rounded-2xl bg-slate-800";switch(e.classList.add("animate-fade-in"),r){case"image":Je(e,t,n,s.onError);break;case"video":Ye(e,t,n,s.autoplay,s.onError);break;case"embed":Ve(e,t,n,s.onEmbedPlay);break;default:e.innerHTML=`<div class="${n} flex items-center justify-center text-slate-500 text-sm">Unsupported media type</div>`}}function Je(e,t,s,r){const n=t.type==="cloudinary"?he(t.url,"w_800,q_auto,f_auto"):t.url;e.innerHTML=`
    <img
      src="${n}"
      alt="Exercise demonstration"
      class="${s}"
      loading="lazy"
      decoding="async"
    />
  `,r&&e.querySelector("img")?.addEventListener("error",()=>r(),{once:!0})}function Ye(e,t,s,r=!0,n){const a=t.type==="cloudinary"?he(t.url,"w_800,q_auto,f_auto"):t.url,o=t.startTime?`#t=${t.startTime}`:"";e.innerHTML=`
    <video
      src="${a}${o}"
      class="${s}"
      ${r?"autoplay":""}
      loop
      muted
      playsinline
      preload="metadata"
    ></video>
  `,n&&e.querySelector("video")?.addEventListener("error",()=>n(),{once:!0})}function Ve(e,t,s,r){const o=`${(t.url||"").includes("/shorts/")?"aspect-9/16 max-h-[70vh] mx-auto":"aspect-video"} w-full rounded-2xl overflow-hidden bg-slate-900`,l=t.type==="youtube"?Fe(t.url,"hqdefault"):null;e.innerHTML=`
    <div class="${o} relative">
      <button
        class="group absolute inset-0 flex items-center justify-center overflow-hidden touch-manipulation"
        data-action="play-embed"
        aria-label="Play video"
      >
        ${l?`<img src="${l}" alt="Video thumbnail" class="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />`:""}
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
  `;const d=e.querySelector('[data-action="play-embed"]');d&&d.addEventListener("click",()=>{const i=t.type==="youtube"?Oe(t.url,{startTime:t.startTime,endTime:t.endTime}):t.url;e.innerHTML=`
        <div class="${o} relative">
          <iframe
            src="${i}"
            class="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      `,r?.()},{once:!0})}function B(e,t,s={}){let r=(t||[]).filter(Boolean);if(r.length===0){e.innerHTML='<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No demos available</div>';return}r=We(r);let n=re(s.startIndex??0,r.length);e.innerHTML=`
    <div class="relative">
      <div
        data-region="track"
        class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 gap-3 pb-1"
        style="scroll-snap-stop: always;"
      ></div>
      ${r.length>1?`
        <div class="flex items-center justify-center gap-1.5 mt-3" data-region="dots"></div>
        <p data-region="caption" class="text-xs text-slate-400 text-center px-2 mt-2 leading-relaxed min-h-4"></p>
      `:""}
    </div>
  `;const a=e.querySelector('[data-region="track"]'),o=e.querySelector('[data-region="dots"]'),l=e.querySelector('[data-region="caption"]');a.style.scrollbarWidth="none",r.forEach((g,y)=>{const T=document.createElement("div");T.className="shrink-0 w-full snap-center",T.dataset.slideIndex=String(y),a.appendChild(T)});const d=new Set,i=new Set,p=g=>{if(d.has(g))return;const y=a.children[g];if(!y)return;const T=r[g];Ge(y,T,{onError:()=>m(g),onEmbedPlay:()=>i.add(g)}),d.add(g)},c=g=>{!i.has(g)||!a.children[g]||(i.delete(g),d.delete(g),p(g))},m=g=>{r.splice(g,1),x()},x=()=>{if(r.length===0){e.innerHTML='<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No demos available</div>';return}n=re(n,r.length),B(e,r,{startIndex:n})},v=()=>{o&&(o.innerHTML=r.map((g,y)=>`
      <button
        data-dot-index="${y}"
        aria-label="Go to demo ${y+1}"
        class="p-1.5 -m-1.5 group touch-manipulation"
      >
        <span class="block w-1 h-1 rounded-full transition-colors
          ${y===n?"bg-brand-400":"bg-slate-600 group-hover:bg-slate-500"}"
        ></span>
      </button>
    `).join(""),o.querySelectorAll("[data-dot-index]").forEach(g=>{g.addEventListener("click",()=>E(Number(g.dataset.dotIndex)))}))},h=()=>{l&&(l.textContent=Ke(r[n]))};function E(g){const y=a.children[g];y&&a.scrollTo({left:y.offsetLeft-a.offsetLeft,behavior:"smooth"})}let k=!1;const Y=()=>{k||(k=!0,requestAnimationFrame(()=>{k=!1;const g=a.children[0]?.offsetWidth||1,y=Math.round(a.scrollLeft/g);if(y!==n&&y>=0&&y<r.length){const T=n;n=y,c(T),v(),h(),p(n),n+1<r.length&&p(n+1),n-1>=0&&p(n-1)}}))};a.addEventListener("scroll",Y,{passive:!0}),p(n),n+1<r.length&&p(n+1),n-1>=0&&p(n-1),requestAnimationFrame(()=>{const g=a.children[n];g&&(a.scrollLeft=g.offsetLeft-a.offsetLeft)}),v(),h()}function re(e,t){return Math.max(0,Math.min(t-1,e))}function We(e){const t={cloudinary:0,youtube:1,vimeo:2,tiktok:2,url:3,local:4};return[...e].sort((s,r)=>s.isPrimary&&!r.isPrimary?-1:r.isPrimary&&!s.isPrimary?1:(t[s.type]??99)-(t[r.type]??99))}function Ke(e){const t={cloudinary:e.format==="mp4"?"Original video":"Original",youtube:"YouTube",tiktok:"TikTok",vimeo:"Vimeo",local:"Local",url:"External"}[e.type]||e.type;return e.notes?`${t} · ${e.notes}`:t}function Ze(e,t){const s=document.createElement("article");s.className=`card overflow-hidden transition-all ${t.isCompleted?"opacity-60":""}`,s.dataset.itemIndex=String(t.index);const r=e.exercise?.demos||[],a=`${t.index+1}. ${e.name}`;if(s.innerHTML=`
    <div class="flex items-stretch">
      <button
        data-action="toggle"
        class="flex-1 min-w-0 px-4 py-4 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation"
      >
        <div class="flex-1 min-w-0">
          ${Xe(e.tags)}
          <h3 class="font-semibold tracking-tight leading-tight ${t.isCompleted?"line-through text-slate-500":"text-slate-100"}">
            ${N(a)}
          </h3>
          <p class="text-sm text-slate-400 mt-1 num">
            ${Qe(e)}
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
  `,t.isExpanded&&r.length>0){const o=s.querySelector("[data-media-slot]");o&&B(o,r)}return s.querySelector('[data-action="toggle"]')?.addEventListener("click",()=>{t.onToggle?.(t.index)}),s.querySelector('[data-action="complete"]')?.addEventListener("click",o=>{o.stopPropagation(),t.onComplete?.(t.index)}),s}function Qe(e){const t=e.reps||"—",s=e.sets||"—";return`${t} · ${s} sets`}function Xe(e=[]){return e.length?`
    <div class="flex gap-1.5 mb-1.5">
      ${e.map(t=>`
        <span class="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">${N(t)}</span>
      `).join("")}
    </div>
  `:""}function N(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const et={superset:"Super Set",compound:"Compound",circuit:"Circuit"},tt={superset:"Alternate between exercises with no rest",compound:"Perform back-to-back as one set",circuit:"Rotate through all exercises"};function st(e,t){const s=document.createElement("article");s.className=`card overflow-hidden transition-all ${t.isCompleted?"opacity-60":""}`,s.dataset.itemIndex=String(t.index);const r=et[e.kind]||e.kind,n=tt[e.kind]||"",a=e.exercises.length,o=t.index+1,l=e.exercises.map(i=>i.name).join(" + "),d=`${o}. ${l}`;return s.innerHTML=`
    <div class="flex items-stretch">
      <button
        data-action="toggle"
        class="flex-1 min-w-0 px-4 py-4 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5 mb-1.5">
            <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300">${r}</span>
            ${(e.tags||[]).map(i=>`
              <span class="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">${j(i)}</span>
            `).join("")}
          </div>
          <h3 class="font-semibold tracking-tight leading-tight ${t.isCompleted?"line-through text-slate-500":"text-slate-100"}">
            ${j(d)}
          </h3>
          <p class="text-sm text-slate-400 mt-1 num">${a} exercises</p>
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
      <div class="px-4 pb-4 space-y-3">
        ${n?`<p class="text-xs text-slate-500 italic">${n}</p>`:""}
        ${e.note?`
          <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
            <p class="text-sm text-slate-300 leading-relaxed">${j(e.note)}</p>
          </div>
        `:""}
        <div class="space-y-2">
          ${e.exercises.map((i,p)=>at(i,p,o)).join("")}
        </div>
      </div>
    </div>
  `,t.isExpanded&&e.exercises.forEach((i,p)=>{const c=s.querySelector(`[data-member-media="${p}"]`),m=i.exercise?.demos||[];c&&m.length>0&&B(c,m)}),s.querySelector('[data-action="toggle"]')?.addEventListener("click",()=>{t.onToggle?.(t.index)}),s.querySelector('[data-action="complete"]')?.addEventListener("click",i=>{i.stopPropagation(),t.onComplete?.(t.index)}),s}function at(e,t,s){const r=String.fromCharCode(97+t);return`
    <div class="bg-slate-800/40 rounded-xl p-3 space-y-3">
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0 num">${s}${r}</span>
        <h4 class="font-medium text-slate-100 text-sm flex-1 leading-tight tracking-tight">${j(e.name)}</h4>
      </div>
      <div data-member-media="${t}"></div>
      <div class="flex gap-2">
        <div class="flex-1 bg-slate-900/60 rounded-lg p-2 text-center">
          <p class="text-lg font-extrabold text-brand-400 leading-none num tracking-tight">${j(e.reps||"—")}</p>
          <p class="label-meta mt-1">${j(e.repUnits||"reps")}</p>
        </div>
        <div class="flex-1 bg-slate-900/60 rounded-lg p-2 text-center">
          <p class="text-lg font-extrabold text-brand-400 leading-none num tracking-tight">${j(e.sets||"—")}</p>
          <p class="label-meta mt-1">sets</p>
        </div>
      </div>
      ${e.note?`
        <p class="text-xs text-slate-400 leading-relaxed px-1">${j(e.note)}</p>
      `:""}
    </div>
  `}function j(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const ne=["Nice work!","Killer moves!","Awesome job!","Crushed it!","You did it!","Beast mode!","On fire!","Way to go!"];let oe=0;function rt(){const e=Date.now();if(e-oe<5e3)return;oe=e;const t=ne[Math.floor(Math.random()*ne.length)],s=document.createElement("div");s.className="celebration-flash";const r=document.createElement("div");r.className="celebration-text",r.textContent=t,document.body.appendChild(s),document.body.appendChild(r),setTimeout(()=>s.remove(),700),setTimeout(()=>r.remove(),3100)}async function nt(e,t){e.innerHTML=G(`
    <main class="flex-1 px-6 pb-24 flex items-center justify-center">
      <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </main>
  `),J(e);try{const s=await Pe(t);if(!s){lt(e,t);return}Me(s.id),ot(e,s)}catch(s){it(e,s)}}function ot(e,t){const s=fe(t.id),r=t.resolvedItems.length;let n=-1;e.innerHTML=G(`
    <div class="sticky top-15 z-10 px-6 pt-2 pb-3 bg-slate-950/85 backdrop-blur-md border-b border-slate-900">
      <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div data-region="progress-bar" class="h-full bg-linear-to-r from-brand-500 to-brand-400 transition-all duration-500" style="width: ${s.size/r*100}%"></div>
      </div>
      <p class="text-[11px] text-slate-500 mt-1.5 font-medium num">
        <span data-region="completed-count">${s.size}</span> of ${r} complete
      </p>
    </div>

    <header class="px-6 pt-4 pb-3">
      <h1 class="h-page">${z(t.title)}</h1>
      ${t.requirements?`
        <p class="text-sm text-slate-400 mt-1.5">${z(t.requirements)}</p>
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
  `,t.title),J(e);const a=e.querySelector('[data-region="items"]'),o=e.querySelector('[data-region="actions"]'),l=()=>{a.innerHTML="",t.resolvedItems.forEach((p,c)=>{const m=document.createElement("li"),x={index:c,isExpanded:c===n,isCompleted:s.has(c),onToggle:h=>{n=n===h?-1:h,i(),n===h&&requestAnimationFrame(()=>{const E=a.querySelector(`[data-item-index="${h}"]`);if(E){const k=window.scrollY+E.getBoundingClientRect().top-130;window.scrollTo({top:Math.max(0,k),behavior:"smooth"})}})},onComplete:h=>{const E=s.size===r,k=qe(t.id,h);s.clear(),k.forEach(Y=>s.add(Y)),k.has(h)&&n===h&&(n=-1),i(),!E&&s.size===r&&setTimeout(rt,250)}},v=p.kind==="single"?Ze(p,x):st(p,x);m.appendChild(v),a.appendChild(m)})},d=()=>{const p=e.querySelector('[data-region="progress-bar"]');p&&(p.style.width=`${s.size/r*100}%`);const c=e.querySelector('[data-region="completed-count"]');c&&(c.textContent=String(s.size)),o.classList.toggle("hidden",s.size===0)},i=()=>{l(),d()};i(),e.querySelector('[data-action="reset"]')?.addEventListener("click",()=>{confirm("Reset progress for this program?")&&(Ce(t.id),s.clear(),i())}),e.querySelector('[data-action="share"]')?.addEventListener("click",()=>{const p=window.location.href;navigator.share?navigator.share({title:t.title,text:`Check out: ${t.title}`,url:p}).catch(()=>{}):navigator.clipboard?.writeText(p).then(()=>alert("Link copied!")).catch(()=>prompt("Copy:",p))})}function G(e,t="Program"){return`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400 truncate">${z(t)}</span>
      </header>
      ${e}
    </div>
  `}function J(e){e.querySelector('[data-action="back"]')?.addEventListener("click",()=>b("/programs"))}function lt(e,t){e.innerHTML=G(`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold mb-2">Program not found</h2>
        <p class="text-sm text-slate-400">No program with id <code class="text-slate-300">${z(t)}</code>.</p>
      </div>
    </main>
  `),J(e)}function it(e,t){e.innerHTML=G(`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold text-red-400 mb-2">Couldn't load program</h2>
        <p class="text-sm text-slate-400">${z(t?.message||String(t))}</p>
      </div>
    </main>
  `),J(e)}function z(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function dt(e){e.innerHTML=`
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
        </div>
      </main>
    </div>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>b("/")),e.querySelector('[data-action="new-program"]')?.addEventListener("click",()=>b("/studio/program")),e.querySelector('[data-action="new-exercise"]')?.addEventListener("click",()=>b("/studio/exercise"))}let I=null;async function ct(){if(I)return I;const{exercises:e}=await H();return I=e.map(t=>({id:t.id,name:t.name,hasDemos:(t.demos||[]).length>0,tokens:P(t.name).concat((t.aliases||[]).flatMap(s=>P(s))).concat(P(t.id.replace(/[-_]/g," "))),exercise:t})),I}function ut(e){I&&I.push({id:e.id,name:e.name,hasDemos:(e.demos||[]).length>0,tokens:P(e.name).concat((e.aliases||[]).flatMap(t=>P(t))).concat(P(e.id.replace(/[-_]/g," "))),exercise:e})}async function te(e,t=10){const s=await ct();if(!e||!e.trim())return s.slice(0,t);const r=P(e);return s.map(n=>({...n,score:mt(n.tokens,r)})).filter(n=>n.score>0).sort((n,a)=>a.score-n.score).slice(0,t)}function pt(e,t={}){e.innerHTML=`
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
  `;const s=e.querySelector('[data-input="search"]'),r=e.querySelector('[data-region="results"]'),n=e.querySelector('[data-region="empty"]'),a=e.querySelector('[data-action="create-new"]');let o=null;const l=(i,p)=>{if(!p||!p.trim()){r.classList.add("hidden"),n.classList.add("hidden"),a.classList.add("hidden");return}if(a.classList.remove("hidden"),i.length===0){r.classList.add("hidden"),n.classList.remove("hidden");return}n.classList.add("hidden"),r.classList.remove("hidden"),r.innerHTML=i.map(c=>`
      <li>
        <button
          data-exercise-id="${c.id}"
          class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800/60 active:bg-slate-800 transition-colors flex items-center gap-3 touch-manipulation"
        >
          <span class="flex-1 min-w-0">
            <span class="text-sm font-medium text-slate-100 block truncate">${xt(c.name)}</span>
          </span>
          ${c.hasDemos?`
            <span class="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-sm">demo</span>
          `:""}
        </button>
      </li>
    `).join(""),r.querySelectorAll("[data-exercise-id]").forEach(c=>{c.addEventListener("click",()=>{const m=i.find(x=>x.id===c.dataset.exerciseId);m&&t.onSelect?.(m.exercise)})})},d=async()=>{const i=s.value,p=await te(i);l(p,i)};s.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(d,150)}),l([],""),a?.addEventListener("click",()=>t.onCreateNew?.(s.value.trim()))}function P(e){return e?e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().split(/[^a-z0-9]+/).filter(t=>t.length>0):[]}function mt(e,t){let s=0;for(const r of t){let n=0;for(const a of e)a===r?n=Math.max(n,10):a.startsWith(r)?n=Math.max(n,7):a.includes(r)&&(n=Math.max(n,4));if(n===0)return 0;s+=n}return s}function xt(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const V=[{value:"youtube",label:"YouTube",fields:["url","startTime","endTime","notes"]},{value:"cloudinary",label:"Cloudinary",fields:["url","startTime","endTime","notes"]},{value:"local",label:"Local file",fields:["url","notes"]},{value:"url",label:"URL (external)",fields:["url","notes"]},{value:"tiktok",label:"TikTok",fields:["url","notes"]},{value:"vimeo",label:"Vimeo",fields:["url","startTime","endTime","notes"]}];function se(e,t){s();function s(){e.innerHTML=`
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
    `,n()}function r(a,o){const d=(V.find(p=>p.value===a.type)||V[0]).fields.includes("startTime"),i=a.type==="youtube"?ft(a.url):null;return`
      <div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 space-y-2.5" data-demo-index="${o}">
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-slate-500 font-bold num">#${o+1}</span>
          <select data-demo-field="type" data-index="${o}" class="flex-1 bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-brand-500">
            ${V.map(p=>`<option value="${p.value}"${a.type===p.value?" selected":""}>${p.label}</option>`).join("")}
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
          <input data-demo-field="url" data-index="${o}" value="${ie(a.url||"")}" placeholder="https://..." class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500 font-mono"/>
        </div>
        ${i?`<img src="${i}" alt="Thumbnail" class="w-full h-20 object-cover rounded-lg bg-slate-900"/>`:""}
        ${d?`
          <div class="grid grid-cols-2 gap-2">
            <div><label class="text-[10px] text-slate-500 block mb-0.5">Start (sec)</label>
              <input data-demo-field="startTime" data-index="${o}" type="number" min="0" value="${a.startTime||0}" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-brand-500 num"/></div>
            <div><label class="text-[10px] text-slate-500 block mb-0.5">End (sec)</label>
              <input data-demo-field="endTime" data-index="${o}" type="number" min="0" value="${a.endTime||0}" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-brand-500 num"/></div>
          </div>
        `:""}
        <div>
          <input data-demo-field="notes" data-index="${o}" value="${ie(a.notes||"")}" placeholder="Notes (optional)" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/>
        </div>
      </div>
    `}function n(){e.querySelector('[data-action="add-demo"]')?.addEventListener("click",()=>{t.push({type:"youtube",mediaType:"video",format:"youtube",url:"",startTime:0,endTime:0,isPrimary:t.length===0,notes:""}),s()}),e.querySelectorAll('[data-action="remove-demo"]').forEach(a=>{a.addEventListener("click",()=>{const o=+a.dataset.index,l=t[o].isPrimary;t.splice(o,1),l&&t.length>0&&(t[0].isPrimary=!0),s()})}),e.querySelectorAll('input[name="primary-demo"]').forEach(a=>{a.addEventListener("change",()=>{const o=+a.dataset.index;t.forEach((l,d)=>{l.isPrimary=d===o})})}),e.querySelectorAll('[data-demo-field="type"]').forEach(a=>{a.addEventListener("change",()=>{const o=+a.dataset.index;t[o].type=a.value,t[o].format=a.value==="youtube"?"youtube":a.value==="cloudinary"?le(t[o].url):a.value,t[o].mediaType="video",s()})}),e.querySelectorAll("[data-demo-field]").forEach(a=>{if(a.tagName==="SELECT")return;const o=()=>{const l=+a.dataset.index,d=a.dataset.demoField;d==="startTime"||d==="endTime"?t[l][d]=Number(a.value)||0:t[l][d]=a.value,d==="url"&&t[l].type==="cloudinary"&&(t[l].format=le(a.value))};a.addEventListener("input",o),a.addEventListener("change",o)})}}function ft(e){if(!e)return null;const t=e.match(/(?:v=|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);return t?`https://img.youtube.com/vi/${t[1]}/hqdefault.jpg`:null}function le(e){return e&&/\.(mp4|webm|mov)(\?|$)/i.test(e)?"mp4":"gif"}function ie(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function gt(e,t,s){const{items:r}=t;if(r.length===0){e.innerHTML="";return}e.innerHTML=r.map((n,a)=>n.type==="group"?bt(n,a,t):vt(n,a,t)).join(""),kt(e,t,s)}function vt(e,t,s){const r=s.expandedIndex===t,n=e.exerciseNote||"",a=n.length>50?n.substring(0,50)+"…":n,o=(e.tags||[]).map(l=>`<span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-300">${l}</span>`).join("");return`<li class="card" data-idx="${t}" data-type="single">
  <div class="flex items-center px-4 py-3 gap-2 relative">
    <div class="flex-1 min-w-0 cursor-pointer" data-action="expand" data-idx="${t}">
      ${o?`<div class="flex gap-1 mb-1">${o}</div>`:""}
      <p class="text-sm font-medium text-slate-100 truncate">${_(e.exerciseName)}</p>
      <p class="text-xs text-slate-400 num mt-0.5">${e.reps||"—"} ${e.repUnits||"reps"} · ${e.sets||"—"} sets</p>
      ${a?`<p class="text-[11px] text-slate-500 truncate mt-0.5 italic">${_(a)}</p>`:""}
    </div>
    ${ye(t)}
  </div>
  ${r?`<div class="border-t border-slate-800" data-region="edit-form" data-idx="${t}"></div>`:""}
</li>`}function bt(e,t,s){const r=s.expandedIndex===t,n={superset:"Superset",compound:"Compound",circuit:"Circuit"}[e.kind]||e.kind,a=e.members.map((o,l)=>`
    <div class="flex items-center px-4 py-2.5 gap-2 ${l>0?"border-t border-slate-800/50":""}">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-100 truncate">${_(o.exerciseName)}</p>
        <p class="text-xs text-slate-400 num mt-0.5">${o.reps||"—"} ${o.repUnits||"reps"} · ${o.sets||"—"} sets</p>
      </div>
      ${r?`<div class="flex gap-0.5">
        <button data-action="member-up" data-idx="${t}" data-mi="${l}" class="p-1 rounded text-slate-600 hover:text-slate-300 ${l===0?"opacity-20 pointer-events-none":""}" aria-label="Move up"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg></button>
        <button data-action="member-down" data-idx="${t}" data-mi="${l}" class="p-1 rounded text-slate-600 hover:text-slate-300 ${l===e.members.length-1?"opacity-20 pointer-events-none":""}" aria-label="Move down"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></button>
        <button data-action="member-remove" data-idx="${t}" data-mi="${l}" class="p-1 rounded text-slate-600 hover:text-red-400" aria-label="Remove from group"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
      </div>`:""}
    </div>
  `).join("");return`<li class="card border-l-[3px] border-l-brand-500" data-idx="${t}" data-type="group">
  <div class="flex items-center px-4 py-2 gap-2 bg-brand-500/5 relative">
    <div class="flex-1 min-w-0 cursor-pointer" data-action="expand" data-idx="${t}">
      <span class="text-[10px] font-bold uppercase tracking-wide text-brand-300">${n}</span>
      <span class="text-[10px] text-slate-500 num ml-2">${e.members.length} exercises</span>
    </div>
    ${ye(t)}
  </div>
  ${a}
  ${r?`<div class="border-t border-slate-800" data-region="edit-form" data-idx="${t}"></div>`:""}
</li>`}function ye(e){return`<button data-action="menu" data-idx="${e}" class="relative z-10 p-3 -mr-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation shrink-0" aria-label="Actions">
    <svg class="w-5 h-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
  </button>`}function ht(e,t,s,r){yt();const n=s.items[t],a=n.type==="group",o=s.items.length,l=t>0?s.items[t-1]:null,d=t<o-1?s.items[t+1]:null;let i="";a?(i+=$("edit","Edit group"),t>0&&(i+=$("move-up","Move up")),t<o-1&&(i+=$("move-down","Move down")),l?.type==="single"&&(i+=$("group-above","Add above to group")),d?.type==="single"&&(i+=$("group-below","Add below to group")),i+=$("ungroup","Ungroup")):(i+=$("edit","Edit"),t>0&&(i+=$("move-up","Move up")),t<o-1&&(i+=$("move-down","Move down")),l?.type==="single"?i+=$("group-above","Group with above"):l?.type==="group"&&(i+=$("group-above","Join group above")),d?.type==="single"?i+=$("group-below","Group with below"):d?.type==="group"&&(i+=$("group-below","Join group below"))),i+=$("remove","Remove","text-red-400");const p=a?n.members.map(m=>m.exerciseName).join(" + "):n.exerciseName||"Item",c=document.createElement("div");c.dataset.region="action-menu",c.className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-fade-in",c.innerHTML=`
    <div class="bg-slate-900 border-t border-slate-700 rounded-t-2xl w-full max-w-sm pb-8 pt-3 px-2">
      <div class="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-3"></div>
      <p class="text-xs text-slate-500 text-center mb-2 px-4 truncate">${_(p)}</p>
      <div class="space-y-0.5">${i}</div>
      <button data-menu-action="cancel" class="w-full mt-2 py-3 text-sm text-slate-500 hover:text-slate-300 transition-colors">Cancel</button>
    </div>
  `,document.body.appendChild(c),c.querySelectorAll("[data-menu-action]").forEach(m=>{m.addEventListener("click",x=>{x.stopPropagation();const v=m.dataset.menuAction;c.remove(),v!=="cancel"&&wt(v,t,s,r)})}),c.addEventListener("click",m=>{m.target===c&&c.remove()})}function $(e,t,s=""){return`<button data-menu-action="${e}" class="w-full text-left px-5 py-3 text-sm font-medium rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors ${s}">${t}</button>`}function yt(){document.querySelectorAll('[data-region="action-menu"]').forEach(e=>e.remove())}function wt(e,t,s,r,n){const a=s.items[t],o=t>0?s.items[t-1]:null,l=t<s.items.length-1?s.items[t+1]:null;switch(e){case"edit":r.onEdit?.(t);break;case"move-up":r.onMove?.(t,t-1);break;case"move-down":r.onMove?.(t,t+1);break;case"group-above":o?.type==="group"?r.onJoinGroup?.(t,t-1):a.type==="group"&&o?.type==="single"?r.onAbsorbIntoGroup?.(t,t-1):de(t,"above",r);break;case"group-below":l?.type==="group"?r.onJoinGroup?.(t,t+1):a.type==="group"&&l?.type==="single"?r.onAbsorbIntoGroup?.(t,t+1):de(t,"below",r);break;case"ungroup":r.onUngroup?.(t);break;case"remove":r.onRemove?.(t);break}}function de(e,t,s){const r=document.createElement("div");r.dataset.region="kind-picker",r.className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in",r.innerHTML=`
    <div class="bg-slate-900 border-t border-slate-700 rounded-t-2xl w-full max-w-sm p-5 space-y-4 pb-8">
      <p class="text-sm font-medium text-slate-200 text-center">Group type</p>
      <div class="flex gap-2">
        <button data-kind="superset" class="flex-1 py-3 rounded-xl text-sm font-medium bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 active:scale-95 transition-all">Superset</button>
        <button data-kind="compound" class="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all">Compound</button>
        <button data-kind="circuit" class="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all">Circuit</button>
      </div>
      <button data-action="cancel-kind" class="w-full py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">Cancel</button>
    </div>
  `,document.body.appendChild(r),r.querySelectorAll("[data-kind]").forEach(n=>{n.addEventListener("click",()=>{r.remove(),s.onGroup?.(e,t,n.dataset.kind)})}),r.querySelector('[data-action="cancel-kind"]')?.addEventListener("click",()=>r.remove()),r.addEventListener("click",n=>{n.target===r&&r.remove()})}function kt(e,t,s){e.querySelectorAll('[data-action="expand"]').forEach(r=>{r.addEventListener("click",()=>s.onEdit?.(+r.dataset.idx))}),e.querySelectorAll('[data-action="menu"]').forEach(r=>{r.addEventListener("click",n=>{n.stopPropagation(),ht(e,+r.dataset.idx,t,s)})}),e.querySelectorAll('[data-action="member-up"]').forEach(r=>{r.addEventListener("click",n=>{n.stopPropagation(),s.onMemberMove?.(+r.dataset.idx,+r.dataset.mi,+r.dataset.mi-1)})}),e.querySelectorAll('[data-action="member-down"]').forEach(r=>{r.addEventListener("click",n=>{n.stopPropagation(),s.onMemberMove?.(+r.dataset.idx,+r.dataset.mi,+r.dataset.mi+1)})}),e.querySelectorAll('[data-action="member-remove"]').forEach(r=>{r.addEventListener("click",n=>{n.stopPropagation(),s.onMemberRemove?.(+r.dataset.idx,+r.dataset.mi)})})}function _(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}let u=we(),f=-1;function we(){return{meta:{title:"",id:"",requirements:"",description:"",difficulty:"",duration:""},items:[],newExercises:[]}}function $t(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/_+$/g,"")}function St(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>b("/studio")),e.querySelector('[data-action="start-fresh"]')?.addEventListener("click",()=>{W(e,null,!1)}),e.querySelector('[data-action="edit-existing"]')?.addEventListener("click",async()=>{const t=await ce();t&&W(e,t,!0)}),e.querySelector('[data-action="clone-existing"]')?.addEventListener("click",async()=>{const t=await ce();t&&W(e,t,!1)})}function W(e,t,s){u=we(),f=-1,e.innerHTML=`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span data-region="header-title" class="text-sm font-medium text-slate-400 flex-1">${t?s?"Edit: "+L(t.title):"New (from "+L(t.title)+")":"New Program"}</span>
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
  `,Et(e),Lt(e),qt(e),S(e),Bt(e),Tt(),t&&jt(e,t,s)}function Et(e){e.querySelector('[data-action="back"]')?.addEventListener("click",()=>b("/studio"))}function Lt(e){const t=e.querySelector('[data-field="title"]'),s=e.querySelector('[data-field="requirements"]'),r=e.querySelector('[data-region="id-preview"]'),n=e.querySelector('[data-region="export-section"]');t?.addEventListener("input",()=>{u.meta.title=t.value,u.meta.id=$t(t.value),r.textContent=u.meta.id?`id: ${u.meta.id}`:"",n?.classList.toggle("hidden",!u.meta.title.trim()||u.items.length===0)}),s?.addEventListener("input",()=>{u.meta.requirements=s.value})}function qt(e){const t=e.querySelector('[data-region="picker"]');pt(t,{onSelect:s=>{u.items.push({type:"single",exerciseId:s.id,exerciseName:s.name,exerciseNote:s.recommendations?.note||"",reps:s.recommendations?.reps||"",sets:s.recommendations?.sets||"",repUnits:s.recommendations?.repUnits||"reps",note:"",tags:[]}),S(e)},onCreateNew:s=>{Pt(e,s)}})}function S(e){const t=e.querySelector('[data-region="timeline"]'),s=e.querySelector('[data-region="empty-timeline"]'),r=e.querySelector('[data-region="item-count"]'),n=e.querySelector('[data-region="export-section"]');if(t){if(r.textContent=`${u.items.length} item${u.items.length!==1?"s":""}`,u.items.length===0){t.classList.add("hidden"),s.classList.remove("hidden"),n?.classList.add("hidden");return}if(t.classList.remove("hidden"),s.classList.add("hidden"),n?.classList.toggle("hidden",!u.meta.title.trim()),gt(t,{items:u.items,expandedIndex:f},{onEdit:a=>{f=f===a?-1:a,S(e)},onRemove:a=>{u.items.splice(a,1),f===a?f=-1:f>a&&f--,S(e)},onMove:(a,o)=>{const[l]=u.items.splice(a,1);u.items.splice(o,0,l),f===a?f=o:a<f&&o>=f?f--:a>f&&o<=f&&f++,S(e)},onGroup:(a,o,l)=>{const d=o==="above"?a-1:a+1,i=Math.min(a,d),p=[u.items[i],u.items[i+1]],c={type:"group",kind:l,note:"",tags:[],members:p};u.items.splice(i,2,c),f=-1,S(e)},onJoinGroup:(a,o)=>{const l=u.items[a];u.items[o].members.push(l),u.items.splice(a,1),f=-1,S(e)},onAbsorbIntoGroup:(a,o)=>{const l=u.items[o],d=u.items[a];o<a?d.members.unshift(l):d.members.push(l),u.items.splice(o,1),f=-1,S(e)},onMemberMove:(a,o,l)=>{const d=u.items[a];if(!d||d.type!=="group")return;const[i]=d.members.splice(o,1);d.members.splice(l,0,i),S(e)},onMemberRemove:(a,o)=>{const l=u.items[a];if(!l||l.type!=="group")return;const[d]=l.members.splice(o,1);if(l.members.length<=1){const i=l.members[0]||d;i.type="single",u.items.splice(a,1,i)}f=-1,S(e)},onUngroup:a=>{const o=u.items[a];if(o.type!=="group")return;const l=o.members.map(d=>({...d,type:"single"}));u.items.splice(a,1,...l),f=-1,S(e)}}),f>=0&&f<u.items.length){const a=t.querySelector(`[data-region="edit-form"][data-idx="${f}"]`);a&&Ct(a,u.items[f],f,e)}}}function Ct(e,t,s,r){const n=["reps","secs","min","yd","rep","reps (each side)","secs (each side)"],a=["warmup","stretch"];e.innerHTML=`
    <div class="px-4 pb-4 pt-3 space-y-3 bg-slate-900/40">
      <div data-demo-preview="${s}"></div>
      <div class="grid grid-cols-3 gap-2">
        <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Reps</label>
          <input data-edit="reps" value="${L(t.reps||"")}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
        <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Sets</label>
          <input data-edit="sets" value="${L(t.sets||"")}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
        <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Units</label>
          <select data-edit="repUnits" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500">
            ${n.map(l=>`<option value="${l}"${(t.repUnits||"reps")===l?" selected":""}>${l}</option>`).join("")}
          </select></div>
      </div>
      <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Note</label>
        <input data-edit="note" value="${L(t.note||"")}" placeholder="Form cues, weight, etc." class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/></div>
      <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Tags</label>
        <div class="flex gap-2">${a.map(l=>`
          <button type="button" data-pill="${l}" class="px-3 py-1.5 rounded-full text-xs font-medium transition-all ${(t.tags||[]).includes(l)?"bg-brand-500 text-white":"bg-slate-800 text-slate-400 hover:bg-slate-700"}">${l}</button>`).join("")}
        </div></div>
    </div>
  `,e.querySelectorAll("[data-edit]").forEach(l=>{const d=()=>{t[l.dataset.edit]=l.value};l.addEventListener("input",d),l.addEventListener("change",d)}),e.querySelectorAll("[data-pill]").forEach(l=>{l.addEventListener("click",()=>{t.tags||(t.tags=[]);const d=l.dataset.pill;t.tags.includes(d)?t.tags=t.tags.filter(i=>i!==d):t.tags.push(d),S(r)})});const o=e.querySelector(`[data-demo-preview="${s}"]`);o&&t.exerciseId&&Mt(o,t.exerciseId)}function L(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Mt(e,t){const{exercises:s}=await H(),r=s.find(o=>o.id===t),n=u.newExercises.find(o=>o.id===t),a=r?.demos||n?.demos||[];if(a.length===0){e.innerHTML='<p class="text-[11px] text-slate-600 italic">No demos available</p>';return}B(e,a)}async function ce(){const{programs:e}=await A(),t=prompt(`Type part of a program name:

`+e.map(r=>`• ${r.title}`).join(`
`));if(!t)return null;const s=e.find(r=>r.title.toLowerCase().includes(t.toLowerCase()));return s||(alert('No program found matching "'+t+'"'),null)}function jt(e,t,s){u.meta.title=s?t.title:"",u.meta.id=s?t.id:"",u.meta.requirements=t.requirements||"",u.items=(t.items||[]).map(n=>n.kind?{type:"group",kind:n.kind,note:n.note||"",tags:n.tags||[],members:n.exercises.map(a=>({type:"single",exerciseId:a.exerciseId,exerciseName:a.exerciseId,reps:a.reps||"",sets:a.sets||"",repUnits:a.repUnits||"reps",note:a.note||"",tags:[]}))}:{type:"single",exerciseId:n.exerciseId,exerciseName:n.exerciseId,exerciseNote:n.note||"",reps:n.reps||"",sets:n.sets||"",repUnits:n.repUnits||"reps",note:n.note||"",tags:n.tags||[]}),f=-1;const r=e.querySelector('[data-field="title"]');r.value=u.meta.title,r.dispatchEvent(new Event("input")),e.querySelector('[data-field="requirements"]').value=u.meta.requirements,s&&(e.querySelector('[data-region="header-title"]').textContent=`Edit: ${t.title}`),S(e)}let K=!1;function Tt(){if(K)return;K=!0;const e=s=>{(u.items.length>0||u.meta.title)&&(s.preventDefault(),s.returnValue="")};window.addEventListener("beforeunload",e);const t=()=>{window.removeEventListener("beforeunload",e),window.removeEventListener("hashchange",t),K=!1};window.addEventListener("hashchange",t)}let Z=[];function Pt(e,t=""){const s=e.querySelector('[data-region="exercise-slideover"]');if(!s)return;Z=[],s.querySelector('[data-exfield="name"]').value=t,s.querySelector('[data-exfield="reps"]').value="",s.querySelector('[data-exfield="sets"]').value="",s.querySelector('[data-exfield="repUnits"]').value="reps",s.querySelector('[data-exfield="note"]').value="";const r=t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,"");s.querySelector('[data-region="ex-id-preview"]').textContent=r?`id: ${r}`:"";const n=s.querySelector('[data-region="demo-manager"]');se(n,Z);const a=s.querySelector('[data-exfield="name"]'),o=s.querySelector('[data-region="ex-id-preview"]');a.addEventListener("input",()=>{const d=a.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,"");o.textContent=d?`id: ${d}`:""}),s.querySelector('[data-action="save-exercise"]')?.addEventListener("click",async()=>{const d=a.value.trim();if(!d){a.focus();return}const i=d.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,""),{exercises:p}=await H(),c=p.find(k=>k.id===i||k.name.toLowerCase()===d.toLowerCase());if(c&&!confirm(`An exercise named "${c.name}" already exists (id: ${c.id}).

Do you still want to create "${d}"?`))return;const m=s.querySelector('[data-exfield="reps"]').value,x=s.querySelector('[data-exfield="sets"]').value,v=s.querySelector('[data-exfield="repUnits"]').value,h=s.querySelector('[data-exfield="note"]').value,E={id:i,name:d,demos:Z.filter(k=>k.url),recommendations:{}};m&&(E.recommendations.reps=m),x&&(E.recommendations.sets=x),v&&v!=="reps"&&(E.recommendations.repUnits=v),h&&(E.recommendations.note=h),u.newExercises.push(E),ut(E),u.items.push({type:"single",exerciseId:i,exerciseName:d,exerciseNote:h||"",reps:m||"",sets:x||"",repUnits:v||"reps",note:"",tags:[]}),s.classList.add("hidden"),S(e)},{once:!0});const l=()=>s.classList.add("hidden");s.querySelector('[data-action="cancel-exercise"]')?.addEventListener("click",l,{once:!0}),s.querySelector('[data-action="close-exercise"]')?.addEventListener("click",l,{once:!0}),s.classList.remove("hidden")}function Bt(e){const t=e.querySelector('[data-region="export-modal"]');e.querySelector('[data-action="export"]')?.addEventListener("click",()=>{At(e)}),e.querySelector('[data-action="close-export"]')?.addEventListener("click",()=>{t?.classList.add("hidden")}),t?.addEventListener("click",s=>{s.target===t&&t.classList.add("hidden")}),e.querySelector('[data-action="preview"]')?.addEventListener("click",()=>{Nt(e)})}function Nt(e){const t=ke(),s=t.items||[],r=`
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
        <h1 class="h-page">${L(t.title||"Untitled")}</h1>
        ${t.requirements?`<p class="text-sm text-slate-400 mt-1.5">${L(t.requirements)}</p>`:""}
      </div>
      <div class="px-6 pb-24 pt-2">
        <ul class="space-y-2.5">
          ${s.map((a,o)=>It(a)).join("")}
        </ul>
      </div>
    </div>
  `,n=document.createElement("div");n.innerHTML=r,e.appendChild(n.firstElementChild),e.querySelector('[data-action="close-preview"]')?.addEventListener("click",()=>{e.querySelector(".fixed.inset-0.z-50.bg-slate-950")?.remove()})}function It(e,t){if(e.kind)return`<li class="card p-4 space-y-2">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-brand-500/20 text-brand-300">${{superset:"Super Set",compound:"Compound",circuit:"Circuit"}[e.kind]||e.kind}</span>
      </div>
      <p class="text-sm font-semibold text-slate-100">${L(e.exercises.map(n=>n.exerciseId).join(" + "))}</p>
      <div class="space-y-1.5 pl-3 border-l-2 border-slate-700">
        ${e.exercises.map((n,a)=>`
          <div class="text-xs text-slate-300">${a+1}. ${L(n.exerciseId)} — ${n.reps||"—"} ${n.repUnits||"reps"} · ${n.sets||"—"} sets</div>
        `).join("")}
      </div>
    </li>`;const s=e.tags?.length?e.tags.map(r=>`<span class="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">${r}</span>`).join(""):"";return`<li class="card px-4 py-3">
    ${s?`<div class="flex gap-1.5 mb-1">${s}</div>`:""}
    <p class="text-sm font-semibold text-slate-100">${L(e.exerciseId)}</p>
    <p class="text-xs text-slate-400 num mt-0.5">${e.reps||"—"} ${e.repUnits||"reps"} · ${e.sets||"—"} sets</p>
    ${e.note?`<p class="text-xs text-slate-500 mt-1">${L(e.note)}</p>`:""}
  </li>`}function At(e){const t=e.querySelector('[data-region="export-modal"]'),s=e.querySelector('[data-region="export-content"]');if(!t||!s)return;const r=ke(),n=[];u.newExercises.length>0&&n.push({label:"New Exercises (append to exercises.json → exercises[])",json:u.newExercises}),n.push({label:"Program (append to workouts.json → programs[])",json:r}),s.innerHTML=n.map((a,o)=>`
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-xs text-slate-400 font-medium">${a.label}</p>
        <button data-action="copy-json" data-section="${o}" class="text-xs text-brand-400 hover:text-brand-300 transition-colors">Copy</button>
      </div>
      <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono leading-relaxed"><code>${L(JSON.stringify(a.json,null,2))}</code></pre>
    </div>
  `).join(""),s.querySelectorAll('[data-action="copy-json"]').forEach(a=>{a.addEventListener("click",()=>{const o=+a.dataset.section,l=JSON.stringify(n[o].json,null,2);navigator.clipboard?.writeText(l).then(()=>{a.textContent="✓ Copied",setTimeout(()=>{a.textContent="Copy"},2e3)}).catch(()=>{prompt("Copy:",l)})})}),t.classList.remove("hidden")}function ke(){const e={id:u.meta.id,title:u.meta.title};return u.meta.requirements&&(e.requirements=u.meta.requirements),u.meta.description&&(e.description=u.meta.description),u.meta.difficulty&&(e.difficulty=u.meta.difficulty),u.meta.duration&&(e.duration=Number(u.meta.duration)),e.items=u.items.map(t=>{if(t.type==="group"){const r={kind:t.kind,exercises:t.members.map(n=>{const a={exerciseId:n.exerciseId};return n.reps&&(a.reps=n.reps),n.sets&&(a.sets=n.sets),n.repUnits&&n.repUnits!=="reps"&&(a.repUnits=n.repUnits),n.note&&(a.note=n.note),a})};return t.note&&(r.note=t.note),t.tags?.length&&(r.tags=t.tags),r}const s={exerciseId:t.exerciseId};return t.reps&&(s.reps=t.reps),t.sets&&(s.sets=t.sets),t.repUnits&&t.repUnits!=="reps"&&(s.repUnits=t.repUnits),t.note&&(s.note=t.note),t.tags.length&&(s.tags=t.tags),s}),e}let R=[],D=!1,F="";function Ht(e){R=[],D=!1,F="",e.innerHTML=`
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
  `,Ut(e),zt(e),Dt(e),Ft(e)}function Ut(e){e.querySelector('[data-action="back"]')?.addEventListener("click",()=>b("/studio"))}function zt(e){const t=e.querySelector('[data-input="edit-search"]'),s=e.querySelector('[data-region="edit-results"]');let r=null;t?.addEventListener("input",()=>{clearTimeout(r),r=setTimeout(async()=>{const n=t.value.trim();if(!n){s.classList.add("hidden");return}const a=await te(n,8);if(a.length===0){s.classList.add("hidden");return}s.classList.remove("hidden"),s.innerHTML=a.map(o=>`
        <li><button data-load-exercise="${o.id}" class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800/60 active:bg-slate-800 transition-colors flex items-center gap-3 touch-manipulation">
          <span class="text-sm font-medium text-slate-100 truncate">${$e(o.name)}</span>
          ${o.hasDemos?'<span class="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-sm">demo</span>':""}
        </button></li>
      `).join(""),s.querySelectorAll("[data-load-exercise]").forEach(o=>{o.addEventListener("click",()=>{const l=a.find(d=>d.id===o.dataset.loadExercise);l&&Rt(e,l.exercise),s.classList.add("hidden"),t.value=""})})},150)})}function Rt(e,t){D=!0,F=t.id,R=JSON.parse(JSON.stringify(t.demos||[])),e.querySelector('[data-region="header-title"]').textContent=`Edit: ${t.name}`,e.querySelector('[data-region="form-label"]').textContent="Editing Exercise";const s=e.querySelector('[data-field="name"]');s.value=t.name,s.dispatchEvent(new Event("input"));const r=t.recommendations||{};e.querySelector('[data-field="reps"]').value=r.reps||"",e.querySelector('[data-field="sets"]').value=r.sets||"",e.querySelector('[data-field="repUnits"]').value=r.repUnits||"reps",e.querySelector('[data-field="note"]').value=r.note||"",se(e.querySelector('[data-region="demos"]'),R),e.querySelector('[data-region="export-section"]')?.classList.remove("hidden")}function Dt(e){const t=e.querySelector('[data-field="name"]'),s=e.querySelector('[data-region="id-preview"]'),r=e.querySelector('[data-region="export-section"]');t?.addEventListener("input",()=>{if(D)s.textContent=`id: ${F} (existing)`;else{const n=t.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,"");s.textContent=n?`id: ${n}`:""}r?.classList.toggle("hidden",!t.value.trim())}),se(e.querySelector('[data-region="demos"]'),R)}function Ft(e){const t=e.querySelector('[data-region="export-modal"]');e.querySelector('[data-action="export"]')?.addEventListener("click",()=>{const s=e.querySelector('[data-field="name"]'),r=s.value.trim();if(!r){s.focus();return}const a={id:D?F:r.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/g,""),name:r,demos:R.filter(x=>x.url),recommendations:{}},o=e.querySelector('[data-field="reps"]').value,l=e.querySelector('[data-field="sets"]').value,d=e.querySelector('[data-field="repUnits"]').value,i=e.querySelector('[data-field="note"]').value;o&&(a.recommendations.reps=o),l&&(a.recommendations.sets=l),d&&d!=="reps"&&(a.recommendations.repUnits=d),i&&(a.recommendations.note=i);const p=e.querySelector('[data-region="export-content"]'),c=JSON.stringify(a,null,2),m=D?`Replace entry with id "${F}" in exercises.json`:"Append to exercises.json → exercises[]";p.innerHTML=`
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-slate-400">${m}</p>
          <button data-action="copy" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
        </div>
        <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono leading-relaxed"><code>${$e(c)}</code></pre>
      </div>`,p.querySelector('[data-action="copy"]')?.addEventListener("click",x=>{navigator.clipboard?.writeText(c).then(()=>{x.target.textContent="✓ Copied",setTimeout(()=>{x.target.textContent="Copy"},2e3)})}),t.classList.remove("hidden")}),e.querySelector('[data-action="close-export"]')?.addEventListener("click",()=>t?.classList.add("hidden")),t?.addEventListener("click",s=>{s.target===t&&t.classList.add("hidden")})}function $e(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Ot(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>b("/"));const{exercises:t}=await H(),s=e.querySelector('[data-region="count"]');s.textContent=`${t.length} total`;let r=null;const n=i=>{const p=e.querySelector('[data-region="list"]'),c=e.querySelector('[data-region="empty"]');if(i.length===0){p.classList.add("hidden"),c.classList.remove("hidden");return}if(p.classList.remove("hidden"),c.classList.add("hidden"),p.innerHTML=i.map(m=>`
      <li>
        <article class="card overflow-hidden" data-exercise-id="${m.id}">
          <button data-action="expand" data-id="${m.id}" class="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold tracking-tight text-slate-100 truncate">${U(m.name)}</h3>
              <p class="text-xs text-slate-400 mt-0.5 num">${m.demos.length} demo${m.demos.length!==1?"s":""}${m.recommendations?.reps?` · ${m.recommendations.reps} ${m.recommendations.repUnits||"reps"}`:""}</p>
            </div>
            <svg class="w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${r===m.id?"rotate-180":""}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          ${r===m.id?a(m):""}
        </article>
      </li>
    `).join(""),p.querySelectorAll('[data-action="expand"]').forEach(m=>{m.addEventListener("click",()=>{if(r=r===m.dataset.id?null:m.dataset.id,n(i),r){const x=p.querySelector(`[data-demo-slot="${r}"]`),v=i.find(h=>h.id===r);x&&v&&v.demos.length>0&&B(x,v.demos)}})}),r){const m=p.querySelector(`[data-demo-slot="${r}"]`),x=i.find(v=>v.id===r);m&&x&&x.demos.length>0&&B(m,x.demos)}};function a(i){return`
      <div class="px-4 pb-4 pt-1 space-y-3 border-t border-slate-800 bg-slate-900/40 animate-fade-in">
        <div data-demo-slot="${i.id}">
          ${i.demos.length===0?'<p class="text-xs text-slate-500 italic py-2">No demos available</p>':""}
        </div>
        ${i.recommendations?`
          <div class="flex gap-3">
            ${i.recommendations.reps?`<div class="bg-slate-800/50 rounded-lg px-3 py-2 text-center flex-1"><p class="text-lg font-extrabold text-brand-400 num">${U(i.recommendations.reps)}</p><p class="label-meta mt-0.5">${U(i.recommendations.repUnits||"reps")}</p></div>`:""}
            ${i.recommendations.sets?`<div class="bg-slate-800/50 rounded-lg px-3 py-2 text-center flex-1"><p class="text-lg font-extrabold text-brand-400 num">${U(i.recommendations.sets)}</p><p class="label-meta mt-0.5">sets</p></div>`:""}
          </div>
        `:""}
        ${i.recommendations?.note?`<div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2 rounded-r-lg"><p class="text-xs text-slate-300 leading-relaxed">${U(i.recommendations.note)}</p></div>`:""}
        ${i.aliases?.length?`<p class="text-[11px] text-slate-500">Also known as: ${i.aliases.join(", ")}</p>`:""}
        <a href="#/exercise/${i.id}" class="inline-block text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">View full page →</a>
      </div>
    `}const o=[...t].sort((i,p)=>i.name.localeCompare(p.name));n(o);const l=e.querySelector('[data-input="search"]');let d=null;l?.addEventListener("input",()=>{clearTimeout(d),d=setTimeout(async()=>{const i=l.value.trim();if(!i){n(o),s.textContent=`${o.length} total`;return}const c=(await te(i,50)).map(m=>m.exercise);n(c),s.textContent=`${c.length} result${c.length!==1?"s":""}`},150)})}function U(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function _t(e,t){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>window.history.back());const s=await Te(t);if(!s){Jt(e,t);return}const{programs:r}=await A(),n=Yt(r,t);Gt(e,s,n)}function Gt(e,t,s){const r=t.demos||[],n=t.recommendations||{},a=t.aliases||[];if(e.innerHTML=`
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-4 flex items-center gap-3">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="h-page flex-1 min-w-0 truncate">${C(t.name)}</h1>
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
              <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${C(n.reps)}</p>
              <p class="label-meta mt-1.5">${C(n.repUnits||"reps")}</p>
            </div>`:""}
            ${n.sets?`
            <div class="card p-4 text-center">
              <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${C(n.sets)}</p>
              <p class="label-meta mt-1.5">sets</p>
            </div>`:""}
          </div>
          ${n.note?`
          <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
            <p class="text-sm text-slate-300 leading-relaxed">${C(n.note)}</p>
          </div>`:""}
        </section>`:""}

        <!-- Aliases -->
        ${a.length>0?`
        <section class="space-y-2">
          <h2 class="eyebrow">Also known as</h2>
          <div class="flex flex-wrap gap-2">
            ${a.map(o=>`<span class="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">${C(o)}</span>`).join("")}
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
                    <h3 class="text-sm font-semibold tracking-tight truncate">${C(o.title)}</h3>
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
          <p class="text-[11px] text-slate-500 font-mono">${C(t.id)}</p>
          <p class="text-[11px] text-slate-500">${r.length} demo${r.length!==1?"s":""}</p>
        </section>
      </main>
    </div>
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>window.history.back()),e.querySelectorAll("[data-program-id]").forEach(o=>{o.addEventListener("click",()=>b(`/program/${o.dataset.programId}`))}),r.length>0){const o=e.querySelector('[data-region="demos"]');B(o,r)}}function Jt(e,t){e.innerHTML=`
    <div class="flex-1 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p class="text-6xl mb-4">🤷</p>
      <h1 class="text-2xl font-bold mb-2">Exercise not found</h1>
      <p class="text-slate-400 mb-6 text-sm font-mono">${C(t)}</p>
      <a href="#/exercises" class="btn-primary">Browse exercises</a>
    </div>
  `}function Yt(e,t){return e.filter(s=>{for(const r of s.items||[]){if(r.exerciseId===t)return!0;if(r.exercises){for(const n of r.exercises)if(n.exerciseId===t)return!0}}return!1})}function C(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}async function Vt(e){e.innerHTML=`
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
  `,e.querySelector('[data-action="back"]')?.addEventListener("click",()=>b("/"));const[{programs:t},{plans:s}]=await Promise.all([A(),ve()]),r=t.map(c=>({id:c.id,title:c.title,requirements:c.requirements||"",itemCount:c.items?.length||c.exercises?.length||0,tokens:O(c.title).concat(O(c.requirements||"")).concat(O(c.id.replace(/[-_]/g," "))),program:c})),n=new Map;for(const c of s)for(const m of c.subPlans||[])for(const x of m.programs||[])n.set(x,`${c.name} · ${m.name}`);const a=e.querySelector('[data-region="results"]'),o=e.querySelector('[data-region="empty"]'),l=e.querySelector('[data-region="initial"]');function d(c){if(c===null){a.classList.add("hidden"),o.classList.add("hidden"),l.classList.remove("hidden");return}if(l.classList.add("hidden"),c.length===0){a.classList.add("hidden"),o.classList.remove("hidden");return}o.classList.add("hidden"),a.classList.remove("hidden"),a.innerHTML=c.map(m=>Wt(m,n.get(m.id))).join(""),a.querySelectorAll("[data-program-id]").forEach(m=>{m.addEventListener("click",()=>b(`/program/${m.dataset.programId}`))})}const i=e.querySelector('[data-input="search"]');let p=null;i?.addEventListener("input",()=>{clearTimeout(p),p=setTimeout(()=>{const c=i.value.trim();if(!c){d(null);return}const m=O(c),x=r.map(v=>({...v,score:Kt(v.tokens,m)})).filter(v=>v.score>0).sort((v,h)=>h.score-v.score);d(x)},150)}),d(null)}function Wt(e,t){return`
    <button
      data-program-id="${e.id}"
      class="w-full card p-4 text-left active:scale-[0.98] transition-transform"
    >
      <div class="flex items-center gap-3">
        <div class="flex-1 min-w-0">
          ${t?`<p class="text-[10px] font-medium uppercase tracking-wider text-slate-500 mb-1">${Q(t)}</p>`:""}
          <h3 class="font-semibold tracking-tight truncate">${Q(e.title)}</h3>
          <p class="text-xs text-slate-400 mt-1 truncate">
            <span class="num">${e.itemCount}</span> exercise${e.itemCount!==1?"s":""}${e.requirements?` · ${Q(e.requirements)}`:""}
          </p>
        </div>
        <svg class="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </button>
  `}function O(e){return e?e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().split(/[^a-z0-9]+/).filter(t=>t.length>0):[]}function Kt(e,t){let s=0;for(const r of t){let n=0;for(const a of e)a===r?n=Math.max(n,10):a.startsWith(r)?n=Math.max(n,7):a.includes(r)&&(n=Math.max(n,4));if(n===0)return 0;s+=n}return s}function Q(e){return e==null?"":String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const q=document.getElementById("app");M("/",()=>Ne(q));M("/programs",()=>Ue(q));M("/program/:id",({id:e})=>nt(q,e));M("/exercises",()=>Ot(q));M("/exercise/:id",({id:e})=>_t(q,e));M("/search",()=>Vt(q));const Zt=["localhost","127.0.0.1"].includes(window.location.hostname);Zt&&(M("/studio",()=>dt(q)),M("/studio/program",()=>St(q)),M("/studio/exercise",()=>Ht(q)));Se(e=>{q.innerHTML=`
    <div class="flex-1 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p class="text-6xl mb-4">🤔</p>
      <h1 class="text-2xl font-bold mb-2">Page not found</h1>
      <p class="text-slate-400 mb-6 text-sm">${e}</p>
      <a href="#/" class="btn-primary">Back home</a>
    </div>
  `});Ee();console.log("🚀 Action App V2 ready");
