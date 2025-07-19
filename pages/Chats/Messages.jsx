import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Modal,
    Animated,
    Easing,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import faceImg from '../../assets/img.png';

const { width, height } = Dimensions.get('window');

const Messages = () => {
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(height)).current;

    const chatUser = {
        name: 'Terri Mitchell',
        isSeller: true,
        isOnline: true,
        avatar: 'https://placehold.co/50x50/FF6600/FFFFFF?text=TM',
    };

    const messages = [
        { id: 1, sender: 'other', text: 'Hi John!', time: '01:30 PM' },
        { id: 2, sender: 'other', text: 'How are you doing?', time: '01:30 PM' },
        { id: 3, sender: 'me', text: 'Hi Terri! 👋', time: '01:31 PM' },
        { id: 4, sender: 'me', text: 'Hello Terri 👋', time: '01:31 PM' },
        { id: 5, sender: 'me', text: 'How are you doing?', time: '01:31 PM' },
        { id: 6, sender: 'me', text: 'Am doing great😊', time: '01:31 PM' },
        { id: 7, sender: 'other', text: 'How are you doing?', time: '01:31 PM' },
        { id: 8, sender: 'me', text: 'Can we talk about the LIVE battle event we discussed earlier', time: '01:31 PM', delivered: true },
    ];

    const toggleModal = () => {
        if (!isModalVisible) {
            setModalVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 300,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }).start(() => setModalVisible(false));
        }
    };

    const handleModalAction = (action) => {
        console.log(`Action: ${action}`);
        toggleModal();
    };

    const modalOptions = [
        { label: 'View profile', action: 'view_profile' },
        { label: 'Mute notification', action: 'mute_notification' },
        { label: 'Clear chat', action: 'clear_chat' },
        { label: 'Report', action: 'report' },
        { label: 'Block', action: 'block' },
    ];

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <View style={styles.headerUserInfo}>
                            <Image source={faceImg} style={styles.headerAvatar} />
                            <View>
                                <View style={styles.headerNameRow}>
                                    <Text style={styles.headerName}>{chatUser.name}</Text>
                                    {chatUser.isSeller && <Text style={styles.headerSellerBadge}>Seller</Text>}
                                </View>
                                {chatUser.isOnline && <Text style={styles.headerOnlineStatus}>Online</Text>}
                            </View>
                        </View>
                        <TouchableOpacity onPress={toggleModal}>
                            <Feather name="more-vertical" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.messagesContainer}>
                        <Text style={styles.dateSeparator}>Today</Text>
                        {messages.map((msg) => (
                            <View
                                key={msg.id}
                                style={[
                                    styles.messageBubble,
                                    msg.sender === 'me' ? styles.myMessageBubble : styles.otherMessageBubble,
                                ]}
                            >
                                <Text style={msg.sender === 'me' ? styles.myMessageText : styles.otherMessageText}>
                                    {msg.text}
                                </Text>
                                <View style={styles.messageTimeContainer}>
                                    {msg.sender === 'me' && msg.delivered && (
                                        <MaterialCommunityIcons name="check-all" size={12} color="#A0A0A0" style={styles.deliveredIcon} />
                                    )}
                                    <Text style={styles.messageTime}>{msg.time}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.inputContainer}>
                        <TouchableOpacity style={styles.inputIcon}>
                            <MaterialIcons name="attach-file" size={24} color="#A0A0A0" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type message"
                            placeholderTextColor="#A0A0A0"
                        />
                        <TouchableOpacity style={styles.inputIcon}>
                            <Ionicons name="add" size={24} color="#A0A0A0" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.micButton}>
                            <Feather name="mic" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <Modal
                        transparent
                        animationType="none"
                        visible={isModalVisible}
                        onRequestClose={toggleModal}
                    >
                        <TouchableWithoutFeedback onPress={toggleModal}>
                            <View style={styles.modalOverlay}>
                                <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
                                    {modalOptions.map(opt => (
                                        <TouchableOpacity
                                            key={opt.action}
                                            style={styles.modalOption}
                                            onPress={() => handleModalAction(opt.action)}
                                        >
                                            <Text style={styles.modalOptionText}>{opt.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </Animated.View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    headerUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 15,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    headerSellerBadge: {
        backgroundColor: '#28A745',
        borderRadius: 5,
        paddingHorizontal: 6,
        paddingVertical: 2,
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    headerOnlineStatus: {
        color: '#A0A0A0',
        fontSize: 12,
    },
    messagesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    dateSeparator: {
        alignSelf: 'center',
        color: '#A0A0A0',
        fontSize: 12,
        marginVertical: 15,
        backgroundColor: '#333333',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    messageBubble: {
        maxWidth: width * 0.7,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    myMessageBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#F78E1B',
        borderBottomRightRadius: 2,
    },
    otherMessageBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#333333',
        borderBottomLeftRadius: 2,
    },
    myMessageText: {
        color: '#FFFFFF',
        fontSize: 15,
    },
    otherMessageText: {
        color: '#FFFFFF',
        fontSize: 15,
    },
    messageTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 5,
    },
    messageTime: {
        color: '#A0A0A0',
        fontSize: 10,
        marginLeft: 5,
    },
    deliveredIcon: {
        marginRight: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333333',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 'auto',
    },
    inputIcon: {
        padding: 8,
    },
    textInput: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: '#FFFFFF',
        fontSize: 16,
        marginHorizontal: 5,
    },
    micButton: {
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#151515',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        // paddingVertical: 10,
        width: '100%',
    },
    modalOption: {
        paddingVertical: 15,
    },
    modalOptionText: {
        color: '#FFFFFF',
    },
});

export default Messages;
