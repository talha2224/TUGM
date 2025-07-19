import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import faceImg from '../../assets/img.png'
import { useNavigation } from '@react-navigation/core';

const stories = [
    { id: 'story_add', type: 'add', name: 'Story', avatar: null },
    { id: 'brandie', type: 'user', name: 'Brandie', avatar: faceImg },
    { id: 'clothin', type: 'user', name: 'Clothin', avatar: 'https://placehold.co/50x50/007BFF/FFFFFF?text=C' },
    { id: 'kiki', type: 'user', name: '@kiki', avatar: 'https://placehold.co/50x50/28A745/FFFFFF?text=K' },
    { id: 'fikky', type: 'user', name: '@fikky', avatar: 'https://placehold.co/50x50/17A2B8/FFFFFF?text=F' },
    { id: 'sash', type: 'user', name: 'Sash', avatar: 'https://placehold.co/50x50/6C757D/FFFFFF?text=S' },
];
const chatMessages = [
    { id: 1, name: 'Terri Mitchell', isSeller: true, time: '1:31 PM', message: 'Can we talk about the LIVE battle...', avatar: 'https://placehold.co/50x50/FF6600/FFFFFF?text=TM', read: true },
    { id: 2, name: 'RGonzalez', isSeller: true, time: '2:00 PM', message: 'I’m looking forward to the upco...', avatar: 'https://placehold.co/50x50/007BFF/FFFFFF?text=RG', unreadCount: 2, read: true },
    { id: 3, name: 'RWard', isSeller: false, time: '2:00 PM', message: 'Hey there! 🙂 I’ve been feeling quite ...', avatar: 'https://placehold.co/50x50/28A745/FFFFFF?text=RW', unreadCount: 1, read: true },
    { id: 4, name: 'Grace Rao', isSeller: false, time: '2:00 PM', message: 'What’s your favorite color?', avatar: 'https://placehold.co/50x50/17A2B8/FFFFFF?text=GR', read: true },
    { id: 5, name: 'Robert Fox', isSeller: false, time: '2:00 PM', message: '🙌 It’s been challenging to keep in...', avatar: 'https://placehold.co/50x50/6C757D/FFFFFF?text=RF', read: false },
    { id: 6, name: 'wanderlustheart', isSeller: false, time: '2:00 PM', message: 'I need your name. It’s nicer that way.', avatar: 'https://placehold.co/50x50/DC3545/FFFFFF?text=WH', unreadCount: 2, read: true },
    { id: 7, name: 'BHill', isSeller: false, time: '2:00 PM', message: 'Hi there!', avatar: 'https://placehold.co/50x50/FFC107/FFFFFF?text=BH', unreadCount: 2, read: false },
    { id: 8, name: 'mountain_ma', isSeller: false, time: '2:00 PM', message: 'What’s the weather like today?', avatar: 'https://placehold.co/50x50/000000/FFFFFF?text=MM', read: true },
];

const Chats = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Messages</Text>
                <TouchableOpacity>
                    <Feather name="search" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Stories/Status Section */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesContainer}>
                {stories.map((story) => (
                    <View key={story.id} style={styles.storyItem}>
                        <View style={[styles.storyAvatarWrapper, story.type !== "add" && { borderWidth: 1, borderColor: "#373737" }]}>
                            {story.type === 'add' ? (
                                <View style={styles.addStoryCircle}>
                                    <AntDesign name="plus" size={24} color="#fff" />
                                </View>
                            ) : (
                                <Image source={faceImg} style={styles.storyAvatar} />
                            )}
                        </View>
                        <Text style={styles.storyName}>{story.name}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Chat Messages List */}
            <ScrollView style={styles.chatListContainer}>
                {chatMessages.map((chat) => (
                    <TouchableOpacity onPress={()=>navigation.navigate("messages")} key={chat.id} style={styles.chatItem}>
                        <View style={styles.chatAvatarWrapper}>
                            <Image source={faceImg} style={styles.chatAvatar} />
                        </View>
                        <View style={styles.chatContent}>
                            <View style={styles.chatNameRow}>
                                <Text style={styles.chatName}>{chat.name}</Text>
                                {chat.isSeller && <Text style={styles.sellerBadge}>Seller</Text>}
                            </View>
                            <Text style={styles.chatMessage} numberOfLines={1} ellipsizeMode="tail">{chat.message}</Text>
                        </View>
                        <View style={styles.chatTimeAndUnread}>
                            <Text style={styles.chatTime}>{chat.time}</Text>
                            {chat.unreadCount > 0 && (
                                <View style={styles.unreadBadge}>
                                    <Text style={styles.unreadText}>{chat.unreadCount}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A', // Dark background
        paddingTop: 50, // For status bar/notch
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
    storiesContainer: {
        paddingTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        maxHeight: 100,
        marginBottom: -100
    },
    storyItem: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    storyAvatarWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        overflow: 'hidden',
    },
    storyAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 30, // Make it circular
    },
    addStoryCircle: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        backgroundColor: '#1B1B1B', // Dark background for add story circle
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "#373737"
    },
    addStoryPlusBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FF6600', // Orange plus badge
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1A1A1A', // Match background
    },
    storyName: {
        color: '#A0A0A0',
        fontSize: 12,
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
        position: "relative"
    },
    chatAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
    },
    readCheckmark: {
        position: 'absolute',
        bottom: 10,
        right: -10,
        backgroundColor: '#1A1A1A', // Background to make checkmark stand out
        borderRadius: 8,
        zIndex: 100
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
    sellerBadge: {
        backgroundColor: '#28A745', // Green for Seller badge
        borderRadius: 5,
        paddingHorizontal: 6,
        paddingVertical: 2,
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
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
    unreadBadge: {
        backgroundColor: '#FF6600', // Orange for unread count
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default Chats;
