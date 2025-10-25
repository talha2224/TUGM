import { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, TextInput, ToastAndroid, Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import product_img from "../assets/product/main.png";
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCart } from '../redux/cartSlice';

const CartScreen = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.cart.cartItems);

    const navigation = useNavigation();
    const [couponCode, setCouponCode] = useState('');
    const subtotal = 30.00;
    const deliveryFees = 7.50;
    const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleApplyCoupon = () => {
        if (couponCode.trim() === '') {
            ToastAndroid.show('Please enter a coupon code', ToastAndroid.SHORT);
            return;
        }
        Keyboard.dismiss();
        ToastAndroid.show(`Coupon code "${couponCode}" applied!`, ToastAndroid.SHORT);
    };

    const handleQuantityChange = (type, i) => {
        console.log(type, 'type')
        if (type === 'increase') {
            dispatch(updateCart({ id: i._id, quantity: i.quantity + 1 }))
        } else if (type === 'decrease' && i.quantity > 1) {
            console.log("enter here")
            dispatch(updateCart({ id: i._id, quantity: i.quantity - 1 }))
        }
    };

    const handleCheckout = () => {
        navigation.navigate("checkout")
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Entypo name="chevron-thin-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cart Summary</Text>
                <TouchableOpacity>
                    <Ionicons name="share-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.cartSection}>
                    <Text style={styles.cartTitle}>Cart ({products?.length})</Text>

                    {
                        products?.map((i) => (
                            <View key={i?._id}>
                                <View style={styles.cartItem}>
                                    <Image source={{ uri: i?.images[0] }} style={styles.productImage} />
                                    <View style={styles.productDetails}>
                                        <Text style={styles.productCategory}>{i?.categories[0]}</Text>
                                        <Text style={styles.productName}>{i?.title}</Text>
                                        <Text style={styles.productSeller}>Seller - <Text style={styles.sellerName}>John Doe</Text></Text>
                                        <Text style={styles.productColor}>Color - {i?.colors[0]}</Text>
                                    </View>
                                    <View style={styles.priceAndQuantity}>
                                        {/* <Text style={styles.discountText}>50% off</Text> */}
                                        <Text style={styles.priceText}>${i?.price?.toFixed(2)}</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, alignItems: "center", marginBottom: 20 }}>
                                    <TouchableOpacity onPress={() => dispatch(removeFromCart(i?._id))} style={styles.removeButton}>
                                        <Text style={styles.removeButtonText}>Remove</Text>
                                    </TouchableOpacity>
                                    <View style={styles.quantityControl}>
                                        <TouchableOpacity onPress={() => handleQuantityChange('decrease', i)}>
                                            <Feather name="minus" size={24} color="#888" />
                                        </TouchableOpacity>
                                        <Text style={styles.quantityText}>{i?.quantity}</Text>
                                        <TouchableOpacity onPress={() => handleQuantityChange('increase', i)}>
                                            <Feather name="plus" size={24} color="#F28C28" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                    }
                </View>

                <View style={styles.couponSection}>
                    <Text style={styles.couponTitle}>Coupon Code</Text>
                    <View style={styles.couponInputContainer}>
                        <Ionicons name="pricetag-outline" size={20} color="#888" />
                        <TextInput
                            style={styles.couponInput}
                            placeholder="Enter code here"
                            placeholderTextColor="#888"
                            value={couponCode}
                            onChangeText={setCouponCode}
                        />
                        <TouchableOpacity onPress={handleApplyCoupon} style={styles.applyButton}>
                            <Text style={styles.applyButtonText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.summarySection}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Delivery Fees</Text>
                        <Text style={styles.summaryValue}>${deliveryFees.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                    <Text style={styles.checkoutButtonText}>Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
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
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollViewContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    cartSection: {
        backgroundColor: '#1B1B1B',
        padding: 15,
        marginBottom: 20,
    },
    cartTitle: {
        color: 'white',
        fontSize: 18,
        marginBottom: 15,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
    },
    productDetails: {
        flex: 1,
    },
    productCategory: {
        color: '#888',
        fontSize: 12,
    },
    productName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 2,
    },
    productSeller: {
        color: '#888',
        fontSize: 12,
    },
    sellerName: {
        color: 'white',
    },
    productColor: {
        color: '#888',
        fontSize: 12,
        marginBottom: 5,
    },
    removeButton: {
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    priceAndQuantity: {
        alignItems: 'flex-end',
        position: 'absolute',
        top: 0,
        right: 0,
    },
    discountText: {
        color: '#5CB85C',
        fontSize: 12,
        fontWeight: 'bold',
    },
    priceText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2C2C2E',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 100,
        justifyContent: 'space-between',
    },
    quantityText: {
        color: 'white',
        fontSize: 16,
    },
    couponSection: {
        backgroundColor: '#1C1C1E',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
    },
    couponTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    couponInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2C2C2E',
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    couponInput: {
        flex: 1,
        color: 'white',
        height: 50,
        paddingLeft: 10,
    },
    applyButton: {
        backgroundColor: '#F28C28',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },
    applyButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    summarySection: {
        backgroundColor: '#1C1C1E',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        color: '#888',
    },
    summaryValue: {
        color: 'white',
    },
    totalLabel: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    totalValue: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    bottomBar: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#000',
        borderTopWidth: 1,
        borderTopColor: '#2C2C2E',
        marginBottom: 50
    },
    checkoutButton: {
        backgroundColor: '#F28C28',
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CartScreen;
