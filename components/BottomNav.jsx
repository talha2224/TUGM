import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { router } from 'expo-router';

const BottomNavBar = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();

  console.log(route?.name)

  const tabs = [
    {link:"home/index",name: 'Home', icon: <AntDesign name="home" size={24} color="gray" />, activeIcon: <AntDesign name="home" size={24} color="#FFA500" /> },
    {link:"home/categories",name: 'Categories', icon: <MaterialIcons name="grid-view" size={24} color="gray" />, activeIcon: <MaterialIcons name="grid-view" size={24} color="#FFA500" /> },
    {link:"home/add",name: 'Add', icon: <AntDesign name="pluscircleo" size={30} color="gray" />, activeIcon: <AntDesign name="pluscircle" size={30} color="#FFA500" /> },
    {link:"home/calendar",name: 'Calendar', icon: <Feather name="calendar" size={24} color="gray" />, activeIcon: <Feather name="calendar" size={24} color="#FFA500" /> },
    {link:"home/profile",name: 'Profile', icon: <Feather name="user" size={24} color="gray" />, activeIcon: <Feather name="user" size={24} color="#FFA500" /> },
  ];

  return (
    <View style={[styles.navContainer, { paddingBottom: insets.bottom }]}>
      <View style={styles.navBar}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.name} style={styles.navItem} onPress={() => router.push(tab?.link ==="home/index"?"home":tab?.link)}>
            {tab?.link === route?.name ? tab.activeIcon : tab.icon}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute', // Stick to the bottom
    bottom: 0,
    left: 0,
    right: 0,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15
  },
});

export default BottomNavBar;