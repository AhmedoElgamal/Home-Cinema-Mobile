import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadFavorites = createAsyncThunk(
  'movie/loadFavorites',
  async (_, { getState }) => {
    try {
      const favoritesString = await AsyncStorage.getItem('favorites');
      if (favoritesString) {
        const favorites = JSON.parse(favoritesString) as number[];
        return favorites;
      } else {
        return [];
      }
    } catch (error) {
      throw error;
    }
  }
);

const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    favorites: [],
  },
  reducers: {
    addToFavorites: (state :any, action: PayloadAction<number>) => {
      state.favorites.push(action.payload);
      AsyncStorage.setItem('favorites', JSON.stringify(state.favorites))
        .catch(error => console.error('Error saving favorites to AsyncStorage:', error));
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
      AsyncStorage.setItem('favorites', JSON.stringify(state.favorites))
        .catch(error => console.error('Error saving favorites to AsyncStorage:', error));
    },
  },
  extraReducers: builder => {
    builder.addCase(loadFavorites.fulfilled, (state :any, action) => {
      state.favorites = action.payload;
    });
  }
});

export const { addToFavorites, removeFromFavorites } = movieSlice.actions;
export default movieSlice.reducer;
