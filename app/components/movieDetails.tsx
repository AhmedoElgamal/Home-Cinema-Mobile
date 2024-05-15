import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, Image, ScrollView } from 'react-native';
import { Movie } from '../types/movie';
import { fetchMovieDetails } from '../utils/api';
import { RouteProp, useRoute } from '@react-navigation/native';

const MovieDetailsPage: React.FC = () => {
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const route = useRoute();

  useEffect(() => {
    const { movieId } = route.params;
    const fetchMovie = async () => {
      const data = await fetchMovieDetails(movieId);
      setMovieDetails(data);
    };
    fetchMovie();
  }, [route.params]);

  if (!movieDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 7.5) {
      return 'green'; // High ratings
    } else if (rating >= 5.0) {
      return 'yellow'; // Medium ratings
    } else {
      return 'red'; // Low ratings
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <Image source={{ uri: "https://image.tmdb.org/t/p/w500"+movieDetails.poster_path }} style={styles.movieImage}/>
      <Text style={styles.title}>{movieDetails.title} <Text style={{color: "silver"}}>[ {movieDetails.original_language} ]</Text></Text>
      <Text style={styles.info}>Release Date: {movieDetails.release_date}</Text>
      <View style={[styles.ratingContainer, { backgroundColor: getRatingColor(movieDetails.vote_average) }]}>
        <Text style={[styles.ratingText, { color: getRatingColor(movieDetails.vote_average) === 'yellow' ? 'black' : 'white' }]}>{movieDetails.vote_average.toFixed(1)}</Text>
      </View>
      <Text style={styles.info}>{movieDetails.overview}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#0A192F',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginVertical: 15,
    marginHorizontal: 10,
    textAlign: "center"
  },
  info: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    textAlign: "center",
    marginHorizontal: "10%"
  },
  movieImage: {
    width: 400,
    height: 400,
    marginRight: 10,
    borderRadius: 8,
    marginBottom: 5,
    marginTop: 10,
    objectFit: "contain"
  },
  ratingContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
    marginTop: 5
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default MovieDetailsPage;
