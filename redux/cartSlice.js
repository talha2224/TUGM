import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(item => item._id === action.payload._id);
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity += 1;
      } else {
        state.cartItems.push({ ...action.payload });
      }
    },
    updateCart: (state, action) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.cartItems.findIndex(item => item._id === id);
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity = quantity;
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
    },
    clearCart: (state) => {
      state.cartItems = [];
    }
  },
});

export const { addToCart, updateCart, removeFromCart ,clearCart} = cartSlice.actions;
export default cartSlice.reducer;
