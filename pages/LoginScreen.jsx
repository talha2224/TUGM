import { useState } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Keyboard } from 'react-native';
import Background from '../assets/login-1.png';
import Logo from '../assets/tugm.png';
import Icon from 'react-native-vector-icons/Feather';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from "../config";

const LoginScreen = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigation = useNavigation();

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async () => {
        Keyboard.dismiss(); 
        const { email, password } = formData;

        if (!email || !password) {
            ToastAndroid.show('Please fill in all fields.', ToastAndroid.SHORT);
            return;
        }

        try {
            console.log(`${config.baseUrl}/account/login`,'`${config.baseUrl}/account/login`')
            let res = await axios.post(`${config.baseUrl}/account/login`, { email, password });

            if (res?.data) {
                const userData = res?.data?.data;
                await AsyncStorage.setItem('userId', userData?._id);
                ToastAndroid.show('Login Successful!', ToastAndroid.SHORT);
                setTimeout(() => {
                    navigation.navigate('Loader');
                }, 2000);
            }
        } catch (error) {
            console.log(error,'error')
            ToastAndroid.show('Invalid Credentials', ToastAndroid.SHORT);
        }
    };

    return (
        <ImageBackground source={Background} style={styles.background} resizeMode="cover">
            <View style={styles.container}>
                <Image source={Logo} style={styles.logo} resizeMode="contain" />

                <View style={styles.formContainer}>

                    <View style={styles.loginSignup}>
                        <TouchableOpacity style={styles.loginSignupButton}>
                            <Text style={[styles.loginSignupText, { fontWeight: 'bold' }]}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.inActiveButton} onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.loginSignupText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input}placeholder="Email address"placeholderTextColor="grey"value={formData.email}onChangeText={(text) => handleChange('email', text)}/>
                        <Icon name="user" size={20} color="grey" style={styles.icon} />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="grey" secureTextEntry={true} value={formData.password} onChangeText={(text) => handleChange('password', text)}/>
                        <AntIcon name="lock" size={20} color="grey" style={styles.icon} />
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>

                    {/* <Text style={styles.orText}>Or</Text> */}

                    {/* <TouchableOpacity style={styles.socialButton}>
                        <Image source={{ uri: "https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" }} style={styles.socialIcon} resizeMode="contain" />
                        <Text style={styles.socialButtonText}>Continue with Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png" }} style={styles.socialIcon} resizeMode="contain" />
                        <Text style={styles.socialButtonText}>Continue with Apple</Text>
                    </TouchableOpacity> */}

                    <Text style={styles.termsText}>
                        By clicking "LOGIN", I agree to be bound by adidas{"\n"}
                        <Text style={styles.linkText}>Terms & Conditions</Text>, (as they may be updated from{"\n"}
                        time to time), and distort <Text style={styles.linkText}>Privacy Policy</Text>
                    </Text>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'space-around',
    },
    logo: {
        width: 150,
        height: 50,
        alignSelf: 'center',
        marginTop: 50
    },
    formContainer: {
        marginTop: 50,
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: "#000",
        padding: 10,
        flex: 1,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
    },
    inputContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 5,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    input: {
        flex: 1,
        height: 40,
        color: 'white',
    },
    icon: {
        marginLeft: 10
    },
    loginButton: {
        backgroundColor: '#FFA500',
        borderRadius: 5,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 20
    },
    loginButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    orText: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 20
    },
    socialButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 5,
        paddingVertical: 12,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    socialIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    socialButtonText: {
        color: 'white'
    },
    termsText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 12,
        marginTop: 20,
    },
    linkText: {
        color: '#FFA500',
        textDecorationLine: 'underline'
    },
    loginSignup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
        width: '100%',
        alignSelf: 'center',
    },
    loginSignupButton: {
        backgroundColor: "#1A1A1A",
        padding: 10,
        borderRadius: 10,
        width: "50%",
        alignItems: "center",
        marginRight: 10
    },
    loginSignupText: {
        color: 'white',
        fontSize: 16,
    },
    inActiveButton: {
        padding: 10,
        borderRadius: 10,
        width: "50%",
        alignItems: "center",
        marginRight: 10
    }
});

export default LoginScreen;
