import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { StripeProvider } from '@stripe/stripe-react-native';
import DefaultScreen from './pages/DefaultScreen';
import OnboardingScreen from './pages/OnboardingScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import LoaderScreen from './pages/LoaderScreen';
import HomeScreen from './pages/HomeScreen';
import CartScreen from './pages/CartScreen';
import AuctionListingScreen from './pages/AuctionListingScreen';
import CreateStreamScreen from './pages/CreateStreamScreen';
import CalendarScreen from './pages/CalendarScreen';
import ProfileScreen from './pages/ProfileScreen';
import MyOrdersScreen from './pages/MyOrdersScreen';
import SellerOrdersScreen from './pages/SellerOrdersScreen';
import SellerProductsScreen from './pages/SellerProductsScreen';
import CreateProductScreen from './pages/CreateProductScreen';
import CreatorStreamScreen from './pages/CreatorStreamScreen';
import AdsScreen from './pages/AdsScreen';
import Notification from './pages/Notification';
import Shipments from './pages/Shipment';
import ShipmentDetailScreen from './pages/Shipment/ShipmentDetailScreen';
import Chats from './pages/Chats';
import Messages from './pages/Chats/Messages';
import FavouriteScreen from './pages/Profile/FavouriteScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StripeProvider publishableKey="pk_test_51OjJpTASyMRcymO6x2PBK1nrHChycNMNXj7HHvTRffOp5xufCj3WRSCLoep1tGp5Ilx3IWj7ck5yqrwEH8VSRKn80055Kvyelu">
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
              <Stack.Screen name="Default" component={DefaultScreen} />
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Loader" component={LoaderScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Cart" component={CartScreen} />
              <Stack.Screen name="CreatorStream" component={CreatorStreamScreen} />
              <Stack.Screen name="Categories" component={AuctionListingScreen} />
              <Stack.Screen name="Add" component={CreateStreamScreen} />
              <Stack.Screen name="Calendar" component={CalendarScreen} />
              <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
              <Stack.Screen name="SellerProducts" component={SellerProductsScreen} />
              <Stack.Screen name="SellerOrders" component={SellerOrdersScreen} />
              <Stack.Screen name="CreateProduct" component={CreateProductScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Ads" component={AdsScreen} />
              <Stack.Screen name="Notification" component={Notification} />
              <Stack.Screen name="shipments" component={Shipments} />
              <Stack.Screen name="shipment_detail" component={ShipmentDetailScreen} />
              <Stack.Screen name="chats" component={Chats} />
              <Stack.Screen name="messages" component={Messages} />
              <Stack.Screen name="favourite" component={FavouriteScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </StripeProvider>
      </PersistGate>
    </Provider>
  );
}
