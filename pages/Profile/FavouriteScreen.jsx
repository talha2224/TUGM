import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/core';
import product_img from '../../assets/product_img.png'

// Placeholder images - replace with actual product images if available
const product_img_1 = product_img;
const product_img_2 = product_img;
const product_img_3 = product_img;
const product_img_4 = product_img;


const favoriteProducts = [
    {
        id: '1',
        name: 'Jacket name',
        image: product_img_1,
        rating: 4.9,
        reviews: 300,
        price: 45.00,
        discount: '-33%',
        isOutOfStock: false,
    },
    {
        id: '2',
        name: 'Jacket name',
        image: product_img_2,
        rating: 4.9,
        reviews: 7700,
        price: 85.00,
        discount: null,
        isOutOfStock: true,
    },
    {
        id: '3',
        name: 'Jacket name',
        image: product_img_3,
        rating: 4.0,
        reviews: 200,
        price: 25.00,
        discount: null,
        isOutOfStock: false,
    },
    {
        id: '4',
        name: 'Jacket name',
        image: product_img_4,
        rating: 3.0,
        reviews: 65,
        price: 20.00,
        discount: null,
        isOutOfStock: false,
    },
];

const ProductCard = ({ product }) => {
    return (
        <View style={styles.productCard}>
            <View style={styles.productImageContainer}>
                <Image source={product.image} style={styles.productImage} />
                <TouchableOpacity style={styles.favoriteIcon}>
                    <MaterialIcons name="favorite" size={20} color="#FF6347" />
                </TouchableOpacity>
                {product.discount && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{product.discount}</Text>
                    </View>
                )}
                {product.isOutOfStock && (
                    <View style={styles.outOfStockBadge}>
                        <Text style={styles.outOfStockText}>Out of stock</Text>
                    </View>
                )}
            </View>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={14} color="#FFA500" />
                <Text style={styles.ratingText}>{product.rating} ({product.reviews} Reviews)</Text>
            </View>
            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
            <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.addToCartButtonText}>Add to cart</Text>
            </TouchableOpacity>
        </View>
    );
};

const FavouriteScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.fullScreenContainer}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                    <MaterialIcons name="keyboard-arrow-left" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Favorites</Text>
                <TouchableOpacity style={styles.headerIcon}>
                    <FontAwesome5 name="shopping-cart" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.favoriteCount}>Favorite ({favoriteProducts.length})</Text>
                <FlatList
                    data={favoriteProducts}
                    renderItem={({ item }) => <ProductCard product={item} />}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    scrollEnabled={false} // Disable FlatList scrolling as it's inside a ScrollView
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