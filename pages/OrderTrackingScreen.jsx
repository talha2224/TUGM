import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Ionicons from 'react-native-vector-icons/Ionicons';
import product_img from "../assets/product/main.png";
import truck_img from "../assets/truck.png";

const OrderTrackingScreen = () => {
    const navigation = useNavigation();
    const [isOrderSummaryCollapsed, setOrderSummaryCollapsed] = useState(false);
    const [isPackageHistoryVisible, setPackageHistoryVisible] = useState(false);

    const toggleOrderSummary = () => {
        setOrderSummaryCollapsed(!isOrderSummaryCollapsed);
    };

    const togglePackageHistory = () => {
        setPackageHistoryVisible(!isPackageHistoryVisible);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.placeholder} />
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Ionicons name="close-outline" size={30} color="white" />
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.statusContainer}>
                    <Image source={truck_img} style={styles.truckImage} />
                    <Text style={styles.statusTitle}>Order Status</Text>
                    <Text style={styles.statusSubtitle}>Your package is on the way</Text>
                </View>

                <View style={styles.productCard}>
                    <Image source={product_img} style={styles.productImage} />
                    <View style={styles.productInfo}>
                        <Text style={styles.productType}>Clothing</Text>
                        <Text style={styles.productName}>Zip-up hoody</Text>
                        <Text style={styles.productColor}>Color - Yellow</Text>
                    </View>
                    <View style={styles.priceInfo}>
                        <Text style={styles.priceItems}>1 Items</Text>
                        <Text style={styles.priceText}>$30.00</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={toggleOrderSummary} style={styles.collapsibleHeader}>
                    <Text style={styles.collapsibleTitle}>Order Summary</Text>
                    <Ionicons name={isOrderSummaryCollapsed ? "chevron-up-outline" : "chevron-down-outline"} size={24} color="white" />
                </TouchableOpacity>
                {!isOrderSummaryCollapsed && (
                    <View style={styles.summaryContent}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Order ID</Text>
                            <Text style={styles.summaryValue}>123456789101</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Shipping Address</Text>
                            <Text style={styles.summaryValue}>6391 Elgin St. Celina, Del... </Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Tracking ID</Text>
                            <Text style={styles.summaryValue}>123456789101</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Delivery Between</Text>
                            <Text style={styles.summaryValue}>15 Jun and 17 Jun</Text>
                        </View>
                    </View>
                )}

                <TouchableOpacity onPress={togglePackageHistory} style={styles.collapsibleHeader}>
                    <Text style={styles.collapsibleTitle}>Payment Information</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>navigation.navigate("order_review")} style={styles.trackOrderButton}>
                    <Text style={styles.trackOrderButtonText}>Track order</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelOrderButton}>
                    <Text style={styles.cancelOrderButtonText}>Cancel Order</Text>
                </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity onPress={togglePackageHistory}  style={[styles.packageHistoryModal, isPackageHistoryVisible && styles.modalVisible]}>
                <TouchableOpacity style={styles.modalHandle} />
                <Text style={styles.modalTitle}>Package History</Text>
                <View style={styles.historyTimeline}>
                    <View style={styles.historyItem}>
                        <View style={styles.timelineIconActive}>
                            <Ionicons name="checkmark" size={16} color="#000" />
                        </View>
                        <View style={styles.historyTextContainer}>
                            <Text style={styles.historyTitle}>Order Placed</Text>
                            <Text style={styles.historyDate}>8 Jun, 2025</Text>
                        </View>
                    </View>
                    <View style={styles.historyItem}>
                        <View style={styles.timelineIconActive}>
                            <Ionicons name="checkmark" size={16} color="#000" />
                        </View>
                        <View style={styles.historyTextContainer}>
                            <Text style={styles.historyTitle}>Pending Confirmation</Text>
                            <Text style={styles.historyDate}>8 Jun, 2025</Text>
                        </View>
                    </View>
                    <View style={styles.historyItem}>
                        <View style={styles.timelineIconActive}>
                            <Ionicons name="checkmark" size={16} color="#000" />
                        </View>
                        <View style={styles.historyTextContainer}>
                            <Text style={styles.historyTitle}>Waiting to be shipped</Text>
                            <Text style={styles.historyDate}>8 Jun, 2025</Text>
                        </View>
                    </View>
                    <View style={styles.historyItem}>
                        <View style={styles.timelineIconActive}>
                            <Ionicons name="checkmark" size={16} color="#000" />
                        </View>
                        <View style={styles.historyTextContainer}>
                            <Text style={styles.historyTitle}>Shipped</Text>
                            <Text style={styles.historyDate}>8 Jun, 2025</Text>
                        </View>
                    </View>
                    <View style={styles.historyItem}>
                        <View style={styles.timelineIconInactive}>
                            <Ionicons name="checkmark" size={16} color="#fff" />
                        </View>
                        <View style={styles.historyTextContainer}>
                            <Text style={styles.historyTitle}>Available for Pickup</Text>
                            <Text style={styles.historyDate}>15 Jun and 17 Jun</Text>
                        </View>
                    </View>
                    <View style={styles.historyItem}>
                        <View style={styles.timelineIconInactive}>
                            <Ionicons name="checkmark" size={16} color="#fff" />
                        </View>
                        <View style={styles.historyTextContainer}>
                            <Text style={styles.historyTitle}>Delivery Date</Text>
                            <Text style={styles.historyDate}>15 Jun and 17 Jun</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    placeholder: {
        width: 30,
    },
    closeButton: {
        
    },
    scrollViewContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    statusContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    truckImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    statusTitle: {
        color: 'white',
        fontSize: 20,
    },
    statusSubtitle: {
        color: '#888',
        fontSize: 16,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#1C1C1E',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 15,
    },
    productInfo: {
        flex: 1,
    },
    productType: {
        color: '#888',
        fontSize: 12,
    },
    productName: {
        color: 'white',
        marginVertical: 2,
    },
    productColor: {
        color: '#888',
        fontSize: 12,
    },
    priceInfo: {
        alignItems: 'flex-end',
    },
    priceItems: {
        color: '#888',
        fontSize: 12,
    },
    priceText: {
        color: 'white',
        fontSize: 16,
        marginTop: 5,
    },
    collapsibleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
    },
    collapsibleTitle: {
        color: 'white',
        fontSize: 16,
    },
    summaryContent: {
        backgroundColor: '#171717',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    summaryLabel: {
        color: '#888',
    },
    summaryValue: {
        color: 'white',
    },
    trackOrderButton: {
        backgroundColor: '#F28C28',
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    trackOrderButtonText: {
        color: 'white',
        fontSize: 18,
    },
    cancelOrderButton: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    cancelOrderButtonText: {
        color: '#888',
        fontSize: 16,
    },
    packageHistoryModal: {
        position: 'absolute',
        bottom: -600, // Start off-screen
        left: 0,
        right: 0,
        backgroundColor: '#171717',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 50,
        transition: 'bottom 0.3s ease-in-out',
        // zIndex: 10,
    },
    modalVisible: {
        bottom: 0,
    },
    modalHandle: {
        width: 50,
        height: 5,
        backgroundColor: '#888',
        borderRadius: 5,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        color: 'white',
        fontSize: 20,
        marginBottom: 20,
    },
    historyTimeline: {
        // Timeline styling here
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    timelineIconActive: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#F28C28',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    timelineIconInactive: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#888',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    historyTextContainer: {
        flex: 1,
    },
    historyTitle: {
        color: 'white',
        fontSize: 16,
    },
    historyDate: {
        color: '#888',
        fontSize: 12,
    },
});

export default OrderTrackingScreen;
