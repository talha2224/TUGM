import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    FlatList
} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import Ionicons from 'react-native-vector-icons/Ionicons';

// Assuming these images are imported and available
import banner from '../assets/promotion/banner.png'
import cover1 from '../assets/promotion/cover-1.png'
import cover2 from '../assets/promotion/cover-2.png'
import cover3 from '../assets/promotion/cover-3.png'
import cover4 from '../assets/promotion/cover-4.png'

const offersData = [{
    id: '1',
    icon: cover1,
    title: 'Summer Sale',
    description: 'Select items',
    expiry: 'Expires on June 30'
}, {
    id: '2',
    icon: cover2,
    title: 'Free Shipping',
    description: 'On Orders Over $50',
    expiry: 'Expires on May 15'
}, {
    id: '3',
    icon: cover3,
    title: 'Buy One, Get One Free',
    description: 'On Select Products',
    expiry: 'Expires on April 30'
}, {
    id: '4',
    icon: cover4,
    title: 'Clearance',
    description: 'Save an Additional 30%',
    expiry: 'Expires on July 15'
},];

const couponsData = [{
    id: '1',
    title: 'SAVE $20',
    description: '$20 Off Minimum purchase of $100'
}, {
    id: '2',
    title: 'WELCOME 10%',
    description: '10% Off for new customers'
},];

const PromotionScreen = () => {
    const navigation = useNavigation()
    const renderOfferItem = ({
        item
    }) => (
        <TouchableOpacity onPress={() => { navigation.navigate("promotion_details", { title: item.title }); }} style={styles.offerItem}>
            <Image source={item.icon} style={styles.offerIcon} />
            <View style={styles.offerTextContainer}>
                <Text style={styles.offerTitle}>{item.title}</Text>
                <Text style={styles.offerDescription}>{item.description}</Text>
                <Text style={styles.offerExpiry}>{item.expiry}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#888" />
        </TouchableOpacity>
    );

    const renderCouponItem = ({
        item
    }) => (
        <View style={styles.couponItem}>
            <View style={styles.couponTextContainer}>
                <Text style={styles.couponTitle}>{item.title}</Text>
                <Text style={styles.couponDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Promotions & Coupons</Text>
                <View style={{ width: 24 }} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.bannerContainer}>
                    <Image source={banner} style={styles.bannerImage} />
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Offers</Text>
                    <FlatList
                        data={offersData}
                        renderItem={renderOfferItem}
                        keyExtractor={item => item.id}
                        scrollEnabled={false}
                    />
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Coupons</Text>
                    <FlatList
                        data={couponsData}
                        renderItem={renderCouponItem}
                        keyExtractor={item => item.id}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1C1C1C",
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: '#1C1C1C',
        position: 'relative',
        gap: 20
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bannerContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 15,
        overflow: 'hidden',
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    bannerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        paddingLeft: 20,
    },
    bannerText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    showNowButton: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
        width: 120,
    },
    showNowButtonText: {
        color: '#FF7B00',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sectionContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    offerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    offerIcon: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    offerTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    offerTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    offerDescription: {
        color: '#ccc',
        fontSize: 14,
        marginTop: 5,
    },
    offerExpiry: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
    couponItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    couponTextContainer: {
        flex: 1,
    },
    couponTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    couponDescription: {
        color: '#ccc',
        fontSize: 14,
        marginTop: 5,
    },
    saveButton: {
        backgroundColor: '#FF7B00',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default PromotionScreen;
