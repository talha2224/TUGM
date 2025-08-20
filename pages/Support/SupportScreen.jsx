import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Ionicons from 'react-native-vector-icons/Ionicons';
import support from "../../assets/support.png";

const SupportScreen = () => {
    const navigation = useNavigation();

    const handleCallUs = () => {
        Linking.openURL('tel:123-456-7890');
    };

    const handleLiveChat = () => {
        navigation.navigate("live_support")
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back-outline" size={30} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Customer Support</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.supportHeader}>
                <Image source={support} style={styles.supportImage} />
                <View style={styles.supportText}>
                    <Text style={styles.supportHello}>Hello~John</Text>
                    <Text style={styles.supportQuestion}>How can we help you?</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.supportCard} onPress={handleCallUs}>
                <Ionicons name="call-outline" size={24} color="white" />
                <View style={styles.supportCardText}>
                    <Text style={styles.supportCardTitle}>You call us</Text>
                    <Text style={styles.supportCardDescription}>
                        If you have inquiries or need assistance, you can call us.
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.supportCard} onPress={handleLiveChat}>
                <Ionicons name="chatbox-ellipses-outline" size={24} color="white" />
                <View style={styles.supportCardText}>
                    <Text style={styles.supportCardTitle}>Live Chat</Text>
                    <Text style={styles.supportCardDescription}>
                        You can chat with our customer assistance agents.
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        marginBottom: 20,
    },
    backButton: {
        width: 30,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 30,
    },
    supportHeader: {
        flexDirection: 'row',
        backgroundColor: '#0F766E', // This color is a gradient in the image, but a solid color is used for simplicity
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    supportImage: {
        width: 60,
        height: 60,
        marginRight: 15,
    },
    supportText: {
        flex: 1,
    },
    supportHello: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    supportQuestion: {
        color: 'white',
        fontSize: 16,
    },
    supportCard: {
        flexDirection: 'row',
        backgroundColor: '#1C1C1E',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginBottom: 10,
    },
    supportCardText: {
        marginLeft: 15,
        flex: 1,
    },
    supportCardTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    supportCardDescription: {
        color: '#888',
        fontSize: 12,
        marginTop: 5,
    },
});

export default SupportScreen;
