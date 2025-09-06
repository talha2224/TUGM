import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useEffect, useState } from 'react'
import {
    ToastAndroid,
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity
} from 'react-native'
import { addToFavourite } from '../redux/favouriteSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import axios from 'axios';
import config from '../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PromotionDetailScreen = () => {
    const route = useRoute();
    const { title } = route.params || {};
    const dispatch = useDispatch()
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const cart = useSelector(state => state.cart.cartItems);
    const navigation = useNavigation()
    const handleAddToCard = (product) => {
        ToastAndroid.show('Item Added In Cart', ToastAndroid.SHORT);
        dispatch(addToCart({
            ...product,
            quantity: 1
        }));
    };
    const handleAddToFavourite = (product) => {
        ToastAndroid.show("Item Added", ToastAndroid.SHORT)
        dispatch(addToFavourite(product));
    };
    const fetchProduct = async () => {
        try {
            let res = await axios.get(`${config.baseUrl}/product/all`);
            if (res?.data) {
                setProducts(res?.data?.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProduct();
    }, []);

    const renderProductItem = ({
        item
    }) => (
        <View style={styles.productCard}>
            {item.listing_type && (
                <View style={styles.shippingBadge}>
                    <Text style={styles.shippingBadgeText}>{item.listing_type}</Text>
                </View>
            )}
            <TouchableOpacity style={styles.heartIcon} onPress={() => handleAddToFavourite(item)}>
                <Ionicons name="heart-outline" size={20} color="white" />
            </TouchableOpacity>
            <Image source={{
                uri: item.images[0] || "https://placehold.co/400x400"
            }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{item.title}</Text>
                <View style={styles.productRating}>
                    <FontAwesome name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>
                        {item.rating || 4.9} ({item.reviews || '0'} Reviews)
                    </Text>
                </View>
                <Text style={styles.productPrice}>${item.price}</Text>
            </View>
            <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCard(item)}>
                <Text style={styles.addToCartButtonText}>Add to cart</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{title || 'Free Shipping'}</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate("Cart") }} style={{ position: "relative" }}>
                    <Feather name="shopping-cart" size={24} color="white" />
                    {
                        cart.length > 0 && (
                            <View style={{ position: "absolute", top: -10, right: -10, backgroundColor: "#FFA500", justifyContent: "center", alignItems: "center", borderRadius: 100, width: 25, height: 25 }}>
                                <Text style={{ color: "#fff" }}>{cart.length ?? 0}</Text>
                            </View>
                        )
                    }
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProductItem}
                    keyExtractor={item => item._id}
                    numColumns={2}
                    columnWrapperStyle={styles.productGrid}
                    contentContainerStyle={styles.productListContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1C1C1C",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: '#1C1C1C',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cartIcon: {
        position: 'absolute',
        right: 20,
        top: 50
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        fontSize: 16,
    },
    productListContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    productGrid: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    productCard: {
        flex: 1,
        backgroundColor: '#2A2A2A',
        borderRadius: 15,
        marginHorizontal: 5,
        marginBottom: 10,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    shippingBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        paddingVertical: 4,
        paddingHorizontal: 8,
        zIndex: 1,
    },
    shippingBadgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    heartIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 15,
        padding: 5,
        zIndex: 1,
    },
    productInfo: {
        padding: 10,
    },
    productTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    productRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    ratingText: {
        color: '#ccc',
        fontSize: 12,
        marginLeft: 5,
    },
    productPrice: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 5,
    },
    addToCartButton: {
        backgroundColor: '#FF7B00',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
        margin: 10,
        alignItems: 'center',
    },
    addToCartButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default PromotionDetailScreen;
