import React from 'react';
import { View, StyleSheet, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import BottomNavBar from '../../components/BottomNav';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';

const profileImage = "https://randomuser.me/api/portraits/men/8.jpg"; // Replace with your image or use random user API

const Profile = () => {
  const menuItems = [
    { icon: <Feather name="user" size={20} color="white" />, text: 'Edit profile' },
    { icon: <Feather name="repeat" size={20} color="white" />, text: 'Transaction' },
    { icon: <Feather name="credit-card" size={20} color="white" />, text: 'My wallet' },
    { icon: <Feather name="shopping-bag" size={20} color="white" />, text: 'My store' },
    { icon: <Feather name="clock" size={20} color="white" />, text: 'History' },
    { icon: <Feather name="settings" size={20} color="white" />, text: 'Settings' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      </View>
      <ScrollView style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            {item.icon}
            <Text style={styles.menuText}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.logoutButton}>
        <AntDesign name="logout" size={20} color="#FF4500" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'gray',
  },
  menu: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  menuText: {
    color: 'white',
    marginLeft: 20,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#282828',
  },
  logoutText: {
    color: '#FF4500',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default Profile;