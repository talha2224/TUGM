import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Load from '../assets/loader.png';

const LoaderScreen = () => {
  const navigation = useNavigation();
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [spinValue, navigation]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image source={Load} style={[styles.image, { transform: [{ rotate: spin }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: 50, // Adjusted for better visibility
    height: 50, 
  },
});

export default LoaderScreen;
