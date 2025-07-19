import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DefaultScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(async() => {
      let userId = await AsyncStorage.getItem('userId');
      if(userId?.length>0){
        navigation.replace('Home');
        return;
      }
      navigation.replace('Onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>TUGM</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: '800',

  }
})

export default DefaultScreen;
