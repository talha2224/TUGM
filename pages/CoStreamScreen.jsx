import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Image, Dimensions, Animated, } from 'react-native';
import ZegoUIKitPrebuiltLiveStreaming, { HOST_DEFAULT_CONFIG } from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn';
import * as ZIM from 'zego-zim-react-native';

import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import config from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Santa from '../assets/Santa.png';
import Img2 from '../assets/2.png';
import Img3 from '../assets/3.png';
import Img4 from '../assets/4.png';
import Img5 from '../assets/5.png';
import Img6 from '../assets/6.png';
import Img7 from '../assets/7.png';
import Img8 from '../assets/8.png';
import { io } from 'socket.io-client';

const APP_ID = 544861619;
const APP_SIGN = "2d10fa4bdb4c634a610edddd16044c73bb0d32607ffe7ce8efb50bbea65cb28c";
// const APP_ID = 785451540;
// const APP_SIGN = "aa7a9ca9603b25fb2aa04b1f1283f0f7ac9d7745015c75d8756d0c7baba9bc82";

const giftImages = {
    Santa: Santa,
    Img2: Img2,
    Img3: Img3,
    Img4: Img4,
    Img5: Img5,
    Img6: Img6,
    Img7: Img7,
    Img8: Img8
};



const CoStreamScreen = ({ route }) => {
    const { streamId } = route.params;
    let randomUserID = String(Math.floor(Math.random() * 100000))
    const navigation = useNavigation();


    const [data, setData] = useState({});
    const [streamInfo, setStreamInfo] = useState(null)
    const [fadeAnim] = useState(new Animated.Value(0));
    const [gift, setGift] = useState(null);
    const [bidInfo] = useState(false);

    const fetchProfileInfo = async () => {
        try {
            let userId = await AsyncStorage.getItem('userId');
            let res = await axios.get(`${config.baseUrl}/account/single/${userId}`);
            if (res?.data) {
                setData(res?.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const fetchStreamInfo = async () => {
        try {
            let res = await axios.get(`${config.baseUrl}/stream/stream/${streamId}`);
            if (res?.data) {
                console.log(res?.data?.data, 'fetchStreamInfo')
                setStreamInfo(res?.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };


    const fetchGifts = async () => {
        try {
            let userId = await AsyncStorage.getItem('userId');
            if (streamInfo?._id) {
                let res = await axios.get(`${config.baseUrl2}/gift/${userId}/${streamInfo?._id}`);
                if (res?.data?.data) {
                    setGift({
                        streamId: res?.data?.data?.streamId,
                        userId: res?.data?.data?.userId?._id,
                        username: res?.data?.data?.userId?.username,
                        name: res?.data?.data?.image
                    });
                    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
                    setTimeout(() => {
                        Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => setGift(null));
                    }, 4000);
                }
            }
        }
        catch (error) {
            console.log(error, 'error in fetch gifts')
        }
    }

    useEffect(() => {
        fetchProfileInfo();
        fetchStreamInfo();
        const interval = setInterval(() => {
            fetchGifts();
        }, 4000);
        return () => clearInterval(interval);
    }, [])


    // data?.username 
    return (
        <View style={styles.container}>

            <ZegoUIKitPrebuiltLiveStreaming
                appID={APP_ID}
                appSign={APP_SIGN}
                userID={randomUserID}
                userName={'Co Host:'+"John"}
                liveID={"streamId"}

                config={{
                    ...HOST_DEFAULT_CONFIG,
                    onStartLiveButtonPressed: () => { },
                    onLiveStreamingEnded: () => { },
                    onLeaveLiveStreaming: () => { navigation.navigate('Home') },
                }}
                plugins={[ZIM]}
            />



            {gift && (
                <Animated.View style={[styles.giftContainer, { opacity: fadeAnim }]}>
                    <Image source={giftImages[gift.name]} style={styles.giftImage} />
                    <Text style={styles.giftText}>{gift.username} sent a gift!</Text>
                </Animated.View>
            )}

            {bidInfo && (
                <Animated.View style={[styles.giftContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.giftText}>{bidInfo?._doc?.username} added a bid! of $ {bidInfo?.amount}</Text>
                </Animated.View>
            )}



        </View>
    );
};

const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('screen').height,
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    coverImage: {
        flex: 1,
    },
    bottomIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20, // Add some bottom padding
        position: 'absolute',
        bottom: 5, // Adjust as needed for BottomNavBar
        left: 0,
        right: 0,
    },
    commentInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    commentInput: {
        flex: 1,
        height: 40,
        color: 'white',
    },
    sendButton: {
        padding: 10
    },
    bidButton: {
        backgroundColor: 'orange',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bidButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    rightIconsContainer: {
        position: 'absolute',
        bottom: 120, // Adjust top position as needed
        right: 10,
        alignItems: 'center', // Center icons vertically
    },
    priceContainer: {
        borderRadius: 10,
        padding: 10,
        marginTop: 10
    },
    price: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16
    },
    timer: {
        color: "red"
    },
    rightIconButton: {
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10, // Add spacing between icons
    },
    leftContainer: {
        position: 'absolute',
        bottom: 150, // Adjust top position as needed
        left: 20,
        right: 70
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20
    },
    cancelButton: {
        borderWidth: 1,
        backgroundColor: "#1A1A1A",
        borderRadius: 25,
        padding: 10,
        width: "48%",
        alignItems: "center"
    },
    cancelText: {
        color: "white"
    },
    startAuctionButton: {
        backgroundColor: "orange",
        borderRadius: 25,
        padding: 10,
        width: "48%",
        alignItems: "center"
    },
    startAuctionText: {
        color: "white"
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent2: {
        backgroundColor: '#000',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
    },
    categoryContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    button: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'gray',
        marginRight: 10,
        backgroundColor: "#1A1A1A"
    },
    activeButton: {
        borderColor: '#FFA500',
        backgroundColor: '#FFA500',
    },
    inActiveButtonText: {
        color: "grey"
    },
    buttonText: {
        color: "black"
    },
    viewStoreButton: {
        borderRadius: 30,
        padding: 5,
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "white",
        width: 100,
        marginTop: 10
    },
    viewStoreText: {
        color: "black"
    },
    sectionHeader: {
        color: "white",
        fontWeight: "bold",
        marginBottom: 10
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        backgroundColor: "#1A1A1A"
    },
    inputLabel: {
        color: "grey"
    },
    inputValue: {
        color: "white"
    },
    timeContainer: {
        marginBottom: 20
    },
    timeOptionsContainer: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    timeOption: {
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: "#1A1A1A",
        marginTop: 10
    },
    activeTimeOption: {
        backgroundColor: "orange",
        borderColor: "orange"
    },
    timeOptionText: {
        color: "white"
    },
    inActiveTimeOptionText: {
        color: "white"
    },
    suddenDeathContainer: {
        padding: 10,
        marginBottom: 20
    },
    suddenDeathDescription: {
        color: "grey",
        marginTop: 10
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cancelButton: {
        borderWidth: 1,
        backgroundColor: "#1A1A1A",
        borderRadius: 25,
        padding: 10,
        width: "48%",
        alignItems: "center"
    },
    cancelText: {
        color: "white"
    },
    startAuctionButton: {
        backgroundColor: "orange",
        borderRadius: 25,
        padding: 10,
        width: "48%",
        alignItems: "center"
    },
    startAuctionText: {
        color: "white"
    },
    giftContainer: {
        position: "absolute",
        top: 80,
        left: "30%",
        transform: [{ translateX: -50 }],
        backgroundColor: "rgba(52, 52, 52, 0.8)",
        padding: 10,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 30
    },
    giftImage: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    giftText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default CoStreamScreen;

