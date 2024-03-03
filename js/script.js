const global = {
  currentPage: window.location.pathname,
  search:
  {
    term: '',
    type:'',
    page: 1,
    totalPage: 1,
    totalResults:0
  },
  api:
  {
    apiKey:'45e0668d6d0fcd6d8abdbb19beaea00b',
    apiURL:'https://api.themoviedb.org/3/'
  }
};

// Popular Movies Page
async function displayPopularMovies() {
  const { results } = await fetchApiData('movie/popular');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
      ${
        movie.poster_path
          ? `<img
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
      class="card-img-top"
      alt="${movie.title}"
    />`
          : `<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${movie.title}"
    />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
      </p>
    </div>`;
    document.querySelector('#popular-movies').appendChild(div);
  });
}

// TV Shows Page
async function displayTVShows() {
  const { results } = await fetchApiData('tv/popular');
  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
               ${
            show.poster_path
              ? `<img
          src="https://image.tmdb.org/t/p/w500${show.poster_path}"
          class="card-img-top"
          alt="${show.name}"
        />`
              : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${show.name}"
        />`
              }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${show.first_air_date}</small>
            </p>
          </div>
          `;
    document.querySelector('#popular-shows').appendChild(div);
  });
}

// TV Details Page
async function displayTVDetails() {
  const showId = window.location.search.split('=')[1];

  const show = await fetchApiData(`tv/${showId}`);

  // Overlay for background image
  displayBackgroundImage('tv', show.backdrop_path);

  const div = document.createElement('div');

      div.innerHTML = `
      <div class="details-top">
      <div>
      ${
        show.poster_path
          ? `<img
        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt="${show.name}"
      />`
          : `<img
      src="../images/no-image.jpg"
      class="card-img-top"
      alt="${show.name}"
    />`
      }
      </div>
      <div>
        <h2>${show.name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${show.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
        <p>
          ${show.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <a href="${
          show.homepage
        }" target="_blank" class="btn">Visit show Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
        <li><span class="text-secondary">Number of Episodes:</span> ${
          show.number_of_episodes
        }</li>
        <li><span class="text-secondary">Last Episode To Air:</span> ${
          show.last_episode_to_air.name
        }</li>
        <li><span class="text-secondary">Status:</span> ${show.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
        ${show.production_companies
          .map((company) => `<span>${company.name}</span>`)
          .join(', ')}
      </div>
    </div>
      `;

  document.querySelector('#show-details').appendChild(div);
};

// Movie Details Page
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  const movID = await fetchApiData(`movie/${movieId}`);
  displayBackgroundImage('movie', movID.backdrop_path);
  const div = document.createElement('div');
    div.innerHTML = `
    <div class="details-top">
               ${
            movID.poster_path
              ? `<img
          src="https://image.tmdb.org/t/p/w500${movID.poster_path}"
          class="card-img-top"
          alt="${movID.name}"
        />`
              : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${movID.name}"
        />`
              }
          <div>
            <h2>${movID.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movID.vote_average.toFixed(1)}
            </p>
            <p class="text-muted">Release Date: ${movID.release_date}</p>
            <p>
              ${movID.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movID.genres.map((genre) =>`<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="#" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${numberWithCommas(movID.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${numberWithCommas(movID.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movID.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movID.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movID.production_companies.map((company)=> `<span>${company.name}</span>`).join(' ')}</div>
        </div>
  `;
  document.querySelector('#movie-details').appendChild(div);
};

// Search Movies and Shows

async function search()
{
  const queryStr = window.location.search;
  const urlParams = new URLSearchParams(queryStr);
  
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null)
  {
    const { results, total_pages, page, total_results } = await searcAPIData();
    global.search.page = page;
    global.search.totalPage = total_pages;
    global.search.totalResults = total_results;
    if (results.length == 0)
    {
      showAlert('No results found');
      return;
    }
    displaySearchResults(results);
    document.querySelector('#search-term').value;
  }
  else
  {
    showAlert('Please enter a search term');
  }
}

// Display Search Movies and Shows
function displaySearchResults(results)
{
  document.querySelector('#search-results').innerHTML = ' ';
  document.querySelector('#search-results-heading').innerHTML = ' ';
  document.querySelector('#pagination').innerHTML = ' ';
  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
    <a href="${global.search.type}-details.html?id=${result.id}">
      ${
        result.poster_path
          ? `<img
      src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
      class="card-img-top"
      alt="${global.search.type === 'movie' ? result.title : result.name}"
    />`
          : `<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${global.search.type === 'movie' ? result.title : result.name}"
    />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
      </p>
    </div>`;
    
    document.querySelector('#search-results-heading').innerHTML = `
      <h2>${results.length} of ${global.search.totalResults} Result for ${global.search.term}</h2>
    `;

    document.querySelector('#search-results').appendChild(div);
  });
  displayPagination();
}

// Display Pagination
function displayPagination()
{
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPage}</div>
  `;

  document.querySelector('#pagination').appendChild(div);

  // Disable prev page
  if (global.search.page === 1)
  {
    document.querySelector('#prev').disabled = true;  
  }

  //Disable next page
  if (global.search.page === global.search.totalPage)
  {
    document.querySelector('#next').disabled = true;  
  }

  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, total_page } = await searcAPIData();
    displaySearchResults(results);  
  });
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, total_page } = await searcAPIData();
    displaySearchResults(results);  
  });
}
// Display Slider Movies
async function displaySlider()
{
  const { results } = await fetchApiData('movie/now_playing');
  results.forEach((movie) =>
  {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
         <a href="movie-details.html?id=${movie.id}">
           <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
         </a>
        <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)}
        </h4>
    `;
    document.querySelector('.swiper-wrapper').appendChild(div);
    initSwiper();
  })
}

function initSwiper()
{
   const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}
// Overlay Backgrouns Image
function displayBackgroundImage(type, backgroundImage)
{
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundImage})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}


// Fetch data from TMDB Api
async function fetchApiData(endpoint)
{
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

  showSpinner();

  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
  const data = await response.json();
  hideSpinner();
  return data;
}

// Search data from API
async function searcAPIData()
{
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

  showSpinner();

  const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`);
  const data = await response.json();
  hideSpinner();
  return data;
}

// Highlight Active Link
function highlightActiveLink()
{
  const links = document.querySelectorAll('.nav-link');
  links.forEach((links) =>
  {
    if (links.getAttribute('href') === global.currentPage)
    {
      links.classList.add('active');  
    }
  })
}

// Show Alert
function showAlert(message, className = 'error')
{
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 2500);
}

// Add Commas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Spinner
function showSpinner()
{
  document.querySelector('.spinner').classList.add('show');
}
function hideSpinner()
{
  document.querySelector('.spinner').classList.remove('show');
}
  
// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displaySlider();
      displayPopularMovies();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/search.html':
      search();
      break;
    case '/shows.html':
      displayTVShows();
      break;
    case '/tv-details.html':
      displayTVDetails();
      break;
  }
  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);