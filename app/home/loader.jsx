import React from 'react'
import { View, Image, Text } from 'react-native';
import Load from '../../assets/images/loader.png';
import { useEffect } from 'react';
import { router } from 'expo-router';

const Loader = () => {

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/home/creator')
        }, 2000);
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center",flexDirection:"column",backgroundColor:"#000" }}>
            <Image source={Load} alt='Loader' />
            <Text style={{color:"#fff",marginTop:10,fontSize:18}}>Going Live In 3 sec</Text>
        </View>
    )
}

export default Loader
