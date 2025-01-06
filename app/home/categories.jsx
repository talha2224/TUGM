import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Text, TouchableOpacity, Pressable } from 'react-native';
import BottomNavBar from '../../components/BottomNav'; // Import your BottomNavBar
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import SellerImage from '../../assets/images/seller.png'
import Profile from '../../assets/images/profile.png'
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';

const auctionData = [
    {
        name: 'sam',
        image: "https://randomuser.me/api/portraits/men/10.jpg",
        date: 'Dec 26, 2024 07:52',
    },
    {
        name: 'james',
        image: "https://randomuser.me/api/portraits/women/11.jpg",
        date: 'Dec 26, 2024 08:50',
    },
    {
        name: 'c',
        image: "https://randomuser.me/api/portraits/men/12.jpg",
        date: 'Dec 28, 2024 09:10',
    },
    {
        name: 'ali',
        image: "https://randomuser.me/api/portraits/men/13.jpg",
        date: 'Dec 29, 2024 10:10',
    },
];

const dressImages = [
    "https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1816183/pexels-photo-1816183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/2917595/pexels-photo-2917595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];
const products = [
    { id: 1, name: 'Jacket name', rating: 4.9, reviews: 300, price: 45.00, image: dressImages[0] },
    { id: 2, name: 'Jacket name', rating: 4.9, reviews: 7700, price: 85.00, image: dressImages[3] },
    { id: 3, name: 'Jacket name', rating: 4.9, reviews: 700, price: 95.00, image: dressImages[2] },
    { id: 4, name: 'Jacket name', rating: 4.9, reviews: 3700, price: 55.00, image: dressImages[3] },
    { id: 1, name: 'Jacket name', rating: 4.9, reviews: 300, price: 45.00, image: dressImages[0] },
    { id: 2, name: 'Jacket name', rating: 4.9, reviews: 7700, price: 85.00, image: dressImages[3] },
    { id: 3, name: 'Jacket name', rating: 4.9, reviews: 700, price: 95.00, image: dressImages[2] },
    { id: 4, name: 'Jacket name', rating: 4.9, reviews: 3700, price: 55.00, image: dressImages[3] },
];

const Categories = () => {
    const [searchText, setSearchText] = useState("");
    const [activeTab, setActiveTab] = useState('Auctions');
    const [activeCategory, setActiveCategory] = useState('Jacket');
    const [likedItems, setLikedItems] = useState({});

    const categories = ['Jacket', 'Shoes', 'Jeans', 'T-shirt', 'Access'];
    const handleCategoryPress = (category) => { setActiveCategory(category); };
    const filteredAuctions = auctionData.filter(auction =>
        auction.name.toLowerCase().includes(searchText.toLowerCase())
    );
    const handleTabPress = (tabName) => {
        setActiveTab(tabName);
    };
    const handleLikePress = (itemId) => {
        setLikedItems(prevLikedItems => ({ ...prevLikedItems, [itemId]: !prevLikedItems[itemId], }));
    };
    return (
        <GestureHandlerRootView style={styles.container}>


            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 }}>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>TUGM</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Feather name="shopping-cart" size={24} color="white" />
                    </View>
                </View>

                <View style={styles.btnContainer}>
                    <TouchableOpacity style={[styles.tabButton, activeTab === 'Auctions' && styles.activeTab]} onPress={() => handleTabPress('Auctions')}>
                        <Text style={[styles.tabText, activeTab !== 'Auctions' ? styles.inActiveTabText : styles?.activeTab]}>Auctions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.tabButton, activeTab === 'Buy now' && styles.activeTab]} onPress={() => handleTabPress('Buy now')}>
                        <Text style={[styles.tabText, activeTab !== 'Buy now' ? styles.inActiveTabText : styles?.activeTab]}>Buy now</Text>
                    </TouchableOpacity>
                </View>

                {
                    activeTab == "Auctions" ?
                        <View>
                            <View style={styles.catContainer}>
                                <View style={styles.searchBar}>
                                    <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
                                    <TextInput style={styles.searchInput} placeholder="Search for auctions" placeholderTextColor="gray" value={searchText} onChangeText={setSearchText}/>
                                </View>
                                <View style={styles.cardList}>
                                    {filteredAuctions.map((auction, index) => (
                                        <View key={index} style={styles.card}>
                                            <Image source={{ uri: auction.image }} style={styles.cardImage} blurRadius={4} />
                                            <View style={styles.cardOverlay}>
                                                <View style={styles.profileContainer}>
                                                    <Image source={{ uri: auction.image }} style={styles.profileImage} />
                                                    <Text style={styles.profileName}>{auction.name}</Text>
                                                </View>
                                                <Text style={styles.upcomingText}>Upcoming</Text>
                                                <Text style={styles.dateText}>{auction.date}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
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
                                    <TouchableOpacity style={styles.followButton}>
                                        <Text style={styles.followButtonText}>Follow</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.dotsContainer}>
                                    <View style={styles.dot} />
                                    <View style={styles.dot} />
                                    <View style={styles.dot} />
                                </View>
                                <TouchableOpacity style={styles.likeButton}>
                                    <AntDesign name="hearto" size={24} color="white" />
                                </TouchableOpacity>
                            </View>

                        </View>
                        :
                        <View>
                            <View style={styles.catContainer}>
                                <View style={styles.searchBar}>
                                    <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
                                    <TextInput style={styles.searchInput} placeholder="Search for products" placeholderTextColor="gray" value={searchText} onChangeText={setSearchText} />
                                </View>
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
                                {categories.map((category) => (
                                    <TouchableOpacity key={category} style={[styles.button, activeCategory === category && styles.activeButton,]} onPress={() => handleCategoryPress(category)}>
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
                        </View>
                }

            </ScrollView>



            <BottomNavBar />
        </GestureHandlerRootView>
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
        overflow: "scroll",
    },
    storyItem: {
        alignItems: 'center',
        marginHorizontal: 20,
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
        marginBottom: 70
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
    catContainer: {
        backgroundColor: '#000',
        padding: 20,
    },
    searchBar: {
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: 'white',
    },
    cardList: {
        marginTop: 20,
        flexDirection: "row",
    },
    card: {
        width: '48%',
        backgroundColor: '#282828',
        borderRadius: 10,
        marginBottom: 20,
        overflow: 'hidden',
        marginHorizontal: 20,
    },
    cardImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
    },
    upcomingText: {
        color: 'white',
        fontWeight: 'bold',
    },
    dateText: {
        color: 'gray',
        fontSize: 12,
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5
    },
    profileImage: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 5
    },
    profileName: {
        color: "white"
    },
    btnContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    tabButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 20,
    },
    activeTab: {
        color: "#F78E1B"
    },
    tabText: {
        fontSize: 16,
        color: 'gray',
    },
    inActiveTabText: {
        color: "gray"
    },
    activeTab: {
        color: "orange"
    },
    categoryContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 10
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

export default Categories;