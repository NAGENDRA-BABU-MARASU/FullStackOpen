import React from "react";
import { Link } from "react-router-dom";
import { Header, List, ListItem } from "semantic-ui-react";
const User = ({ userInfo }) => {
  if (!userInfo) {
    return null;
  }
  
  return (
    <div>
      <Header as="h1">{userInfo.username}</Header>
      {userInfo.blogs.length > 0 ? (
        <div>
          <Header as="h3">Added blogs: </Header>
          <List link>
            {userInfo.blogs.map((blog) => (
              <ListItem key={blog.title}>
                <Link style={{ fontWeight: "800" }} to={`/blogs/${blog.id}`}>
                  <Header as="h5">{blog.title}</Header>
                </Link>
              </ListItem>
            ))}
          </List>
        </div>
      ) : (
        <p>no blogs added </p>
      )}
    </div>
  );
};

export default User;
