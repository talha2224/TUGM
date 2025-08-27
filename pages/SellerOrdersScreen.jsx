import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import BottomNavBar from '../components/BottomNav';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import config from "../config";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';


const SellerOrdersScreen = () => {
    const [orders, setOrders] = useState([])
    const navigation = useNavigation();


    const fetchProduct = async () => {
        let userId = await AsyncStorage.getItem('userId');
        try {
            let res = await axios.get(`${config.baseUrl}/order/seller/${userId}`)
            if (res?.data) {
                setOrders(res?.data?.data);
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
    const orderStatus = async (id) => {
        try {
            let res = await axios.put(`${config.baseUrl}/order/status/${id}`, { status: "cancelled" })
            if (res?.data) {
                fetchProduct();
                ToastAndroid.show('Order Cancelled!', ToastAndroid.SHORT);

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
                        orders?.map((order) => (
                            <View key={order._id} style={{ backgroundColor: '#171717', marginBottom: 20, padding: 10, }}>
                                <View style={styles.orderCard}>
                                    <Image source={{ uri: order?.productId?.images[0] }} style={styles.productImage} />
                                    <View style={styles.orderDetails}>
                                        <Text style={styles.productType}>{order?.productId?.categories[0]}</Text>
                                        <Text style={styles.productName}>{order?.productId?.title}</Text>
                                    </View>
                                    <View style={styles.priceContainer}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                            <View style={[styles.statusTag, styles.ongoingTag]}><Text style={styles.statusText}>{order?.status}</Text></View>
                                            <Text style={styles.priceItems}>{order?.quantity} Items</Text>
                                        </View>
                                        <Text style={styles.priceText}>${order?.total}</Text>
                                    </View>
                                </View>
                                {
                                    order.status === "ongoing" && (
                                        <View>

                                            <TouchableOpacity onPress={() => orderStatus(order?._id)} style={{ backgroundColor: "red", marginTop: 10, paddingVertical: 7, borderRadius: 6, justifyContent: "center", alignItems: "center" }}>
                                                <Text style={{ color: "white", fontSize: 15 }}>Cancel Order</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => deliverOrder(order?._id)} style={{ backgroundColor: "#2C2C2E", marginTop: 10, paddingVertical: 7, borderRadius: 6, justifyContent: "center", alignItems: "center" }}>
                                                <Text style={{ color: "white", fontSize: 15 }}>Complete Order</Text>
                                            </TouchableOpacity>

                                        </View>
                                    )
                                }


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
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 70
    },
    headerText: {
        color: 'white',
        fontSize: 20,
    },
    searchBar: {
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginBottom: 30
    },
    searchIcon: {
        marginRight: 10,
        color: "grey"
    },
    searchText: {
        color: "grey"
    },
    orderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 15,
    },
    orderDetails: {
        flex: 1,
    },
    productType: {
        color: '#888',
        fontSize: 12,
    },
    productName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginVertical: 2,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    priceItems: {
        color: '#888',
        fontSize: 12,
    },
    priceText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 5,
    },
    statusTag: {
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    ongoingTag: {
        backgroundColor: '#2C2C2E',
        width: 70,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    statusText: {
        color: 'white',
        fontSize: 12,
    },
});

export default SellerOrdersScreen;
