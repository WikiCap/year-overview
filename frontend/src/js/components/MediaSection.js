/**
 * Formats a number of votes into a human-readable string (e.g., 1.2M, 45.3K).
 * 
 * @param {number} votes - The number of votes to format.
 * @returns {string|number} The formatted vote count as a string, or the original number if less than 1000.
 */
function formatVotes(votes) {
  if (votes >= 1000000) {
    return (votes / 1000000).toFixed(1) + 'M';
  }
  if (votes >= 1000) {
    return (votes / 1000).toFixed(1) + 'K';
  }
  return votes;
}

/**
 * Renders the awards and honors section (Oscars) for a specific year.
 * 
 * @param {Object} highlights - Object containing Oscar award data.
 * @param {Object} highlights.oscars - Oscar specific data.
 * @param {Object} highlights.oscars.bestPicture - Data for Best Picture.
 * @param {Object} highlights.oscars.bestActor - Data for Best Actor.
 * @param {Object} highlights.oscars.bestActress - Data for Best Actress.
 * @param {string|number} year - The year to display in the header.
 * @returns {string} HTML string representing the highlights section.
 */
export function renderHighlights(highlights, year) {
    /*
    Storlekar för posters. Mer info på tmbd
    w185 - Small thumbnail
    w342 - Medium size
    w500 - Large
    w780 - Extra large
    original - Full resolution
    */
    const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

    const bestPicture = highlights.oscars.bestPicture;
    const bestActor = highlights.oscars.bestActor;
    const bestActress = highlights.oscars.bestActress;

    return `
        <div class="awards-section-container">
            <div class="awards-year-label">${year}</div>
            <h2 class="awards-section-title title-gradient-sunset">Awards & Honors</h2>

        
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-4">
                <!-- Best Picture Poster (first on mobile, second column on desktop) -->
                <div class="award-card-poster order-first md:order-last">
                    <div class="award-card-poster-inner">
                        <h3 class="award-card-category">Best Picture</h3>
                        ${bestPicture.poster ? `
                            <div class="award-card-poster-image-wrapper">
                                <img 
                                    src="${TMDB_IMAGE_BASE}${bestPicture.poster}" 
                                    alt="${bestPicture.title} poster"
                                    class="award-card-poster-image"
                                    onerror="this.style.display='none'"
                                />
                            </div>
                        ` : '<div class="award-card-poster-placeholder"></div>'}
                        <p class="award-card-name">${bestPicture.title}</p>
                    </div>
                </div>
                
                <!-- Left column with title and actor cards -->
                <div class="flex flex-col gap-6 lg:gap-4 justify-around">
                    <div class="grid grid-cols-2 md:grid-cols-1 gap-6 lg:gap-4 md:space-y-6 lg:md:space-y-4">
                        <!-- Best Actor Card -->
                        <div class="award-card">
                            <div class="award-card-inner">
                                <h3 class="award-card-category">Best Actor</h3>
                                ${bestActor.image ? `
                                    <div class="award-card-image-wrapper">
                                        <img 
                                            src="${TMDB_IMAGE_BASE}${bestActor.image}" 
                                            alt="${bestActor.name}"
                                            class="award-card-image"
                                            onerror="this.style.display='none'"
                                        />
                                    </div>
                                ` : '<div class="award-card-placeholder"></div>'}
                                <p class="award-card-name">${bestActor.name}</p>
                            </div>
                        </div>
                        
                        <!-- Best Actress Card -->
                        <div class="award-card">
                            <div class="award-card-inner">
                                <h3 class="award-card-category">Best Actress</h3>
                                ${bestActress.image ? `
                                    <div class="award-card-image-wrapper">
                                        <img 
                                            src="${TMDB_IMAGE_BASE}${bestActress.image}" 
                                            alt="${bestActress.name}"
                                            class="award-card-image"
                                            onerror="this.style.display='none'"
                                        />
                                    </div>
                                ` : '<div class="award-card-placeholder"></div>'}
                                <p class="award-card-name">${bestActress.name}</p>
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
        </div>
    `;
}

/**
 * Renders a grid of movies.
 * 
 * @param {Array<Object>} movies - Array of movie objects.
 * @param {string} movies[].title - Movie title.
 * @param {string} movies[].poster - Movie poster path.
 * @param {number} movies[].rating - Movie rating.
 * @param {string} movies[].release_date - Movie release date string.
 * @param {number} movies[].votes - Number of votes.
 * @returns {string} HTML string representing the top movies section.
 */
export function renderMovies(movies) {
    const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

    return `
    <section class="mt-20 space-y-6">
      <div class="flex items-center gap-3 ">
        <h2 class="awards-section-title title-gradient-teal shrink-0">Top Movies</h2>
        <div class="grow h-1 rounded-full bg-linear-to-r from-[#03A6A1]/40 to-transparent"></div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        ${movies.map((movie, index) => {
          const isLeft = index % 2 === 0;
          return `
          <div class="movie-card reveal opacity-0 transition-all duration-700 ease-out blur-sm ${isLeft ? '-translate-x-10' : 'translate-x-10'}" data-reveal="${isLeft ? 'left' : 'right'}">
            <div class="movie-card-badge">Released</div>
            ${movie.poster ? `
              <div class="movie-card-poster-wrapper">
                <img 
                  src="${TMDB_IMAGE_BASE}${movie.poster}" 
                  alt="${movie.title} poster"
                  class="movie-card-poster"
                  onerror="this.style.display='none'"
                />
              </div>
            ` : '<div class="movie-card-poster-placeholder"></div>'}
            <div class="movie-card-content">
              <div class="flex items-start justify-between gap-2 mb-1">
                <h3 class="movie-card-title flex-1">${movie.title}</h3>
                <div class="movie-card-votes-wrapper">
                  <p class="movie-card-rating">${movie.rating}</p>
                </div>
              </div>
              <div class="flex items-center justify-between gap-2">
                <p class="movie-card-date">${new Date(movie.release_date).toLocaleDateString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p class="movie-card-votes">${formatVotes(movie.votes)} votes</p>
              </div>
            </div>
          </div>
        `}).join("")}
      </div>
    </section>
  `;
}

/**
 * Renders a grid of TV series.
 * 
 * @param {Array<Object>} series - Array of series objects.
 * @param {string} series[].title - Series title.
 * @param {string} series[].poster - Series poster path.
 * @param {number} series[].rating - Series rating.
 * @param {string} series[].release_date - Series release date (first air date).
 * @param {number} series[].votes - Number of votes.
 * @param {number} year - The year being displayed.
 * @returns {string} HTML string representing the top series section.
 */
export function renderSeries(series, year) {
  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

  return `
    <section class="mt-20 space-y-6">
      <div class="flex items-center gap-3 justify-end">
        <div class="grow h-1 rounded-full bg-linear-to-r from-transparent to-[#FF4F0F]/40"></div>
        <h2 class="awards-section-title title-gradient-vermilion shrink-0">Top Series</h2>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        ${series.map((serie, index) => {
          const isLeft = index % 2 === 0;
          const releaseYear = new Date(serie.release_date).getFullYear();
          const releaseText = releaseYear === Number(year) ? 'First released' : `New season ${year}`;

          return `
          <div class="series-card reveal opacity-0 transition-all duration-700 ease-out blur-sm ${isLeft ? '-translate-x-10' : 'translate-x-10'}" data-reveal="${isLeft ? 'left' : 'right'}">
            <div class="series-card-badge">${releaseText}</div>
            ${serie.poster ? `
              <div class="series-card-poster-wrapper">
                <img 
                  src="${TMDB_IMAGE_BASE}${serie.poster}" 
                  alt="${serie.title} poster"
                  class="series-card-poster"
                  onerror="this.style.display='none'"
                />
              </div>
            ` : '<div class="series-card-poster-placeholder"></div>'}
            <div class="series-card-content">
              <div class="flex items-start justify-between gap-2 mb-1">
                <div class="series-card-votes-wrapper">
                  <p class="series-card-rating text-right">${serie.rating}</p>
                </div>
                <h3 class="series-card-title flex-1 text-right">${serie.title}</h3>
              </div>
              <div class="flex items-center justify-between gap-2">
                <p class="series-card-votes">${formatVotes(serie.votes)} votes</p>
                <p class="series-card-date text-right">${new Date(serie.release_date).toLocaleDateString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        `}).join("")}
      </div>
    </section>
  `;
}





