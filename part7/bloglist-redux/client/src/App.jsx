import { useState, useEffect, useRef } from "react";
import React from "react";
import blogService from "./services/blogs";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBlogWithId,
  initializeBlogs,
  likeBlog,
} from "./reducers/blogReduer";
import BlogList from "./components/BlogList";
import { deleteUser, loginUser, setUser } from "./reducers/userReducer";
import { useMatch, Routes, Route, Link, useNavigate } from "react-router-dom";
import Users from "./components/Users";
import User from "./components/User";
import axios from "axios";
import Blog from "./components/Blog";
import { setNotificationFor } from "./reducers/notificationReducer";
import {
  Form,
  MenuMenu,
  MenuItem,
  Menu,
  Container,
  Header,
  FormInput,
  Button,
} from "semantic-ui-react";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeItem, setActiveItem] = useState("blogs");
  // const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  let user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      dispatch(setUser(user));
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    dispatch(loginUser(username, password));
    setUsername("");
    setPassword("");
    setActiveItem("blogs");
  };

  const loginForm = () => {
    return (
      <Form onSubmit={handleLogin}>
        <FormInput
          label="Username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
        <FormInput
          label="Password"
          value={password}
          name="Password"
          type="password"
          onChange={({ target }) => setPassword(target.value)}
        />
        <Header as="h1" textAlign="center">
          <Button primary floated="middle" type="submit">
            login
          </Button>
        </Header>
      </Form>
    );
  };

  const logout = () => {
    window.localStorage.removeItem("loggedBloglistUser");
    dispatch(deleteUser());
  };

  const [usersInfo, setUsersInfo] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3003/api/users").then((response) => {
      setUsersInfo(response.data);
    });
  }, [blogs]);

  const userMatch = useMatch("/users/:id");
  let userInfo = null;
  if (usersInfo) {
    userInfo = userMatch
      ? usersInfo.find((userInfo) => userInfo.id === userMatch.params.id)
      : null;
  }

  const blogMatch = useMatch("/blogs/:id");
  let matchedBlog = null;
  if (blogMatch) {
    matchedBlog = blogMatch
      ? blogs.find((blog) => blog.id === blogMatch.params.id)
      : null;
  }

  const like = (id) => {
    const blogToLike = blogs.filter((blog) => blog.id === id)[0];
    dispatch(likeBlog(id));
    dispatch(setNotificationFor(`you liked the blog: ${blogToLike.title}`, 5));
  };

  const deleteBlogOf = (id) => {
    const blogToDelete = blogs.find((blog) => blog.id === id);
    const message = `Remove blog '${blogToDelete.title}' by ${blogToDelete.author} ?'`;
    if (window.confirm(message)) {
      dispatch(deleteBlogWithId(id));
      navigate("/");
    }
  };

  if (user === null) {
    return (
      <Container>
        <Notification />
        <Header as="h1" textAlign="center">
          Log in to the Blogs App
        </Header>
        {loginForm()}
      </Container>
    );
  }

  return (
    <Container>
      <div>
        <Menu pointing secondary>
          <MenuItem
            name="blogs"
            active={activeItem === "blogs"}
            onClick={() => {
              setActiveItem("blogs");
              navigate("/");
            }}
          />
          <MenuItem
            name="users"
            active={activeItem === "users"}
            onClick={() => {
              setActiveItem("users");
              navigate("/users");
            }}
          />
          <MenuItem position="right">
            <Header as="h3">Blogs App</Header>
          </MenuItem>
          <MenuMenu position="right">
            <MenuItem position="right">{`${user.name} logged in`}</MenuItem>
            <MenuItem
              name="logout"
              position="right"
              active={activeItem === "logout"}
              onClick={() => {
                setActiveItem("logout");
                logout();
              }}
            />
          </MenuMenu>
        </Menu>
      </div>

      <Notification />

      <div style={{ margin: "20px 0" }}>
        <Togglable ref={blogFormRef} buttonLabel="Create new blog">
          <BlogForm blogFormRef={blogFormRef} />
        </Togglable>
      </div>

      <Routes>
        <Route path="/users" element={<Users usersInfo={usersInfo} />} />
        <Route path="/users/:id" element={<User userInfo={userInfo} />} />
        <Route
          path="/blogs/:id"
          element={
            <Blog blog={matchedBlog} like={like} deleteBlogOf={deleteBlogOf} />
          }
        />
        <Route
          path="/"
          element={
            <BlogList blogs={blogs} like={like} deleteBlogOf={deleteBlogOf} />
          }
        />
      </Routes>
    </Container>
  );
};

export default App;
