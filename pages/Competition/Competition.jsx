import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
    Pressable,
    Animated,
    Dimensions,
    TextInput,
} from 'react-native';
import versus from '../../assets/competition/versus.png';
import contestant from '../../assets/competition/contestant.png';
import icon1 from '../../assets/competition/1.png';
import icon2 from '../../assets/competition/2.png';
import icon3 from '../../assets/competition/3.png';
import icon4 from '../../assets/competition/4.png';
import icon5 from '../../assets/competition/5.png';
import icon6 from '../../assets/competition/6.png';
import slam_item from '../../assets/competition/slam_item.png';
import TShirts from '../../assets/T-Shirts.png';
import header from '../../assets/competition/header.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/core';
import { KeyboardAvoidingView, Platform } from 'react-native';

const Competition = () => {
    const [showVersus, setShowVersus] = useState(true);
    const versusOpacity = useState(new Animated.Value(1))[0];
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
    const [isImageBlurred, setIsImageBlurred] = useState(false);
    const [isPerksModalVisible, setIsPerksModalVisible] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(null);
    const [perkMessage, setPerkMessage] = useState(null);
    const [showSlamItem, setShowSlamItem] = useState(false);
    const perkMessageAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(100)).current;
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.timing(versusOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setShowVersus(false);
            });
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const comments = [
        { id: '1', user: 'TropicParadise', comment: 'You’re looking bro' },
        { id: '2', user: '@d_charile', comment: 'You’re so underrated bruh' },
        { id: '3', user: '@d_jatin_gammal', comment: 'joined' },
        { id: '4', user: 'User456', comment: 'Great competition!' },
        { id: '5', user: 'LiveFan', comment: 'Who do you think will win?' },
        { id: '6', user: 'GamingGuru', comment: 'Awesome moves!' },
        { id: '7', user: 'StreamWatcher', comment: 'Loving the energy!' },
        { id: '8', user: 'TropicParadise', comment: 'You’re looking bro' },
        { id: '9', user: '@d_charile', comment: 'You’re so underrated bruh' },
        { id: '10', user: '@d_jatin_gammal', comment: 'joined' },
    ];

    const perksData = [
        {
            id: 'perk1',
            name: 'Expose',
            icon: icon1,
            description: 'Force opponent to show the item tag and stitching.',
        },
        {
            id: 'perk2',
            name: 'Item Slam',
            icon: icon2,
            description: 'Temporarily disable opponent’s item.',
        },
        {
            id: 'perk3',
            name: 'Dark Mode',
            icon: icon3,
            description: 'Apply a dark filter to opponent’s screen.',
        },
        {
            id: 'perk4',
            name: 'Steal the Mic',
            icon: icon4,
            description: 'Take over opponent’s audio for a short duration.',
        },
        {
            id: 'perk5',
            name: 'Drop Price',
            icon: icon5,
            description: 'Force a temporary price drop on opponent’s item.',
        },
        {
            id: 'perk6',
            name: 'Audience Flip',
            icon: icon6,
            description: 'Temporarily swap audience votes with opponent.',
        },
    ];

    const handleShareOptionPress = (platform) => {
        setIsShareModalVisible(false);
    };

    const toggleImageBlur = () => {
        setIsImageBlurred(prev => !prev);
    };

    const togglePerksModal = () => {
        setIsPerksModalVisible(prev => !prev);
        setTooltipVisible(null);
    };

    const toggleTooltip = (perkId) => {
        setTooltipVisible(prevId => (prevId === perkId ? null : perkId));
    };

    const handlePerkClick = (perk) => {
        setPerkMessage(perk.description);
        setIsPerksModalVisible(false);
        setTooltipVisible(null);

        if (perk.name === 'Item Slam') {
            setShowSlamItem(true);
        }

        Animated.timing(perkMessageAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(progressAnim, {
                toValue: 0,
                duration: 3000,
                useNativeDriver: false,
            }).start(() => {
                Animated.timing(perkMessageAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    setPerkMessage(null);
                    progressAnim.setValue(100);
                    setShowSlamItem(false);
                });
            });
        });
    };

    const perkMessageTranslateY = perkMessageAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0],
    });

    const progressBarWidth = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
                <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.header}>
                    <TouchableOpacity style={{ maxHeight: 45, marginRight: 10, backgroundColor: "#3d1e1a", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 40, gap: 5, alignItems: "center", flexDirection: "row" }}>
                        <MaterialIcons name="bar-chart" size={20} style={{ color: "#FFC61A" }} />
                        <Text style={{ color: "#fff" }}>Ranking Voter</Text>
                        <SimpleLineIcons name="arrow-right" style={{ color: "#fff" }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ maxHeight: 45, marginRight: 10, backgroundColor: "#1E1E1E", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 40, gap: 5, alignItems: "center", flexDirection: "row" }}>
                        <Feather name="user" size={16} style={{ color: "#fff" }} />
                        <Text style={{ color: "#fff" }}>26</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ maxHeight: 45, marginRight: 10, backgroundColor: "#1E1E1E", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 40, gap: 5, alignItems: "center", flexDirection: "row" }}>
                        <Feather name="gift" size={16} style={{ color: "#FFC61A" }} />
                        <Text style={{ color: "#fff" }}>Gifts</Text>
                        <SimpleLineIcons name="arrow-right" style={{ color: "#fff" }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("Home")} style={{ marginRight: 30, maxHeight: 45, backgroundColor: "#FF3729", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 40, gap: 5, alignItems: "center", flexDirection: "row" }}>
                        <Text style={{ color: "#fff" }}>Quite battle</Text>
                        <AntDesign name="close" size={16} style={{ color: "#fff" }} />
                    </TouchableOpacity>
                </ScrollView>

                <Image source={header} style={{ backgroundColor: "#1a0b18", width: "100%", paddingBottom: 20 }} />

                <Image source={contestant} style={styles.contestantImage} blurRadius={isImageBlurred ? 10 : 0} />
                {showVersus && (
                    <Animated.Image
                        source={versus}
                        style={[styles.versusImage, { opacity: versusOpacity }]}
                    />
                )}

                <ScrollView style={styles.commentsContainer} showsVerticalScrollIndicator={false}>
                    {comments.map((item, index) => (
                        <View key={item.id} style={[styles.commentItem]}>
                            <Image source={{ uri: `https://randomuser.me/api/portraits/men/${index + 1}.jpg` }} style={styles.commentAvatar} />
                            <View>
                                <Text style={styles.commentUser}>{item.user}</Text>
                                <Text style={styles.commentText}>{item.comment}</Text>
                            </View>
                        </View>
                    ))}

                    <ScrollView horizontal contentContainerStyle={{ marginTop: 20 }}>
                        {
                            [1, 3, 4, 9].map((i) => (
                                <View key={i} style={{ marginRight: 20, width: 300, backgroundColor: "#fff", borderRadius: 6, flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 10, paddingHorizontal: 10 }}>
                                    <Image source={TShirts} style={{ width: 70, height: 70 }} />
                                    <View style={{ flex: 1 }}>
                                        <Text>Yellow T-Shirt</Text>
                                        <Text style={{ marginTop: 4 }}>⭐ 4.0 200 sold</Text>
                                        <View style={{ marginTop: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <Text>$230 <Text style={{ color: "red" }}>$500</Text></Text>
                                            <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#000", borderRadius: 100, justifyContent: "center", alignItems: "center" }}>
                                                <Text style={{ color: "#fff", fontSize: 10 }}>Add to cart</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))
                        }
                    </ScrollView>
                    <View style={styles.commentInputBar}>
                        <View style={styles.cartIconContainer}>
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>2</Text>
                            </View>
                            <Ionicons name="cart-outline" size={24} color="#fff" />
                        </View>

                        <View style={styles.commentInputContainer}>
                            <TextInput placeholder='Type your comment' style={styles.commentPlaceholder} />
                        </View>

                        <TouchableOpacity style={styles.sendButton}>
                            <Ionicons name="send" size={18} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.giftButton}>
                            <Ionicons name="gift" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                </ScrollView>

                <View style={styles.actionBar}>
                    <TouchableOpacity style={styles.actionButton} onPress={togglePerksModal}>
                        <FontAwesome name="magic" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Perks</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="chatbox" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Mute chats</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Entypo name="camera" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Dual cam</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={toggleImageBlur}>
                        <MaterialIcons name="deblur" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>{isImageBlurred ? "UnBlur" : "Blur"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => setIsShareModalVisible(true)}>
                        <Feather name="share-2" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Share Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isShareModalVisible}
                    onRequestClose={() => setIsShareModalVisible(false)}
                >
                    <Pressable style={styles.modalBackground} onPress={() => setIsShareModalVisible(false)}>
                        <Pressable style={styles.shareModalView}>
                            <Text style={styles.shareModalTitle}>Share</Text>
                            <View style={styles.shareOptionsContainer}>
                                <TouchableOpacity style={styles.shareOption} onPress={() => handleShareOptionPress('Copy link')}>
                                    <Feather name="copy" size={20} color="#fff" />
                                    <Text style={styles.shareOptionText}>Copy link</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.shareOption} onPress={() => handleShareOptionPress('Whatsapp')}>
                                    <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                                    <Text style={styles.shareOptionText}>Whatsapp</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.shareOption} onPress={() => handleShareOptionPress('Instagram')}>
                                    <AntDesign name="instagram" size={20} color="#C13584" />
                                    <Text style={styles.shareOptionText}>Instagram</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.shareOption} onPress={() => handleShareOptionPress('Facebook')}>
                                    <Feather name="facebook" size={20} color="#1877F2" />
                                    <Text style={styles.shareOptionText}>Facebook</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.shareOption} onPress={() => handleShareOptionPress('Discord')}>
                                    <MaterialCommunityIcons name="discord" size={20} color="#7289DA" />
                                    <Text style={styles.shareOptionText}>Discord</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.cancelShareButton} onPress={() => setIsShareModalVisible(false)}>
                                <Text style={styles.cancelShareButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </Pressable>
                    </Pressable>
                </Modal>

                {/* Perks Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isPerksModalVisible}
                    onRequestClose={togglePerksModal}
                >
                    <Pressable style={styles.modalBackground} onPress={togglePerksModal}>
                        <Pressable style={styles.perksModalView} onPress={(e) => e.stopPropagation()}>
                            <View style={styles.perksModalHeader}>
                                <Text style={styles.perksModalTitle}>Perks</Text>
                                <TouchableOpacity onPress={togglePerksModal}>
                                    <AntDesign name="close" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.perksGrid}>
                                {perksData.map((perk) => (
                                    <TouchableOpacity key={perk.id} style={styles.perkItem} onPress={() => handlePerkClick(perk)}>
                                        <Image source={perk.icon} style={styles.perkIcon} />
                                        <View style={styles.perkTextContainer}>
                                            <Text style={styles.perkName}>{perk.name}</Text>
                                            <Pressable onPress={() => toggleTooltip(perk.id)} hitSlop={10}>
                                                <AntDesign name="infocirlceo" size={14} color="#999" />
                                            </Pressable>
                                        </View>
                                        {tooltipVisible === perk.id && (
                                            <View style={styles.tooltip}>
                                                <Text style={styles.tooltipText}>{perk.description}</Text>
                                                <View style={styles.tooltipTriangle} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </Pressable>
                    </Pressable>
                </Modal>

                {/* Animated Perk Message View */}
                {(perkMessage && !showSlamItem) && (
                    <Animated.View style={[styles.perkMessageContainer, { transform: [{ translateY: perkMessageTranslateY }] }]}>
                        <Text style={styles.perkMessageText}>{perkMessage}</Text>
                        <Animated.View style={[styles.perkProgressBar, { width: progressBarWidth }]} />
                    </Animated.View>
                )}

                {showSlamItem && (
                    <Image source={slam_item} style={styles.slamItemImage} />
                )}

        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    container: { flex: 1,height:9000 },
    header: {
        paddingTop: 60,
        paddingHorizontal: 15,
        backgroundColor: '#1a0b18',
        maxHeight: 130,
    },
    liveCompText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rankingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 10,
    },
    rankingText: {
        color: '#fff',
        fontSize: 12,
        marginLeft: 5,
    },
    votesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 10,
    },
    votesText: {
        color: '#fff',
        fontSize: 12,
        marginLeft: 5,
    },
    quickButton: {
        backgroundColor: '#F78E1B',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    quickButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    contestantImage: {
        width: Dimensions.get("screen").width,
        height: 350,
        resizeMode: 'cover',
    },
    versusImage: {
        position: 'absolute',
        top: 200,
        width: 250,
        height: 250,
        resizeMode: 'contain',
        alignSelf: 'center',
        zIndex: 1,
    },
    slamItemImage: {
        position: 'absolute',
        top: 250,
        width: 400,
        height: 400,
        resizeMode: 'contain',
        alignSelf: 'center',
        zIndex: 2,
    },
    commentsContainer: {
        flex: 0.5,
        paddingHorizontal: 15,
        backgroundColor: "#0f111bff",
        paddingVertical: 20,
    },
    commentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginRight: 8,
    },
    commentUser: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    commentText: {
        color: '#ccc',
        fontSize: 13,
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 40,
        backgroundColor: '#1C141D',
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingTop: 40,
    },
    actionButton: {
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 13,
        marginTop: 5,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    shareModalView: {
        backgroundColor: '#151515',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 30,
        alignItems: 'center',
    },
    shareModalTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    shareOptionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    shareOption: {
        alignItems: 'center',
        marginHorizontal: 15,
        marginBottom: 15,
    },
    shareOptionText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 5,
    },
    cancelShareButton: {
        backgroundColor: '#1B1B1B',
        borderRadius: 100,
        width: '90%',
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelShareButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    perksModalView: {
        backgroundColor: '#151515',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    perksModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    perksModalTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    perksGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    perkItem: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        padding: 5,
        position: 'relative',
    },
    perkIcon: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
    },
    perkTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    perkName: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
        marginRight: 5,
    },
    tooltip: {
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: [{ translateX: -50 }],
        backgroundColor: '#282828',
        borderRadius: 8,
        padding: 10,
        width: 180,
        marginBottom: 10,
        zIndex: 10,
    },
    tooltipText: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
    },
    tooltipTriangle: {
        position: 'absolute',
        bottom: -10,
        left: '50%',
        transform: [{ translateX: -5 }],
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#282828',
    },
    perkMessageContainer: {
        position: 'absolute',
        bottom: 120, // Position above the action bar
        left: 20,
        right: 20,
        backgroundColor: '#FF3729',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
    },
    perkMessageText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    perkProgressBar: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: 3,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    commentInputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        marginTop: 20,
        marginBottom: 40,
    },

    cartIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginRight: 10,
    },

    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },

    cartBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },

    commentInputContainer: {
        flex: 1,
        backgroundColor: '#2C2C2E',
        borderRadius: 100,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },

    commentPlaceholder: {
        color: '#888',
    },

    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },

    giftButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2C2C2E',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },

});

export default Competition;