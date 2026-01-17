import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import config from "../config";

const TransactionHistory = () => {
    const navigation = useNavigation();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const userId = await AsyncStorage.getItem("userId");
            if (!userId) return;

            const res = await axios.get(`${config.baseUrl}/transaction/history/user/${userId}`);
            if (res.data?.data) {
                setHistory(res.data.data);
            }
        } catch (error) {
            console.log("Error fetching transaction history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.amount}>${item.amount}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Transaction History</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Content */}
            {history.length === 0 ? (
                <Text style={styles.emptyText}>No transactions found</Text>
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    header: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: "#1C1C1C",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom:40
    },
    headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    emptyText: { color: "#fff", textAlign: "center", marginTop: 20 },
    item: { backgroundColor: "#222", padding: 15, borderRadius: 10, marginHorizontal: 20, marginBottom: 10 },
    type: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    amount: { color: "#4CAF50", fontSize: 16, marginTop: 5 },
    date: { color: "#ccc", fontSize: 12, marginTop: 5 },
});

export default TransactionHistory;
