import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from '../config';
import { useNavigation } from "@react-navigation/core";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const navigation = useNavigation();


    useEffect(() => {
        const fetchUserId = async () => {
            const storedUserId = await AsyncStorage.getItem("userId");
            if (storedUserId) {
                setUserId(storedUserId);
                fetchNotifications(storedUserId);
            } else {
                setLoading(false);
            }
        };
        fetchUserId();
    }, []);

    const fetchNotifications = async (id) => {
        try {
            const res = await axios.get(`${config.baseUrl}/notification/get/${id}`);
            setNotifications(res?.data?.data || []);
        } catch (error) {
            console.log("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleJoin = (streamId,type) => {
        if(type=="stream"){
            navigation.navigate("CreatorStream", { streamId: streamId,isHost:true,coHost:true })
        }
        else{
            navigation.navigate("competition", { streamId: streamId,isHost:true,coHost:true })
        }
    };

    const timeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diff = Math.floor((now - past) / 1000);

        if (diff < 60) return `${diff} sec ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: "#000" }}>
            
            
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 10 }}>Notifications</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : notifications.length === 0 ? (
                <View style={{ alignItems: "center", marginTop: 50 }}>
                    <Text style={{ color: "#fff", fontSize: 18 }}>No Notifications Found</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                backgroundColor: "#1A1A1A",
                                padding: 15,
                                borderRadius: 10,
                                marginBottom: 10,
                            }}
                        >
                            <Text style={{ color: "#fff", fontSize: 16 }}>
                                <Text>{item.invitedBy?.username} invited you to a {item?.type=="stream"?"stream":"battle"}.</Text>
                            </Text>
                            <Text style={{ color: "#aaa", fontSize: 14, marginTop: 5 }}>{timeAgo(item.createdAt)}</Text>

                            <TouchableOpacity style={{backgroundColor: "#007bff",padding: 10,borderRadius: 5,marginTop: 10,alignItems: "center",}} onPress={() => handleJoin(item.streamId,item?.type)}>
                                <Text style={{ color: "#fff", fontSize: 14 }}>Join</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default Notification;
