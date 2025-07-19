import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground, Text, TouchableOpacity, TextInput, Image, Pressable, Platform, Dimensions, ToastAndroid, Keyboard, Animated, Alert } from 'react-native';
import { io } from "socket.io-client";
import Santa from '../assets/Santa.png';
import Img2 from '../assets/2.png';
import Img3 from '../assets/3.png';
import Img4 from '../assets/4.png';
import Img5 from '../assets/5.png';
import Img6 from '../assets/6.png';
import Img7 from '../assets/7.png';
import Img8 from '../assets/8.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import config from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ZegoUIKitPrebuiltLiveStreaming, { AUDIENCE_DEFAULT_CONFIG, ZegoMenuBarButtonName, } from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn'; 
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import * as ZIM from 'zego-zim-react-native';

const APP_ID = 785451540;
const APP_SIGN = "aa7a9ca9603b25fb2aa04b1f1283f0f7ac9d7745015c75d8756d0c7baba9bc82";
let randomUserID = String(Math.floor(Math.random() * 100000))

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

const SingleStreamScreen = ({ route }) => {
    // const socket = io(config.socketUrl);

    const { streamId } = route.params;
    const dispatch = useDispatch();
    const [amount, setAmount] = useState(0);
    const [uId, setuId] = useState("")
    const [data, setData] = useState({});
    const [streamInfo, setStreamInfo] = useState(null);
    const [biddingInfo, setbiddingInfo] = useState([])
    const [quantity, setQuantity] = useState(1)
    const navigation = useNavigation();
    const [showShirts, setshowShirts] = useState(false)
    const [showGifts, setshowGifts] = useState(false)
    const [wallet, setwallet] = useState(false)
    const [showBid, setshowBid] = useState(false);

    const [gift, setGift] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [bidInfo, setbidInfo] = useState(false)

    const fetchProfileInfo = async () => {
        try {
            let userId = await AsyncStorage.getItem('userId');
            setuId(userId)
            let res = await axios.get(`${config.baseUrl2}/account/single/${userId}`);
            if (res?.data) {
                setData(res?.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchStreamInfo = async () => {
        try {
            let res = await axios.get(`${config.baseUrl2}/stream/stream/${streamId}`);
            if (res?.data) {
                setStreamInfo(res?.data?.data);
                fetchBidInfo(res?.data?.data?._id)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchBidInfo = async (streamIds) => {
        try {
            let res = await axios.get(`${config.baseUrl2}/bidding/all/${streamIds}`);
            if (res?.data) {
                setbiddingInfo(res?.data?.data)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddToCard = (product) => {
        ToastAndroid.show('Item Added In Cart', ToastAndroid.SHORT);
        dispatch(addToCart({ ...product, quantity }));
    };

    const proceed = async () => {
        Keyboard.dismiss();
        setwallet(false)
        let userId = await AsyncStorage.getItem('userId');
        try {
            let paymentIntentRes = await axios.post(`${config.baseUrl2}/payment/create-intent`, { amount: amount * 100, currency: "usd" });
            if (!paymentIntentRes?.data?.clientSecret) {
                throw new Error("Failed to fetch payment intent");
            }
            let clientSecret = paymentIntentRes?.data?.clientSecret
            if (clientSecret) {
                const initResponse = await initPaymentSheet({ merchantDisplayName: "User", paymentIntentClientSecret: clientSecret })
                if (initResponse.error) {
                    Alert.alert(initResponse?.error?.message)
                    return
                }
                else {
                    const paymentResponse = await presentPaymentSheet()
                    if (paymentResponse.error) {
                        Alert.alert(paymentResponse?.error?.message)
                        return
                    }
                    else {
                        let res = await axios.put(`${config.baseUrl2}/account/buy/${userId}`, { dollars: amount });
                        if (res?.data) {
                            ToastAndroid.show('Coin Purchased Successfully!', ToastAndroid.SHORT);
                            setAmount(0)
                            fetchProfileInfo();
                        }
                    }
                }

            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleSendGifts = async (coins, name) => {
        if (data?.coins < coins) {
            ToastAndroid.show('Not Enough Coins', ToastAndroid.SHORT);
            setshowGifts(false)
            return
        }
        let userId = await AsyncStorage.getItem('userId');

        let res = await axios.post(`${config.baseUrl}/gift/create`, { userId, streamId: streamInfo?._id, image: name });

        if (res?.data?.data) {
            ToastAndroid.show('Gift Sent!', ToastAndroid.SHORT);
            setshowGifts(false)
            fetchGifts()
        }



        // socket.emit("sendGift", { streamId, userId: userId, username: data?.username, coins, name });
        // setGift({ streamId, userId: userId, username: data?.username, coins, name });
        // Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
        // setTimeout(() => {
        //     Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => setGift(null));
        // }, 4000);
    }

    const handleBid = async () => {
        Keyboard.dismiss();
        setshowBid(false)
        const highestBid = biddingInfo.length > 0 ? Math.max(...biddingInfo.map(bid => Number(bid.amount) || 0)) : (0);
        if (amount <= highestBid) {
            Alert.alert("Bid Error", `Your bid must be higher than the current highest bid of $${highestBid}`);
            return;
        }

        try {
            let paymentIntentRes = await axios.post(`${config.baseUrl2}/payment/create-intent`, { amount: amount * 100, currency: "usd" });
            if (!paymentIntentRes?.data?.clientSecret) {
                throw new Error("Failed to fetch payment intent");
            }
            let clientSecret = paymentIntentRes?.data?.clientSecret
            if (clientSecret) {
                const initResponse = await initPaymentSheet({ merchantDisplayName: "User", paymentIntentClientSecret: clientSecret })
                if (initResponse.error) {
                    Alert.alert(initResponse?.error?.message)
                    return
                }
                else {
                    const paymentResponse = await presentPaymentSheet()
                    if (paymentResponse.error) {
                        Alert.alert(paymentResponse?.error?.message)
                        return
                    }
                    else {
                        let userId = await AsyncStorage.getItem('userId');
                        // socket.emit("bid", { streamId2: streamId, streamId: streamInfo?._id, userId: userId, amount: Number(amount) });
                        ToastAndroid.show('Bid Added!', ToastAndroid.SHORT);
                        setAmount(0);
                        setbidInfo({ streamId2: streamId, streamId: streamInfo?._id, userId: userId, amount: Number(amount) });
                        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
                        setTimeout(() => {
                            setbidInfo(null);
                        }, 3000);
                    }
                }

            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const fetchGifts = async () => {
        try {

            if (streamInfo?._id) {
                let res = await axios.get(`${config.baseUrl4}/gift/${uId}/${streamInfo?._id}`);
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
    }, []);



    return (
        <View style={styles.container}>


            <ZegoUIKitPrebuiltLiveStreaming
                appID={382727773}
                appSign={"05ab936d7afac9e4902120753c86bdbbeaa66665a84c75c20a3602f59df30fe2"}
                userID={"123"}
                userName={'Viewer :' + data?.username}
                liveID={"streamId"}
                config={{
                    ...AUDIENCE_DEFAULT_CONFIG,
                    onLeaveLiveStreaming: () => {
                        navigation.navigate('Home');
                    },
                    topMenuBarConfig: {
                        buttons: [ZegoMenuBarButtonName.minimizingButton, ZegoMenuBarButtonName.leaveButton],
                    },
                    onWindowMinimized: () => {
                        navigation.navigate('Home');
                    },
                    onWindowMaximized: () => {
                        props.navigation.navigate('AudiencePage', {
                            userID: "123",
                            userName: "Viewer",
                            liveID: "streamId",
                        });
                    }
                }}
                plugins={[ZIM]}
            />


            <View style={styles.leftContainer}>
                <View style={{ marginVertical: 5, flexDirection: "row", justifyContent: "flex-start", width: 100 }}>
                    <Text style={{ color: "white", fontSize: 16, color: "#F78E1B" }}>Bidding {biddingInfo?.length}/3</Text>
                    <TouchableOpacity onPress={() => { biddingInfo.length >= 3 ? ToastAndroid.show('Bidding Is Over!', ToastAndroid.SHORT) : setshowBid(!showBid) }} style={{ color: "white", backgroundColor: "#F78E1B", paddingHorizontal: 15, borderRadius: 10, marginLeft: 10 }}>
                        <Text style={{ color: "#fff" }}>Bid</Text>
                    </TouchableOpacity>
                </View>
            </View>


            <View style={styles.bottomIconsContainer}>
                <View style={styles.commentInputWrapper}>
                </View>
                <TouchableOpacity onPress={() => setshowShirts(true)} style={styles.iconButton}>
                    <Ionicons name="cart-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setshowGifts(true)} style={styles.iconButton}>
                    <AntDesign name="gift" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bidButton} onPress={() => setwallet(true)}>
                    <Text style={styles.bidButtonText}>$</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('screen').height,
    },
    coverImage: {
        flex: 1,
    },
    bottomIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        position: 'absolute',
        bottom: 5,
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
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
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
        bottom: 100, // Adjust top position as needed
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
    leftContainer: {position: 'absolute',top: 100,right: 50},
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
    avView: {
        flex: 1,
        width: '100%',
        height: '100%',
        zIndex: 1,
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: 'red',
    },
    ctrlBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 50,
        width: '100%',
        height: 50,
        zIndex: 2,
    },
    ctrlBtn: {
        flex: 1,
        width: 48,
        height: 48,
        marginLeft: 37 / 2,
        position: 'absolute',
    },
});

export default SingleStreamScreen;