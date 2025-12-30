import {renderMovies, renderSeries} from "../components/MediaSection.js";
const app = document.getElementById("app")

document.getElementById("searchForm").addEventListener("submit", getMovies);
const baseURL = "http://localhost:8000/api/v1";

async function getMovies(event) {
  event.preventDefault();
  const year = document.getElementById("year").value;
  const URL = `${baseURL}/year/${year}`

  const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }

    const response = await fetch(URL, options);
    const data = await response.json();
    console.log(data);

    const sortedMovies = [...data.movies.topMovies].sort((a, b) => b.rating - a.rating);
    document.getElementById("movieSection").innerHTML = renderMovies(sortedMovies);

    const sortedSeries = [...data.series.topSeries].sort((a, b) => b.rating - a.rating);
    document.getElementById("seriesSection").innerHTML = renderSeries(sortedSeries);
}