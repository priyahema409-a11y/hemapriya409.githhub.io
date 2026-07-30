// ============ Seed data ============
// Poster colors are simple gradients standing in for real artwork.
const MOVIES = [
  {
    id: "spirited-echoes",
    title: "Spirited Echoes",
    year: 2019,
    genre: "Animation",
    director: "Mei Okonkwo",
    synopsis: "A retired lighthouse keeper discovers her late husband's radio still picks up messages from ships that sank decades ago.",
    poster: "linear-gradient(135deg,#1b3a4b,#5a8f9c)",
    seedReviews: [
      { name: "Priya", rating: 5, comment: "Quiet and devastating in the best way. The sound design alone is worth the watch.", date: "2024-03-11" },
      { name: "Tomas", rating: 4, comment: "Gorgeous animation, though the pacing sags in the middle third.", date: "2024-05-02" }
    ]
  },
  {
    id: "concrete-canyon",
    title: "Concrete Canyon",
    year: 2021,
    genre: "Thriller",
    director: "Rafael Ibarra",
    synopsis: "A city engineer uncovers a decade-old cover-up buried in the blueprints of the subway she's meant to expand.",
    poster: "linear-gradient(135deg,#3a1b1b,#a63446)",
    seedReviews: [
      { name: "Dee", rating: 4, comment: "Tense from the first scene. The final act twist actually earns itself.", date: "2023-11-20" }
    ]
  },
  {
    id: "the-long-orchard",
    title: "The Long Orchard",
    year: 2016,
    genre: "Drama",
    director: "Helen Vance",
    synopsis: "Three estranged siblings return to their family's failing orchard for one last harvest before the land is sold.",
    poster: "linear-gradient(135deg,#2a3a1b,#8f9c5a)",
    seedReviews: [
      { name: "Marcus", rating: 5, comment: "Aching, patient, and beautifully acted. The kind of film that stays with you.", date: "2022-09-14" },
      { name: "Rina", rating: 3, comment: "Beautiful cinematography but a bit slow if you're not in the mood for it.", date: "2023-01-08" },
      { name: "Wes", rating: 4, comment: "The scene at the well near the end got me. Great ensemble cast.", date: "2023-04-30" }
    ]
  },
  {
    id: "static-parade",
    title: "Static Parade",
    year: 2023,
    genre: "Comedy",
    director: "Junko Saito",
    synopsis: "A washed-up local TV weatherman accidentally goes viral and has to decide whether fame is worth losing his sense of humor.",
    poster: "linear-gradient(135deg,#4b3a1b,#e8a33d)",
    seedReviews: [
      { name: "Ola", rating: 4, comment: "Genuinely funny without being mean-spirited. Refreshing.", date: "2024-01-19" }
    ]
  },
  {
    id: "hollow-frequency",
    title: "Hollow Frequency",
    year: 2020,
    genre: "Sci-Fi",
    director: "Bram de Groot",
    synopsis: "A radio astronomer's discovery of a repeating signal forces her to question who — or what — is still listening back.",
    poster: "linear-gradient(135deg,#1b2a3a,#3a5a8f)",
    seedReviews: [
      { name: "Sanjay", rating: 5, comment: "Slow-burn sci-fi done right. The ending recontextualizes everything.", date: "2023-07-02" },
      { name: "Ines", rating: 4, comment: "Smart script, though the middle act leans a little heavy on exposition.", date: "2023-08-15" }
    ]
  },
  {
    id: "paperweight",
    title: "Paperweight",
    year: 2018,
    genre: "Drama",
    director: "Colin Marsh",
    synopsis: "A courthouse stenographer starts rewriting the testimonies she transcribes, convinced she's the only one who can make them true.",
    poster: "linear-gradient(135deg,#3a2a1b,#9c7a5a)",
    seedReviews: []
  },
  {
    id: "the-understudy",
    title: "The Understudy",
    year: 2022,
    genre: "Comedy",
    director: "Farida Haidari",
    synopsis: "A community theater's backup lead has three days to learn the starring role after the star breaks both wrists in a pottery class.",
    poster: "linear-gradient(135deg,#3a1b3a,#a6349c)",
    seedReviews: [
      { name: "Beth", rating: 3, comment: "Charming cast, but a few jokes overstay their welcome.", date: "2024-02-27" }
    ]
  },
  {
    id: "low-tide-forever",
    title: "Low Tide Forever",
    year: 2024,
    genre: "Thriller",
    director: "Noa Reznik",
    synopsis: "A marine biologist tracking a pod of orcas starts finding evidence that someone on her own research vessel doesn't want her to publish.",
    poster: "linear-gradient(135deg,#1b3a34,#3aa68f)",
    seedReviews: [
      { name: "Kwame", rating: 5, comment: "Claustrophobic and paranoid in the best Hitchcock tradition.", date: "2024-06-09" }
    ]
  }
];

const STORAGE_KEY = "marquee_user_reviews_v1";

// ============ State ============
let userReviews = loadUserReviews();
let activeGenre = "All";
let searchTerm = "";
let currentMovieId = null;
let pendingStars = 0;

// ============ Persistence ============
function loadUserReviews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Could not read saved reviews:", e);
    return {};
  }
}

function saveUserReviews() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userReviews));
  } catch (e) {
    console.error("Could not save review:", e);
  }
}

// ============ Derived data helpers ============
function getAllReviews(movie) {
  const extra = userReviews[movie.id] || [];
  return [...movie.seedReviews, ...extra];
}

function getAverage(movie) {
  const all = getAllReviews(movie);
  if (all.length === 0) return null;
  const sum = all.reduce((acc, r) => acc + r.rating, 0);
  return sum / all.length;
}

function getGenres() {
  return ["All", ...new Set(MOVIES.map(m => m.genre))];
}

// ============ Rendering: hero feature ============
function renderFeatured() {
  const rated = MOVIES
    .map(m => ({ movie: m, avg: getAverage(m) }))
    .filter(x => x.avg !== null)
    .sort((a, b) => b.avg - a.avg);

  const el = document.getElementById("featured-film");
  if (rated.length === 0) { el.innerHTML = ""; return; }

  const top = rated[0];
  el.innerHTML = `
    <span class="marquee__feature-badge">Top Rated</span>
    <span class="marquee__feature-name">${escapeHtml(top.movie.title)}</span>
    <span>${top.avg.toFixed(1)} / 5</span>
  `;
}

// ============ Rendering: genre chips ============
function renderGenreChips() {
  const container = document.getElementById("genre-filters");
  container.innerHTML = "";
  getGenres().forEach(genre => {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.textContent = genre;
    btn.setAttribute("aria-pressed", String(genre === activeGenre));
    btn.addEventListener("click", () => {
      activeGenre = genre;
      renderGenreChips();
      renderGrid();
    });
    container.appendChild(btn);
  });
}

// ============ Rendering: movie grid ============
function renderGrid() {
  const grid = document.getElementById("movie-grid");
  const emptyState = document.getElementById("empty-state");
  grid.innerHTML = "";

  const filtered = MOVIES.filter(m => {
    const matchesGenre = activeGenre === "All" || m.genre === activeGenre;
    const haystack = (m.title + " " + m.director).toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  emptyState.hidden = filtered.length !== 0;

  filtered.forEach(movie => {
    const avg = getAverage(movie);
    const count = getAllReviews(movie).length;
    const pct = avg ? (avg / 5) * 100 : 0;

    const card = document.createElement("button");
    card.className = "stub";
    card.setAttribute("aria-label", `View reviews for ${movie.title}`);
    card.innerHTML = `
      <div class="stub__poster" style="background:${movie.poster}">
        <span class="stub__year">${movie.year}</span>
      </div>
      <div class="stub__perforation"></div>
      <div class="stub__body">
        <h2 class="stub__title">${escapeHtml(movie.title)}</h2>
        <span class="stub__meta">${escapeHtml(movie.genre)} · ${escapeHtml(movie.director)}</span>
        <div class="stub__footer">
          <div class="dial" style="--pct:${pct}">
            <div class="dial__inner">${avg ? avg.toFixed(1) : "—"}</div>
          </div>
          <span class="stub__count">${count} review${count === 1 ? "" : "s"}</span>
        </div>
      </div>
    `;
    card.addEventListener("click", () => openModal(movie.id));
    grid.appendChild(card);
  });
}

// ============ Modal: detail + reviews + form ============
function openModal(movieId) {
  currentMovieId = movieId;
  pendingStars = 0;
  renderModal();
  document.getElementById("modal-backdrop").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal-backdrop").hidden = true;
  document.body.style.overflow = "";
  currentMovieId = null;
}

function renderModal() {
  const movie = MOVIES.find(m => m.id === currentMovieId);
  if (!movie) return;

  const avg = getAverage(movie);
  const pct = avg ? (avg / 5) * 100 : 0;
  const reviews = getAllReviews(movie).slice().reverse();

  const reviewsHtml = reviews.length
    ? reviews.map(r => `
        <div class="review">
          <div class="review__head">
            <span class="review__name">${escapeHtml(r.name)}</span>
            <span class="review__stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
          </div>
          <div class="review__date">${escapeHtml(r.date)}</div>
          <p class="review__comment">${escapeHtml(r.comment)}</p>
        </div>
      `).join("")
    : `<p class="no-reviews">No reviews yet — be the first to leave one.</p>`;

  document.getElementById("modal-content").innerHTML = `
    <p class="detail__eyebrow">${escapeHtml(movie.genre)}</p>
    <h2 class="detail__title" id="modal-title">${escapeHtml(movie.title)}</h2>
    <p class="detail__meta">${movie.year} · Directed by ${escapeHtml(movie.director)}</p>
    <p class="detail__synopsis">${escapeHtml(movie.synopsis)}</p>

    <div class="detail__score">
      <div class="dial" style="--pct:${pct}">
        <div class="dial__inner">${avg ? avg.toFixed(1) : "—"}</div>
      </div>
      <span class="stub__count">${reviews.length} review${reviews.length === 1 ? "" : "s"} · out of 5</span>
    </div>

    <hr class="rule">

    <div class="reviews">
      <h3>Reviews</h3>
      ${reviewsHtml}
    </div>

    <hr class="rule">

    <form class="review-form" id="review-form">
      <h3>Leave a review</h3>
      <div class="field">
        <label for="reviewer-name">Your name</label>
        <input type="text" id="reviewer-name" required maxlength="40" placeholder="e.g. Sam">
      </div>
      <div class="field">
        <label>Rating</label>
        <div class="star-picker" id="star-picker" role="radiogroup" aria-label="Rating out of 5">
          ${[1,2,3,4,5].map(n => `<button type="button" data-value="${n}" role="radio" aria-checked="false" aria-label="${n} star${n > 1 ? "s" : ""}">★</button>`).join("")}
        </div>
      </div>
      <div class="field">
        <label for="reviewer-comment">Your feedback</label>
        <textarea id="reviewer-comment" rows="3" required maxlength="500" placeholder="What did you think?"></textarea>
      </div>
      <button type="submit" class="submit-btn">Post review</button>
      <p class="form-note">Reviews are saved in this browser only — they won't be visible to other visitors.</p>
    </form>
  `;

  // Star picker interactivity
  const starButtons = document.querySelectorAll("#star-picker button");
  starButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      pendingStars = Number(btn.dataset.value);
      starButtons.forEach(b => {
        const active = Number(b.dataset.value) <= pendingStars;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-checked", String(Number(b.dataset.value) === pendingStars));
      });
    });
  });

  document.getElementById("review-form").addEventListener("submit", handleReviewSubmit);
}

function handleReviewSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("reviewer-name").value.trim();
  const comment = document.getElementById("reviewer-comment").value.trim();

  if (!name || !comment) return;
  if (pendingStars === 0) {
    alert("Please pick a star rating before posting.");
    return;
  }

  const entry = {
    name,
    rating: pendingStars,
    comment,
    date: new Date().toISOString().slice(0, 10)
  };

  if (!userReviews[currentMovieId]) userReviews[currentMovieId] = [];
  userReviews[currentMovieId].push(entry);
  saveUserReviews();

  renderModal();
  renderGrid();
  renderFeatured();
}

// ============ Utilities ============
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ============ Wire up global controls ============
document.getElementById("search").addEventListener("input", (e) => {
  searchTerm = e.target.value;
  renderGrid();
});

document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-backdrop").addEventListener("click", (e) => {
  if (e.target.id === "modal-backdrop") closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ============ Init ============
renderFeatured();
renderGenreChips();
renderGrid();
initBackgroundAnimation();

// ============ Animated background: drifting light particles ============
function initBackgroundAnimation() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const BG_COLOR = "#0e0e12";
  const PARTICLE_COLORS = ["rgba(232,163,61,", "rgba(166,52,70,", "rgba(242,240,234,"];

  let width, height, particles;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.4,
      speedY: Math.random() * 0.35 + 0.08,
      driftX: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.5 + 0.15,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
    };
  }

  function initParticles() {
    const count = Math.min(90, Math.floor((width * height) / 14000));
    particles = Array.from({ length: count }, makeParticle);
  }

  function drawStatic() {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = p.color + p.opacity + ")";
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function tick() {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.driftX;

      if (p.y < -5) { p.y = height + 5; p.x = Math.random() * width; }
      if (p.x < -5) p.x = width + 5;
      if (p.x > width + 5) p.x = -5;

      ctx.beginPath();
      ctx.fillStyle = p.color + p.opacity + ")";
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(tick);
  }

  resize();
  initParticles();

  if (prefersReducedMotion) {
    drawStatic();
  } else {
    tick();
  }

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      initParticles();
      if (prefersReducedMotion) drawStatic();
    }, 150);
  });
}
