import { useNavigation } from '@react-navigation/core';
import React, { useRef } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

const AdsScreen = () => {
  const videoRef = useRef(null);
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#000', }}>
      <Video ref={videoRef} source={{ uri: 'https://videos.pexels.com/video-files/6548176/6548176-hd_1920_1080_24fps.mp4' }} style={{ width, height }} resizeMode="contain" controls={true} onLoadStart={() => console.log("Loading video...")} onLoad={() => console.log("Video Loaded!")} onError={(error) => console.log("Video Error:", error)} />
      <TouchableOpacity style={{ position: 'absolute', top: 50, right: 20 }} onPress={() => { navigation.navigate("Home") }}>
        <Text style={{ color: 'white', fontSize: 20 }}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdsScreen;
