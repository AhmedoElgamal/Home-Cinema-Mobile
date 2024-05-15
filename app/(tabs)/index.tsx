import React, { useEffect, useState, useRef } from 'react';
import { View, SafeAreaView, ScrollView, TextInput, StyleSheet, Text, Image, Dimensions, FlatList, Animated } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { fetchMovies } from '../utils/api';
import { Movie } from '../types/movie';
import MovieList from '../components/movieList';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');
const CAROUSEL_INTERVAL = 3000; // 3 seconds

const HomePage = () => {
  const [category, setCategory] = useState('popular');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showingMovies, setShowingMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const [isFontLoaded] = useFonts({
    CustomFont: require('../../assets/fonts/MightySouly.ttf'),
  });

  useEffect(() => {
    fetchMoviesData();
    fetchShowingMovies();
    startCarousel();
  }, [category, searchQuery]);

  const fetchShowingMovies = async () => {
    const data = await fetchMovies('now_playing');
    setShowingMovies(data);
  };

  const fetchMoviesData = async () => {
    const data = await fetchMovies(category);
    setMovies(data);
  };

  const handleSearch = () => {
    setSearchQuery('');
    scrollViewRef.current?.scrollTo({ x: 0, y: 550, animated: true });
  };

  const handleFilterSelection = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 550, animated: true });
  };

  const filteredMovies = movies.filter(movie => {
    return movie.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderCarouselItem = ({ item, index }: { item: Movie, index: number }) => {
    return (
      <View style={styles.carouselItemContainer}>
        <Image source={{ uri: item.poster_path }} style={styles.carouselItemPoster} />
      </View>
    );
  };

  const startCarousel = () => {
    setInterval(() => {
      const newIndex = (featuredIndex + 1) % filteredMovies.length;
      setFeaturedIndex(newIndex);
      scrollToIndex(newIndex);
    }, CAROUSEL_INTERVAL);
  };

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < filteredMovies.length) {
      const offset = index * width;
      scrollViewRef.current?.scrollTo({ x: offset, y: 0, animated: true });
    }
  };

  if (!isFontLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#0A192F', flex: 1 }}>
      <View style={styles.header}>
        <Image source={require('../../assets/logoC.png')} style={styles.logo} />
        <Text style={styles.headerTitle}><Text style={{color: "red"}}>H</Text>ome <Text style={{color: "red"}}>C</Text>inema</Text>
      </View>
      <ScrollView ref={scrollViewRef}>
        <FlatList
          data={showingMovies}
          renderItem={renderCarouselItem}
          horizontal
          pagingEnabled
          keyExtractor={(item, index) => `${item.id}_${index}`}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
        />
        <View style={styles.footerBar}>
          <Text style={styles.footerText}>Now Showing...</Text>
        </View>
        <View style={styles.toolbar}>
          <TextInput
            style={styles.searchBar}
            placeholderTextColor="#000000"
            placeholder="Search Movies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearch}
          />
          <RNPickerSelect
            value={category}
            onOpen={handleFilterSelection}
            onValueChange={(value) => setCategory(value)}
            items={[
              { label: 'Popular', value: 'popular' },
              { label: 'Top Movies', value: 'top_rated' },
              { label: 'Upcoming Movies', value: 'upcoming' },
              { label: 'Now Playing Movies', value: 'now_playing' },
            ]}
            style={pickerSelectStyles}
            Icon={() => {
              return <Ionicons name="caret-down-outline" size={24} color="black" style={{ marginRight: 10 }} />;
            }}
            placeholder={{}}
          />
        </View>
        <ScrollView style={{minHeight: 570}}>
          {filteredMovies.length > 0 ? (
            <MovieList movies={filteredMovies} />
          ) : (
            <Text style={styles.noResultsText}>No Results Found !</Text>
          )}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    marginBottom: 10,
    marginHorizontal: 20
  },
  logo: {
    width: 90,
    height: 60,
    resizeMode: 'contain',
    marginRight: 10,
  },
  headerTitle: {
    fontFamily: 'CustomFont',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  carouselItemContainer: {
    width,
    height,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: -150
  },
  carouselItemPoster: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  footerBar: {
    position: 'relative',
    bottom: 0,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginTop: -45
  },
  footerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 10
  },
  searchBar: {
    height: 40,
    width: '60%',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingLeft: 10,
    color: '#000000',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: "40%",
    fontSize: 20,
    fontWeight: 'bold',
    color: "white"
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    width: 143,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 40,
  },
  inputAndroid: {
    height: 40,
    width: 150,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 40,
  },
  iconContainer: {
    top: 10,
    right: 10,
  },
});

export default HomePage;
