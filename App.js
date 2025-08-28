const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const state = {
  tracks: [
    {
      title: "Midnight Drive",
      artist: "Nova",
      cover: "https://picsum.photos/seed/drive/300/300",
      src: "https://cdn.pixabay.com/download/audio/2021/09/30/audio_3f1c2a.mp3?filename=midnight-stroll-12269.mp3"
    },
    {
      title: "Chill Breeze",
      artist: "Cosmo",
      cover: "https://picsum.photos/seed/breeze/300/300",
      src: "https://cdn.pixabay.com/download/audio/2021/10/20/audio_1e36c8.mp3?filename=chill-ambient-11058.mp3"
    },
    {
      title: "Neon City",
      artist: "Volt",
      cover: "https://picsum.photos/seed/neon/300/300",
      src: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_98a0f0.mp3?filename=neon-11745.mp3"
    }
  ],
  i: 0,
  dark: true,
};

const cards = $("#cards");
const trending = $("#trendingGrid");
const audio = $("#audio");
const cover = $("#cover");
const titleEl = $("#trackTitle");
const artistEl = $("#trackArtist");
const playBtn = $("#playBtn");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");
const seek = $("#seek");
const time = $("#time");
const duration = $("#duration");

function fmt(t){
  const m = Math.floor(t/60); const s = Math.floor(t%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

function load(i){
  state.i = (i+state.tracks.length)%state.tracks.length;
  const tr = state.tracks[state.i];
  audio.src = tr.src;
  cover.src = tr.cover;
  titleEl.textContent = tr.title;
  artistEl.textContent = tr.artist;
  audio.addEventListener('loadedmetadata', ()=>{
    duration.textContent = fmt(audio.duration||0);
  }, {once:true});
}

function toggle(){
  if(audio.paused){ audio.play(); playBtn.textContent = '⏸️'; }
  else { audio.pause(); playBtn.textContent = '▶️'; }
}

playBtn.addEventListener('click', toggle);
prevBtn.addEventListener('click', ()=>{ load(state.i-1); audio.play(); playBtn.textContent='⏸️'; });
nextBtn.addEventListener('click', ()=>{ load(state.i+1); audio.play(); playBtn.textContent='⏸️'; });

seek.addEventListener('input', ()=>{
  if(audio.duration){ audio.currentTime = (seek.value/100)*audio.duration; }
});

audio.addEventListener('timeupdate', ()=>{
  if(audio.duration){
    seek.value = (audio.currentTime/audio.duration)*100;
    time.textContent = fmt(audio.currentTime);
  }
});

function renderGrid(el, list){
  el.innerHTML = list.map((t,idx)=>`
    <div class="card" data-i="${idx}">
      <img src="${t.cover}" alt="cover ${t.title}" />
      <div class="title">${t.title}</div>
      <div class="muted">${t.artist}</div>
    </div>
  `).join('');
  el.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('click', ()=>{
      load(parseInt(card.dataset.i,10));
      audio.play();
      playBtn.textContent='⏸️';
    });
  })
}

renderGrid(cards, state.tracks);
renderGrid(trending, [...state.tracks].reverse());

load(0);

// Hledání
$("#search").addEventListener('input', (e)=>{
  const q = e.target.value.toLowerCase();
  const filtered = state.tracks.filter(t=>
    t.title.toLowerCase().includes(q) ||
    t.artist.toLowerCase().includes(q)
  );
  renderGrid(cards, filtered);
});

// Tma/Světlo
$("#themeBtn").addEventListener('click', ()=>{
  state.dark = !state.dark;
  document.body.classList.toggle('light', !state.dark);
});

// Rok v patičce
$("#year").textContent = new Date().getFullYear();
