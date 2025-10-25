import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
    Pressable,
    Animated,
    Dimensions,
    TextInput,
    Alert,
    ToastAndroid,
    StatusBar,
} from 'react-native';
import versus from '../../assets/competition/versus.png';
import vs from '../../assets/competition/vs.png';
import slam_item from '../../assets/competition/slam_item.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import getPermission from '../../components/Permission';
import createAgoraRtcEngine, { AudienceLatencyLevelType, ChannelProfileType, ClientRoleType, RtcSurfaceView } from 'react-native-agora';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { perksData } from '../../constant/perk';
import io from "socket.io-client";
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { BlurView } from '@react-native-community/blur';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';

const appId = config.appId;
const localUid = 0;

const Competition = ({ route }) => {
    const { streamId, isHost, coHost = false } = route.params;
    const socketRef = useRef(null);
    const [showVersus, setShowVersus] = useState(true);
    const versusOpacity = useState(new Animated.Value(1))[0];
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
    const [isImageBlurred, setIsImageBlurred] = useState(false);
    const [isPerksModalVisible, setIsPerksModalVisible] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(null);
    const [perkMessage, setPerkMessage] = useState(null);
    const [showSlamItem, setShowSlamItem] = useState(false);
    const perkMessageAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(100)).current;
    const navigation = useNavigation();


    // AGORA
    const eventHandler = useRef(null);
    const agoraEngineRef = useRef(null);
    const [isJoined, setIsJoined] = useState(false);
    const [remoteUids, setRemoteUids] = useState([]);
    const [agoraUid, setagoraUid] = useState(null)
    const [isFrontCamera, setIsFrontCamera] = useState(true);
    const [userProfile, setUserProfile] = useState({})
    const [streamInfo, setStreamInfo] = useState({})
    const [uid, setUid] = useState("")
    const [channelName] = useState(streamId)

    // CHAT 
    const [comments, setComments] = useState([]);
    const [message, setMessage] = useState("");


    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.timing(versusOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setShowVersus(false);
            });
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const handleShareOptionPress = (platform) => {
        setIsShareModalVisible(false);
    };

    const toggleImageBlur = () => {
        setIsImageBlurred(prev => !prev);
    };

    const togglePerksModal = () => {
        setIsPerksModalVisible(prev => !prev);
        setTooltipVisible(null);
    };

    const toggleTooltip = (perkId) => {
        setTooltipVisible(prevId => (prevId === perkId ? null : perkId));
    };

    const handlePerkClick = async (perk) => {
        setIsPerksModalVisible(false);
        setTooltipVisible(null);
        if (perk?.price) {
            try {
                let paymentIntentRes = await axios.post(`${config.baseUrl2}/payment/create-intent`, { amount: perk?.price * 100, currency: "usd" });
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
                            setPerkMessage(perk.description);
                            socketRef.current?.emit("sendPerk", { streamId, user: userProfile, perk });
                        }
                    }

                }
            }
            catch (error) {

            }

        }
    };


    const perkMessageTranslateY = perkMessageAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0],
    });

    const progressBarWidth = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    // AGORA 
    const fetchToken = async () => {
        try {
            let res = await axios.get(`${config.baseUrl3}/stream/token/${streamId}/${isHost ? "host" : "subscriber"}`);
            if (res?.data) {
                await setupVideoSDKEngine();
                await setupEventHandler();
                await join(res?.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

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
    const setupEventHandler = async () => {
        eventHandler.current = {
            onJoinChannelSuccess: () => {
                setIsJoined(true);
            },
            onUserJoined: (_connection, uid) => {
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
            clientRoleType: isHost ? ClientRoleType.ClientRoleBroadcaster : ClientRoleType.ClientRoleAudience,
            publishMicrophoneTrack: isHost,
            publishCameraTrack: isHost,
            autoSubscribeAudio: true,
            autoSubscribeVideo: true,
            audienceLatencyLevel: isHost ? undefined : AudienceLatencyLevelType.AudienceLatencyLevelUltraLowLatency,
        });
    };

    const leave = async () => {
        await agoraEngineRef.current?.leaveChannel();
        setIsJoined(false);
        setRemoteUids(prev => prev.filter(id => id !== agoraUid));
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
            setUid(userId)
            let res = await axios.get(`${config.baseUrl}/account/single/${userId}`);
            if (res?.data) {
                setUserProfile(res?.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchStreamInfo = async () => {
        try {
            let res = await axios.get(`${config.baseUrl}/battle/info/${streamId}`);
            if (res?.data) {
                setStreamInfo(res?.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchMessages = async () => {
        try {
            let res = await axios.get(`${config.baseUrl}/battle/messages/${streamId}`);
            if (res?.data?.data) {
                setComments(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSend = async () => {
        if (!message.trim()) return;
        let userId = await AsyncStorage.getItem("userId");
        await axios.post(`${config.baseUrl}/battle/message`, { battleId: streamId, userId, message })
        setMessage("");
    };

    const handleVote = async (type) => {
        try {
            let paymentIntentRes = await axios.post(`${config.baseUrl2}/payment/create-intent`, { amount: 1 * 100, currency: "usd" });
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
                        const result = await axios.post(`${config.baseUrl}/battle/vote`, { battleId: streamId, type });
                        if (result.data) {
                            ToastAndroid.show("Vote Added", ToastAndroid.SHORT)
                        }
                    }
                }

            }
        } catch (error) {
            console.log("Vote error:", error.response?.data || error.message);
        }
    };

    const handleEndStream = async () => {
        try {
            if (isHost && !coHost) {
                let res = await axios.put(`${config.baseUrl}/battle/end/${streamInfo?._id}`)
                if (res?.data?.data) {
                    leave()
                    navigation.navigate('Home')
                }
            }
            else {
                await agoraEngineRef.current?.leaveChannel();
                navigation.navigate('Home')
            }
        }
        catch (error) {
            navigation.navigate('Home')
            leave()
            console.log(error)
        }
    }

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
        fetchMessages();
    }, [])

    useEffect(() => {
        socketRef.current = io(config.socketUrl, { transports: ["websocket"] });
        socketRef.current.emit("join", { streamId });
        socketRef.current.on("newMessage", (msg) => {
            console.log('newMessage')
            setComments(prev => [msg, ...prev]);
        });
        socketRef.current.on("voteUpdate", (data) => {
            console.log(data, 'voteUpdate')
            setStreamInfo(data);
        });
        socketRef.current.on("newPerk", (data) => {
            console.log('newPerk');
            setPerkMessage(`${data.user.username} used ${data.perk.name}: ${data.perk.description}`);
            if (data.perk.name === 'Item Slam') {
                setShowSlamItem(true);
            }
            Animated.timing(perkMessageAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                Animated.timing(progressAnim, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: false,
                }).start(() => {
                    Animated.timing(perkMessageAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => {
                        setPerkMessage(null);
                        progressAnim.setValue(100);
                        setShowSlamItem(false);
                    });
                });
            });
        });
        return () => {
            socketRef.current.disconnect();
        };
    }, [streamId]);

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setHidden(true);
            return () => {
                StatusBar.setHidden(false);
            };
        }, [])
    );

    const isCreator = userProfile?._id == streamInfo?.creatorId?._id

    const getStatusAndColor = (side) => {
        const creatorVotes = Number(streamInfo?.creatorVotes || 0);
        const opponentVotes = Number(streamInfo?.opponentVotes || 0);
        if (creatorVotes === opponentVotes) {
            return { status: "Tied", color: "#6b7280", votes: side === "creator" ? creatorVotes : opponentVotes };
        }

        if (side === "creator") {
            return creatorVotes > opponentVotes
                ? { status: "Winning", color: "blue", votes: streamInfo?.creatorVotes }
                : { status: "Losing", color: "red", votes: streamInfo?.creatorVotes };
        } else {
            return opponentVotes > creatorVotes
                ? { status: "Winning", color: "blue", votes: streamInfo?.opponentVotes }
                : { status: "Losing", color: "red", votes: streamInfo?.opponentVotes };
        }
    };
    const creatorBadge = getStatusAndColor("creator");
    const opponentBadge = getStatusAndColor("opponent");
    const dispatch = useDispatch();

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container} enableOnAndroid={true}>

            <StatusBar hidden={true} />

            <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.header}>
                <TouchableOpacity style={{ maxHeight: 45, marginRight: 10, backgroundColor: "#3d1e1a", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 40, gap: 5, alignItems: "center", flexDirection: "row" }}>
                    <MaterialIcons name="bar-chart" size={20} style={{ color: "#FFC61A" }} />
                    <Text style={{ color: "#fff" }}>Ranking Voter</Text>
                    <SimpleLineIcons name="arrow-right" style={{ color: "#fff" }} />
                </TouchableOpacity>

                <TouchableOpacity style={{ maxHeight: 45, marginRight: 10, backgroundColor: "#1E1E1E", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 40, gap: 5, alignItems: "center", flexDirection: "row" }}>
                    <Feather name="user" size={16} style={{ color: "#fff" }} />
                    <Text style={{ color: "#fff" }}>{remoteUids?.length > 0 ? remoteUids.length : 1}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ maxHeight: 45, marginRight: 10, backgroundColor: "#1E1E1E", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 40, gap: 5, alignItems: "center", flexDirection: "row" }}>
                    <Feather name="gift" size={16} style={{ color: "#FFC61A" }} />
                    <Text style={{ color: "#fff" }}>Gifts</Text>
                    <SimpleLineIcons name="arrow-right" style={{ color: "#fff" }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleEndStream} style={{ marginRight: 30, maxHeight: 45, backgroundColor: "#FF3729", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 40, gap: 5, alignItems: "center", flexDirection: "row" }}>
                    <Text style={{ color: "#fff" }}>Quite battle</Text>
                    <AntDesign name="close" size={16} style={{ color: "#fff" }} />
                </TouchableOpacity>
            </ScrollView>

            <View style={{ backgroundColor: "#1a0b18", justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingHorizontal: 20, paddingBottom: 20 }}>
                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <Image source={{ uri: streamInfo?.creatorId?.profile }} style={{ width: 40, height: 40, borderRadius: 100 }} />
                    <View>
                        <Text style={{ color: "white" }}>{streamInfo?.creatorId?.username}</Text>
                        <Text style={{ color: "lightgray" }}>{streamInfo?.creatorId?.followers} Followers</Text>
                    </View>
                </View>
                <Image source={vs} />
                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <Image source={{ uri: streamInfo?.opponentId?.profile }} style={{ width: 40, height: 40, borderRadius: 100 }} />
                    <View>
                        <Text style={{ color: "white" }}>{streamInfo?.opponentId?.username}</Text>
                        <Text style={{ color: "lightgray" }}>{streamInfo?.opponentId?.followers} Followers</Text>
                    </View>
                </View>
            </View>


            <View style={{ display: "flex", backgroundColor: "#1a0b18", justifyContent: "space-between", gap: 10, alignItems: "center", flexDirection: "row" }}>

                {isJoined && isHost && (
                    <View style={{ borderWidth: 1, borderColor: "blue", overflow: "hidden", width: "50%", height: 300, position: "relative" }}>
                        <RtcSurfaceView canvas={{ uid: localUid, renderMode: 1, mirrorMode: isFrontCamera ? 1 : 0, }} connection={{ channelId: channelName, localUid }} style={{ flex: 1 }} />
                        <View style={{ position: "absolute", bottom: 0, width: "100%", height: 50, backgroundColor: "#4D1C2B", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "#fff", fontSize: 14 }}>You</Text>
                        </View>

                        <View style={{ position: "absolute", top: 0, width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <View style={{
                                backgroundColor: isCreator ? creatorBadge.color : opponentBadge.color,
                                paddingHorizontal: 20,
                                paddingVertical: 4,
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10
                            }}>
                                <Text style={{ color: "#fff" }}>{isCreator ? creatorBadge.status : opponentBadge.status}</Text>
                            </View>
                        </View>
                        <View style={{ position: "absolute", bottom: 60, width: "100%", left: 10 }}>
                            <TouchableOpacity onPress={() => handleVote(isCreator ? "creator" : "opponent")} style={{ backgroundColor: "#404151", width: "60%", paddingVertical: 5, borderRadius: 100, paddingHorizontal: 10, flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{ color: "#fff", fontSize: 13 }}>👍 {isCreator ? streamInfo?.creatorVotes : streamInfo?.opponentVotes} Votes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {isHost && isJoined && remoteUids?.map(uid => (
                    <View key={uid} style={{ borderWidth: 1, borderColor: "red", overflow: "hidden", width: "47%", height: 300, marginRight: 10, position: "relative" }}>
                        <RtcSurfaceView
                            key={uid}
                            canvas={{ uid, renderMode: 1 }}
                            connection={{ channelId: channelName, localUid }} style={{ flex: 1 }}
                        />
                        {isImageBlurred && (
                            <View style={{ position: "absolute", left: 0, right: 0, width: "100%", height: "100%", backgroundColor: "rgba(255, 255, 255,0.4)", zIndex: 100 }}>
                            </View>
                        )}
                        <View style={{ position: "absolute", bottom: 0, width: "100%", height: 50, backgroundColor: "#6478ddff", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "#fff", fontSize: 14 }}>{userProfile?.username}</Text>
                        </View>
                        <View style={{ position: "absolute", top: 0, width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <View style={{
                                backgroundColor: isCreator ? opponentBadge.color : creatorBadge.color,
                                paddingHorizontal: 20,
                                paddingVertical: 4,
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10
                            }}>
                                <Text style={{ color: "#fff" }}>{isCreator ? opponentBadge.status : creatorBadge.status}</Text>
                            </View>
                        </View>
                        <View style={{ position: "absolute", bottom: 60, width: "100%", left: 10 }}>
                            <TouchableOpacity onPress={() => handleVote(isCreator ? "opponent" : "creator")} style={{ backgroundColor: "#404151", width: "60%", paddingVertical: 5, borderRadius: 100, paddingHorizontal: 10, flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{ color: "#fff", fontSize: 13 }}>👍 {!isCreator ? streamInfo?.creatorVotes : streamInfo?.opponentVotes} Votes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

            </View>

            {/* FOR VIEWERS  */}
            {
                !isHost && isJoined && remoteUids.length > 0 && (
                    <View style={{ display: "flex", backgroundColor: "#1a0b18", justifyContent: "space-between", gap: 10, alignItems: "center", flexDirection: "row" }}>

                        <View style={{ borderWidth: 1, borderColor: "blue", overflow: "hidden", width: "50%", height: 300, position: "relative" }}>
                            <RtcSurfaceView canvas={{ uid: remoteUids[0], renderMode: 1, mirrorMode: isFrontCamera ? 1 : 0, }} connection={{ channelId: channelName, localUid }} style={{ flex: 1 }} />
                            <View style={{ position: "absolute", bottom: 0, width: "100%", height: 50, backgroundColor: "#6478ddff", justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: "#fff", fontSize: 14 }}>{streamInfo?.creatorId?.username}</Text>
                            </View>
                            <View style={{ position: "absolute", top: 0, width: "100%", justifyContent: "center", alignItems: "center" }}>
                                <View style={{ backgroundColor: creatorBadge.color, paddingHorizontal: 20, paddingVertical: 4, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                    <Text style={{ color: "#fff" }}>{creatorBadge.status}</Text>
                                </View>
                            </View>
                            <View style={{ position: "absolute", bottom: 60, width: "100%", left: 10 }}>
                                <TouchableOpacity onPress={() => handleVote("creator")} style={{ backgroundColor: "#404151", width: "60%", paddingVertical: 5, borderRadius: 100, paddingHorizontal: 10, flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
                                    <Text style={{ color: "#fff", fontSize: 13 }}>👍 {streamInfo?.creatorVotes} Votes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ borderWidth: 1, borderColor: "red", overflow: "hidden", width: "47%", height: 300, marginRight: 10, position: "relative" }}>
                            <RtcSurfaceView
                                key={uid}
                                canvas={{ uid: remoteUids[1], renderMode: 1 }}
                                connection={{ channelId: channelName, localUid }} style={{ flex: 1 }}
                            />
                            <View style={{ position: "absolute", bottom: 0, width: "100%", height: 50, backgroundColor: "#4D1C2B", justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: "#fff", fontSize: 14 }}>{streamInfo?.opponentId?.username}</Text>
                            </View>
                            <View style={{ position: "absolute", top: 0, width: "100%", justifyContent: "center", alignItems: "center" }}>
                                <View style={{ backgroundColor: opponentBadge.color, paddingHorizontal: 20, paddingVertical: 4, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                    <Text style={{ color: "#fff" }}>{opponentBadge.status}</Text>
                                </View>
                            </View>
                            <View style={{ position: "absolute", bottom: 60, width: "100%", left: 10 }}>
                                <TouchableOpacity onPress={() => handleVote("opponent")} style={{ backgroundColor: "#404151", width: "60%", paddingVertical: 5, borderRadius: 100, paddingHorizontal: 10, flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
                                    <Text style={{ color: "#fff", fontSize: 13 }}>👍 {streamInfo?.opponentVotes} Votes</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>
                )
            }



            {
                showVersus && (
                    <Animated.Image source={versus} style={[styles.versusImage, { opacity: versusOpacity }]} />
                )
            }

            <ScrollView style={styles.commentsContainer} showsVerticalScrollIndicator={false}>
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

                <View style={styles.commentInputBar}>

                    <TouchableOpacity style={styles.giftButton}>
                        <Ionicons name="gift" size={20} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.commentInputContainer}>
                        <TextInput
                            placeholder='Type your comment'
                            style={styles.commentPlaceholder}
                            value={message}
                            onChangeText={setMessage}
                            placeholderTextColor={"#c2c2c2ff"}
                        />
                    </View>

                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Ionicons name="send" size={18} color="#fff" />
                    </TouchableOpacity>

                </View>
                <ScrollView horizontal contentContainerStyle={{ marginTop: 20, paddingBottom: 50 }}>
                    {
                        streamInfo?.productId?.map((i) => (
                            <View key={i?._id} style={{ marginBottom: 50, marginRight: 20, width: streamInfo?.productId?.length > 1 ? 300 : "100%", backgroundColor: "#fff", borderRadius: 6, flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 10, paddingHorizontal: 10 }}>
                                <Image source={{ uri: i?.images[0] }} style={{ width: 70, height: 70, borderRadius: 10 }} />
                                <View style={{ flex: 1 }}>
                                    <Text>{i?.title}</Text>
                                    <Text style={{ marginTop: 4 }}>⭐ 4.0 {i?.stock} left</Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <Text>${i?.price}{/* <Text style={{ color: "red" }}>${i?.price}</Text> */}</Text>
                                        <TouchableOpacity onPress={() => {
                                            dispatch(addToCart({ ...streamInfo?.productId, quantity: 1 }));
                                            ToastAndroid.show('Item Added In Cart', ToastAndroid.SHORT);
                                        }} style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#000", borderRadius: 100, justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ color: "#fff", fontSize: 10 }}>Add to cart</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                    }

                </ScrollView>
            </ScrollView>

            <View style={styles.actionBar}>
                <TouchableOpacity style={styles.actionButton} onPress={togglePerksModal}>
                    <FontAwesome name="magic" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Perks</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="chatbox" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Mute chats</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={switchCamera} style={styles.actionButton}>
                    <Entypo name="camera" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Switch cam</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={toggleImageBlur}>
                    <MaterialIcons name="deblur" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>{isImageBlurred ? "UnBlur" : "Blur"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => setIsShareModalVisible(true)}>
                    <Feather name="share-2" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
            </View>

            {/* Share Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isShareModalVisible}
                onRequestClose={() => setIsShareModalVisible(false)}
            >
                <Pressable style={styles.modalBackground} onPress={() => setIsShareModalVisible(false)}>
                    <Pressable style={styles.shareModalView}>
                        <Text style={styles.shareModalTitle}>Share</Text>
                        <View style={styles.shareOptionsContainer}>
                            <TouchableOpacity style={styles.shareOption} onPress={() => handleShareOptionPress('Copy link')}>
                                <Feather name="copy" size={20} color="#fff" />
                                <Text style={styles.shareOptionText}>Copy link</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareOption} onPress={() => handleShareOptionPress('Whatsapp')}>
                                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                                <Text style={styles.shareOptionText}>Whatsapp</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareOption} onPress={() => handleShareOptionPress('Instagram')}>
                                <AntDesign name="instagram" size={20} color="#C13584" />
                                <Text style={styles.shareOptionText}>Instagram</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareOption} onPress={() => handleShareOptionPress('Facebook')}>
                                <Feather name="facebook" size={20} color="#1877F2" />
                                <Text style={styles.shareOptionText}>Facebook</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareOption} onPress={() => handleShareOptionPress('Discord')}>
                                <MaterialCommunityIcons name="discord" size={20} color="#7289DA" />
                                <Text style={styles.shareOptionText}>Discord</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.cancelShareButton} onPress={() => setIsShareModalVisible(false)}>
                            <Text style={styles.cancelShareButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Perks Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isPerksModalVisible}
                onRequestClose={togglePerksModal}
            >
                <Pressable style={styles.modalBackground} onPress={togglePerksModal}>
                    <Pressable style={styles.perksModalView} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.perksModalHeader}>
                            <Text style={styles.perksModalTitle}>Perks</Text>
                            <TouchableOpacity onPress={togglePerksModal}>
                                <AntDesign name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.perksGrid}>
                            {perksData.map((perk) => (
                                <TouchableOpacity key={perk.id} style={styles.perkItem} onPress={() => handlePerkClick(perk)}>
                                    <Image source={perk.icon} style={styles.perkIcon} />
                                    <View style={styles.perkTextContainer}>
                                        <Text style={styles.perkName}>{perk.name}</Text>
                                        <Pressable onPress={() => toggleTooltip(perk.id)} hitSlop={10}>
                                            <AntDesign name="infocirlceo" size={14} color="#999" />
                                        </Pressable>
                                    </View>
                                    {tooltipVisible === perk.id && (
                                        <View style={styles.tooltip}>
                                            <Text style={styles.tooltipText}>{perk.description}</Text>
                                            <View style={styles.tooltipTriangle} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Animated Perk Message View */}
            {
                (perkMessage && !showSlamItem) && (
                    <Animated.View style={[styles.perkMessageContainer, { transform: [{ translateY: perkMessageTranslateY }] }]}>
                        <Text style={styles.perkMessageText}>{perkMessage}</Text>
                        <Animated.View style={[styles.perkProgressBar, { width: progressBarWidth }]} />
                    </Animated.View>
                )
            }

            {
                showSlamItem && (
                    <Image source={slam_item} style={styles.slamItemImage} />
                )
            }

        </KeyboardAwareScrollView >

    );
};

const styles = StyleSheet.create({
    container: { flex: 1, flexGrow: 1 },
    header: {
        paddingTop: 20,
        paddingHorizontal: 15,
        backgroundColor: '#1a0b18',
        maxHeight: 90,
    },
    liveCompText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rankingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 10,
    },
    rankingText: {
        color: '#fff',
        fontSize: 12,
        marginLeft: 5,
    },
    votesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 10,
    },
    votesText: {
        color: '#fff',
        fontSize: 12,
        marginLeft: 5,
    },
    quickButton: {
        backgroundColor: '#F78E1B',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    quickButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    contestantImage: {
        width: Dimensions.get("screen").width,
        height: 350,
        resizeMode: 'cover',
    },
    versusImage: {
        position: 'absolute',
        top: 200,
        width: 250,
        height: 250,
        resizeMode: 'contain',
        alignSelf: 'center',
        zIndex: 1,
    },
    slamItemImage: {
        position: 'absolute',
        top: 250,
        width: 400,
        height: 400,
        resizeMode: 'contain',
        alignSelf: 'center',
        zIndex: 2,
    },
    commentsContainer: {
        flex: 0.5,
        paddingHorizontal: 15,
        backgroundColor: "#0f111bff",
        paddingVertical: 20,
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
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 150,
        backgroundColor: '#1C141D',
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    actionButton: {
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 13,
        marginTop: 5,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    shareModalView: {
        backgroundColor: '#151515',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 30,
        alignItems: 'center',
    },
    shareModalTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    shareOptionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    shareOption: {
        alignItems: 'center',
        marginHorizontal: 15,
        marginBottom: 15,
    },
    shareOptionText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 5,
    },
    cancelShareButton: {
        backgroundColor: '#1B1B1B',
        borderRadius: 100,
        width: '90%',
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelShareButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    perksModalView: {
        backgroundColor: '#151515',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    perksModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    perksModalTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    perksGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    perkItem: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        padding: 5,
        position: 'relative',
    },
    perkIcon: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
    },
    perkTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    perkName: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
        marginRight: 5,
    },
    tooltip: {
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: [{ translateX: -50 }],
        backgroundColor: '#282828',
        borderRadius: 8,
        padding: 10,
        width: 180,
        marginBottom: 10,
        zIndex: 10,
    },
    tooltipText: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
    },
    tooltipTriangle: {
        position: 'absolute',
        bottom: -10,
        left: '50%',
        transform: [{ translateX: -5 }],
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#282828',
    },
    perkMessageContainer: {
        position: 'absolute',
        bottom: 120, // Position above the action bar
        left: 20,
        right: 20,
        backgroundColor: '#FF3729',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
    },
    perkMessageText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    perkProgressBar: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: 3,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    commentInputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 10,
    },

    cartIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginRight: 10,
    },

    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },

    cartBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },

    commentInputContainer: {
        flex: 1,
        backgroundColor: '#2C2C2E',
        borderRadius: 100,
        paddingHorizontal: 15,
        justifyContent: 'center',
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

    giftButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2C2C2E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

});

export default Competition;

{/* <ScrollView horizontal contentContainerStyle={{ marginTop: 20 }}>
    {
        [1, 3, 4, 9].map((i) => (
            <View key={i} style={{ marginRight: 20, width: 300, backgroundColor: "#fff", borderRadius: 6, flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 10, paddingHorizontal: 10 }}>
                <Image source={TShirts} style={{ width: 70, height: 70 }} />
                <View style={{ flex: 1 }}>
                    <Text>Yellow T-Shirt</Text>
                    <Text style={{ marginTop: 4 }}>⭐ 4.0 200 sold</Text>
                    <View style={{ marginTop: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Text>$230 <Text style={{ color: "red" }}>$500</Text></Text>
                        <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#000", borderRadius: 100, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "#fff", fontSize: 10 }}>Add to cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        ))
    }
</ScrollView>  */}
{/* <View style={styles.cartIconContainer}>
    <View style={styles.cartBadge}>
        <Text style={styles.cartBadgeText}>2</Text>
    </View>
    <Ionicons name="cart-outline" size={24} color="#fff" />
</View> */}