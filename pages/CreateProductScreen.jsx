import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, TextInput, Button, ToastAndroid } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import config from "../config";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';

const CreateProductScreen = () => {
    const navigation = useNavigation();
    const [data, setData] = useState({title: "",description: "",price: "",stock: "",categoryId: "",image: null});
    const [categories, setCategories] = useState([]);
    
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            let res = await axios.get(`${config.baseUrl}/category/all`);
            if (res?.data?.data) {
                setCategories(res?.data?.data);
                setData({ ...data, categoryId: res?.data?.data[0]?._id });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const pickImage = async () => {
        const options = {mediaType: 'photo',quality: 1,includeBase64: false,};
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                ToastAndroid.show('Image selection canceled!', ToastAndroid.SHORT);
            } 
            else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } 
            else if (response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0].uri;
                setData({ ...data, image: selectedImage });
            }
        });
    };
    const handleCreateProduct = async () => {
        let userId = await AsyncStorage.getItem('userId');

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("stock", data.stock);
        formData.append("categoryId", data.categoryId);
        formData.append("userId", userId);

        if (data.image) {
            formData.append("image", {
                uri: data.image,
                name: "product.jpg",
                type: "image/jpeg",
            });
        }

        try {
            ToastAndroid.show('Creating Product!', ToastAndroid.SHORT);
            let res = await axios.post(`${config.baseUrl}/product/create/`, formData, {headers: { 'Content-Type': 'multipart/form-data' },});
            if(res?.data?.data){
                ToastAndroid.show('Product Created!', ToastAndroid.SHORT);
                setTimeout(() => {
                    navigation.navigate("SellerProducts")
                }, 2000);
            }

        } 
        catch (error) {
            console.log("Error creating product: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <Text style={styles.headerText}>Create Product</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SellerProducts")}>
                        <FontAwesome5 name="arrow-alt-circle-left" size={20} color="#ffff" />
                    </TouchableOpacity>
                </View>

                <View>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        placeholder='Product Title'
                        placeholderTextColor={"grey"}
                        style={styles.input}
                        onChangeText={(text) => setData({ ...data, title: text })}
                    />

                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        placeholder='Product Description'
                        placeholderTextColor={"grey"}
                        style={styles.input}
                        onChangeText={(text) => setData({ ...data, description: text })}
                    />

                    <Text style={styles.label}>Price</Text>
                    <TextInput
                        placeholder='Product Price'
                        keyboardType='numeric'
                        placeholderTextColor={"grey"}
                        style={styles.input}
                        onChangeText={(text) => setData({ ...data, price: text })}
                    />

                    <Text style={styles.label}>Stock</Text>
                    <TextInput
                        placeholder='Product Stock'
                        keyboardType='numeric'
                        placeholderTextColor={"grey"}
                        style={styles.input}
                        onChangeText={(text) => setData({ ...data, stock: text })}
                    />

                    <Text style={styles.label}>Category</Text>
                    <ScrollView horizontal style={styles.categoryContainer}>
                        {categories.map((item) => (
                            <TouchableOpacity
                                key={item._id}
                                style={[styles.button, data.categoryId === item._id && styles.activeButton]}
                                onPress={() => setData({ ...data, categoryId: item._id })}
                            >
                                <Text style={data.categoryId === item._id ? styles.activeButtonText : styles.inactiveButtonText}>
                                    {item.category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text style={[styles.label,{marginBottom:10}]}>Upload Image</Text>
                    <Button color={"orange"} title="Pick an image" onPress={pickImage} />
                    {data?.image && <Image source={{ uri: data.image }} style={styles.image} />}

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                        <TouchableOpacity onPress={() => navigation.navigate("SellerProducts")} style={[styles.cancelButton, { backgroundColor: "grey" }]}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCreateProduct} style={[styles.createButton]}>
                            <Text style={styles.buttonText}>Create Product</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 70
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    label: {
        color: "grey",
        fontSize: 17,
        marginTop: 10
    },
    input: {
        backgroundColor: "#1a1a1a",
        height: 50,
        marginTop: 10,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: "#fff"
    },
    categoryContainer: {
        flexDirection: "row",
        marginTop: 10
    },
    button: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'gray',
        marginRight: 10,
        backgroundColor: "#1A1A1A"
    },
    activeButton: {
        borderColor: '#FFA500',
        backgroundColor: '#FFA500',
    },
    inactiveButtonText: {
        color: "grey"
    },
    activeButtonText: {
        color: "black"
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginTop: 10
    },
    cancelButton: {
        borderRadius: 25,
        padding: 10,
        width: "48%",
        alignItems: "center"
    },
    createButton: {
        backgroundColor: "orange",
        borderRadius: 25,
        padding: 10,
        width: "48%",
        alignItems: "center"
    },
    buttonText: {
        color: "white"
    }
});

export default CreateProductScreen
