import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import favouriteReducer from './favouriteSlice';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedCartReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    favourite: favouriteReducer,
  },
});

export const persistor = persistStore(store);
