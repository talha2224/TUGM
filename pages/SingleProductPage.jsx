import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Text, View, StyleSheet, ActivityIndicator } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import review from "../assets/product/review.png";
import axios from 'axios';
import config from '../config';

const SingleProductPage = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { productId } = route.params;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${config.baseUrl}/product/single/${productId}`);
                setProduct(res.data.data);
                setSelectedImage(res.data.data?.images[0]); 
            } catch (err) {
                console.log("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Product not found</Text>
            </View>
        );
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Entypo name="chevron-thin-left" size={24} color="white" />
                </Pressable>
                <Text style={styles.headerTitle}>{product?.title}</Text>
            </View>

            <View style={styles.productImageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.mainProductImage} />
            </View>
            <View style={styles.productDetailsContainer}>
                <Text style={styles.productTitle}>{product?.title}</Text>
                <Text style={styles.productSubtitle}>{product?.description}</Text>

                <View style={styles.priceContainer}>
                    <Text style={styles.currentPrice}>${product?.price}</Text>
                    {/* <Text style={styles.originalPrice}>$46</Text>
                    <Text style={styles.discount}>-50% off</Text> */}
                </View>

                <View style={styles.reviewsContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Ionicons name="star-half-outline" size={16} color="#FFD700" />
                    <Text style={styles.reviewText}>(140 verified reviews)</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Variants</Text>
                <View style={styles.colorPickerContainer}>
                    {product?.images?.map((img, index) => (
                        <Pressable
                            key={index}
                            onPress={() => setSelectedImage(img)}
                            style={[
                                styles.colorOption,
                                selectedImage === img && styles.colorOptionSelected
                            ]}
                        >
                            <Image source={{ uri: img }} style={styles.colorImage} />
                        </Pressable>
                    ))}
                </View>
            </View>


            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Size</Text>
                <View style={styles.sizeOptionsContainer}>
                    {
                        product?.size[0]?.split(",")?.map((i) => (
                            <Pressable key={i} style={[styles.sizeOption, styles.sizeOptionSelected]}>
                                <Text style={styles.sizeOptionTextSelected}>{i}</Text>
                            </Pressable>
                        ))
                    }
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Shipping</Text>
                <View style={styles.shippingContainer}>
                    <Text style={styles.shippingOption}>Pickup Station</Text>
                    <Text style={styles.shippingText}>{product?.shipping_type}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{product?.description}</Text>
            </View>

            <View style={[styles.section, { marginBottom: 150 }]}>
                <View style={styles.reviewsHeader}>
                    <Text style={styles.sectionTitle}>Reviews (3)</Text>
                    <Pressable>
                        <Text style={styles.moreReviewsText}>More Reviews</Text>
                    </Pressable>
                </View>
                {
                    [1, 2, 3, 4].map((i) => (
                        <Pressable onPress={() => { navigation.navigate("profile_details", { userId: product?.userId }) }}key={i} style={styles.reviewCard}>
                            <Image source={review} style={styles.reviewerImage} />
                            <View style={styles.reviewContent}>
                                <View style={styles.reviewerInfo}>
                                    <Text style={styles.reviewerName}>r_nstal_user</Text>
                                    <View style={styles.reviewRating}>
                                        <Ionicons name="star" size={12} color="#FFD700" />
                                        <Ionicons name="star" size={12} color="#FFD700" />
                                        <Ionicons name="star" size={12} color="#FFD700" />
                                        <Ionicons name="star" size={12} color="#FFD700" />
                                        <Ionicons name="star-half-outline" size={12} color="#FFD700" />
                                    </View>
                                </View>
                                <Text style={styles.reviewDate}>20 July 2024</Text>
                                <Text style={styles.reviewTextContent}>
                                    “I've delivered the best quality clothes and I'm very happy with it.”
                                </Text>
                            </View>
                        </Pressable>
                    ))
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        paddingTop: 60,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitle: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 20,
    },
    productImageContainer: {
        marginTop: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    mainProductImage: {
        width: 177,
        height: 177,
        resizeMode: 'contain',
    },
    productDetailsContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    productTitle: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
    productSubtitle: {
        color: "#888",
        fontSize: 16,
        marginBottom: 5,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    currentPrice: {
        color: "#FFF",
        fontSize: 20,
        fontWeight: "bold",
        marginRight: 10,
    },
    originalPrice: {
        color: "#888",
        fontSize: 16,
        textDecorationLine: "line-through",
        marginRight: 10,
    },
    discount: {
        color: "#5CB85C",
        fontSize: 16,
    },
    reviewsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    reviewText: {
        color: "#888",
        marginLeft: 5,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    colorPickerContainer: {
        flexDirection: "row",
        gap: 15,
    },
    colorOption: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#1A1A1A"
    },
    colorOptionSelected: {
        borderColor: "#F78E1B"
    },
    colorImage: {
        width: 36,
        height: 36,
        borderRadius: 4,
        resizeMode: 'cover',
    },
    sizeOptionsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    sizeOption: {
        backgroundColor: "#171717",
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#262626',
    },
    sizeOptionSelected: {
        borderColor: 'white',
    },
    sizeOptionText: {
        color: "white",
        fontSize: 16,
    },
    sizeOptionTextSelected: {
        color: "white",
        fontWeight: "bold",
    },
    shippingContainer: {
        backgroundColor: "#222",
        borderRadius: 10,
        padding: 15,
    },
    shippingOption: {
        color: "white",
        fontWeight: "bold",
        marginBottom: 5,
    },
    shippingText: {
        color: "#888",
    },
    descriptionText: {
        color: "#888",
        lineHeight: 20,
        marginBottom: 10,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 5,
    },
    listItemText: {
        color: "#888",
        flex: 1,
        marginLeft: -5,
    },
    viewProductDetailsText: {
        color: "#3498DB",
        marginTop: 10,
    },
    reviewsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    moreReviewsText: {
        color: "#3498DB",
    },
    reviewCard: {
        flexDirection: "row",
        backgroundColor: "#111",
        padding: 15,
        borderRadius: 10,
        alignItems: 'flex-start',
    },
    reviewerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    reviewContent: {
        flex: 1,
    },
    reviewerInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    reviewerName: {
        color: "white",
        fontWeight: "bold",
    },
    reviewRating: {
        flexDirection: "row",
    },
    reviewDate: {
        color: "#888",
        fontSize: 12,
        marginBottom: 5,
    },
    reviewTextContent: {
        color: "#ccc",
        lineHeight: 18,
    }
});

export default SingleProductPage;