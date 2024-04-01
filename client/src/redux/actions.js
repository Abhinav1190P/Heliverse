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

export const fetchFilteredUsers = createAsyncThunk('users/fetchFilteredUsers', async (filters) => {
  console.log(filters);
  try {
    const encodedFilters = encodeURIComponent(JSON.stringify(filters));
    const response = await axios.get(`http://localhost:4000/api/users?filters=${encodedFilters}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});


export const fetchFilteredUsersByText = createAsyncThunk('users/fetchFilteredUsersByText', async (search) => {

  try {
    const response = await axios.get(`http://localhost:4000/api/users?search=${search}`)
    return response.data;

  } catch (error) {
    console.log(error)
    throw error;
  }
})


export const fetchOneUser = createAsyncThunk('users/fetchOneUser', async (id) => {

  try {
    const response = await axios.get(`http://localhost:4000/api/users/${id}`)
    return response.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
})



export const updateOneUser = createAsyncThunk('users/updateOneUser', async ({ id, data }) => {
  try {
    const response = await axios.put(`http://localhost:4000/api/users/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});