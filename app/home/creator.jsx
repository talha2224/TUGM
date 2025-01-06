import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground, Text, TouchableOpacity, TextInput, Image, Pressable, Modal, Switch } from 'react-native';
import Cover from '../../assets/images/stream-cover.png';
import Shortcuts from '../../assets/images/shortcuts.png';
import Pop from '../../assets/images/pop.png';

import { Ionicons, AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const dressImages = [
    "https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];
const products = [
    { id: 1, name: 'Jacket name', quantity: 32, price: 45.00, image: dressImages[0] },
    { id: 2, name: 'Jacket name', quantity: 12, price: 405.00, image: dressImages[1] },
];
const categories = ['Jacket', 'Shoes', 'Jeans', 'T-shirt', 'Access'];
const timeOptions = ['5s', '10s', '15s', '20s', '25s', '30s', '40s', '50s', '1m'];


const Creator = () => {
    const [store, setstore] = useState(false)
    const [showAuction, setshowAuction] = useState(false)
    const [activeCategory, setActiveCategory] = useState('Jacket');
    const [selectedTime, setSelectedTime] = useState('10s');
    const [isSuddenDeathEnabled, setIsSuddenDeathEnabled] = useState(false);
    const [end, setend] = useState(false)
    const handleCategoryPress = (category) => { setActiveCategory(category); };

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

                <View style={{ padding: 10, backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: 20, width: 120, marginVertical: 10 }}>
                    <Text style={{ color: "#fff", fontWeight: "800" }}> <Text style={{ color: "#F78E1B" }}>$</Text> duncan <Text style={{ color: "#c4c4c4" }}>- Bid</Text></Text>
                </View>
                <View style={{ marginVertical: 5, flexDirection: "row", justifyContent: "flex-start", width: 150 }}>
                    <Text style={{ color: "white", fontSize: 16, color: "#F78E1B" }}>Bidding 2/3</Text>
                    <TouchableOpacity onPress={() => setstore(!store)} style={{ color: "white", backgroundColor: "#F78E1B", paddingHorizontal: 15, borderRadius: 10, paddingVertical: 2, marginLeft: 10 }}>
                        <Text style={{ color: "#fff", fontSize: 12 }}>Auction settings</Text>
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
            </View>


            <View style={[styles.buttonContainer, { position: "absolute", bottom: 80, eft: 10, right: 10 }]}>
                <TouchableOpacity onPress={() => setend(!end)} style={[styles.cancelButton, { width: "45%", backgroundColor: "#C4C4C4", borderWidth: 0 }]}>
                    <Text style={{ color: "#000" }}>3 Bids</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setshowAuction(!showAuction)} style={[styles.startAuctionButton, { width: "45%" }]}>
                    <Text style={styles.startAuctionText}>Run Next      {">"}</Text>
                </TouchableOpacity>
            </View>


            {/* AUCTION  */}
            <Modal animationType="slide" transparent={true} visible={showAuction} onRequestClose={() => setshowAuction(false)}>
                <View style={styles.modalOverlay}>

                    <View style={styles?.modalContent2}>

                        <Text style={{ color: "white", fontSize: 16 }}>Live listings</Text>

                        <View style={{ backgroundColor: '#1A1A1A', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 2, marginVertical: 10 }}>
                            <Ionicons name="search" size={20} color="gray" />
                            <TextInput placeholder="Search for products" placeholderTextColor="gray" />
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
                            {categories.map((category) => (
                                <TouchableOpacity key={category} style={[styles.button, activeCategory === category && styles.activeButton,]} onPress={() => handleCategoryPress(category)}>
                                    <Text style={[styles.buttonText, activeCategory !== category && styles.inActiveButtonText]}>{category}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text style={{ color: "white", fontSize: 16, marginTop: 10 }}>My Store</Text>

                        {
                            products?.map((i) => (
                                <View key={i.id} style={{ padding: 10, backgroundColor: '#1A1A1A', borderRadius: 10, marginVertical: 10, }}>

                                    <View style={{ flexDirection: "row", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: "#494848", paddingBottom: 20 }}>

                                        <Image source={{ uri: i.image }} alt='img' style={{ width: 70, height: 70, borderRadius: 10 }} />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={{ color: "#fff", fontSize: 12 }}>{i.name}</Text>
                                            <Text style={{ color: "#c4c4c4", fontSize: 12, marginTop: 8 }}>QTY: {i?.quantity}</Text>
                                            <Text style={{ color: "#fff", fontSize: 12, marginTop: 8 }}>${i.price}</Text>
                                        </View>

                                    </View>

                                    <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", marginTop: 15 }}>
                                        <View>
                                            <Text style={{ color: "#c4c4c4", fontSize: 12 }}>0 Bid</Text>
                                            <Text style={{ color: "#fff", fontSize: 16, marginTop: 3 }}>${i.price}</Text>
                                        </View>

                                        <TouchableOpacity onPress={() => setshowAuction(false)} style={[styles.cancelButton, { backgroundColor: "#fff", width: 110 }]}>
                                            <Text style={[styles.cancelText, { color: "#000" }]}>Start auction</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            ))
                        }


                    </View>

                </View>
            </Modal>


            {/* STORE  */}

            <Modal animationType="slide" transparent={true} visible={store} onRequestClose={() => setstore(false)}>
                <View style={styles.modalOverlay}>

                    <View style={styles?.modalContent2}>

                        <Text style={{ color: "white", fontSize: 16 }}>Live listings</Text>

                        <View style={{ backgroundColor: '#1A1A1A', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 2, marginVertical: 10 }}>
                            <Ionicons name="search" size={20} color="gray" />
                            <TextInput placeholder="Search for products" placeholderTextColor="gray" />
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
                            {categories.map((category) => (
                                <TouchableOpacity key={category} style={[styles.button, activeCategory === category && styles.activeButton,]} onPress={() => handleCategoryPress(category)}>
                                    <Text style={[styles.buttonText, activeCategory !== category && styles.inActiveButtonText]}>{category}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity style={styles.viewStoreButton}>
                            <Text style={styles.viewStoreText}>View store</Text>
                        </TouchableOpacity>
                        <Text style={styles.sectionHeader}>Auction settings</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Starting Bid</Text>
                            <Text style={styles.inputValue}>$1</Text>
                        </View>

                        <View style={styles.timeContainer}>
                            <Text style={styles.inputLabel}>Time</Text>
                            <ScrollView horizontal contentContainerStyle={styles.timeOptionsContainer}>
                                {timeOptions.map((time) => (
                                    <TouchableOpacity key={time} style={[styles.timeOption, selectedTime === time && styles.activeTimeOption]} onPress={() => setSelectedTime(time)}
                                    >
                                        <Text style={[styles.timeOptionText, selectedTime !== time && styles.inActiveTimeOptionText]}>{time}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.suddenDeathContainer}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={styles.inputLabel}>Sudden death</Text>
                                <Switch trackColor={{ false: "#767577", true: "#81b0ff" }} thumbColor={isSuddenDeathEnabled ? "#f5dd4b" : "#f4f3f4"} ios_backgroundColor="#3e3e3e" onValueChange={setIsSuddenDeathEnabled} value={isSuddenDeathEnabled} style={{ marginLeft: 10 }} />
                            </View>
                            <Text style={styles.suddenDeathDescription}>This means when you're down to 00:01 the last person to bid wins!</Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => setstore(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setstore(false)} style={styles.startAuctionButton}>
                                <Text style={styles.startAuctionText}>Start auction</Text>
                            </TouchableOpacity>
                        </View>


                    </View>

                </View>
            </Modal>

            {
                end && (
                    <Pressable onPress={()=>setend(false)} style={{ position: "absolute", left: 20, right: 10, bottom: 30, padding: 20, backgroundColor: "#000", zIndex: 1, width: "90%", borderRadius: 30,justifyContent:"center",alignItems:"center" }}>
                        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", marginTop: 5 }}>
                            <Text style={{ color: "#fff",fontSize:16,fontWeight:"900" }}>W  I  N  N E  R </Text>
                        </View>
                        <Image source={{ uri:`https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`}} alt='img' style={{ width: 100, height: 100, borderRadius: 100,marginVertical:20 }} />
                        <Text style={{ textAlign: "center", marginTop: 10, color: "#c4c4c4" }}>Viveka</Text>
                        <Text style={{ textAlign: "center", marginTop: 10, color: "#F78E1B",fontWeight:"800",fontSize:15 }}>Won the auction</Text>
                    </Pressable>
                )
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
        bottom: 120, // Adjust top position as needed
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
        bottom: 150, // Adjust top position as needed
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent2: {
        backgroundColor: '#000',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
    },
    categoryContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    button: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'gray',
        marginRight: 10,
        backgroundColor: "#1A1A1A"
    },
    activeButton: {
        borderColor: '#FFA500',
        backgroundColor: '#FFA500',
    },
    inActiveButtonText: {
        color: "grey"
    },
    buttonText: {
        color: "black"
    },
    viewStoreButton: {
        borderRadius: 30,
        padding: 5,
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "white",
        width: 100,
        marginTop: 10
    },
    viewStoreText: {
        color: "black"
    },
    sectionHeader: {
        color: "white",
        fontWeight: "bold",
        marginBottom: 10
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        backgroundColor: "#1A1A1A"
    },
    inputLabel: {
        color: "grey"
    },
    inputValue: {
        color: "white"
    },
    timeContainer: {
        marginBottom: 20
    },
    timeOptionsContainer: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    timeOption: {
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: "#1A1A1A",
        marginTop: 10
    },
    activeTimeOption: {
        backgroundColor: "orange",
        borderColor: "orange"
    },
    timeOptionText: {
        color: "white"
    },
    inActiveTimeOptionText: {
        color: "white"
    },
    suddenDeathContainer: {
        padding: 10,
        marginBottom: 20
    },
    suddenDeathDescription: {
        color: "grey",
        marginTop: 10
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
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

export default Creator;
