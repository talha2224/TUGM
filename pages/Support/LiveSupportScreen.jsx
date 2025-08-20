import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LiveSupportScreen = () => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hi John, I am TUGM virtual assistant. I am here to answer your questions.', sender: 'bot' },
        { id: 2, text: 'Are you contacting us regarding an existing order?', sender: 'bot', type: 'options' },
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: inputMessage,
                sender: 'user',
            };
            setMessages([...messages, newMessage]);
            setInputMessage('');
        }
    };

    const handleOptionPress = (option) => {
        const newMessage = {
            id: messages.length + 1,
            text: option,
            sender: 'user',
        };
        setMessages([...messages, newMessage]);
    };

    const renderMessage = (message) => {
        if (message.type === 'options') {
            return (
                <View key={message.id} style={styles.botMessageBubble}>
                    <Text style={styles.botMessageText}>{message.text}</Text>
                    <View style={styles.optionContainer}>
                        <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionPress('Yes')}>
                            <Text style={styles.optionButtonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionPress('No')}>
                            <Text style={styles.optionButtonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return (
            <View
                key={message.id}
                style={[
                    styles.messageBubble,
                    message.sender === 'user' ? styles.userMessage : styles.botMessage,
                ]}
            >
                <Text style={styles.messageText}>{message.text}</Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back-outline" size={30} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>TUGM Chat Support</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Ionicons name="close-outline" size={30} color="white" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.chatContent}>
                {messages.map(renderMessage)}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type message"
                    placeholderTextColor="#888"
                    value={inputMessage}
                    onChangeText={setInputMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Ionicons name="send" size={24} color="#F28C28" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
    },
    backButton: {},
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {},
    chatContent: {
        padding: 20,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 15,
        marginBottom: 10,
    },
    botMessage: {
        backgroundColor: '#1C1C1E',
        alignSelf: 'flex-start',
    },
    userMessage: {
        backgroundColor: '#F28C28',
        alignSelf: 'flex-end',
    },
    messageText: {
        color: 'white',
    },
    botMessageBubble: {
        maxWidth: '80%',
        padding: 15,
        borderRadius: 15,
        backgroundColor: '#1C1C1E',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    botMessageText: {
        color: 'white',
        marginBottom: 10,
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    optionButton: {
        backgroundColor: '#2C2C2E',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    optionButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#1C1C1E',
        borderTopWidth: 1,
        borderTopColor: '#2C2C2E',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#3A3A3C',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: 'white',
        marginRight: 10,
    },
    sendButton: {
        padding: 5,
    },
});

export default LiveSupportScreen;
