import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Movie } from '../types/movie';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../redux/slices/movieSlice';
import { RootState } from '../types/rootState';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type MovieListProps = {
  movies: Movie[];
};

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state: RootState) => state.movie.favorites);
  const navigation = useNavigation();

  const isFavorite = (movieId: number) => {
    return favoriteIds.includes(movieId);
  };

  const toggleFavorite = (movieId: number) => {
    if (isFavorite(movieId)) {
      dispatch(removeFromFavorites(movieId));
    } else {
      dispatch(addToFavorites(movieId));
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 7.5) {
      return 'green'; // High ratings
    } else if (rating >= 5.0) {
      return 'yellow'; // Medium ratings
    } else {
      return 'red'; // Low ratings
    }
  };

  const navigateToDetails = (movieId: number) => {
    navigation.navigate('components/movieDetails', { movieId });
  };

  return (
    <View style={styles.container}>
      {movies.map(movie => (
          <View style={styles.movieContainer} key={movie.id}>
            <View style={[styles.movieContent, { borderBottomColor: 'rgba(192, 192, 192, 0.4)', borderBottomWidth: 1 }]}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => navigateToDetails(movie.id)}>
                <Image source={{ uri: movie.poster_path }} style={styles.movieImage} />
              </TouchableOpacity>
              <View style={styles.detailsContainer}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigateToDetails(movie.id)}>
                  <Text style={styles.movieTitle}>{movie.title}</Text>
                </TouchableOpacity>
                <Text style={styles.releaseDate}>Release Date: {movie.release_date}</Text>
                <View style={[styles.movieRatingContainer, { backgroundColor: getRatingColor(movie.vote_average) }]}>
                  <Text style={[styles.movieRating, { color: getRatingColor(movie.vote_average) === 'yellow' ? 'black' : 'white' }]}>
                    {movie.vote_average.toFixed(1)}
                  </Text>
                </View>
                <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(movie.id)}>
                  <Ionicons
                    name={isFavorite(movie.id) ? 'heart' : 'heart-outline'}
                    size={24}
                    color={isFavorite(movie.id) ? 'red' : 'white'}
                  />
                  <Text style={styles.favoriteButtonText}>{isFavorite(movie.id) ? 'Remove from Favorites' : 'Add to Favorites'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  movieContainer: {
    marginBottom: 20,
  },
  movieContent: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  movieImage: {
    width: 120,
    height: 180,
    marginRight: 10,
    borderRadius: 8,
    marginBottom: 5
  },
  detailsContainer: {
    flex: 1,
  },
  movieTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: "#FFD700",
    marginBottom: 10,
  },
  releaseDate: {
    fontSize: 12,
    color: '#C0C0C0',
    marginBottom: 15,
  },
  movieRatingContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  movieRating: {
    fontWeight: 'bold',
    color: 'white',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  favoriteButtonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default MovieList;
