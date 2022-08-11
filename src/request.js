import axios from 'axios'
import Notiflix from 'notiflix';
const API_KEY = '29159880-83bd8f09217c4813e14c9607d';

export default async function fetchImages(name, pageNumber) {
    try {
      const response = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&page=${pageNumber}&per_page=40`);
     return response.data;
    } catch (error) {
      Notiflix.Notify.warning('error');
    }
  }