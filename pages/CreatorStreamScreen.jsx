import React, { useEffect, useRef, useState } from "react";
import { Platform, View, StyleSheet, TouchableOpacity, Text, Animated, Modal, FlatList, Image, Keyboard, ToastAndroid, TextInput, Pressable } from "react-native";
import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType, AudienceLatencyLevelType, RtcSurfaceView, } from "react-native-agora";
import config from "../config";
import Entypo from 'react-native-vector-icons/Entypo';
import getPermission from "../components/Permission";
import { useNavigation } from "@react-navigation/core";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Santa from '../assets/Santa.png';
import Img2 from '../assets/2.png';
import Img3 from '../assets/3.png';
import Img4 from '../assets/4.png';
import Img5 from '../assets/5.png';
import Img6 from '../assets/6.png';
import Img7 from '../assets/7.png';
import Img8 from '../assets/8.png';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const appId = config.appId;
const localUid = 0;

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
            let res = await axios.get(`${config.baseUrl}/account/single/${userId}`);
            if (res?.data) {
                setData(res?.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAllUser = async () => {
        try {
            let res = await axios.get(`${config.baseUrl}/account/all`);
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
                let res = await axios.put(`${config.baseUrl}/stream/end/${id}`)
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
                let res = await axios.get(`${config.baseUrl3}/gift/${userId}/${streamInfo?._id}`);
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

    useEffect(() => {
        const init = async () => {
            await fetchToken()
            agoraEngineRef.current?.enableVideo()
        };
        init();

        return cleanupAgoraEngine();
    }, []);

    useEffect(() => {
        fetchProfileInfo();
        fetchStreamInfo();
        fetchAllUser()
        // setInterval(() => {
        //     fetchGifts();
        // }, 8000);
        // return () => clearInterval(interval);
    }, [])


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





    return (
        <View style={styles.container}>


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
                <RtcSurfaceView
                    key={uid}
                    canvas={{ uid, renderMode: 1 }}
                    connection={{ channelId: channelName, localUid }}
                    style={index == 0 ? styles.remoteVideo2 : styles?.remoteVideo}
                />
            ))}

            {/* Controls */}

            {
                isHost && (
                    <View style={styles.controls}>
                        <TouchableOpacity onPress={toggleMic} style={styles.button}>
                            <Feather name={isMicMuted ? "mic-off" : "mic"} size={15} color="#fff" />

                        </TouchableOpacity>
                        <TouchableOpacity onPress={switchCamera} style={{ backgroundColor: "#222", width: 40, height: 40, borderRadius: 100, justifyContent: "center", alignItems: "center" }}>
                            <Entypo name="camera" size={15} />
                        </TouchableOpacity>
                    </View>
                )
            }

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
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>

                    <View style={{ backgroundColor: "rgba(52, 52, 52, 0.8)", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "80%", }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Invite Users</Text>

                        {/* User List */}
                        <FlatList data={allUsers} keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (

                                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.5)", }}>
                                    <Image source={{ uri: item.profile }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
                                    <Text style={{ flex: 1, fontSize: 16 }}>{item?.username}</Text>
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
                    <Image source={giftImages[gift.name]} style={styles.giftImage} />
                    <Text style={styles.giftText}>{gift.username} sent a gift!</Text>
                </Animated.View>
            )}

            {bidInfo && (
                <Animated.View style={[styles.giftContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.giftText}>{bidInfo?._doc?.username} added a bid! of $ {bidInfo?.amount}</Text>
                </Animated.View>
            )}


            {
                !isHost && (
                    <View style={{ position: 'absolute', top: 100, right: 50 }}>
                        <View style={{ marginVertical: 5, flexDirection: "row", justifyContent: "flex-start", width: 100 }}>
                            <Text style={{ color: "white", fontSize: 16, color: "#F78E1B" }}>Bidding {biddingInfo?.length}/3</Text>
                            <TouchableOpacity onPress={() => { biddingInfo.length >= 3 ? ToastAndroid.show('Bidding Is Over!', ToastAndroid.SHORT) : setshowBid(!showBid) }} style={{ color: "white", backgroundColor: "#F78E1B", paddingHorizontal: 15, borderRadius: 10, marginLeft: 10 }}>
                                <Text style={{ color: "#fff" }}>Bid</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }

            {
                !isHost && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20, position: 'absolute', bottom: 5, left: 0, right: 0, }}>
                        <View style={{}}>
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
                )
            }

            {
                biddingInfo?.some(bid => bid?.userId?._id === uId) && (
                    <View style={{ padding: 10, backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: 20, width: 120, marginVertical: 10, position: "absolute", top: "30%", left: "30%" }}>
                        <Text style={{ color: "#fff", fontWeight: "800" }}> <Text style={{ color: "#F78E1B" }}>$ </Text>  Bid added</Text>
                    </View>
                )
            }


            {
                showShirts &&
                <View style={{ marginBottom: 20, position: "absolute", bottom: 5, width: "100%", justifyContent: "center", alignItems: "center", zIndex: 10 }}>

                    <View style={{ paddingHorizontal: 25, paddingVertical: 10, backgroundColor: "rgba(121, 121, 121,1)", borderRadius: 20, width: "95%" }}>
                        <View style={{ justifyContent: "center", alignItems: "center", padding: 10, borderRadius: 20, backgroundColor: "#979797" }}>
                            <Image
                                source={{ uri: streamInfo?.productId?.image || "https://via.placeholder.com/150" }}
                                style={{ width: "100%", height: 250, borderRadius: 20, }}
                            />
                        </View>

                        <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ marginTop: 10, gap: 10, flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
                            <View style={{ justifyContent: "center", alignItems: "center", padding: 10, borderRadius: 5, backgroundColor: "#979797" }}>
                                <Image source={{ uri: streamInfo?.productId?.image || "https://via.placeholder.com/150" }} style={{ width: 30, height: 30 }} />
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center", padding: 10, borderRadius: 5, backgroundColor: "#979797" }}>
                                <Image source={{ uri: streamInfo?.productId?.image || "https://via.placeholder.com/150" }} style={{ width: 30, height: 30 }} />
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center", padding: 10, borderRadius: 5, backgroundColor: "#979797" }}>
                                <Image source={{ uri: streamInfo?.productId?.image || "https://via.placeholder.com/150" }} style={{ width: 30, height: 30 }} />
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center", padding: 10, borderRadius: 5, backgroundColor: "#979797" }}>
                                <Image source={{ uri: streamInfo?.productId?.image || "https://via.placeholder.com/150" }} style={{ width: 30, height: 30 }} />
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center", padding: 10, borderRadius: 5, backgroundColor: "#979797" }}>
                                <Image source={{ uri: streamInfo?.productId?.image || "https://via.placeholder.com/150" }} style={{ width: 30, height: 30 }} />
                            </View>
                        </ScrollView>
                    </View>

                    <View style={{ paddingHorizontal: 25, paddingVertical: 10, backgroundColor: "rgba(121, 121, 121,1)", borderRadius: 20, width: "95%", marginTop: 15 }}>

                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <View style={{ justifyContent: "center", alignItems: "center", padding: 10, borderRadius: 5, backgroundColor: "#979797" }}>
                                <Image source={{ uri: streamInfo?.productId?.image || "https://via.placeholder.com/150" }} style={{ width: 30, height: 30 }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: "#fff", fontSize: 15 }}>{streamInfo?.productId?.title}</Text>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                                    <Text style={{ color: "#fff", fontSize: 15 }}>${streamInfo?.productId?.price}</Text>
                                    <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                        <Pressable onPress={() => setQuantity(quantity + 1)}><AntDesign name="plus" size={15} color="#fff" /></Pressable>
                                        <Text style={{ color: "#fff", fontSize: 15 }}>{quantity}</Text>
                                        <Pressable onPress={() => setQuantity(quantity - 1)}><AntDesign name="minus" size={15} color="#fff" /></Pressable>
                                    </View>
                                </View>
                            </View>


                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1, marginTop: 10 }}>
                            <View>
                                <Text>Total</Text>
                                <Text style={{ color: "#fff", fontSize: 20 }}>${streamInfo?.productId?.price * quantity}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                <TouchableOpacity onPress={() => { handleAddToCard(streamInfo?.productId); setshowShirts(false) }} style={{ backgroundColor: "#fff", borderRadius: 20 }}>
                                    <Text style={{ padding: 5, paddingHorizontal: 10, color: "#000" }}>Add to cart</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => setshowShirts(false)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#343434", padding: 10, marginTop: 15, borderRadius: 10 }}>
                            <Text style={{ color: "#fff", fontSize: 17 }}>Close </Text>
                        </TouchableOpacity>


                    </View>

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
                        <Pressable onPress={() => { handleSendGifts(10, "Santa") }} style={{ backgroundColor: "#343434", padding: 10, marginTop: 15, borderRadius: 10 }}>
                            <Image source={Santa} />
                            <Text style={{ color: "#fff", textAlign: "center", marginTop: 4 }}>Santa</Text>
                            <TouchableOpacity onPress={() => setshowShirts(false)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 5 }}>
                                <AntDesign name="bank" size={13} color="orange" />
                                <Text style={{ color: "#fff", marginLeft: 5 }}>10</Text>
                            </TouchableOpacity>
                        </Pressable>
                        <Pressable onPress={() => { handleSendGifts(20, "Img2") }} style={{ backgroundColor: "#343434", padding: 10, marginTop: 15, borderRadius: 10 }}>
                            <Image source={Img2} />
                            <Text style={{ color: "#fff", textAlign: "center", marginTop: 4 }}>Eagle</Text>
                            <TouchableOpacity onPress={() => setshowShirts(false)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 5 }}>
                                <AntDesign name="bank" size={13} color="orange" />
                                <Text style={{ color: "#fff", marginLeft: 5 }}>20</Text>
                            </TouchableOpacity>
                        </Pressable>
                        <Pressable onPress={() => { handleSendGifts(15, "Img3") }} style={{ backgroundColor: "#343434", padding: 10, marginTop: 15, borderRadius: 10 }}>
                            <Image source={Img3} />
                            <Text style={{ color: "#fff", textAlign: "center", marginTop: 4 }}>Rose</Text>
                            <TouchableOpacity onPress={() => setshowShirts(false)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 5 }}>
                                <AntDesign name="bank" size={13} color="orange" />
                                <Text style={{ color: "#fff", marginLeft: 5 }}>15</Text>
                            </TouchableOpacity>
                        </Pressable>
                        <Pressable onPress={() => { handleSendGifts(22, "Img4") }} style={{ backgroundColor: "#343434", padding: 10, marginTop: 15, borderRadius: 10 }}>
                            <Image source={Img4} />
                            <Text style={{ color: "#fff", textAlign: "center", marginTop: 4 }}>Boxing</Text>
                            <TouchableOpacity onPress={() => setshowShirts(false)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 5 }}>
                                <AntDesign name="bank" size={13} color="orange" />
                                <Text style={{ color: "#fff", marginLeft: 5 }}>22</Text>
                            </TouchableOpacity>
                        </Pressable>
                        <Pressable onPress={() => { handleSendGifts(21, "Img5") }} style={{ backgroundColor: "#343434", padding: 10, marginTop: 15, borderRadius: 10 }}>
                            <Image source={Img5} />
                            <Text style={{ color: "#fff", textAlign: "center", marginTop: 4 }}>Sunflower</Text>
                            <TouchableOpacity onPress={() => setshowShirts(false)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 5 }}>
                                <AntDesign name="bank" size={13} color="orange" />
                                <Text style={{ color: "#fff", marginLeft: 5 }}>21</Text>
                            </TouchableOpacity>
                        </Pressable>
                        <Pressable onPress={() => { handleSendGifts(100, "Img6") }} style={{ backgroundColor: "#343434", padding: 10, marginTop: 15, borderRadius: 10 }}>
                            <Image source={Img6} />
                            <Text style={{ color: "#fff", textAlign: "center", marginTop: 4 }}>Zebra</Text>
                            <TouchableOpacity onPress={() => setshowShirts(false)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 5 }}>
                                <AntDesign name="bank" size={13} color="orange" />
                                <Text style={{ color: "#fff", marginLeft: 5 }}>100</Text>
                            </TouchableOpacity>
                        </Pressable>
                        <Pressable onPress={() => { handleSendGifts(29, "Img7") }} style={{ backgroundColor: "#343434", padding: 10, marginTop: 15, borderRadius: 10 }}>
                            <Image source={Img7} />
                            <Text style={{ color: "#fff", textAlign: "center", marginTop: 4 }}>Heart</Text>
                            <TouchableOpacity onPress={() => setshowShirts(false)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 5 }}>
                                <AntDesign name="bank" size={13} color="orange" />
                                <Text style={{ color: "#fff", marginLeft: 5 }}>29</Text>
                            </TouchableOpacity>
                        </Pressable>
                        <Pressable onPress={() => { handleSendGifts(150, "Img8") }} style={{ backgroundColor: "#343434", padding: 10, marginTop: 15, borderRadius: 10 }}>
                            <Image source={Img8} />
                            <Text style={{ color: "#fff", textAlign: "center", marginTop: 4 }}>Lion</Text>
                            <TouchableOpacity onPress={() => setshowShirts(false)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 5 }}>
                                <AntDesign name="bank" size={13} color="orange" />
                                <Text style={{ color: "#fff", marginLeft: 5 }}>150</Text>
                            </TouchableOpacity>
                        </Pressable>

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
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => setshowBid(false)} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleBid} style={styles.startAuctionButton}>
                            <Text style={styles.startAuctionText}>Bid</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }






        </View>

    );
};

const styles = StyleSheet.create({
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
    },
    container: {
        flex: 1,
        backgroundColor: "#000",
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

});

export default CreatorStreamScreen;