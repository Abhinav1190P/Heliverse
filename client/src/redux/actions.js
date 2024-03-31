import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (currentPage) => {
  try {

    const response = await axios.get(`http://localhost:4000/api/users?page=${currentPage}`);
    return response.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
});
