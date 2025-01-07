import React from 'react'
import { View, Image } from 'react-native';
import Load from '../assets/images/loader.png';
import { useEffect } from 'react';
import { router } from 'expo-router';

const Loader = () => {

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/home')
        }, 2000);
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center",backgroundColor:"#000" }}>
            <Image source={Load} alt='Loader' />
        </View>
    )
}

export default Loader
