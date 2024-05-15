import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../types/rootState';
import FavoriteMovieList from '../components/favoriteMovieList';
import { fetchMovieDetails } from '../utils/api';
import { Movie } from '../types/movie';
import { removeFromFavorites } from '../redux/slices/movieSlice';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state: RootState) => state.movie.favorites);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      const movies = await Promise.all(favoriteIds.map((id :any) => fetchMovieDetails(id)));
      setFavoriteMovies(movies.filter((movie :any) => movie !== null));
    };

    fetchFavoriteMovies();
  }, [favoriteIds]);

  const handleRemoveFavorite = (movieId: number) => {
    dispatch(removeFromFavorites(movieId));
    setFavoriteMovies(prevFavorites => prevFavorites.filter(movie => movie.id !== movieId));
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#0A192F", flex: 1 }}>
      <Text style={{color: "white", fontWeight: "bold", textAlign: "center", fontSize: 25, marginVertical: 20}}>Your Favorites</Text>
      <ScrollView>
      {favoriteMovies.length > 0 ? (
        <FavoriteMovieList favorites={favoriteMovies} onRemoveFavorite={handleRemoveFavorite} />
      ) : (
        <View style={{alignItems: "center", flex: 1, justifyContent: "center"}}>
        <Image source={require('../../assets/logoC.png')} style={{width: 300, height: 300, resizeMode: 'contain', marginTop: "20%"}}/>
        <Text style={{color: "white", textAlign: "center", fontSize: 25, fontWeight: "bold", marginBottom: 20, marginTop: -40}}>No Favorite Movies !</Text>
        <Text style={{color: "yellow", textAlign: "center", fontSize: 20, fontWeight: "bold"}}>Try adding some :)</Text>
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FavoritesPage;
