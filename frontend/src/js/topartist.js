import { renderHighlights, renderMovies, renderSeries } from "../components/MediaSection.js";
import { renderWikiSection } from "../components/WikiSection.js";

const API_BASE = "http://127.0.0.1:8000";

const form = document.querySelector("#yearForm");
const input = document.querySelector("#yearInput");
const statusEl = document.querySelector("#status");
const resultsEl = document.querySelector("#results");
const highlightsSection = document.querySelector("#highlightsSection");
const movieSection = document.querySelector("#movieSection");
const seriesSection = document.querySelector("#seriesSection");
const wikiTpl = document.querySelector("#wikiCardTpl");
const heroText = document.querySelector("#heroText");
const tpl = wikiTpl;

const recapHeader = document.querySelector("#recapHeader");
const yearBadge = document.querySelector("#yearBadge");
const submitBtn = document.querySelector("#submitBtn");

const ArtistSection = document.querySelector("#ArtistSection");
const ArtistGrid = document.querySelector("#ArtistGrid");
const ArtistTpl = document.querySelector("#ArtistCardTpl");
const statsEl = document.querySelector("#stats");

//let cleanupArtistPin = null;

// function setupArtistPinReveal() {
// if (cleanupArtistPin) cleanupArtistPin();

// const section = document.querySelector("#ArtistSection");
// const spacer = document.querySelector("#ArtistPinSpacer");
// const cards = Array.from(document.querySelectorAll("#ArtistGrid .pin-card"));

// if (!section || !spacer || cards.length === 0) return; 

// const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// const pxPerCard = 140; // justera känslan: 100 snabbare, 200 långsammare

// const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// function showCard(card) {
//   card.classList.remove("opacity-0", "translate-y-6", "blur-sm", "pointer-events-none");
//   card.classList.add("opacity-100", "translate-y-0", "blur-0");
// }

// function hideCard(card) {
//   card.classList.add("opacity-0", "translate-y-6", "blur-sm", "pointer-events-none");
//   card.classList.remove("opacity-100", "translate-y-0", "blur-0");
// }

// function layout() {
//   // Scroll-längd för hela pinned-upplevelsen
//   spacer.style.height = `${window.innerHeight + cards.length * pxPerCard}px`;
//   update();
// }

// function update() {
//   const start = section.offsetTop;
//   const end = start + spacer.offsetHeight - window.innerHeight;

//   const y = window.scrollY;
//   const progress = clamp((y - start) / (end - start || 1), 0, 1);

//   const scrolledCount = prefersReduced
//     ? cards.length
//     : Math.floor(progress * (cards.length + 0.999));

//   const initialVisible = 3;

//   const visibleCount = Math.min(
//     cards.length,
//     Math.max(initialVisible, scrolledCount)
//   ); 

//   cards.forEach((card, index) => {
//     if(index < visibleCount) showCard(card);
//     else hideCard(card);

//   });

// }

let cleanupArtistAutoReveal = null;

function setupArtistAutoReveal({
  initialVisible = 3,
  delayMs = 1000, //styr att det blir 1 sekund mellan varje nytt kort. 
  durationMs = 1200, //styr så att animationen tar 1,2 sek. (långsammare)

} = {}) {
  if (cleanupArtistAutoReveal) cleanupArtistAutoReveal();

  const cards = Array.from(document.querySelectorAll("#ArtistGrid .pin-card"));
  if (cards.length === 0) return;


  function showCard(card) {
    card.classList.remove("opacity-0", "translate-y-6", "blur-sm", "pointer-events-none");
    card.classList.add("opacity-100", "translate-y-0", "blur-0");
  }

  // Sätt långsammare transition (override på varje kort)
    cards.forEach(card => {
    card.style.transitionDuration = `${durationMs}ms`;
  });

  // Visa första "radens" kort direkt
  const firstCount = Math.min(initialVisible, cards.length);
  for (let index = 0; index < firstCount; index++) showCard(cards[index]);

  //Visa upp resterande kort automatiskt. 
  let index = firstCount;
  const timer = setInterval(() => {
    if (index >= cards.length) {
      clearInterval(timer);
      return;
    }
    showCard(cards[index]);
    index++;
  }, delayMs);

  cleanupArtistAutoReveal = () => {
    clearInterval(timer);
    cleanupArtistAutoReveal = null;
  };
}

// let ticking = false;
// function onScroll() {
//   if (ticking) return;
//   ticking = true;
//   requestAnimationFrame(() => {
//     update();
//     ticking = false;
//   });
// }

  //window.addEventListener("scroll", onScroll, { passive: true});
  //window.addEventListener("resize", layout);

  //layout();

//   cleanupArtistPin = () => {
//     window.removeEventListener("scroll", onScroll);
//     window.removeEventListener("resize", layout);
//     spacer.style.height = "0px";
//     cleanupArtistPin = null;
// };

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove(
      "opacity-0",
      "blur-sm",
      "-translate-x-10",
      "translate-x-10"
    );

    entry.target.classList.add("is-visible");


    observer.unobserve(entry.target);
  });
},
{  threshold: 0.15}

    );

  function clearTopArtist() {
  //if (cleanupArtistPin) cleanupArtistPin();  
  if (cleanupArtistAutoReveal) cleanupArtistAutoReveal();
  if (ArtistGrid) ArtistGrid.innerHTML = "";
  if (ArtistSection) ArtistSection.classList.add("hidden");
  if (statsEl) statsEl.textContent = "";
}

  // Fetch top artist of the year.
  async function fetchArtistOfTheYear(year) {
    const res = await fetch(`${API_BASE}/api/v1/year/${year}/billboard/artist`);
    if (!res.ok) return {};
    const data = await res.json();
    return data ?? {};
  }

 async function renderTopArtist(artistData, year) {
  clearTopArtist();

  if (!artistData || !ArtistTpl || !ArtistGrid || !ArtistSection) return;

  ArtistSection.classList.remove("hidden");

  let topTracksByArtist = new Map();
  try {
    const topSongsData = await fetchBillboardTopSong(year, 5);
    topTracksByArtist = new Map(
      (topSongsData.artist ?? []).map(a => [a.artist, a.toptracks ?? []])
    );
} catch (err) {
  console.error("Top songs fecth failed:", err);
}
  const maxArtistsCards = 6;

  for (let index = 0; index < Math.min( maxArtistsCards, artistData.artists.length); index++) {
    const artistName = artistData.artists[index];
    const node = ArtistTpl.content.firstElementChild.cloneNode(true);

    
    node.classList.add(
      "pin-card",
      "opacity-0",
      "translate-y-6",
      "blur-sm",
      "pointer-events-none",
      "transition-all",
      "duration-500",
      "will-change-transform"
    );

    node.querySelector(".name").textContent = artistName;

    const toptracks = topTracksByArtist.get(artistName) ?? [];
    renderTopSongs(toptracks, node);

    ArtistGrid.appendChild(node);
  }

  //setupArtistPinReveal();
  setupArtistAutoReveal({
    initialVisible: 3,
    delayMs: 1000,
    durationMs: 1200
  });

  requestAnimationFrame(() => {
  const position = ArtistSection.getBoundingClientRect().top + window.scrollY;
  const offset = 220;
  window.scrollTo({ top: position - offset, behavior: "smooth"});
  });
}


    //   const imgUrl = topArtist.image || "";
    //   if (imgUrl) {
    //     img.src = imgUrl;
    //     img.alt = `Portrait of ${topArtist.name}`;
    //   } else {
    //     img.src = "https://www.billboard.com/lists/year-end-hot-100-number-one-songs/";
    //     img.alt = "Billboard Top Songs by Year";
    //   }
      
  
  async function fetchBillboardTopSong(year, limit=5) {
    const res = await fetch(
      `${API_BASE}/api/v1/year/${year}/billboard/artist/top-songs?limit=${limit}`);
    if (!res.ok) {
      throw new Error("Failed to fetch top songs");
    }
      return await res.json();
  }

  function renderTopSongs(songs, container) {
    if (!songs || songs.length === 0) return;

    const listOfSongs = container.querySelector(".songs") ?? container;
    listOfSongs.innerHTML = ""; 
    
    //container.querySelector(".top-songs")?.remove();

    const ul = document.createElement("ul");
    ul.className = "mt-2 text-sm list-disc pl-4";

    songs.forEach(song => {
      const title = typeof song === "string" ? song : song?.title;
      if (!title) return;

      const li = document.createElement("li");
      li.textContent = title;
      ul.appendChild(li);
    });
     listOfSongs.appendChild(ul);
  }


function setStatus(text, kind = "info") {
  statusEl.className = "text-center";
  statusEl.innerHTML = "";

  if (kind === "loading") {
    statusEl.innerHTML = `
      <div class="status-row">
        <div class="loader" aria-label="Loading"></div>
        <span class="status-text">${text}</span>
      </div>
    `;
    return;
  }

  const span = document.createElement("span");
  span.className = "text-sm";

  if (kind === "error") span.classList.add("text-red-300");
  else if (kind === "success") span.classList.add("text-emerald-200");
  else span.classList.add("text-slate-300");

  span.textContent = text;
  statusEl.appendChild(span);
}

function clearResults() {
  resultsEl.innerHTML = "";
  highlightsSection.innerHTML = "";
  movieSection.innerHTML = "";
  seriesSection.innerHTML = "";
  recapHeader.classList.add("hidden");
  yearBadge.textContent = "";
}

function renderMonthCard({ month, year, events, index }) {
  const node = tpl.content.firstElementChild.cloneNode(true);

  const isOdd = index % 2 === 0;
  node.classList.add(isOdd ? "justify-start" : "justify-end");

  const card = node.querySelector(".component-card");

  card.classList.add(isOdd ? "reveal-left" : "reveal-right");

  card.style.transitionDelay = `${index * 80}ms`;
  card.dataset.reveal = isOdd ? "left" : "right";

  const title = node.querySelector(".monthTitle");
  const chip = node.querySelector(".monthChip");
  const list = node.querySelector(".monthList");

  title.textContent = `${month} ${year}`;
  title.classList.add(isOdd ? "text-cyan-200" : "text-purple-200");



  for (const e of events) {
    const li = document.createElement("li");
    li.textContent = `• ${e}`;
    li.className = "leading-relaxed";
    list.appendChild(li);
  }

  resultsEl.appendChild(node);
  observer.observe(card);
}

async function fetchYear(year) {
  const url = `${API_BASE}/api/v1/year/${encodeURIComponent(year)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();


  const raw = input.value.trim();
  const year = Number(raw);


  clearTopArtist();
  clearResults();
  setStatus("Fetching data...", "loading");
  submitBtn.disabled = true;
  submitBtn.classList.add("opacity-70", "cursor-not-allowed");

  try {
    const ArtistData = await fetchArtistOfTheYear(year);
    await renderTopArtist(ArtistData,year);

    console.log(ArtistData);
    


  // const data = await fetchYear(year);

  //   const eventsByMonth = data?.events_by_month ?? {};
  //   const entries = Object.entries(eventsByMonth);
  //   const hasEvents = Object.keys(eventsByMonth).length > 0;

  //   if (!hasEvents) {
  //     setStatus(`Found no events for ${year}.`, "error");
  //     return;
  //   }

  //   // Update hero text
      heroText.textContent = `Top artists of the year ${year}`;
  //   //const entries = Object.entries(eventsByMonth);


  //   entries.forEach(([month, events], i) => {
  //     renderMonthCard({ month, year, events, index: i });
  //   });

    setStatus("");
  } catch (err) {
    console.error(err);
    setStatus("Could not fetch data. Is the backend running on 127.0.0.1:8000?", "error");
    clearTopArtist();
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
  }
});
