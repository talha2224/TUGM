import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/core';
import config from '../../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chats = () => {
    const navigation = useNavigation();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);

    const fetchChats = async () => {
        try {
            const userId = await AsyncStorage.getItem("userId");
            if (!userId) {
                setLoading(false);
                return;
            }

            const res = await axios.get(`${config.baseUrl}/chat/user/${userId}`);
            setChats(res.data.data || []);
        } catch (error) {
            console.error("Error fetching chats:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProfileInfo = async () => {
        const userId = await AsyncStorage.getItem("userId");
        try {
            let res = await axios.get(`${config.baseUrl2}/account/single/${userId}`);
            if (res?.data) {
                setProfileData(res?.data?.data);
            }
        } catch (error) {
            console.log("Error fetching profile info:", error);
        }
    };

    useEffect(() => {
        fetchChats();
        fetchProfileInfo();
    }, []);

    const handleMessagePress = async (chatId) => {
        const currentUserId = await AsyncStorage.getItem("userId")
        try {
            navigation.navigate("messages", { chatId, chatUser: profileData, currentUserId });
        } catch (err) {
            console.log("create chat error", err);
            ToastAndroid.show("Error starting chat", ToastAndroid.SHORT);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Messages</Text>
                <TouchableOpacity>
                    <Feather name="search" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Chat Messages List */}
            {loading ? (
                <ActivityIndicator size="large" color="#FF6600" style={{ marginTop: 20 }} />
            ) : (
                <ScrollView style={styles.chatListContainer}>
                    {chats.length === 0 ? (
                        <Text style={{ color: "#A0A0A0", textAlign: "center", marginTop: 20 }}>
                            No chats found
                        </Text>
                    ) : (
                        chats.map((chat) => {
                            // find other participant
                            const otherUser = chat.participants?.[0]; // adjust logic if needed
                            return (
                                <TouchableOpacity
                                    key={chat._id}
                                    style={styles.chatItem}
                                    onPress={() => handleMessagePress(chat._id)}
                                >
                                    <View style={styles.chatAvatarWrapper}>
                                        <Image
                                            source={
                                                otherUser?.profile
                                                    ? { uri: otherUser.profile }
                                                    : require('../../assets/img.png')
                                            }
                                            style={styles.chatAvatar}
                                        />
                                    </View>
                                    <View style={styles.chatContent}>
                                        <View style={styles.chatNameRow}>
                                            <Text style={styles.chatName}>
                                                {otherUser?.username || "Unknown"}
                                            </Text>
                                        </View>
                                        <Text
                                            style={styles.chatMessage}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {chat.lastMessage || "No messages yet"}
                                        </Text>
                                    </View>
                                    <View style={styles.chatTimeAndUnread}>
                                        <Text style={styles.chatTime}>
                                            {chat.messages?.length > 0
                                                ? new Date(
                                                    chat.messages[
                                                        chat.messages.length - 1
                                                    ].createdAt
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : ""}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    chatListContainer: {
        paddingHorizontal: 16,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    chatAvatarWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: "relative",
    },
    chatAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
    },
    chatContent: {
        flex: 1,
    },
    chatNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    chatName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    chatMessage: {
        color: '#A0A0A0',
        fontSize: 14,
    },
    chatTimeAndUnread: {
        alignItems: 'flex-end',
        marginLeft: 10,
    },
    chatTime: {
        color: '#A0A0A0',
        fontSize: 12,
        marginBottom: 4,
    },
});

export default Chats;
