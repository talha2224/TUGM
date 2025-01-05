import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';

const RootLayout = () => {

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboarding')
    }, 2000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor: 'black',}}>
      <Text style={{color: 'white',fontSize:30,fontWeight:"800",textDecorationLine: 'underline',textAlign: 'center',}}>TUGM</Text>
    </View>
  );
};

export default RootLayout;