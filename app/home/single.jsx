import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground, Text, TouchableOpacity, TextInput, Image, Pressable } from 'react-native';
import BottomNavBar from '../../components/BottomNav';
import Cover from '../../assets/images/stream-cover.png';
import Shortcuts from '../../assets/images/shortcuts.png';
import Shirts from '../../assets/images/shirts.png';
import Gifts from '../../assets/images/gifts.png';
import Wallet from '../../assets/images/wallet.png';

import { Ionicons, AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Single = () => {
    const [showShirts, setshowShirts] = useState(false)
    const [showGifts, setshowGifts] = useState(false)
    const [wallet, setwallet] = useState(false)
    return (
        <View style={styles.container}>

            <ImageBackground source={Cover} style={styles.coverImage} resizeMode="cover">
                <TouchableOpacity onPress={() => router.push("home")} style={{ justifyContent: "center", alignItems: "center", marginTop: 40, marginHorizontal: 20 }}>
                    <Image source={Shortcuts} />
                </TouchableOpacity>
            </ImageBackground>




            <View style={styles.leftContainer}>
                <View style={{ marginTop: 5 }}>
                    <Text style={{ color: "#a7a7a7" }}>John</Text>
                    <Text style={{ color: "white", fontSize: 16 }}>Hi How are you ?</Text>
                </View>
                <View style={{ marginTop: 5 }}>
                    <Text style={{ color: "#a7a7a7" }}>John</Text>
                    <Text style={{ color: "white", fontSize: 16 }}>Hi How are you ?</Text>
                </View>
                <View style={{ marginTop: 5 }}>
                    <Text style={{ color: "#a7a7a7" }}>John</Text>
                    <Text style={{ color: "white", fontSize: 16 }}>Hi How are you ?</Text>
                </View>
                <View style={{ marginTop: 5 }}>
                    <Text style={{ color: "#a7a7a7" }}>John</Text>
                    <Text style={{ color: "white", fontSize: 16 }}>Hi How are you ?</Text>
                </View>
                <Text style={{ color: "white", fontSize: 16, color: "#F78E1B", marginTop: 5 }}>Bidding 2/3</Text>
                <Text style={{ color: "#c4c4c4", fontSize: 13 }}>Cobbles Classic sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam... see more</Text>

            </View>



            <View style={styles.rightIconsContainer}> {/* Right Icons Container */}
                <TouchableOpacity style={styles.rightIconButton}>
                    <Ionicons name="volume-mute-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightIconButton}>
                    <Ionicons name="share-social-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightIconButton}>
                    <AntDesign name="hearto" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightIconButton}>
                    <Feather name="message-square" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightIconButton}>
                    <MaterialIcons name="more-vert" size={24} color="white" />{/*More Icon*/}
                </TouchableOpacity>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>$20</Text>
                    <Text style={styles.timer}>-00:06</Text>
                </View>
            </View>

            <View style={styles.bottomIconsContainer}>
                <View style={styles.commentInputWrapper}>
                    <TextInput style={styles.commentInput} placeholder="Add comment..." placeholderTextColor="gray" />
                    <TouchableOpacity style={styles.sendButton}>
                        <Feather name="send" size={20} color="white" />
                    </TouchableOpacity>
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

            {
                showShirts &&
                <View style={{ marginBottom: 20 }}>
                    <Pressable onPress={() => setshowShirts(false)}>
                        <Image source={Shirts} style={{ width: "100%" }} />
                    </Pressable>
                </View>

            }


            {
                showGifts &&
                <View style={{ marginBottom: 20 }}>
                    <Pressable onPress={() => setshowGifts(false)}>
                        <Image source={Gifts} style={{ width: "100%" }} />
                    </Pressable>
                </View>

            }

            {
                wallet &&
                <View style={{ marginBottom: 20,marginLeft:20 }}>
                    <Pressable onPress={() => setwallet(false)}>
                        <Image source={Wallet} style={{ width: "100%" }} />
                    </Pressable>
                </View>

            }


        </View>
    );
};

const styles = StyleSheet.create({
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
        color: 'black',
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
    leftContainer: {
        position: 'absolute',
        bottom: 100, // Adjust top position as needed
        left: 20,
        right: 70
    },
});

export default Single;