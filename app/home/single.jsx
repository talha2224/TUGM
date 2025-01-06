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
    const [showBid, setshowBid] = useState(false)
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
                <View style={{ marginVertical: 5, flexDirection: "row", justifyContent: "flex-start", width: 100 }}>
                    <Text style={{ color: "white", fontSize: 16, color: "#F78E1B" }}>Bidding 2/3</Text>
                    <TouchableOpacity onPress={() => setshowBid(!showBid)} style={{ color: "white", backgroundColor: "#F78E1B", paddingHorizontal: 15, borderRadius: 10, marginLeft: 10 }}>
                        <Text style={{ color: "#fff" }}>Bid</Text>
                    </TouchableOpacity>
                </View>
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

            <View style={{ padding: 10, backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: 20, width: 120, marginVertical: 10,position:"absolute",top:"30%",left:"30%" }}>
                <Text style={{ color: "#fff", fontWeight: "800" }}> <Text style={{ color: "#F78E1B" }}>$ </Text> Bid added</Text>
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
                <View style={{ marginBottom: 20, marginLeft: 20 }}>
                    <Pressable onPress={() => setwallet(false)}>
                        <Image source={Wallet} style={{ width: "100%" }} />
                    </Pressable>
                </View>
            }

            {
                showBid &&
                <View style={{ position: "absolute", left: 20, right: 10, bottom: 30, padding: 20, backgroundColor: "#000", zIndex: 1, width: "90%", borderRadius: 30 }}>
                    <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", marginTop: 5 }}>
                        <Text style={{ color: "#fff" }}>$ Add Bid</Text>
                    </View>
                    <Text style={{ textAlign: "center", marginTop: 10, color: "#c4c4c4" }}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => setshowBid(false)} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setshowBid(false)} style={styles.startAuctionButton}>
                            <Text style={styles.startAuctionText}>Bid</Text>
                        </TouchableOpacity>
                    </View>
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
    leftContainer: {
        position: 'absolute',
        bottom: 100, // Adjust top position as needed
        left: 20,
        right: 70
    },
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
});

export default Single;