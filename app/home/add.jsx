import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Switch, Modal, Image, TextInput } from 'react-native';
import BottomNavBar from '../../components/BottomNav';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Insta from '../../assets/images/insta.png'
import Tiktok from '../../assets/images/tiktok.png'
import Youtub from '../../assets/images/youtub.png'


const dressImages = [
  "https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];
const products = [
  { id: 1, name: 'Jacket name', quantity: 32, price: 45.00, image: dressImages[0] },
  { id: 2, name: 'Jacket name', quantity: 12, price: 405.00, image: dressImages[1] },
];
const categories = ['Jacket', 'Shoes', 'Jeans', 'T-shirt', 'Access'];
const timeOptions = ['5s', '10s', '15s', '20s', '25s', '30s', '40s', '50s', '1m'];


const Create = () => {
  const [isSuddenDeathEnabled, setIsSuddenDeathEnabled] = useState(false);
  const [selectedTime, setSelectedTime] = useState('10s');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isSocialVisible, setIsSocialVisible] = useState(false);
  const [isStoreVisible, setIsStoreVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Jacket');



  const togglePopup = () => { setIsPopupVisible(!isPopupVisible); }
  const handleCategoryPress = (category) => { setActiveCategory(category); };
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

        <TouchableOpacity onPress={() => setIsStoreVisible(!isStoreVisible)} style={styles.viewStoreButton}>
          <Text style={styles.viewStoreText}>View store</Text>
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>LIVE settings</Text>

        <TouchableOpacity onPress={togglePopup} style={styles.addPlatform}>
          <Text style={{ color: "grey" }} >+ Add Platform</Text>
        </TouchableOpacity>

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
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={styles.inputLabel}>Sudden death</Text>
            <Switch trackColor={{ false: "#767577", true: "#81b0ff" }} thumbColor={isSuddenDeathEnabled ? "#f5dd4b" : "#f4f3f4"} ios_backgroundColor="#3e3e3e" onValueChange={setIsSuddenDeathEnabled} value={isSuddenDeathEnabled} style={{ marginLeft: 10 }} />
          </View>
          <Text style={styles.suddenDeathDescription}>This means when you're down to 00:01 the last person to bid wins!</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => router.push("home/loader")} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("home/loader")} style={styles.startAuctionButton}>
            <Text style={styles.startAuctionText}>Start auction</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={isPopupVisible} onRequestClose={togglePopup}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add platforms</Text>
            <Text style={styles.modalSubtitle}>Broadcast through TUGM LIVE by connecting a platform</Text>

            <View style={styles.platformIconsContainer}>
              <TouchableOpacity onPress={() => { setIsPopupVisible(false); setIsSocialVisible(true) }} style={styles.platformIcon}>
                <Image source={Insta} style={styles.iconImage} resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setIsPopupVisible(false); setIsSocialVisible(true) }} style={styles.platformIcon}>
                <Image source={Tiktok} style={styles.iconImage} resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setIsPopupVisible(false); setIsSocialVisible(true) }} style={styles.platformIcon}>
                <Image source={Youtub} style={styles.iconImage} resizeMode="contain" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalHandle} />

          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={isSocialVisible} onRequestClose={() => setIsSocialVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add platforms</Text>
            <Text style={styles.modalSubtitle}>Broadcast through TUGM LIVE by connecting a platform</Text>

            <View style={styles.platformIconsContainer}>
              <TouchableOpacity style={styles.platformIcon}>
                <Image source={Insta} style={styles.iconImage} resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.platformIcon}>
                <Image source={Tiktok} style={styles.iconImage} resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.platformIcon}>
                <Image source={Youtub} style={styles.iconImage} resizeMode="contain" />
              </TouchableOpacity>
            </View>
            <View style={styles.rtmoSettings}>
              <Text style={styles.rtmoTitle}>RTMO settings</Text>

              <View style={styles.inputContainerModal}>
                <Text style={styles.inputLabelModal}>Stream URL *</Text>
                <TextInput style={styles.inputModal} placeholder="http://www.zencorporation.com" placeholderTextColor={"grey"} />
              </View>

              <View style={styles.inputContainerModal}>
                <Text style={styles.inputLabelModal}>Stream Key *</Text>
                <TextInput style={styles.inputModal} placeholder="Required" placeholderTextColor={"grey"} />
              </View>

              <View style={styles.inputContainerModal}>
                <Text style={styles.inputLabelModal}>Stream name *</Text>
                <TextInput style={styles.inputModal} placeholder="Instagram" placeholderTextColor={"grey"} />
              </View>

              <View style={styles.advancedSettings}>
                <Text style={styles.advancedSettingsTitle}>Stream authentication (Advanced settings)</Text>
                <View style={styles.inputContainerModal}>
                  <Text style={styles.inputLabelModal}>ID</Text>
                  <TextInput style={styles.inputModal} />
                </View>
                <View style={styles.inputContainerModal}>
                  <Text style={styles.inputLabelModal}>Password</Text>
                  <TextInput style={styles.inputModal} secureTextEntry={true} />
                </View>
              </View>
            </View>
            <View style={styles.buttonContainerModal}>
              <TouchableOpacity onPress={() => setIsSocialVisible(false)} style={styles.cancelButtonModal}>
                <Text style={styles.cancelTextModal}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsSocialVisible(false)} style={styles.saveButtonModal}>
                <Text style={styles.saveTextModal}>Save</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.modalHandle} /> */}

          </View>
        </View>
      </Modal>


      <Modal animationType="slide" transparent={true} visible={isStoreVisible} onRequestClose={() => setIsStoreVisible(false)}>
        <View style={styles.modalOverlay}>

          <View style={styles?.modalContent2}>

            <Text style={{ color: "white", fontSize: 16 }}>Live listings</Text>

            <View style={{ backgroundColor: '#1A1A1A', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 2, marginVertical: 10 }}>
              <Ionicons name="search" size={20} color="gray" />
              <TextInput placeholder="Search for products" placeholderTextColor="gray" />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity key={category} style={[styles.button, activeCategory === category && styles.activeButton,]} onPress={() => handleCategoryPress(category)}>
                  <Text style={[styles.buttonText, activeCategory !== category && styles.inActiveButtonText]}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={{ color: "white", fontSize: 16, marginTop: 10 }}>My Store</Text>

            {
              products?.map((i) => (
                <View key={i.id} style={{ padding: 10, backgroundColor: '#1A1A1A', borderRadius: 10, marginVertical: 10, }}>

                  <View style={{ flexDirection: "row", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: "#494848", paddingBottom: 20 }}>

                    <Image source={{ uri: i.image }} alt='img' style={{ width: 70, height: 70, borderRadius: 10 }} />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={{ color: "#fff", fontSize: 12 }}>{i.name}</Text>
                      <Text style={{ color: "#c4c4c4", fontSize: 12, marginTop: 8 }}>QTY: {i?.quantity}</Text>
                      <Text style={{ color: "#fff", fontSize: 12, marginTop: 8 }}>${i.price}</Text>
                    </View>

                  </View>

                  <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", marginTop: 15 }}>
                    <View>
                      <Text style={{ color: "#c4c4c4", fontSize: 12 }}>0 Bid</Text>
                      <Text style={{ color: "#fff", fontSize: 16, marginTop: 3 }}>${i.price}</Text>
                    </View>

                    <TouchableOpacity onPress={() => setIsStoreVisible(false)} style={[styles.cancelButton,{backgroundColor:"#fff",width:110}]}>
                      <Text style={[styles.cancelText,{color:"#000"}]}>Start auction</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              ))
            }


          </View>

        </View>
      </Modal>



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
    paddingBottom: 70
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
    borderRadius: 30,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "white",
    width: 100
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
    backgroundColor: "#1A1A1A"
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
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "#1A1A1A",
    marginTop: 10
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
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#1A1A1A"
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: 'white',
    borderRadius: 2.5,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  modalContent2: {
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    color: 'grey',
    marginBottom: 20,
  },
  platformIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  platformIcon: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 6,
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  buttonContainerModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 1
  },
  cancelButtonModal: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 20,
    padding: 10,
    width: "48%",
    alignItems: "center"
  },
  cancelTextModal: {
    color: "white"
  },
  saveButtonModal: {
    backgroundColor: "orange",
    borderRadius: 20,
    padding: 10,
    width: "48%",
    alignItems: "center",
    marginLeft: 15
  },
  saveTextModal: {
    color: "white"
  },
  rtmoSettings: {
    width: '100%',
    marginTop: 5,
  },
  rtmoTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainerModal: {
    marginBottom: 15,
  },
  inputLabelModal: {
    color: 'grey',
    marginBottom: 5,
  },
  inputModal: {
    backgroundColor: '#1A1A1A',
    color: "white",
    borderRadius: 8,
    padding: 10,
  },
  advancedSettings: {
    marginTop: 15,
  },
  advancedSettingsTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
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
  inActiveButtonText: {
    color: "grey"
  },
  buttonText: {
    color: "black"
  },

});

export default Create;