import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Switch, Modal, Image, TextInput, ToastAndroid } from 'react-native';
import BottomNavBar from '../components/BottomNav';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import config from "../config";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';


const SellerOrdersScreen = () => {
    const [products, setProducts] = useState([])
    const navigation = useNavigation();


    const fetchProduct = async () => {
        let userId = await AsyncStorage.getItem('userId');
        try {
            let res = await axios.get(`${config.baseUrl}/order/seller/${userId}`)
            if (res?.data) {
                setProducts(res?.data?.data);
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const deliverOrder = async (id) => {
        try {
            let res = await axios.get(`${config.baseUrl}/order/delivered/${id}`)
            if (res?.data) {
                fetchProduct();
                ToastAndroid.show('Order Marked!', ToastAndroid.SHORT);

            }
        }
        catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        fetchProduct()
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, }}>
                    <Text style={styles.headerText}>Selling History</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <AntDesign name="plus" size={20} color="#ffff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
                    <Text style={styles.searchText}>Search</Text>
                </View>


                <View>
                    {
                        products?.map((i) => (
                            <View key={i?._id} style={{ padding: 10, backgroundColor: '#1A1A1A', borderRadius: 10, marginVertical: 10, }}>

                                <View style={{ flexDirection: "row", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: "#494848", paddingBottom: 20 }}>

                                    <Image source={{ uri: i.productId?.image }} alt='img' style={{ width: 70, height: 70, borderRadius: 10 }} />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ color: "#c4c4c4", fontSize: 15, marginTop: 8 }}>Quantity : {i?.quantity}</Text>
                                        <Text style={{ color: "#fff", fontSize: 15, marginTop: 3 }}>${i?.total}</Text>
                                    </View>

                                </View>

                                <Text style={{ color: "#fff", fontSize: 15, marginTop: 8 }}>Buyer Name : {i?.userId?.username}</Text>
                                <Text style={{ color: "#fff", fontSize: 15, marginTop: 3 }}>Country : {i?.country}</Text>
                                <Text style={{ color: "#fff", fontSize: 15, marginTop: 3 }}>City : {i?.city}</Text>
                                <Text style={{ color: "#fff", fontSize: 15, marginTop: 3 }}>Phone : {i?.phone}</Text>
                                <Text style={{ color: "#fff", fontSize: 15, marginTop: 3 }}>Address : {i?.address}</Text>

                                <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", marginTop: 15 }}>
                                    {
                                        !i?.delivered ? (
                                            <TouchableOpacity onPress={() => deliverOrder(i?._id)} style={styles.cancelButton}>
                                                <Text style={[styles.cancelText]}>Mark As Delivered</Text>
                                            </TouchableOpacity>

                                        ) :
                                            <TouchableOpacity style={styles.cancelButton}>
                                                <Text style={[styles.cancelText]}>Order Delivered</Text>
                                            </TouchableOpacity>
                                    }
                                </View>

                            </View>
                        ))
                    }
                </View>


            </ScrollView>




            <BottomNavBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 70
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchBar: {
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginBottom: 10
    },
    searchIcon: {
        marginRight: 10,
        color: "grey"
    },
    searchText: {
        color: "grey"
    },
    tabContainer: {
        flexDirection: "row",
        marginBottom: 20
    },
    tab: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "grey",
        marginRight: 10
    },
    activeTab: {
        backgroundColor: "orange",
        borderColor: "orange"
    },
    tabText: {
        color: "grey"
    },
    activeTabText: {
        color: "black"
    },
    viewStoreButton: {
        borderRadius: 30,
        padding: 10,
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "white",
        width: 100
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
        backgroundColor: "orange",
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
        width: "100%"
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

    addPlatform: {
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        backgroundColor: "#1A1A1A"
    },
    modalHandle: {
        width: 40,
        height: 5,
        backgroundColor: 'white',
        borderRadius: 2.5,
        marginTop: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#000',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    modalContent2: {
        backgroundColor: '#000',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
    },
    modalTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalSubtitle: {
        color: 'grey',
        marginBottom: 20,
    },
    platformIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 10,
    },
    platformIcon: {
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        padding: 6,
    },
    iconImage: {
        width: 30,
        height: 30,
    },
    buttonContainerModal: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 1
    },
    cancelButtonModal: {
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 20,
        padding: 10,
        width: "48%",
        alignItems: "center"
    },
    cancelTextModal: {
        color: "white"
    },
    saveButtonModal: {
        backgroundColor: "orange",
        borderRadius: 20,
        padding: 10,
        width: "48%",
        alignItems: "center",
        marginLeft: 15
    },
    saveTextModal: {
        color: "white"
    },
    rtmoSettings: {
        width: '100%',
        marginTop: 5,
    },
    rtmoTitle: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputContainerModal: {
        marginBottom: 15,
    },
    inputLabelModal: {
        color: 'grey',
        marginBottom: 5,
    },
    inputModal: {
        backgroundColor: '#1A1A1A',
        color: "white",
        borderRadius: 8,
        padding: 10,
    },
    advancedSettings: {
        marginTop: 15,
    },
    advancedSettingsTitle: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
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

});

export default SellerOrdersScreen;
