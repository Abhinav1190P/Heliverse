import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers, fetchFilteredUsers, fetchFilteredUsersByText,fetchOneUser } from './actions';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    status: 'idle',
    totalUsers: 0,
    error: null,
    currentUser:{}
  },
  reducers: {
    // Your other reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchFilteredUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFilteredUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
      })
      .addCase(fetchFilteredUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchFilteredUsersByText.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFilteredUsersByText.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
      })
      .addCase(fetchFilteredUsersByText.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchOneUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOneUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(fetchOneUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export default usersSlice.reducer;
