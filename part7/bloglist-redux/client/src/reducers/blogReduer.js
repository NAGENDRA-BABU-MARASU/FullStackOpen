import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { setNotificationFor } from "./notificationReducer";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      state = action.payload;
      return state;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog,
      );
    },
    deleteBlog(state, action) {
      const id = action.payload;
      const newState = state.filter((blog) => blog.id !== id);
      return newState;
    },
  },
});

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog);
    dispatch(appendBlog(newBlog));
  };
};

export const likeBlog = (id) => {
  return async (dispatch, getState) => {
    const blogToLike = getState().blogs.find((blog) => blog.id === id);
    const likedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
    };
    const likedBlogFromServer = await blogService.update(likedBlog);
    dispatch(updateBlog(likedBlogFromServer));
  };
};

export const deleteBlogWithId = (id) => {
  return async (dispatch) => {
    try {
      await blogService.deleteBlog(id);
      dispatch(deleteBlog(id));
      dispatch(setNotificationFor("blog deleted successfully", 5));
    } catch (e) {
      dispatch(
        setNotificationFor(
          "you can't delete this blog as you are not owner of this blog",
          5,
        ),
      );
    }
  };
};

export const commentBlog = (id, comment) => {
  return async (dispatch) => {
    const commentedBlog = await blogService.commentBlog(id, comment);
    dispatch(updateBlog(commentedBlog));
  };
};

export const { setBlogs, appendBlog, updateBlog, deleteBlog } =
  blogSlice.actions;
export default blogSlice.reducer;
