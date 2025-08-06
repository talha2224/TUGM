import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Switch,
    Modal,
    Pressable,
    Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const dummyOpponents = [
    { id: '1', name: 'Deploya', followers: '20.8K', isOnline: true, profile: 'https://placehold.co/50x50/F78E1B/FFFFFF?text=D' },
    { id: '2', name: 'zacharyking', followers: '15.1K', isOnline: true, profile: 'https://placehold.co/50x50/1A1A1A/FFFFFF?text=Z' },
    { id: '3', name: 'Matt | gaming', followers: '18.8K', isOnline: false, profile: 'https://placehold.co/50x50/F78E1B/FFFFFF?text=M' },
    { id: '4', name: 'Tech Sential', followers: '21.8K', isOnline: true, profile: 'https://placehold.co/50x50/1A1A1A/FFFFFF?text=T' },
    { id: '5', name: '@gavinjones', followers: '12.0K', isOnline: false, profile: 'https://placehold.co/50x50/F78E1B/FFFFFF?text=G' },
    { id: '6', name: 'VanillaSky', followers: '17.0K', isOnline: true, profile: 'https://placehold.co/50x50/1A1A1A/FFFFFF?text=V' },
    { id: '7', name: '@_angle_talu', followers: '15.8K', isOnline: false, profile: 'https://placehold.co/50x50/F78E1B/FFFFFF?text=A' },
    { id: '8', name: 'WhiteGhost', followers: '17.0K', isOnline: true, profile: 'https://placehold.co/50x50/1A1A1A/FFFFFF?text=W' },
    { id: '9', name: 'parkerlee', followers: '18.0K', isOnline: false, profile: 'https://placehold.co/50x50/F78E1B/FFFFFF?text=P' },
    { id: '10', name: '@noraclark', followers: '17.0K', isOnline: true, profile: 'https://placehold.co/50x50/1A1A1A/FFFFFF?text=N' },
    { id: '11', name: 'dylanjames', followers: '2.5K', isOnline: false, profile: 'https://placehold.co/50x50/F78E1B/FFFFFF?text=D' },
];
const CompetitionsSettings = () => {
    const navigation = useNavigation();
    const [competitionName, setCompetitionName] = useState('');
    const [isAddOpponentModalVisible, setIsAddOpponentModalVisible] = useState(false);
    const [allowPerks, setAllowPerks] = useState(false);
    const [selectedOpponent, setSelectedOpponent] = useState(null);
    const [searchOpponentText, setSearchOpponentText] = useState('');


    const filteredOpponents = dummyOpponents.filter(opponent =>
        opponent.name.toLowerCase().includes(searchOpponentText.toLowerCase())
    );

    const handleSelectOpponent = (opponent) => {
        setSelectedOpponent(opponent);
        setIsAddOpponentModalVisible(false);
    };

    const handleRemoveOpponent = () => {
        setSelectedOpponent(null);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Competition settings</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="close" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollViewContent}>
                {/* Name your competition */}
                <Text style={styles.label}>Name your competition</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter competition name"
                    placeholderTextColor="#666"
                    value={competitionName}
                    onChangeText={setCompetitionName}
                />

                {/* Add opponent */}
                <Text style={styles.label}>Add opponent</Text>
                <View style={styles.addOpponentContainer}>
                    {selectedOpponent ? (
                        <View style={styles.selectedOpponentPill}>
                            <Image source={{ uri: selectedOpponent.profile }} style={styles.selectedOpponentAvatar} />
                            <Text style={styles.selectedOpponentText}>@{selectedOpponent.name.replace(/\s/g, '_').toLowerCase()}</Text>
                            <TouchableOpacity onPress={handleRemoveOpponent} style={styles.removeOpponentButton}>
                                <AntDesign name="closecircle" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.addOpponentButton} onPress={() => setIsAddOpponentModalVisible(true)}>
                            <Feather name="user-plus" size={20} color="#fff" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => setIsAddOpponentModalVisible(true)}>
                        <MaterialCommunityIcons name="account-group-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Media */}
                <Text style={styles.label}>Media</Text>
                <Text style={styles.subLabel}>Add a thumbnail and Battle ready prep screen with your intros.</Text>
                <View style={styles.mediaContainer}>
                    <View style={styles.mediaOption}>
                        <TouchableOpacity style={styles.mediaButton}>
                            <Feather name="camera" size={24} color="#fff" />
                            <Text style={styles.mediaButtonText}>Add a Thumbnail</Text>
                        </TouchableOpacity>
                        <Text style={styles.optionalText}>Optional</Text>
                    </View>
                    <View style={styles.mediaOption}>
                        <TouchableOpacity style={styles.mediaButton}>
                            <Ionicons name="play-circle-outline" size={24} color="#fff" />
                            <Text style={styles.mediaButtonText}>Prep video intros</Text>
                            <Text style={styles.mediaTime}>01:00</Text>
                        </TouchableOpacity>
                        <Text style={styles.optionalText}>Optional</Text>
                    </View>
                </View>

                {/* Allow Perks */}
                <View style={styles.perksContainer}>
                    <View>
                        <Text style={styles.label}>Allow Perks</Text>
                        <Text style={styles.subLabel}>You can use 1-2 perks per competition.</Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#767577", true: "#F78E1B" }}
                        thumbColor={allowPerks ? "#f4f3f4" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={setAllowPerks}
                        value={allowPerks}
                    />
                </View>

                {/* Primary Category */}
                <Text style={styles.label}>Primary Category</Text>
                <Text style={styles.subLabel}>Accurately categorizing your show will help to increase</Text>
                <TouchableOpacity style={styles.categoryButton}>
                    <Text style={styles.categoryButtonText}>Category</Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("competition")} style={styles.goLiveButton}>
                        <Text style={styles.goLiveButtonText}>Go LIVE</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Add Opponent Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddOpponentModalVisible}
                onRequestClose={() => setIsAddOpponentModalVisible(false)}
            >
                <Pressable style={styles.modalBackground} onPress={() => setIsAddOpponentModalVisible(false)}>
                    <Pressable style={styles.addOpponentModalView}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add your opponent</Text>
                            <TouchableOpacity onPress={() => setIsAddOpponentModalVisible(false)}>
                                <AntDesign name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Search Bar in Modal */}
                        <View style={styles.modalSearchBar}>
                            <Ionicons name="search" size={20} color="gray" style={styles.modalSearchIcon} />
                            <TextInput
                                style={styles.modalSearchInput}
                                placeholder="Search for opponent"
                                placeholderTextColor="gray"
                                value={searchOpponentText}
                                onChangeText={setSearchOpponentText}
                            />
                        </View>

                        {/* Opponent List */}
                        <ScrollView showsVerticalScrollIndicator={false} style={styles.opponentList}>
                            {
                                filteredOpponents.map((opponent, _index) => (
                                    <TouchableOpacity key={opponent.id} style={styles.opponentItem} onPress={() => handleSelectOpponent({...opponent,profile:`https://randomuser.me/api/portraits/men/${_index + 1}.jpg`})}>
                                        <Image source={{ uri: `https://randomuser.me/api/portraits/men/${_index + 1}.jpg` }} style={styles.opponentAvatar} />
                                        <View style={styles.opponentInfo}>
                                            <Text style={styles.opponentName}>{opponent.name}</Text>
                                            <Text style={styles.opponentFollowers}>{opponent.followers}</Text>
                                            {opponent.isOnline && <Text style={styles.opponentStatus}>Online</Text>}
                                        </View>
                                        {selectedOpponent && selectedOpponent.id === opponent.id ? (
                                            <AntDesign name="checkcircle" size={24} color="#F78E1B" />
                                        ) : (
                                            <TouchableOpacity style={styles.inviteButton}>
                                                <Text style={styles.inviteButtonText}>Invite</Text>
                                            </TouchableOpacity>
                                        )}
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollViewContent: {
        paddingHorizontal: 20,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    subLabel: {
        color: '#999',
        fontSize: 12,
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        color: '#fff',
        fontSize: 16,
    },
    addOpponentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
    },
    addOpponentButton: {
        padding: 5,
    },
    selectedOpponentPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#282828',
        borderRadius: 20,
        padding: 5,
        paddingRight: 10,
    },
    selectedOpponentAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
    },
    selectedOpponentText: {
        color: '#fff',
        fontSize: 16,
    },
    removeOpponentButton: {
        marginLeft: 10,
        padding: 2,
    },
    mediaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    mediaOption: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    mediaButton: {
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        width: '100%',
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    mediaButtonText: {
        color: '#fff',
        marginTop: 10,
        textAlign: 'center',
    },
    mediaTime: {
        color: '#999',
        fontSize: 12,
        marginTop: 5,
    },
    optionalText: {
        color: '#999',
        fontSize: 12,
        marginTop: 5,
    },
    perksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    categoryButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        marginTop: 10,
    },
    categoryButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 50,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#282828',
        borderRadius: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    goLiveButton: {
        flex: 1,
        backgroundColor: '#F78E1B',
        borderRadius: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    goLiveButtonText: {
        color: '#fff',
        fontSize: 16,
    },

    // Modal Styles
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay for this modal
        justifyContent: 'flex-end',
    },
    addOpponentModalView: {
        backgroundColor: '#1A1A1A', // Dark background for the modal content
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        height: '80%', // Adjust height as needed
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalSearchBar: {
        backgroundColor: '#282828', // Slightly lighter than modal background
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    modalSearchIcon: {
        marginRight: 10,
    },
    modalSearchInput: {
        flex: 1,
        height: 40,
        color: '#fff',
        fontSize: 16,
    },
    opponentList: {
        flex: 1,
    },
    opponentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    opponentAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    opponentInfo: {
        flex: 1,
    },
    opponentName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    opponentFollowers: {
        color: '#999',
        fontSize: 12,
    },
    opponentStatus: {
        color: '#0f0', // Green for online
        fontSize: 12,
        marginTop: 2,
    },
    inviteButton: {
        backgroundColor: '#F78E1B',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    inviteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CompetitionsSettings;