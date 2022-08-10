import './css/styles.css';

import Notiflix from 'notiflix';

import axios from 'axios'

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = '29159880-83bd8f09217c4813e14c9607d';
let pageNumber = 1;

async function fetchImages(name) {
    try {
      const response = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&page=${pageNumber}&per_page=40`);
     return response.data;
    } catch (error) {
      Notiflix.Notify.warning('error');
    }
  }

const form = document.querySelector('#search-form')
const galleryEl = document.querySelector('.gallery')
const loadBtn = document.querySelector('.load-more')
const tittle = document.querySelector('.search-tittle')

form.addEventListener('submit', createGalery)

async function createGalery (event){
    event.preventDefault();
    galleryEl.innerHTML = ""
    const name = event.target.searchQuery.value;
    const searchResult = await fetchImages(name);
    if(searchResult.hits.length === 0){
      Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    } else {
      tittle.textContent = `Hooray! We found ${searchResult.totalHits} images.`

      await createImagesCard(searchResult.hits);
      const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
      const lightbox = new SimpleLightbox('.gallery a');

      loadBtn.classList.remove('is-hidden')
      loadBtn.addEventListener('click', loadNextGalery)

      async function loadNextGalery(){
      pageNumber += 1;
      const nextResult = await fetchImages(name);

      createImagesCard(nextResult.hits);
      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      });
      lightbox.refresh()
      if (nextResult.hits.length < 40){
        loadBtn.classList.add('is-hidden')
        galleryEl.insertAdjacentHTML('beforeend', `<div><h2 class="result-message">We're sorry, but you've reached the end of search results.</h2></div>`);
      }
    }
  }
    form.reset()
}

function createImagesCard(array){
  const cards = array.reduce((acc, image) => acc + renderCardForImages(image), "");
  return galleryEl.insertAdjacentHTML('beforeend', cards);
}
function renderCardForImages (image) {
    return `<div class="photo-card">
    <a href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width=300 height=300/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <b>${image.likes}</b>
    </p>
    <p class="info-item">
      <b>Views</b>
      <b>${image.views}</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <b>${image.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <b>${image.downloads}</b>
    </p>
  </div>
</div>`
}

