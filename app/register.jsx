import React from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Background from '../assets/images/login-1.png';
import Logo from '../assets/images/tugm.png';
import { Feather, AntDesign } from '@expo/vector-icons'; // Import icons
import { router } from 'expo-router';

const Register = () => {
    return (
        <ImageBackground source={Background} style={styles.background} resizeMode="cover">
            <View style={styles.container}>
                <Image source={Logo} style={styles.logo} resizeMode="contain" />

                <View style={styles.formContainer}>

                    <View style={styles.loginSignup}>
                        <TouchableOpacity onPress={() => router.push('/login')} style={styles.inActiveButton}>
                            <Text style={[styles.loginSignupText, { fontWeight: 'bold' }]}>Login</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.loginSignupButton} onPress={() => router.push('/register')}> {/* Navigate to Register */}
                            <Text style={styles.loginSignupText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder="Username" placeholderTextColor="grey" />
                        <Feather name="user" size={20} color="grey" style={styles.icon} />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder="Email address" placeholderTextColor="grey" />
                        <Feather name="user" size={20} color="grey" style={styles.icon} />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="grey" secureTextEntry={true} />
                        <AntDesign name="lock" size={20} color="grey" style={styles.icon} />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="grey" secureTextEntry={true} />
                        <AntDesign name="lock" size={20} color="grey" style={styles.icon} />
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/loader')}>
                        <Text style={styles.loginButtonText}>Sign Up</Text>
                    </TouchableOpacity>

                    <Text style={styles.orText}>Or</Text>

                    <TouchableOpacity style={styles.socialButton}>
                        <Image source={{ uri: "https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" }} style={styles.socialIcon} resizeMode="contain" />
                        <Text style={styles.socialButtonText}>Continue with Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png" }} style={styles.socialIcon} resizeMode="contain" />
                        <Text style={styles.socialButtonText}>Continue with Apple</Text>
                    </TouchableOpacity>

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
        flex: 1,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
    },
    inputContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
        borderRadius: 5,
        marginBottom: 10,
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
        backgroundColor: '#FFA500', // Orange color
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
        marginBottom: 10
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
        marginTop: 10,
    },
    linkText: {
        color: '#FFA500',
        textDecorationLine: 'underline'
    },

    loginSignup: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Distribute space evenly
        marginBottom: 30,
        width: '100%', // Occupy half the width
        alignSelf: 'center', // Center the buttons
    },
    loginSignupButton: {
        backgroundColor: "#1A1A1A",
        padding: 10,
        borderRadius: 10,
        width: "50%",
        alignItems: "center",
        marginRight:10
    },
    loginSignupText: {
        color: 'white',
        fontSize: 16,
    },
    inActiveButton:{
        padding: 10,
        borderRadius: 10,
        width: "50%",
        alignItems: "center",
        marginRight:10
    }
});

export default Register;