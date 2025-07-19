import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/core';

const shipmentData = [
    { id: 1, recipient: 'danbrtech', date: '01-30-2025', items: 2, status: 'Delivered & Paid Out', tracking: '3932029', service: 'USPS Ground Advantage' },
    { id: 2, recipient: 'kallashk', date: '01-30-2025', items: 1, status: 'Delivered & Paid Out', tracking: '3932029', service: 'USPS Ground Advantage' },
    { id: 3, recipient: 'newuser99', date: '01-28-2025', items: 4, status: 'Needs Label', tracking: '3932029', service: 'USPS Ground Advantage' },
    { id: 4, recipient: 'simon006', date: '01-27-2025', items: 2, status: 'Unfulfilled', tracking: '3932029', service: 'USPS Ground Advantage' },
    { id: 5, recipient: 'HeroCoder', date: '01-26-2025', items: 1, status: 'Shipping', tracking: '3932029', service: 'USPS Ground Advantage' },
    { id: 6, recipient: 'consult.xxxx', date: '01-25-2025', items: 2, status: 'Pickup', tracking: '3932029', service: 'USPS Ground Advantage' },
    { id: 7, recipient: 'chrisrocky', date: '01-20-2025', items: 2, status: 'Cancelled', tracking: '3932029', service: 'USPS Ground Advantage' },
    { id: 8, recipient: 'janedoe123', date: '01-20-2025', items: 2, status: 'Delivered & Paid Out', tracking: '3932029', service: 'USPS Ground Advantage' },
];
const Shipments = () => {
    const shippingServiceImageUrl = 'https://www.ecommercebytes.com/wp-content/uploads/2017/06/USPS.jpg';
    const navigation = useNavigation();


    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered & Paid Out':
                return styles.statusDelivered;
            case 'Needs Label':
                return styles.statusNeedsLabel;
            case 'Unfulfilled':
                return styles.statusUnfulfilled;
            case 'Shipping':
                return styles.statusShipping;
            case 'Pickup':
                return styles.statusPickup;
            case 'Cancelled':
                return styles.statusCancelled;
            default:
                return {};
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text></Text>
                <Text style={styles.headerTitle}>Shipments</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}><AntDesign name="close" size={24} color="#A0A0A0" /></TouchableOpacity>
            </View>

            {/* Summary Section */}
            <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Sales</Text>
                    <Text style={styles.summaryValue}>$200.00</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Completed Earnings</Text>
                    <Text style={styles.summaryValue}>$300.20</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Shipping Speed</Text>
                    <Text style={styles.summaryValue}>$4.99</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Items Sold</Text>
                    <Text style={styles.summaryValue}>20</Text>
                </View>
                <View style={[styles.summaryItem, styles.summaryItemSpan]}>
                    <Text style={styles.summaryLabel}>Total Delivered</Text>
                    <Text style={styles.summaryValue}>20</Text>
                </View>
                <View style={[styles.summaryItem, styles.summaryItemSpan]}>
                    <Text style={styles.summaryLabel}>Pending Delivery</Text>
                    <Text style={styles.summaryValue}>0</Text>
                </View>
            </View>

            {/* Navigation Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
                {['All', 'Delivered', 'Unfulfilled', 'Pickup', 'Needs Label', 'Cancelled', 'Shipping'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tabButton, tab === 'All' ? styles.tabButtonActive : styles.tabButtonInactive]}
                    >
                        <Text style={tab === 'All' ? styles.tabTextActive : styles.tabTextInactive}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="#A0A0A0" style={styles.searchIcon} /> {/* Search icon */}
                <TextInput
                    style={styles.searchInput}
                    placeholder="Username, order ID..."
                    placeholderTextColor="#A0A0A0"
                />
            </View>

            {/* Pagination */}
            <View style={styles.paginationContainer}>
                <TouchableOpacity>
                    <Feather name="chevron-left" size={24} color="#A0A0A0" /> {/* Chevron left icon */}
                </TouchableOpacity>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={[styles.pageButton, num === 1 ? styles.pageButtonActive : styles.pageButtonInactive]}
                    >
                        <Text style={num === 1 ? styles.pageTextActive : styles.pageTextInactive}>{num}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity>
                    <Feather name="chevron-right" size={24} color="#A0A0A0" /> {/* Chevron right icon */}
                </TouchableOpacity>
            </View>

            {/* Shipment List Items */}
            <ScrollView horizontal style={{ marginTop: 10 }}>
                <View style={{ minWidth: 1000 }}>
                    {/* Table Header */}
                    <View style={[styles.listItem, { backgroundColor: '#222' }]}>
                        <Text style={[styles.tableHeaderCell, { width: 50 }]}>#</Text>
                        <Text style={[styles.tableHeaderCell, { width: 120 }]}>Recipient</Text>
                        <Text style={[styles.tableHeaderCell, { width: 100 }]}>Order Date</Text>
                        <Text style={[styles.tableHeaderCell, { width: 60 }]}>Items</Text>
                        <Text style={[styles.tableHeaderCell, { width: 80 }]}>Value</Text>
                        <Text style={[styles.tableHeaderCell, { width: 80 }]}>Weight</Text>
                        <Text style={[styles.tableHeaderCell, { width: 120 }]}>Dimensions</Text>
                        <Text style={[styles.tableHeaderCell, { width: 120 }]}>Status</Text>
                        <Text style={[styles.tableHeaderCell, { width: 200, marginLeft: 30 }]}>Tracking</Text>
                    </View>

                    {/* Table Rows */}
                    <ScrollView style={{ maxHeight: 400 }}>
                        {shipmentData.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.listItem}
                                onPress={() => navigation.navigate('shipment_detail', { shipment: item })}
                            >
                                <Text style={[styles.tableCell, { width: 50 }]}>{index + 1}</Text>
                                <Text style={[styles.tableCell, { width: 120 }]}>{item.recipient}</Text>
                                <Text style={[styles.tableCell, { width: 100 }]}>{item.date}</Text>
                                <Text style={[styles.tableCell, { width: 60 }]}>{item.items}</Text>
                                <Text style={[styles.tableCell, { width: 80 }]}>${(item.items * 3).toFixed(2)}</Text>
                                <Text style={[styles.tableCell, { width: 80 }]}>{item.items * 7} oz</Text>
                                <Text style={[styles.tableCell, { width: 120 }]}>12 × 12 × 12 in</Text>
                                <View style={[styles.tableCell, { width: 120 }]}>
                                    <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                                        <Text style={styles.statusBadgeText}>{item.status}</Text>
                                    </View>
                                </View>
                                <View style={[styles.tableCell, { width: 200, flexDirection: 'row', alignItems: 'center', marginLeft: 30 }]}>
                                    <Image source={{ uri: shippingServiceImageUrl }} style={styles.shippingServiceImage} />
                                    <Text style={styles.listItemTextSmall}>{item.service}...{item.tracking}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                    </ScrollView>
                </View>
            </ScrollView>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A', // Dark background
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        marginTop: 50
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    summaryItem: {
        width: '48%', // Approx half width for 2 columns on small screens
        marginBottom: 12,
    },
    summaryItemSpan: {
        width: '48%', // For the "Total Delivered" and "Pending Delivery"
    },
    summaryLabel: {
        color: '#A0A0A0',
        fontSize: 12,
        marginBottom: 4,
    },
    summaryValue: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tabsContainer: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        maxHeight: 50

    },
    tabButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    tabButtonActive: {
        backgroundColor: '#FF6600', // Orange
    },
    tabButtonInactive: {
        backgroundColor: '#333333',
    },
    tabTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 13,
    },
    tabTextInactive: {
        color: '#A0A0A0',
        fontWeight: '600',
        fontSize: 13,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333333',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginVertical: 16,
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 14,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    pageButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    pageButtonActive: {
        backgroundColor: '#FF6600',
    },
    pageButtonInactive: {
        backgroundColor: '#333333',
    },
    pageTextActive: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
    pageTextInactive: {
        color: '#A0A0A0',
        fontSize: 13,
    },
    listHeader: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        backgroundColor: '#222222', // Slightly different background for header
    },
    listHeaderColCheckbox: {
        width: '10%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listHeaderColRecipient: {
        width: '30%',
        color: '#A0A0A0',
        fontSize: 12,
        fontWeight: 'bold',
    },
    listHeaderColOrderDate: {
        width: '25%',
        color: '#A0A0A0',
        fontSize: 12,
        fontWeight: 'bold',
    },
    listHeaderColItems: {
        width: '15%',
        color: '#A0A0A0',
        fontSize: 12,
        fontWeight: 'bold',
    },
    listHeaderColMore: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listItemsContainer: {
        flex: 1,
        paddingBottom: 50
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    listColRecipient: {
        width: '30%',
    },
    listColOrderDate: {
        width: '25%',
        color: '#FFFFFF',
        fontSize: 13,
    },
    listColItems: {
        width: '15%',
        color: '#FFFFFF',
        fontSize: 13,
    },
    listColStatus: {
        width: '20%',
    },
    listColTracking: {
        width: '40%', // Adjust width to accommodate image and text
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 8,
    },
    listItemTextBold: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    listItemTextSmall: {
        color: '#A0A0A0',
        fontSize: 11,
    },
    statusBadge: {
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignSelf: 'flex-start',
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    statusDelivered: {
        backgroundColor: '#28A745', // Green
    },
    statusNeedsLabel: {
        backgroundColor: '#007BFF', // Blue
    },
    statusUnfulfilled: {
        backgroundColor: '#FFC107', // Yellow
    },
    statusShipping: {
        backgroundColor: '#17A2B8', // Teal
    },
    statusPickup: {
        backgroundColor: '#6C757D', // Gray
    },
    statusCancelled: {
        backgroundColor: '#DC3545', // Red
    },
    shippingServiceImage: {
        width: 24, // Adjust size as needed
        height: 24,
        marginRight: 8,
        resizeMode: 'contain', // Ensure the image fits within the bounds
    },
    tableHeaderCell: {
        color: '#A0A0A0',
        fontWeight: 'bold',
        fontSize: 12,
        paddingVertical: 6,
    },

    tableCell: {
        color: '#FFFFFF',
        fontSize: 13,
        paddingVertical: 6,
    },

});

export default Shipments;
