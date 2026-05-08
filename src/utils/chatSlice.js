import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    socket: null,
    unreadCount: 0,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    incrementUnread: (state) => {
      state.unreadCount += 1;
    },
    resetUnread: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const { setSocket, incrementUnread, resetUnread } = chatSlice.actions;
export default chatSlice.reducer;