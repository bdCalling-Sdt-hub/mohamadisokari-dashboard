
import { createSlice } from '@reduxjs/toolkit';
import { commentApi } from '../../features/Chat/message';


const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    chats: [],
    unreadCount: 0
  },
  reducers: {
    addChats: (state, action) => {
      state.chats.push(action.payload);
      state.unreadCount += 1;
    },


  },

  extraReducers: (builder) => {
    builder.addMatcher(commentApi?.endpoints?.getAllChat?.matchFulfilled, (state, { payload }) => {
      state.chats = payload?.data;
      state.unreadCount = payload?.unreadChat || 0;
    });
  },

});

export const { addChats } = chatsSlice.actions;
export default chatsSlice.reducer;
