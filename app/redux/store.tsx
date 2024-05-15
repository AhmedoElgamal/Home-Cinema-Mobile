import { configureStore } from '@reduxjs/toolkit';
import movieReducer, { loadFavorites } from './slices/movieSlice';

const store = configureStore({
  reducer: {
    movie: movieReducer,
  },
});

store.dispatch(loadFavorites());

export default store;
