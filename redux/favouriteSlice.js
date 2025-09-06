import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    favouriteItems: [],
};

const FavouriteSlice = createSlice({
    name: 'favourite',
    initialState,
    reducers: {
        addToFavourite: (state, action) => {
            const itemIndex = state.favouriteItems.findIndex(item => item._id === action.payload._id);
            if (itemIndex >= 0) {
                state.favouriteItems[itemIndex].quantity += 1;
            } else {
                state.favouriteItems.push({ ...action.payload });
            }
        },
        removeFromFavourite: (state, action) => {
            state.favouriteItems = state.favouriteItems.filter(item => item._id !== action.payload);
        },
    },
});

export const { addToFavourite, removeFromFavourite, } = FavouriteSlice.actions;
export default FavouriteSlice.reducer;
