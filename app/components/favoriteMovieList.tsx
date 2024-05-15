import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Movie } from '../types/movie';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type FavoriteMovieListProps = {
  favorites: Movie[];
  onRemoveFavorite: (movieId: number) => void;
};

const FavoriteMovieList: React.FC<FavoriteMovieListProps> = ({ favorites, onRemoveFavorite }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const navigateToDetails = (movieId: number) => {
    navigation.navigate('components/movieDetails', { movieId });
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

  const getRatingTextColor = (rating: number) => {
    return getRatingColor(rating) === 'yellow' ? 'black' : 'white';
  };

  return (
    <View style={styles.container}>
      {favorites.map(movie => (
          <View style={[styles.movieContainer, { borderBottomColor: 'rgba(192, 192, 192, 0.4)', borderBottomWidth: 1 }]} key={movie.id}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigateToDetails(movie.id)}>
            <Image source={{ uri: "https://image.tmdb.org/t/p/w500"+movie.poster_path }} style={styles.movieImage} />
            </TouchableOpacity>
            <View style={styles.movieDetails}>
              <View style={styles.movieHeader}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => navigateToDetails(movie.id)}>
                <Text style={styles.movieTitle}>{movie.title}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.releaseDate}>Release Date: {movie.release_date}</Text>
              <View style={[styles.movieRatingContainer, { backgroundColor: getRatingColor(movie.vote_average) }]}>
                <Text style={[styles.movieRating, { color: getRatingTextColor(movie.vote_average) }]}>
                  {movie.vote_average.toFixed(1)}
                </Text>
              </View>
              <View style={styles.favoriteContainer}>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => onRemoveFavorite(movie.id)}>
                  <Ionicons name="trash" size={24} color="red" />
                  <Text style={{ color: "red", marginLeft: 5 }}>Remove from Favorites</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      ))}
    </View>
  );
};

export default FavoriteMovieList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  movieContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  movieImage: {
    width: 120,
    height: 180,
    marginRight: 10,
    borderRadius: 8,
    marginBottom: 15
  },
  movieDetails: {
    flex: 1,
  },
  movieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  movieTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: "#FFD700",
    marginBottom: 5
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
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
});
