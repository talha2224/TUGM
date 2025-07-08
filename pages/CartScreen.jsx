import { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, TextInput, ToastAndroid, Alert, Keyboard } from 'react-native';
import BottomNavBar from '../components/BottomNav';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import config from "../config";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { updateCart, removeFromCart, clearCart } from '../redux/cartSlice';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { useNavigation } from '@react-navigation/core';

const CartScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const products = useSelector(state => state.cart.cartItems);
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const proceed = async () => {
        Keyboard.dismiss(); 
        let userId = await AsyncStorage.getItem('userId');
        if(city.length<=0 || country.length<=0 || address.length<=0 || phone.length<=0){
            ToastAndroid.show('All Fields Are Required', ToastAndroid.SHORT);
            return
        }
        try {
            let paymentIntentRes = await axios.post(`${config.baseUrl}/payment/create-intent`, { amount: total * 100, currency: "usd" });
            console.log(paymentIntentRes?.data?.clientSecret)
            if (!paymentIntentRes?.data?.clientSecret) {
                throw new Error("Failed to fetch payment intent");
            }
            let clientSecret = paymentIntentRes?.data?.clientSecret
            if (clientSecret) {
                const initResponse = await initPaymentSheet({ merchantDisplayName: "User", paymentIntentClientSecret: clientSecret })
                console.log(initResponse, 'initResponse')
                if (initResponse.error) {
                    Alert.alert(initResponse?.error?.message)
                    return
                }
                else {
                    const paymentResponse = await presentPaymentSheet()
                    console.log(paymentResponse)
                    if (paymentResponse.error) {
                        Alert.alert(paymentResponse?.error?.message)
                        return
                    }
                    else {
                        let res = await axios.post(`${config.baseUrl}/order/checkout`, { userId, city, country, address, phone, product: products });
                        console.log(res?.data)
                        if (res?.data) {
                            console.log("Order placed successfully!");
                            ToastAndroid.show('Order Completed!', ToastAndroid.SHORT);
                            dispatch(clearCart());
                            setTimeout(() => {
                                navigation.navigate('Home');
                            }, 2000);
                        }
                    }
                }

            }
        } 
        catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <Text style={styles.headerText}>My Cart</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
                    <Text style={styles.searchText}>Search</Text>
                </View>

                {/* Cart Items */}
                {products.length > 0 ? products.map((i) => (
                    <View key={i._id} style={styles.cartItem}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image source={{ uri: i.image }} alt='img' style={styles.productImage} />
                            <View style={{ marginLeft: 20 }}>
                                <Text style={{ color: "#fff", fontSize: 12 }}>{i.title}</Text>
                                <Text style={{ color: "#fff", fontSize: 14, marginTop: 8 }}>${i.price}</Text>
                                <TouchableOpacity onPress={() => dispatch(removeFromCart(i._id))}>
                                    <Feather name="delete" size={20} color="red" style={{ marginTop: 8 }} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Quantity Controls */}
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity onPress={() => dispatch(updateCart({ id: i._id, quantity: i.quantity + 1 }))} style={styles.quantityButton}>
                                <AntDesign name="plus" size={15} color="white" />
                            </TouchableOpacity>
                            <Text style={{ color: "#c4c4c4", fontSize: 14 }}>{i.quantity}</Text>
                            <TouchableOpacity onPress={() => dispatch(updateCart({ id: i._id, quantity: i.quantity - 1 }))} style={styles.quantityButton}>
                                <AntDesign name="minus" size={15} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )) : (
                    <View style={{ height: 500, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "#fff", fontSize: 20 }}>No product found in cart ☁️</Text>
                    </View>
                )}

                {/* Delivery Details Inputs */}
                {
                    products.length > 0 && (
                        <View style={styles.deliveryContainer}>
                            <Text style={styles.deliveryHeader}>Delivery Details</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="City"
                                placeholderTextColor="gray"
                                value={city}
                                onChangeText={setCity}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Country"
                                placeholderTextColor="gray"
                                value={country}
                                onChangeText={setCountry}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Address"
                                placeholderTextColor="gray"
                                value={address}
                                onChangeText={setAddress}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone"
                                placeholderTextColor="gray"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>
                    )
                }

                {/* Total Values */}
                {
                    products.length > 0 && (
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalText}>Sub Total : ${total}</Text>
                            <Text style={[styles.totalText, { marginTop: 6 }]}>Total : ${total}</Text>
                        </View>
                    )
                }



                {/* Proceed Button */}
                {products.length > 0 && (
                    <TouchableOpacity style={styles.proceedButton} onPress={proceed}>
                        <Text style={{ color: "#fff", fontSize: 16 }}>Proceed Payment</Text>
                    </TouchableOpacity>
                )}
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
    cartItem: {
        paddingHorizontal: 10,
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        marginVertical: 10,
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 10
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    quantityButton: {
        width: 25,
        height: 25,
        backgroundColor: "gray",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    deliveryContainer: {
        marginVertical: 20
    },
    deliveryHeader: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10
    },
    input: {
        backgroundColor: '#1A1A1A',
        color: "white",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10
    },
    totalContainer: {
        justifyContent: "flex-end",
        alignItems: "flex-end",
        marginHorizontal: 10
    },
    totalText: {
        color: "#fff",
        fontSize: 16
    },
    proceedButton: {
        backgroundColor: "orange",
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20
    }
});

export default CartScreen;
