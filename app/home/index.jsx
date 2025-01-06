import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Text, TouchableOpacity, Pressable } from 'react-native';
import BottomNavBar from '../../components/BottomNav'; // Import your BottomNavBar
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import SellerImage from '../../assets/images/seller.png'
import * as Location from 'expo-location';
import { router } from 'expo-router';


const userImages = [
    "https://randomuser.me/api/portraits/men/1.jpg",
    "https://randomuser.me/api/portraits/women/2.jpg",
    "https://randomuser.me/api/portraits/men/3.jpg",
    "https://randomuser.me/api/portraits/women/4.jpg",
    "https://randomuser.me/api/portraits/men/5.jpg",
    "https://randomuser.me/api/portraits/women/6.jpg",
    "https://randomuser.me/api/portraits/men/7.jpg",
];
const users = [
    { name: 'My story', image: "https://randomuser.me/api/portraits/women/7.jpg" },
    { name: 'duncan', image: userImages[0] },
    { name: 'robert', image: userImages[1] },
    { name: 'katie', image: userImages[2] },
    { name: 'sam', image: userImages[3] },
    // { name: 'James', image: userImages[4] },
]
const dressImages = [
    "https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1816183/pexels-photo-1816183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/2917595/pexels-photo-2917595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];
const products = [
    { id: 1, name: 'Jacket name', rating: 4.9, reviews: 300, price: 45.00, image: dressImages[0] },
    { id: 2, name: 'Jacket name', rating: 4.9, reviews: 7700, price: 85.00, image: dressImages[1] },
    { id: 3, name: 'Jacket name', rating: 4.9, reviews: 700, price: 95.00, image: dressImages[2] },
    { id: 4, name: 'Jacket name', rating: 4.9, reviews: 3700, price: 55.00, image: dressImages[3] },
];
const Index = () => {
    const [activeCategory, setActiveCategory] = useState('Jacket');
    const [likedItems, setLikedItems] = useState({});
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const categories = ['Jacket', 'Shoes', 'Jeans', 'T-shirt', 'Access'];
    const handleCategoryPress = (category) => { setActiveCategory(category); };
    const handleLikePress = (itemId) => {
        setLikedItems(prevLikedItems => ({ ...prevLikedItems, [itemId]: !prevLikedItems[itemId], }));
    };

    useEffect(() => {
        (async () => {
          // Request location permissions
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          // Get current location
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        })();
      }, []);

    return (
        <View style={styles.container}>


            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 }}>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>TUGM</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="search-outline" size={24} color="white" style={{ marginRight: 20 }} />
                        <Feather name="shopping-cart" size={24} color="white" />
                    </View>
                </View>

                <View horizontal showsHorizontalScrollIndicator={false} style={styles.storyContainer}>
                    {users.map((user, index) => (
                        <View key={index} style={styles.storyItem}>
                            <View style={[styles.imageContainer, index == 0 && styles.activeStoryBorder]}>
                                <Image source={{ uri: user.image }} style={styles.storyImage} />
                            </View>
                            <Text style={styles.storyText}>{user.name}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.liveContainer}>
                    <Image source={SellerImage} style={styles.liveImage} />
                    <View style={styles.liveInfo}>
                        <View style={styles.liveUserInfo}>
                            <View style={styles.liveBadge}>
                                <Text style={styles.liveBadgeText}>LIVE</Text>
                            </View>
                            <View style={styles.liveStreamText}>
                                <Text style={styles.liveStreamTitle}>Cameron Williamson</Text>
                                <Text style={styles.liveStreamDescription}>2.3M followers</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={()=>{router.push("home/single")}} style={styles.followButton}>
                            <Text style={styles.followButtonText}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dotsContainer}>
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>
                    <TouchableOpacity style={styles.likeButton2}>
                        <AntDesign name="hearto" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal contentContainerStyle={styles.categoryContainer}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.button,
                                activeCategory === category && styles.activeButton,
                            ]}
                            onPress={() => handleCategoryPress(category)}
                        >
                            <Text style={[styles.buttonText, activeCategory !== category && styles.inActiveButtonText]}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.productList}>
                    {products.map((product) => (
                        <View key={product.id} style={styles.card}>
                            <TouchableOpacity style={styles.likeButton} onPress={() => handleLikePress(product.id)}>
                                <AntDesign name={likedItems[product.id] ? "heart" : "hearto"} size={24} color={likedItems[product.id] ? "red" : "white"} />
                            </TouchableOpacity>
                            <Image source={{ uri: product.image }} style={styles.productImage} />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <View style={styles.ratingContainer}>
                                    <Text style={styles.rating}>{product.rating}</Text>
                                    <Text style={styles.reviews}>({product.reviews} Reviews)</Text>
                                </View>
                                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>



            <BottomNavBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 60
    },
    storyContainer: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        flexDirection: "row",
        display: "flex",
        overflow: "scroll"
    },
    storyItem: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 35,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'gray',
        justifyContent: "center",
        alignItems: "center"
    },
    activeStoryBorder: {
        borderColor: "orange"
    },
    storyImage: {
        width: '100%',
        height: '100%',
        borderRadius: 35,
        resizeMode: 'cover',
    },
    storyText: {
        color: '#C4C4C4',
        marginTop: 5,
    },
    liveContainer: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    liveImage: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        borderRadius: 10, // Match container border radius
    },
    liveInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        shadowOpacity: 0,
        opacity: 2,
        position: 'absolute',
        width: '100%',
    },
    liveUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    liveBadge: {
        backgroundColor: 'red',
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    liveBadgeText: {
        color: 'white',
        fontSize: 10,
    },
    liveStreamText: {
        marginLeft: 10,
    },
    liveStreamTitle: {
        color: 'white',
        fontWeight: 'bold',
    },
    liveStreamDescription: {
        color: 'white',
        fontSize: 12,
    },
    followButton: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    followButtonText: {
        color: 'black',
        fontWeight: "bold"
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        alignSelf: "center"
    },
    dot: {
        backgroundColor: 'white',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 5,
    },
    likeButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    likeButton2:{
        position: "absolute",
        bottom: 30,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    categoryContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20, // Add horizontal padding for spacing
        marginTop: 20
    },
    button: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'gray',
        marginRight: 10, // Add spacing between buttons
        backgroundColor: "#1A1A1A"
    },
    activeButton: {
        borderColor: '#FFA500', // Orange border for active button
        backgroundColor: '#FFA500', // Orange background for active button
    },
    inActiveButtonText: {
        color: "grey"
    },
    buttonText: {
        color: "black"
    },
    productList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        marginTop: 20,
        marginBottom: 50
    },
    card: {
        backgroundColor: '#1A1A1A',
        width: '45%',
        borderRadius: 10,
        marginBottom: 20,
        overflow: "hidden"
    },
    productImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: 'cover',
    },
    productInfo: {
        padding: 10,
    },
    productName: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    rating: {
        color: 'gold',
        marginRight: 5,
    },
    reviews: {
        color: 'gray',
    },
    price: {
        color: 'white',
        fontWeight: 'bold',
    },
    likeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1,
    },
});

export default Index;