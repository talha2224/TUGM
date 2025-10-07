import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import image1 from '../assets/login-1.png';
import image2 from '../assets/login-2.png';
import image3 from '../assets/login-3.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const onboardingData = [
    {
        image: image1,
        title: 'Welcome to TUGM - Shop, Stream, and Bid in Real-Time!',
        description: 'Experience the future of shopping with live streaming, exclusive auctions, and instant purchases',
    },
    {
        image: image2,
        title: 'Join Live Streams and Bid for Your Favorite Products!',
        description: 'Interact with sellers in real-time, place bids, and secure one-of-a-kind deals before they\'re gone.',
    },
    {
        image: image3,
        title: 'Shop Smarter, Bid Better, Win More!',
        description: 'Explore our innovative features: live bidding, personalized recommendations, and secure checkouts—all in one place.',
    },
];

const OnboardingScreen = () => {
    const [currentScreen, setCurrentScreen] = useState(0);
    const { width, height } = Dimensions.get('window');
    const translateX = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    const nextScreen = () => {
        if (currentScreen < onboardingData.length - 1) {
            Animated.timing(translateX, { toValue: -(currentScreen + 1) * width, duration: 300, useNativeDriver: true, }).start(() => { setCurrentScreen(currentScreen + 1); });
        }
        else {
            navigation.replace('Login');
        }
    };

    const skipOnboarding = () => {
        navigation.replace('Login');
    };

    useEffect(() => {
        const timer = setTimeout(async () => {
            let userId = await AsyncStorage.getItem('userId');
            if (userId?.length > 0) {
                navigation.replace('Home');
                return;
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={{ flexDirection: "row", width: width * onboardingData.length, transform: [{ translateX }] }}>
                {onboardingData.map((item, index) => (
                    <ImageBackground key={index} source={item.image} style={[styles.backgroundImage, { width, height }]} resizeMode="cover">
                        <View style={styles.contentContainer}>
                            <View style={[styles.textContainer, styles.shadowBox]}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                            <View style={[styles.bottomContainer, styles.bottomShadow]}>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={skipOnboarding}>
                                        <Text style={styles.skipButton}>Skip</Text>
                                    </TouchableOpacity>
                                    <View style={styles.dotsContainer}>
                                        {onboardingData.map((_, index) => (
                                            <View key={index} style={[styles.dot, currentScreen === index && styles.activeDot]} />
                                        ))}
                                    </View>
                                    <TouchableOpacity style={styles.nextButton} onPress={nextScreen}>
                                        <AntDesign name="arrowright" size={20} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                ))}
            </Animated.View>
        </View>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    contentContainer: {
        padding: 20,
        marginBottom: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        marginHorizontal: 20,
        borderRadius: 30,
    },
    textContainer: {
        alignItems: 'start',
    },
    title: {
        fontSize: 18,
        fontWeight: '900',
        color: 'white',
        textAlign: 'start',
        marginBottom: 10,
        lineHeight: 25,
    },
    description: {
        fontSize: 16,
        color: '#D4D4D4',
        textAlign: 'start',
    },
    bottomContainer: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nextButton: {
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 5,
    },
    skipButton: {
        color: 'white',
        fontSize: 16,
    },
    dotsContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'transparent',
        marginHorizontal: 5,
        borderColor: "gray",
        borderWidth: 2
    },
    activeDot: {
        backgroundColor: 'white',
        borderWidth: 0
    },
});
