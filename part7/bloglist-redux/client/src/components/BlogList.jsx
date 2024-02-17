import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ListItem, List, Divider, Header } from "semantic-ui-react";

const BlogList = ({ blogs }) => {
  const compareBlogs = (blog1, blog2) => {
    return blog2.likes - blog1.likes;
  };

  return (
    <div>
      {/* {blogs.map((blog) => ( */}
      <List style={{ margin: "20px 0" }}>
        {[...blogs].sort(compareBlogs).map((blog) => (
          <ListItem key={blog.id}>
            <Link
              style={{ color: "black", fontWeight: "800" }}
              to={`/blogs/${blog.id}`}
            >
              <Header as="h3">{blog.title}</Header>
            </Link>
            <Divider />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default BlogList;
