import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Switch } from 'react-native';
import BottomNavBar from '../../components/BottomNav';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Create = () => {
  const [isSuddenDeathEnabled, setIsSuddenDeathEnabled] = useState(false);
  const [selectedTime, setSelectedTime] = useState('10s');

  const timeOptions = ['5s', '10s', '15s', '20s', '25s', '30s', '40s', '50s', '1m'];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>LIVE listings</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
          <Text style={styles.searchText}>Search</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}><Text style={styles.activeTabText}>Auction</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Buy Now</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Giveaway</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Sold</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Offers</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Tips</Text></TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.viewStoreButton}>
          <Text style={styles.viewStoreText}>View store</Text>
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>LIVE settings</Text>

        <View style={styles.addPlatform}>
          <Text style={{ color: "grey" }} >+ Add Platform</Text>
        </View>

        <Text style={styles.sectionHeader}>Auction settings</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Starting Bid</Text>
          <Text style={styles.inputValue}>$1</Text>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.inputLabel}>Time</Text>
          <ScrollView horizontal contentContainerStyle={styles.timeOptionsContainer}>
            {timeOptions.map((time) => (
              <TouchableOpacity key={time} style={[styles.timeOption, selectedTime === time && styles.activeTimeOption]} onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.timeOptionText, selectedTime !== time && styles.inActiveTimeOptionText]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.suddenDeathContainer}>
          <View style={{ flexDirection: "row", alignItems: "center",justifyContent:"space-between" }}>
            <Text style={styles.inputLabel}>Sudden death</Text>
            <Switch trackColor={{ false: "#767577", true: "#81b0ff" }} thumbColor={isSuddenDeathEnabled ? "#f5dd4b" : "#f4f3f4"} ios_backgroundColor="#3e3e3e" onValueChange={setIsSuddenDeathEnabled} value={isSuddenDeathEnabled} style={{ marginLeft: 10 }}/>
          </View>
          <Text style={styles.suddenDeathDescription}>This means when you're down to 00:01 the last person to bid wins!</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={()=>router.push("home")} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>router.push("home")} style={styles.startAuctionButton}>
            <Text style={styles.startAuctionText}>Start auction</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom:70
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 10
  },
  searchIcon: {
    marginRight: 10,
    color: "grey"
  },
  searchText: {
    color: "grey"
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "grey",
    marginRight: 10
  },
  activeTab: {
    backgroundColor: "orange",
    borderColor: "orange"
  },
  tabText: {
    color: "grey"
  },
  activeTabText: {
    color: "black"
  },
  viewStoreButton: {
    borderRadius:30,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor:"white",
    width:100
  },
  viewStoreText: {
    color: "black"
  },
  sectionHeader: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 10
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor:"#1A1A1A"
  },
  inputLabel: {
    color: "grey"
  },
  inputValue: {
    color: "white"
  },
  timeContainer: {
    marginBottom: 20
  },
  timeOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  timeOption: {
    borderRadius:5,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor:"#1A1A1A",
    marginTop:10
  },
  activeTimeOption: {
    backgroundColor: "orange",
    borderColor: "orange"
  },
  timeOptionText: {
    color: "white"
  },
  inActiveTimeOptionText: {
    color: "white"
  },
  suddenDeathContainer: {
    padding: 10,
    marginBottom: 20
  },
  suddenDeathDescription: {
    color: "grey",
    marginTop: 10
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 25,
    padding: 10,
    width: "48%",
    alignItems: "center"
  },
  cancelText: {
    color: "white"
  },
  startAuctionButton: {
    backgroundColor: "orange",
    borderRadius: 25,
    padding: 10,
    width: "48%",
    alignItems: "center"
  },
  startAuctionText: {
    color: "white"
  },
  addPlatform: {
    borderRadius:5,
    padding: 10,
    marginBottom: 20,
    backgroundColor:"#1A1A1A"
  }

});

export default Create;