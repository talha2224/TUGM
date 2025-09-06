import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image, FlatList, ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { removeFromFavourite } from '../../redux/favouriteSlice';


const ProductCard = ({ product, handleAddToCard, handleRemoveFromFav }) => {
    const randomRating = (Math.random() * (5 - 3) + 3).toFixed(1);
    const randomReviews = Math.floor(Math.random() * 200) + 1;

    return (
        <View style={styles.productCard}>
            <View style={styles.productImageContainer}>
                <Image source={{ uri: product.images?.[0] }} style={styles.productImage} />
                <TouchableOpacity style={styles.favoriteIcon} onPress={() => handleRemoveFromFav(product._id)}>
                    <MaterialIcons name="favorite" size={20} color="#FF6347" />
                </TouchableOpacity>
                {product.discount && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{product.discount}</Text>
                    </View>
                )}
                {product.stock === 0 && (
                    <View style={styles.outOfStockBadge}>
                        <Text style={styles.outOfStockText}>Out of stock</Text>
                    </View>
                )}
            </View>

            <Text style={styles.productName}>{product.title}</Text>

            <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={14} color="#FFA500" />
                <Text style={styles.ratingText}>
                    {product.rating ?? randomRating} ({product.reviews ?? randomReviews} Reviews)
                </Text>
            </View>

            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>

            {/* Add to Cart */}
            <TouchableOpacity onPress={() => handleAddToCard(product)} style={styles.addToCartButton}>
                <Text style={styles.addToCartButtonText}>Add to cart</Text>
            </TouchableOpacity>

            {/* Remove from Fav */}
            <TouchableOpacity onPress={() => handleRemoveFromFav(product._id)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
        </View>
    );
};



const FavouriteScreen = () => {
    const navigation = useNavigation();
    const cart = useSelector(state => state.cart.cartItems);
    const products = useSelector(state => state.favourite.favouriteItems,);
    const dispatch = useDispatch();

    const handleAddToCard = (product) => {
        ToastAndroid.show('Item Added In Cart', ToastAndroid.SHORT);
        dispatch(addToCart({ ...product, quantity: 1 }));
    };
    const handleRemoveFromFav = (id) => {
        dispatch(removeFromFavourite(id));
        ToastAndroid.show('Removed from Favorites', ToastAndroid.SHORT);
    };

    return (
        <View style={styles.fullScreenContainer}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                    <MaterialIcons name="keyboard-arrow-left" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Favorites</Text>
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

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.favoriteCount}>Favorite ({products.length})</Text>
                <FlatList
                    data={products}
                    renderItem={({ item }) => <ProductCard product={item} handleAddToCard={handleAddToCard} handleRemoveFromFav={handleRemoveFromFav} />}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    scrollEnabled={false}
                />
            </ScrollView>
        </View>
    );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#000',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerIcon: {
        padding: 5,
    },
    scrollViewContent: {
        paddingHorizontal: 15, // Adjusted padding for the grid
        paddingBottom: 70, // Ensure space at the bottom
    },
    favoriteCount: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        marginLeft: 5, // Align with product cards
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    productCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 10,
        padding: 10,
        width: '48%', // Approx half minus spacing
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    productImageContainer: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 10,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    favoriteIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#2C2C2E', // Dark background for the heart icon
        borderRadius: 15,
        padding: 5,
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FF6347', // Reddish color for discount
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    discountText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    outOfStockBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FFA500', // Orange for out of stock
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    outOfStockText: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
    },
    productName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    ratingText: {
        color: '#999',
        fontSize: 12,
        marginLeft: 5,
    },
    productPrice: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addToCartButton: {
        backgroundColor: '#FFA500',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    addToCartButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
});