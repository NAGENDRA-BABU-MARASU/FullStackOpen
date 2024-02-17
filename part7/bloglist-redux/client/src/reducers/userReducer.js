import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { setNotification, setNotificationFor } from "./notificationReducer";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      state = action.payload;
      return state;
    },
    deleteUser(state, action) {
      return null;
    },
  },
});

export const loginUser = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
    } catch (e) {
      setNotificationFor("Wrong credentials", 5);
    }
  };
};

export const { setUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
