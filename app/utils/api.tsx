import axios from 'axios';
import { Movie } from '../types/movie';

const API_KEY = 'private';
const BASE_URL = 'https://api.themoviedb.org/3';

const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/';
const IMAGE_SIZE = 'w500';

export const fetchMovies = async (category: string): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${category}`, {
      params: {
        api_key: API_KEY,
      },
    });

    const moviesWithImages = response.data.results.map((movie: any) => ({
      ...movie,
      poster_path: `${BASE_IMAGE_URL}${IMAGE_SIZE}/${movie.poster_path}`,
    }));

    return moviesWithImages;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const fetchMovieDetails = async (movieId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};


