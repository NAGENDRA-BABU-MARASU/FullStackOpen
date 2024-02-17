import ReactDOM from "react-dom/client";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import blogReduer from "./reducers/blogReduer";
import notificationReducer from "./reducers/notificationReducer";
import userReducer from "./reducers/userReducer";
import { BrowserRouter as Router } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";

const store = configureStore({
  reducer: {
    blogs: blogReduer,
    notification: notificationReducer,
    user: userReducer,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
);
