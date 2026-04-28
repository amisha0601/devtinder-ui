import { createSlice } from "@reduxjs/toolkit";

const presenceSlice = createSlice({
  name: "presence",
  initialState: [], 
  reducers: {
    setOnlineUsers: (state, action) => {
      return action.payload; 
    },
  },
});

export const { setOnlineUsers } = presenceSlice.actions;
export default presenceSlice.reducer;