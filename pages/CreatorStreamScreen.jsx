import React, { useEffect, useRef, useState } from "react";
import { Platform, View, StyleSheet, TouchableOpacity, Text, Animated, Modal, FlatList, Image, Keyboard, ToastAndroid, TextInput, Pressable, ScrollView } from "react-native";
import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType, AudienceLatencyLevelType, RtcSurfaceView, } from "react-native-agora";
import config from "../config";
import Entypo from 'react-native-vector-icons/Entypo';
import getPermission from "../components/Permission";
import { useNavigation } from "@react-navigation/core";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { io } from "socket.io-client";
import useLiveStreamSocket from "../hooks/socketRef";


const appId = config.appId;
const localUid = 0;

const CreatorStreamScreen = ({ route }) => {
    const { streamId, isHost, coHost = false } = route.params;
    const agoraEngineRef = useRef(null);
    const eventHandler = useRef(null);
    const navigation = useNavigation();
    const [isJoined, setIsJoined] = useState(false);
    const [remoteUids, setRemoteUids] = useState([]);
    const [agoraUid, setagoraUid] = useState(null)
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isFrontCamera, setIsFrontCamera] = useState(true);
    const [data, setData] = useState({});
    const [streamInfo, setStreamInfo] = useState(null)
    const [fadeAnim] = useState(new Animated.Value(0));
    const [gift, setGift] = useState(null);
    const [bidInfo] = useState(false);
    const [showUserInvitation, setShowUserInvitation] = useState(false)
    const [allUsers, setAllUsers] = useState({});
    const [giftsData, setGiftsData] = useState([]);

    const [token, setToken] = useState("")
    const [channelName] = useState(streamId)


    const dispatch = useDispatch();
    const [amount, setAmount] = useState(0);
    const [uId, setuId] = useState("")
    const [biddingInfo, setbiddingInfo] = useState([])
    const [quantity, setQuantity] = useState(1)
    const [showShirts, setshowShirts] = useState(false)
    const [showGifts, setshowGifts] = useState(false)
    const [wallet, setwallet] = useState(false)
    const [showBid, setshowBid] = useState(false);

    // CHAT 
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [message, setMessage] = useState("");

    useLiveStreamSocket(streamId, (msg) => {
        setComments((prev) => [msg, ...prev]);
    });





    const setupVideoSDKEngine = async () => {
        if (Platform.OS === "android") {
            await getPermission();
        }

        const engine = createAgoraRtcEngine();
        agoraEngineRef.current = engine;
        engine.initialize({ appId });
        if (isHost) {
            engine.enableVideo();
            engine.startPreview();
        }
    };

    const setupEventHandler = () => {
        eventHandler.current = {
            onJoinChannelSuccess: () => {
                setIsJoined(true);
            },
            onUserJoined: (_connection, uid) => {
                console.log("👤 Remote user joined:", uid);
                setagoraUid(uid);
                setTimeout(() => {
                    setRemoteUids(prev => [...new Set([...prev, uid])]);
                }, 1000);
            },
            onUserOffline: (_connection, uid) => {
                setagoraUid(null)
                setRemoteUids(prev => prev.filter(id => id !== uid));
            },
        };
        agoraEngineRef.current?.registerEventHandler(eventHandler.current);
    };

    const join = async (tk) => {
        if (!agoraEngineRef.current) return;

        await agoraEngineRef.current.joinChannel(tk, channelName, localUid, {
            channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
            clientRoleType: isHost
                ? ClientRoleType.ClientRoleBroadcaster
                : ClientRoleType.ClientRoleAudience,
            publishMicrophoneTrack: isHost,
            publishCameraTrack: isHost,
            autoSubscribeAudio: true,
            autoSubscribeVideo: true,
            audienceLatencyLevel: isHost
                ? undefined
                : AudienceLatencyLevelType.AudienceLatencyLevelUltraLowLatency,
        });
    };

    const leave = async () => {
        await agoraEngineRef.current?.leaveChannel();
        setIsJoined(false);
        setRemoteUids(prev => prev.filter(id => id !== agoraUid));
    };

    const toggleMic = async () => {
        const newMuteState = !isMicMuted;
        await agoraEngineRef.current?.muteLocalAudioStream(newMuteState);
        setIsMicMuted(newMuteState);
    };

    const switchCamera = async () => {
        await agoraEngineRef.current?.switchCamera();
        setIsFrontCamera(prev => !prev);
    };

    const cleanupAgoraEngine = () => {
        return () => {
            agoraEngineRef.current?.unregisterEventHandler(eventHandler.current);
            agoraEngineRef.current?.release();
        };
    };

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
    const fetchAllGifts = async () => {
        try {
            let res = await axios.get(`${config.baseUrl2}/gifts/all`);
            if (res?.data) {
                setGiftsData(res?.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAllUser = async () => {
        try {
            let res = await axios.get(`${config.baseUrl2}/account/all`);
            if (res?.data) {
                setAllUsers(res?.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchStreamInfo = async () => {
        try {
            let res = await axios.get(`${config.baseUrl}/stream/stream/${streamId}`);
            if (res?.data) {
                setStreamInfo(res?.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchToken = async () => {
        try {
            let res = await axios.get(`${config.baseUrl3}/stream/token/${streamId}/${isHost ? "host" : "subscriber"}`);
            if (res?.data) {
                setToken(res?.data?.data);
                await setupVideoSDKEngine();
                setupEventHandler();
                await join(res?.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleEndStream = async () => {
        try {
            if (isHost && !coHost) {
                let id = await AsyncStorage.getItem('streamId');
                let res = await axios.put(`${config.baseUrl2}/stream/end/${id}`)
                if (res?.data?.data) {
                    navigation.navigate('Home')
                    leave()
                }
            }
            else {
                await agoraEngineRef.current?.leaveChannel();
                navigation.navigate('Home')
            }
        }
        catch (error) {
            navigation.navigate('Home')
            // leave()
            console.log(error)
        }
    }

    const fetchGifts = async () => {
        try {
            let userId = await AsyncStorage.getItem('userId');
            if (true) {
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
    const handleSend = async () => {
        if (!message.trim()) return;
        let userId = await AsyncStorage.getItem("userId");
        try {
            await axios.post(`${config.baseUrl}/stream/message`, { streamId: streamId, userId, message })
            setMessage("");
        } catch (error) {
            console.log(error, 'erro in handle message send');
        }
    };


    const fetchMessages = async () => {
        try {
            console.log(streamId, 'streamId');
            let res = await axios.get(`${config.baseUrl}/stream/message/${streamId}`);
            if (res?.data?.data) {
                setComments(res.data.data);
            }
        } catch (error) {
            console.log(error, 'ERROR IN FETCH MESSAGES');
        }
    };



    const sendInvite = async (userId) => {
        try {
            await axios.post(`${config.baseUrl}/notification/invite`, { userId, streamId, invitedBy: data?._id });
            ToastAndroid.show("Invite sent successfully!", ToastAndroid.SHORT);
            setShowUserInvitation(false)
        }
        catch (error) {
            console.log("Error sending invite:", error);
            ToastAndroid.show("Failed to send invite.", ToastAndroid.SHORT);
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

    // useEffect(() => {
    //     if(streamId){
    //         console.log('comes her');
    //         socketRef.current = io(config.socketUrl, { transports: ["websocket"] });
    //         socketRef.current.emit("join", { streamId });
    //         socketRef.current.on("newMessage", (msg) => {
    //             setComments(prev => [msg, ...prev]);
    //         });
    //         return () => {
    //             socketRef.current.disconnect();
    //         };
    //     }
    // }, [streamId]);


    useEffect(() => {
        const init = async () => {
            await fetchToken()
            agoraEngineRef.current?.enableVideo()
        };
        init();

        return cleanupAgoraEngine();
    }, []);

    useEffect(() => {
        fetchMessages();
        fetchProfileInfo();
        fetchStreamInfo();
        fetchAllUser();
        fetchAllGifts()
        // const interval = setInterval(() => {
        //     fetchGifts();
        // }, 8000);
        // return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardOpen(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardOpen(false);
        });
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);



    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container} enableOnAndroid={true}>


            {isJoined && isHost && (
                <RtcSurfaceView
                    canvas={{
                        uid: localUid,
                        renderMode: 1,
                        mirrorMode: isFrontCamera ? 1 : 0,
                    }}
                    connection={{ channelId: channelName, localUid }}
                    style={styles.localVideo}
                />
            )}

            {isHost && isJoined && remoteUids?.map(uid => (
                <RtcSurfaceView
                    key={uid}
                    canvas={{ uid, renderMode: 1 }}
                    connection={{ channelId: channelName, localUid }}
                    style={styles.remoteVideo}
                />
            ))}

            {!isHost && isJoined && remoteUids.length > 0 && remoteUids.map((uid, index) => (
                <RtcSurfaceView key={uid} canvas={{ uid, renderMode: 1 }} connection={{ channelId: channelName, localUid }} style={index == 0 ? styles.remoteVideo2 : styles?.remoteVideo} />
            ))}

            {/* Controls */}

            {
                isHost && (
                    <TouchableOpacity onPress={() => setShowUserInvitation(true)} style={{ position: "absolute", top: 50, left: "20%", transform: [{ translateX: -50 }], backgroundColor: "gray", padding: 5, borderRadius: 100, flexDirection: "row", alignItems: "center", zIndex: 100 }}>
                        <AntDesign name="plus" size={15} color="#fff" />
                    </TouchableOpacity>
                )
            }


            <TouchableOpacity onPress={handleEndStream} style={{ position: "absolute", top: 50, right: 20, backgroundColor: "gray", padding: 5, borderRadius: 100, flexDirection: "row", alignItems: "center", zIndex: 100 }}>
                <Entypo name='cross' size={22} />
            </TouchableOpacity>

            <Modal animationType="slide" transparent={true} visible={showUserInvitation} onRequestClose={() => setShowUserInvitation(false)}>
                <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0)", justifyContent: "flex-end" }}>

                    <View style={{ backgroundColor: "rgba(46, 45, 45, 0.8)", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "80%", }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "white" }}>Invite Users</Text>

                        {/* User List */}
                        <FlatList data={allUsers} keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (

                                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.5)", }}>
                                    <Image
                                        source={{ uri: item?.profile ? item.profile : "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?semt=ais_hybrid&w=740&q=80" }
                                        }
                                        defaultSource={{uri:"https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?semt=ais_hybrid&w=740&q=80"}} // iOS only
                                        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                                    />
                                    <Text style={{ flex: 1, fontSize: 16, color: "white" }}>{item?.username}</Text>
                                    <TouchableOpacity style={{ backgroundColor: "#007bff", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, }} onPress={() => sendInvite(item._id)}>
                                        <Text style={{ color: "#fff", fontSize: 14 }}>Send Invite</Text>
                                    </TouchableOpacity>
                                </View>

                            )}
                        />

                        {/* Close Button */}
                        <TouchableOpacity style={{ backgroundColor: "red", padding: 10, marginTop: 10, borderRadius: 5, alignItems: "center", }} onPress={() => setShowUserInvitation(false)}>
                            <Text style={{ color: "#fff", fontSize: 14 }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {gift && (
                <Animated.View style={[styles.giftContainer, { opacity: fadeAnim }]}>
                    {
                        (() => {
                            const matchedGift = giftsData.find(g => g.title === gift.name);

                            return (
                                <>
                                    <Image
                                        source={{
                                            uri: matchedGift
                                                ? matchedGift.image
                                                : "https://via.placeholder.com/100"
                                        }}
                                        style={styles.giftImage}
                                    />
                                    <Text style={styles.giftText}>
                                        {gift.username} sent {matchedGift?.title || "a gift"}!
                                    </Text>
                                </>
                            );
                        })()
                    }
                </Animated.View>
            )}


            {bidInfo && (
                <Animated.View style={[styles.giftContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.giftText}>{bidInfo?._doc?.username} added a bid! of $ {bidInfo?.amount}</Text>
                </Animated.View>
            )}

            {/* DISABLE THAT  */}
            {
                !isHost && (
                    <View style={{ paddingBottom: 20, position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                        <TouchableOpacity onPress={() => { biddingInfo.length >= 3 ? ToastAndroid.show('Bidding Is Over!', ToastAndroid.SHORT) : setshowBid(!showBid) }} style={[styles.startAuctionButton, { width: "100%", height: 50, justifyContent: "center" }]}>
                            <Text style={[styles.startAuctionText, { fontSize: 20 }]}>Bid</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

            {/* DISABLE THAT  */}
            <View style={{ position: 'absolute', bottom: 150, right: 20, gap: 30 }}>
                {
                    !isHost && (
                        <TouchableOpacity onPress={() => setshowShirts(true)} style={styles.iconButton}>
                            <Ionicons name="cart-outline" size={30} color="white" />
                        </TouchableOpacity>
                    )
                }
                {
                    !isHost && (
                        <TouchableOpacity onPress={() => setshowGifts(true)} style={styles.iconButton}>
                            <AntDesign name="gift" size={30} color="white" />
                        </TouchableOpacity>
                    )
                }
                {
                    !isHost && (
                        <TouchableOpacity onPress={() => setwallet(true)} style={styles.iconButton}>
                            <FontAwesome name="dollar" size={30} color="white" />
                        </TouchableOpacity>

                    )
                }
                {
                    isHost && (
                        <TouchableOpacity onPress={toggleMic} style={styles.iconButton}>
                            <Feather name={isMicMuted ? "mic-off" : "mic"} size={30} color="#fff" />
                        </TouchableOpacity>

                    )
                }
                {
                    isHost &&
                    <TouchableOpacity onPress={switchCamera} style={styles?.iconButton}>
                        <Entypo name="camera" size={30} color="#fff" />
                    </TouchableOpacity>
                }
            </View>

            {
                biddingInfo?.some(bid => bid?.userId?._id === uId) && (
                    <View style={{ padding: 10, backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: 20, width: 120, marginVertical: 10, position: "absolute", top: "30%", left: "30%" }}>
                        <Text style={{ color: "#fff", fontWeight: "800" }}> <Text style={{ color: "#F78E1B" }}>$ </Text>  Bid added</Text>
                    </View>
                )
            }


            {
                showShirts &&
                <View
                    style={{
                        marginBottom: 20,
                        position: "absolute",
                        bottom: 5,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 10,
                        backgroundColor: "rgba(0,0,0,0.1)"
                    }}
                >
                    {/* Show first product as main large image */}
                    <View
                        style={{
                            paddingHorizontal: 25,
                            paddingVertical: 10,
                            backgroundColor: "#1A1A1A",
                            borderRadius: 10,
                            width: "95%",
                        }}
                    >
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                                borderRadius: 10,
                            }}
                        >
                            <Image
                                source={{
                                    uri:
                                        streamInfo?.productId?.[0]?.images?.[0] ||
                                        "https://via.placeholder.com/150",
                                }}
                                style={{ width: "100%", height: 250, borderRadius: 10 }}
                            />
                        </View>

                        {/* Product thumbnails */}
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            contentContainerStyle={{
                                marginTop: 10,
                                gap: 10,
                                flexDirection: "row",
                                flex: 1,
                                gap: 2
                            }}
                        >
                        </ScrollView>
                    </View>

                    {/* List of products with quantity and add-to-cart */}
                    <ScrollView
                        style={{
                            maxHeight: 300,
                            width: "95%",
                            marginTop: 15,
                            borderRadius: 10,
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        {streamInfo?.productId?.map((item) => (
                            <View
                                key={item._id}
                                style={{
                                    paddingHorizontal: 25,
                                    paddingVertical: 10,
                                    backgroundColor: "#1A1A1A",
                                    borderRadius: 10,
                                    marginBottom: 15,
                                }}
                            >
                                <View style={{ flexDirection: "row", gap: 10 }}>
                                    <View
                                        style={{
                                            justifyContent: "center",
                                            alignItems: "center",
                                            padding: 10,
                                            borderRadius: 5,
                                            backgroundColor: "#1A1A1A",
                                        }}
                                    >
                                        <Image
                                            source={{
                                                uri: item?.images?.[0] || "https://via.placeholder.com/150",
                                            }}
                                            style={{ width: 30, height: 30 }}
                                        />
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: "#fff", fontSize: 15 }}>{item.title}</Text>

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                flex: 1,
                                            }}
                                        >
                                            <Text style={{ color: "#fff", fontSize: 15 }}>${item.price}</Text>
                                            {/* <View
                                                style={{
                                                    flexDirection: "row",
                                                    gap: 5,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Pressable onPress={() => setQuantity(quantity + 1)}>
                                                    <AntDesign name="plus" size={15} color="#fff" />
                                                </Pressable>
                                                <Text style={{ color: "#fff", fontSize: 15 }}>{quantity}</Text>
                                                <Pressable
                                                    onPress={() => {
                                                        if (quantity > 1) setQuantity(quantity - 1);
                                                    }}
                                                >
                                                    <AntDesign name="minus" size={15} color="#fff" />
                                                </Pressable>
                                            </View> */}
                                        </View>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        flex: 1,
                                        marginTop: 10,
                                    }}
                                >
                                    <View>
                                        <Text style={{ color: "#fff" }}>Total</Text>
                                        <Text style={{ color: "#fff", fontSize: 20 }}>
                                            ${(item.price * quantity).toFixed(2)}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => {
                                            handleAddToCard(item);
                                            setshowShirts(false);
                                        }}
                                        style={{
                                            backgroundColor: "#fff",
                                            borderRadius: 20,
                                            paddingHorizontal: 15,
                                            paddingVertical: 5,
                                        }}
                                    >
                                        <Text style={{ color: "#000" }}>Add to cart</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        onPress={() => setshowShirts(false)}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#1a1a1a",
                            padding: 10,
                            borderRadius: 10,
                            marginBottom: 20,
                            width: "95%"
                        }}
                    >
                        <Text style={{ color: "#fff", fontSize: 17 }}>Close</Text>
                    </TouchableOpacity>
                </View>

            }


            {
                showGifts &&
                <View style={{ position: "absolute", left: 10, right: 10, bottom: 5, padding: 20, backgroundColor: "#000", zIndex: 1, width: "95%", borderRadius: 10 }}>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Text style={{ color: "#fff", fontSize: 17 }}>Gifts</Text>
                        <TouchableOpacity onPress={() => setshowShirts(false)} style={{ backgroundColor: "orange", borderRadius: 15, paddingVertical: 5, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", marginLeft: 10 }}>
                            <AntDesign name="bank" size={13} color="#fff" />
                            <Text style={{ color: "#fff", marginLeft: 5 }}>{data?.coins}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: "row", columnGap: 23, flexWrap: "wrap" }}>
                        {
                            giftsData?.map((i) => (
                                <Pressable key={i?._id} onPress={() => { handleSendGifts(i?.coin, i?.title) }} style={{ backgroundColor: "#343434", padding: 10, marginTop: 15, borderRadius: 10 }}>
                                    <Image source={{ uri: i?.image }} style={{ width: 80, height: 80, borderRadius: 10 }} />
                                    <Text style={{ color: "#fff", textAlign: "center", marginTop: 4 }}>{i?.title}</Text>
                                    <TouchableOpacity onPress={() => setshowShirts(false)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 5 }}>
                                        <AntDesign name="bank" size={13} color="orange" />
                                        <Text style={{ color: "#fff", marginLeft: 5 }}>{i?.coin}</Text>
                                    </TouchableOpacity>
                                </Pressable>
                            ))
                        }
                    </View>

                    <TouchableOpacity onPress={() => setshowGifts(false)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#343434", padding: 10, marginTop: 15, borderRadius: 10 }}>
                        <Text style={{ color: "#fff", fontSize: 17 }}>Close </Text>
                    </TouchableOpacity>

                </View>
            }

            {
                wallet &&
                <View style={{ position: "absolute", left: 10, right: 10, bottom: 5, padding: 20, backgroundColor: "#000", zIndex: 1, width: "95%", borderRadius: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <Text style={{ color: "#fff", fontSize: 17 }}>Coins</Text>
                        <Text style={{ color: "#fff", fontSize: 17 }}>🪙 {data?.coins}</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#343434", padding: 10, marginTop: 15, borderRadius: 10 }}>
                        <View style={{ backgroundColor: "#5856d6", padding: 10, borderRadius: 10 }}><AntDesign name="creditcard" size={24} color="#fff" /></View>
                        <TextInput keyboardType="numeric" value={amount.toString()} onChangeText={(text) => setAmount(text ? parseInt(text) : '')} placeholderTextColor={"#747474"} style={{ flex: 1, height: 50, paddingHorizontal: 20, borderWidth: 1, borderColor: "#747474", marginLeft: 10, borderRadius: 10, }} placeholder='Amount To Buy Coins' />
                    </View>
                    <TouchableOpacity onPress={proceed} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "orange", padding: 10, marginTop: 15, borderRadius: 10 }}>
                        <Text style={{ color: "#fff", fontSize: 17 }}>Pay Now </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setwallet(false)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#343434", padding: 10, marginTop: 15, borderRadius: 10 }}>
                        <Text style={{ color: "#fff", fontSize: 17 }}>Close </Text>
                    </TouchableOpacity>
                </View>
            }

            {
                showBid &&
                <View style={{ position: "absolute", left: 20, right: 10, bottom: 30, padding: 20, backgroundColor: "#000", zIndex: 1, width: "90%", borderRadius: 30 }}>
                    <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", marginTop: 5 }}>
                        <Text style={{ color: "#fff" }}>$ Add Bid</Text>
                    </View>
                    <Text style={{ textAlign: "center", marginTop: 10, color: "#c4c4c4" }}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#343434", padding: 10, marginTop: 15, borderRadius: 10 }}>
                        <View style={{ backgroundColor: "#5856d6", padding: 10, borderRadius: 10 }}><AntDesign name="creditcard" size={24} color="#fff" /></View>
                        <TextInput keyboardType="numeric" value={amount.toString()} onChangeText={(text) => setAmount(text ? parseInt(text) : '')} placeholderTextColor={"#747474"} style={{ flex: 1, height: 50, paddingHorizontal: 20, borderWidth: 1, borderColor: "#747474", marginLeft: 10, borderRadius: 10, }} placeholder='Amount To Bid' />
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 20 }}>
                        <TouchableOpacity onPress={() => setshowBid(false)} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleBid} style={styles.startAuctionButton}>
                            <Text style={styles.startAuctionText}>Bid</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }


            <View style={{ position: "absolute", bottom: keyboardOpen ? 400 : 115, left: 30, right: 100, paddingVertical: 10, maxHeight: "50%" }}>

                <View>
                    <ScrollView style={{ maxHeight: "90%" }} showsVerticalScrollIndicator={false}>
                        {comments.map((item, index) => (
                            <View key={index} style={styles.commentItem}>
                                <Image
                                    source={{ uri: item.userId?.profile || `https://randomuser.me/api/portraits/men/${index + 1}.jpg` }}
                                    style={styles.commentAvatar}
                                />
                                <View>
                                    <Text style={styles.commentUser}>{item.userId?.username || "User"}</Text>
                                    <Text style={styles.commentText}>{item.message}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.commentInputBar}>

                    <View style={styles.commentInputContainer}>
                        <TextInput
                            placeholder='Type your comment'
                            style={styles.commentPlaceholder}
                            value={message}
                            onChangeText={setMessage}
                            placeholderTextColor={"#c2c2c2ff"}
                        />
                    </View>

                    <TouchableOpacity style={{ marginLeft: 15 }} onPress={handleSend}>
                        <Ionicons name="send" size={25} color="#fff" />
                    </TouchableOpacity>

                </View>

            </View>






        </KeyboardAwareScrollView>

    );
};

const styles = StyleSheet.create({
    iconButton: {
        // width: 40,
        // height: 40,
        // borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'rgba(52, 52, 52, 0.8)',
    },
    container: {
        flex: 1,
        backgroundColor: "#000",
        flexGrow: 1
    },
    localVideo: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
    },
    remoteVideo: {
        position: "absolute",
        top: 40,
        right: 10,
        width: 100,
        height: 150,
        backgroundColor: "#1c1c1c",
        borderRadius: 8,
        overflow: "hidden",
        zIndex: 1,
    },
    remoteVideo2: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
    },
    controls: {
        position: "absolute",
        bottom: 30,
        width: "100%",
        right: 30,
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        zIndex: 2,
    },
    button: {
        backgroundColor: "#222",
        padding: 12,
        borderRadius: 300,
    },
    buttonText: {
        color: "#fff",
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
    commentInputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 10,
    },
    giftButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2C2C2E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    commentInputContainer: {
        flex: 1,
        borderColor: '#b9b9b9ff',
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: 15,
        justifyContent: 'center',
        backgroundColor: "transparent"
    },

    commentPlaceholder: {
        color: '#fff',
    },

    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    commentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginRight: 8,
    },
    commentUser: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    commentText: {
        color: '#ccc',
        fontSize: 13,
    },
});

export default CreatorStreamScreen;