// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Initial state
// const initialState = {
//   userInfo: null,
//   loading: false,
//   error: null,
// };

// // Async thunk for logging in the user
// export const loginUser = createAsyncThunk(
//   "user/login",
//   async (
//     { email, password }: { email: string; password: string },
//     thunkAPI
//   ) => {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/user/login`,
//         {
//           email,
//           password,
//         }
//       );
//       localStorage.setItem("token", response.data.token);
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );

// // Async thunk for getting user profile
// export const getUserProfile = createAsyncThunk(
//   "user/getProfile",
//   async (_, thunkAPI) => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_BASE_URL}/user/profile`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );

// // User slice
// export const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       localStorage.removeItem("token");
//       state.userInfo = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userInfo = action.payload;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(getUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getUserProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userInfo = action.payload;
//       })
//       .addCase(getUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// // Export the actions
// export const { logout } = userSlice.actions;

// // Export the reducer
// export default userSlice.reducer;
