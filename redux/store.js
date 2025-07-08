import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage, // Persist data using AsyncStorage
};

const persistedCartReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
  },
});

export const persistor = persistStore(store);
