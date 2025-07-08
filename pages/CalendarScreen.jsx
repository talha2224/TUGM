import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Text, TouchableOpacity, Pressable } from 'react-native';
import BottomNavBar from '../components/BottomNav';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import config from '../config';
import axios from 'axios';

const auctionData = [
    {
        name: 'sam',
        image: "https://randomuser.me/api/portraits/men/10.jpg",
        date: 'Dec 26, 2024 07:52',
    },
    {
        name: 'james',
        image: "https://randomuser.me/api/portraits/women/11.jpg",
        date: 'Dec 26, 2024 08:50',
    },
    {
        name: 'c',
        image: "https://randomuser.me/api/portraits/men/12.jpg",
        date: 'Dec 28, 2024 09:10',
    },
    {
        name: 'ali',
        image: "https://randomuser.me/api/portraits/men/13.jpg",
        date: 'Dec 29, 2024 10:10',
    },
    {
        name: 'sam',
        image: "https://randomuser.me/api/portraits/men/10.jpg",
        date: 'Dec 26, 2024 07:52',
    },
    {
        name: 'james',
        image: "https://randomuser.me/api/portraits/women/11.jpg",
        date: 'Dec 26, 2024 08:50',
    },
    {
        name: 'c',
        image: "https://randomuser.me/api/portraits/men/12.jpg",
        date: 'Dec 28, 2024 09:10',
    },
    {
        name: 'ali',
        image: "https://randomuser.me/api/portraits/men/13.jpg",
        date: 'Dec 29, 2024 10:10',
    },
];


const CalendarScreen = () => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState("");
    const [activeTab] = useState('Auctions');
    const [streams, setStreams] = useState([]);
    const filteredAuctions = auctionData.filter(stream => stream.name.toLowerCase().includes(searchText.toLowerCase()));

    const fetchLiveStreams = async () => {
        try {
            let res = await axios.get(`${config.baseUrl}/stream/active`);
            if (res?.data) {
                setStreams(res?.data?.data);
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    useEffect(() => { fetchLiveStreams(); }, []);

    return (
        <GestureHandlerRootView style={styles.container}>


            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 }}>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>TUGM</Text>
                    <Pressable onPress={() => { navigation.navigate("Cart") }} style={{ flexDirection: "row", alignItems: "center" }}>
                        <Feather name="shopping-cart" size={24} color="white" />
                    </Pressable>
                </View>

                <View style={styles.btnContainer}>
                    <TouchableOpacity style={[styles.tabButton, activeTab === 'Auctions' && styles.activeTab]} onPress={() => handleTabPress('Auctions')}>
                        <Text style={[styles.tabText, activeTab !== 'Auctions' ? styles.inActiveTabText : styles?.activeTab]}>Events</Text>
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
                                <TouchableOpacity onPress={() => { navigation.navigate("CreatorStream", { streamId: stream?.streamId,isHost:false }) }} key={index} style={styles.card}>
                                    <Image source={{ uri: stream?.creatorId?.profile || stream?.creatorId?.coverImage }} style={styles.cardImage} blurRadius={4} />
                                    <View style={styles.cardOverlay}>
                                        <View style={styles.profileContainer}>
                                            <Image source={{ uri: stream?.creatorId?.profile || stream?.creatorId?.coverImage  }} style={styles.profileImage} />
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
        paddingHorizontal: 20,
        marginTop: 20,
    },
    tabButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 20,
    },
    activeTab: {
        color: "#F78E1B"
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

});

export default CalendarScreen;
