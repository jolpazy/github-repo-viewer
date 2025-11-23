import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppState = {
  searchQuery: string;
  favorites: number[];
};

const initialState: AppState = {
  searchQuery: "",
  favorites: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    addFavorite(state, action: PayloadAction<number>) {
      state.favorites.push(action.payload);
    },
    removeFavorite(state, action: PayloadAction<number>) {
      state.favorites = state.favorites.filter((f) => f !== action.payload);
    },
  },
});

export const { setSearchQuery, addFavorite, removeFavorite } = appSlice.actions;
export const appReducer = appSlice.reducer;
