"use strict";
// const $showsList = $("#showsList");
// const $episodesArea = $("#episodesArea");
// const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

const backUpUrl = 'https://tinyurl.com/tv-missing'
const tvShowTitle = document.querySelector('#searchForm-term')
const term = tvShowTitle.value;

async function getShowsByTerm(term) {
  const results = await axios.get('http://api.tvmaze.com/search/shows', { params: { q: term } })
  // console.log(results)
  //to filter out data we would like to display/show
  //map is used to iterate over results.data array and generate filtered array with elements we would like to show.
  return (results.data.map(res => {
    const show = res.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : backUpUrl
    }
  }));
}


/** Given list of shows, create markup for each and to DOM */
function populateShows(shows) {
  const showsList = document.querySelector('#showsList');
  showsList.innerHTML = "";

  for (let show of shows) {
    const showDetails = document.createElement('div')
    showDetails.classList.add("Show", "col-md-12", "col-lg-6", "mb-4")
    showDetails.setAttribute("data-show-id", show.id)
    showDetails.innerHTML = `
    <div class = "media">
      <img src="${show.image}"
        alt="${show.name}"
        class = "w-25 me-3">
      <div class="media-body">
        <h5 class = "text-primary"> ${show.name}</h5>
        <div> <small> ${show.summary} </small> </div>
        <button class = "btn btn-outline-light btn-sm Show-getEpisodes"> Episodes </button>
      </div>
    </div>
    `
    showsList.appendChild(showDetails);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

const searchForm = document.querySelector('#searchForm')

searchForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const term = document.querySelector('#searchForm-term').value;
  const shows = await getShowsByTerm(term);
  populateShows(shows)
})



const episodeList = document.querySelector('#episodesList')

async function getEpisode(id) {
  const getId = await getShowsByTerm(term)
  const result = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)

  return result.data.map(res => ({
    id: res.id,
    name: res.name,
    season: res.season,
    number: res.number
  }))
}

function populateEpisodes(episodes) {
  const episodesList = document.querySelector('#episodesList');
  for (let episode of episodes) {
    const listedEpisodes = document.createElement('li');
    listedEpisodes.innerHTML = `Episode name - ${episode.name}, season - ${episode.season}, Episode number - ${episode.number}`;
    episodeList.appendChild(listedEpisodes);
  }
document.querySelector('#episodesArea').style.display = 'block';

}

const showsList = document.querySelector('#showsList')
showsList.addEventListener('click', async function (e) {

  if (e.target.classList.contains('Show-getEpisodes')) {
    e.preventDefault();
    const closestShow = e.target.closest('.Show');
    const showId = closestShow ? closestShow.dataset.showId : null;
    const Episodes = await getEpisode(showId);
    populateEpisodes(Episodes);
  }

})


// /** Given a show ID, get from API and return (promise) array of episodes:
//  *      { id, name, season, number }
//  */

// // async function getEpisodesOfShow(id) { }

// /** Write a clear docstring for this function... */

// // function populateEpisodes(episodes) { }
