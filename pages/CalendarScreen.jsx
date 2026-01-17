import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Text, TouchableOpacity, Pressable, Modal } from 'react-native';
import BottomNavBar from '../components/BottomNav';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import config from '../config';
import axios from 'axios';
// Import icons for the modal
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';


const CalendarScreen = () => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState("");
    const [activeTab] = useState('Auctions');
    const [streams, setStreams] = useState([]);
    // State to control modal visibility
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchLiveStreams = async () => {
        try {
            let res = await axios.get(`${config.baseUrl}/battle/active`);
            if (res?.data) {
                setStreams(res?.data?.data);
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    useEffect(() => { fetchLiveStreams(); }, []);

    // Function to handle opening the modal
    const handleSeeMorePress = () => {
        setIsModalVisible(true);
    };

    // Dummy function for modal item presses
    const handleModalItemPress = (action) => {
        setIsModalVisible(false);
        navigation.navigate("competitions/settings")
    };

    console.log(streams)

    return (
        <GestureHandlerRootView style={styles.container}>

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 50 }}>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>TUGM</Text>
                    <Pressable onPress={() => { navigation.navigate("Cart") }} style={{ flexDirection: "row", alignItems: "center" }}>
                        <Feather name="shopping-cart" size={24} color="white" />
                    </Pressable>
                </View>

                <View style={styles.btnContainer}>
                    <TouchableOpacity style={[styles.tabButton, activeTab === 'Auctions' && styles.activeTab]} onPress={() => handleTabPress('Auctions')}>
                        <Text style={[styles.tabText, styles?.activeTab]}>Battle Arena</Text>
                    </TouchableOpacity>

                    {/* Updated TouchableOpacity for See More */}
                    <TouchableOpacity
                        style={{ backgroundColor: "#F78E1B", justifyContent: "center", alignItems: "center", paddingHorizontal: 10, borderRadius: 5 }}
                        onPress={handleSeeMorePress}
                    >
                        <Text style={{ color: "#fff" }}>See More</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <View style={styles.catContainer}>
                        <View style={styles.searchBar}>
                            <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
                            <TextInput style={styles.searchInput} placeholder="Search for events" placeholderTextColor="gray" value={searchText} onChangeText={setSearchText} />
                        </View>
                    </View>
                </View>


                {
                    streams?.length > 0 ?
                        <View style={styles.cardList}>
                            {streams?.map((stream, index) => (
                                <TouchableOpacity onPress={() => { navigation.navigate("competition", { streamId: stream?.streamId, isHost: false }) }} key={index} style={styles.card}>
                                    <Image source={{ uri: stream?.coverImage || stream?.creatorId?.profile }} style={styles.cardImage} blurRadius={4} />
                                    <View style={styles.cardOverlay}>
                                        <View style={styles.profileContainer}>
                                            <Image source={{ uri: stream?.coverImage || stream?.creatorId?.profile }} style={styles.profileImage} />
                                            <Text style={styles.profileName}>{stream?.creatorId?.username}</Text>
                                        </View>
                                        <Text style={styles.upcomingText}>Live</Text>
                                        {/* <Text style={styles.dateText}>{stream.date}</Text> */}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View> :
                        <Text style={{ flex: 1, textAlign: "center", fontSize: 20, color: "#fff", marginTop: 200 }}>No Live Event Found</Text>
                }


            </ScrollView>

            {/* The Bottom Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(!isModalVisible);
                }}
            >
                <Pressable style={styles.modalBackground} onPress={() => setIsModalVisible(false)}>
                    <Pressable style={styles.modalView}>
                        <TouchableOpacity style={styles.modalItem} onPress={() => handleModalItemPress('Live Auction')}>
                            <AntDesign name="camera" size={17} color="#fff" style={styles.modalIcon} />
                            <Text style={styles.modalText}>LIVE Auction</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalItem} onPress={() => handleModalItemPress('Live Competition')}>
                            <MaterialCommunityIcons name="trophy-variant-outline" size={17} color="#fff" style={styles.modalIcon} />
                            <Text style={styles.modalText} onPress={() => navigation.navigate("create_post")}>Post</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.modalItem} onPress={() => handleModalItemPress('Schedule a show')}>
                            <Ionicons name="play-circle-outline" size={17} color="#fff" style={styles.modalIcon} />
                            <Text style={styles.modalText}>Schedule a show</Text>
                        </TouchableOpacity> */}
                    </Pressable>
                </Pressable>
            </Modal>

            <BottomNavBar />
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 20
    },
    catContainer: {
        backgroundColor: '#000',
        padding: 20,
    },
    searchBar: {
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: 'white',
    },
    btnContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginTop: 20,
        justifyContent: "space-between"
    },
    tabButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 20,
    },
    tabText: {
        fontSize: 16,
        color: 'gray',
    },
    activeTab: {
        color: "orange"
    },

    cardList: {
        marginTop: 20,
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 50
    },
    card: {
        width: '40%',
        backgroundColor: '#282828',
        borderRadius: 10,
        marginBottom: 20,
        marginHorizontal: 15,
    },
    cardImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
    },
    upcomingText: {
        color: 'white',
        fontWeight: 'bold',
    },
    dateText: {
        color: 'gray',
        fontSize: 12,
    },
    // Styles for the new modal
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end', // Aligns modal to the bottom
    },
    modalView: {
        backgroundColor: '#151515',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'flex-start', // Align items to the left
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 15,
    },
    modalIcon: {
        marginRight: 15,
    },
    modalText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default CalendarScreen;