import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Entypo from 'react-native-vector-icons/Entypo';
import product_img from "../assets/product/main.png";

const orderData = [
    { id: '1', product: 'Zip-up hoody', status: 'Ongoing', price: '30.00', image: product_img, type: 'Clothing' },
    { id: '2', product: 'Zip-up hoody', status: 'Delivered', date: 'On 10-05', price: '30.00', image: product_img, type: 'Clothing' },
    { id: '3', product: 'Jacket name', status: 'Ongoing', price: '55.00', image: product_img, type: 'Clothing' },
    { id: '4', product: 'Jacket name', status: 'Canceled', price: '21.00', image: product_img, type: 'Clothing' },
    { id: '5', product: 'Jacket name', status: 'Delivered', price: '21.00', image: product_img, type: 'Clothing' },
];

const BuyerOrderScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('All');

    const filteredOrders = orderData.filter(order => {
        if (activeTab === 'All') {
            return true;
        }
        return order.status === activeTab;
    });

    const renderOrderStatus = (status, date) => {
        switch (status) {
            case 'Ongoing':
                return (
                    <View style={[styles.statusTag, styles.ongoingTag]}>
                        <Text style={styles.statusText}>Ongoing</Text>
                    </View>
                );
            case 'Delivered':
                return (
                    <View style={styles.statusContainer}>
                        <View style={[styles.statusTag, styles.deliveredTag]}>
                            <Text style={styles.statusText}>Delivered</Text>
                        </View>
                        {date && <Text style={styles.deliveryDate}>{date}</Text>}
                        <TouchableOpacity style={styles.rateButton}>
                            <Text style={styles.rateButtonText}>Rate this product</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 'Canceled':
                return (
                    <View style={[styles.statusTag, styles.canceledTag]}>
                        <Text style={styles.statusText}>Canceled</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Entypo name="chevron-thin-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Orders</Text>
                <View style={styles.placeholder} />
            </View>
            <View style={styles.tabContainer}>
                {['All', 'Delivered', 'Ongoing', 'Canceled'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tabButton, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                {filteredOrders.map(order => (
                    <TouchableOpacity onPress={()=>navigation.navigate("order_tracking")} key={order.id} style={styles.orderCard}>
                        <Image source={order.image} style={styles.productImage} />
                        <View style={styles.orderDetails}>
                            <Text style={styles.productType}>{order.type}</Text>
                            <Text style={styles.productName}>{order.product}</Text>
                            {order.status === 'Ongoing' && renderOrderStatus(order.status)}
                            {order.status === 'Canceled' && renderOrderStatus(order.status)}
                            {order.status === 'Delivered' && renderOrderStatus(order.status, order.date)}
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.priceItems}>1 Items</Text>
                            <Text style={styles.priceText}>${order.price}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    backButton: {
    },
    headerTitle: {
        color: 'white',
        fontSize: 20
    },
    placeholder: {
        width: 40,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        marginHorizontal: 5,
        backgroundColor: '#252525',
        borderRadius: 50,
    },
    activeTab: {
        backgroundColor: '#F28C28',
    },
    tabText: {
        color: 'white'
    },
    activeTabText: {
        color: 'white',
    },
    scrollViewContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    orderCard: {
        flexDirection: 'row',
        backgroundColor: '#171717',
        marginBottom: 20,
        padding: 10,
        alignItems: 'center',
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
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    statusTag: {
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 5,
    },
    ongoingTag: {
        backgroundColor: '#2C2C2E',
        width: 70,
        marginTop: 6,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    deliveredTag: {
        backgroundColor: '#5CB85C',
        width: 70,
        marginTop: 6,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    canceledTag: {
        backgroundColor: '#D9534F',
        width: 70,
        marginTop: 6,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    statusText: {
        color: 'white',
        fontSize: 12,
    },
    deliveryDate: {
        color: '#888',
        fontSize: 12,
        marginRight: 5,
    },
    rateButton: {
        backgroundColor: '#F28C28',
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    rateButtonText: {
        color: 'white',
        fontSize: 12,
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
});

export default BuyerOrderScreen;
