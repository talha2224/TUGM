import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

const shipment = {
    orderId: '0022291',
    shipmentId: '9303939',
    itemCount: 1,
    itemName: 'Yellow T-Shirt',
    itemDescription: 'No stain quality yellow T-Shirt',
    status: 'Delivered',
    shippingAddress: '4517 Washington Ave. Manchester, Kentucky 39495 US',
    trackingId: '393550301157285020625250',
    orderDate: '01-30-2025',
    dimensions: '12 x 12 x 12 in',
    weight: '7 oz',
    value: '$2.99',
};

const ShipmentDetailScreen = () => {

    const navigation = useNavigation();

    const handlePrintShippingLabel = () => {
        console.log('Print Shipping Label clicked');
    };

    const handlePrintPackingSlip = () => {
        console.log('Print Packing Slip clicked');
    };

    const handleTrackingLink = () => {
        const trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${shipment.trackingId}`;
        Linking.openURL(trackingUrl).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <ScrollView style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.tugmText}>TUGM</Text>
                <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.closeButton}>
                    <AntDesign name="close" size={24} color="#A0A0A0" />
                </TouchableOpacity>
            </View>

            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:10}}>

                <Text style={styles.shipmentsTitle}>Shipments</Text>
                <View>
                    <View style={styles.itemCountBadge}>
                        <Text style={styles.itemCountText}>{shipment.itemCount} Item</Text>
                    </View>
                    <Text style={styles.shipmentIdText}>#{shipment.shipmentId}</Text>
                    <View style={styles.deliveredBadge}>
                        <Text style={styles.deliveredText}>{shipment.status}</Text>
                    </View>
                </View>

            </View>


            {/* Order Information */}
            <View style={styles.section}>
                <Text style={styles.orderNumberText}>Order - #{shipment.orderId}</Text>
                <View style={styles.itemRow}>
                    <Text style={styles.itemNameText}>{shipment.itemName}</Text>
                    <View style={styles.soldBadge}>
                        <Text style={styles.soldText}>Sold</Text>
                    </View>
                </View>
                <Text style={styles.itemDescriptionText}>{shipment.itemDescription}</Text>
            </View>

            {/* Shipping Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Shipping actions</Text>
                <Text style={styles.shippingLabel}>Ship to</Text>
                <Text style={styles.shippingAddress}>{shipment.shippingAddress}</Text>

                <View style={styles.trackingRow}>
                    <Text style={styles.shippingLabel}>Tracking ID</Text>
                    <TouchableOpacity onPress={handleTrackingLink}>
                        <Text style={styles.trackingIdText}>{shipment.trackingId}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.actionButton} onPress={handlePrintShippingLabel}>
                    <Feather name="printer" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Print Shipping Label</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handlePrintPackingSlip}>
                    <Feather name="file-text" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Print Packing Slip</Text>
                </TouchableOpacity>
            </View>

            {/* Shipment Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Shipment Details</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Shipment #</Text>
                    <Text style={[styles.detailValueBold,{color:"#FEEF06"}]}>{shipment.shipmentId}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Order</Text>
                    <Text style={[styles.detailValueBold,{color:"#FEEF06"}]}>{shipment.orderId}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Order date</Text>
                    <Text style={styles.detailValue}>{shipment.orderDate}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Dimension</Text>
                    <Text style={styles.detailValue}>{shipment.dimensions}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Weight</Text>
                    <Text style={styles.detailValue}>{shipment.weight}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Value</Text>
                    <Text style={styles.detailValue}>{shipment.value}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A', // Dark background
        paddingHorizontal: 16,
        paddingTop: 50, // To account for status bar/notch
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Align items to the start for multi-line right content
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    tugmText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    shipmentsTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    itemCountBadge: {
        backgroundColor: '#FF6600', // Orange badge
        borderRadius: 5,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginBottom: 4,
    },
    itemCountText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    shipmentIdText: {
        color: '#A0A0A0',
        fontSize: 12,
        marginBottom: 4,
    },
    deliveredBadge: {
        backgroundColor: '#28A745', // Green
        borderRadius: 5,
        paddingHorizontal: 6,
        paddingVertical: 2,
        alignSelf: 'flex-end', // Ensure badge aligns right
    },
    deliveredText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: -10, // Adjust to position accurately relative to container
        right: -10, // Adjust to position accurately relative to container
        padding: 10, // Make it easier to tap
    },
    section: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    orderNumberText: {
        color: '#A0A0A0',
        fontSize: 14,
        marginBottom: 8,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemNameText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginRight: 10,
    },
    soldBadge: {
        backgroundColor: '#FF6600', // Orange
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    soldText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    itemDescriptionText: {
        color: '#A0A0A0',
        fontSize: 14,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    shippingLabel: {
        color: '#A0A0A0',
        fontSize: 14,
        marginBottom: 4,
    },
    shippingAddress: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 16,
    },
    trackingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    trackingIdText: {
        color: '#FEEF06', // Orange for link
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    actionButton: {
        flexDirection: 'row',
        backgroundColor: '#F78E1B', // Orange
        borderRadius: 100,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailLabel: {
        color: '#A0A0A0',
        fontSize: 14,
    },
    detailValue: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    detailValueBold: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default ShipmentDetailScreen;
