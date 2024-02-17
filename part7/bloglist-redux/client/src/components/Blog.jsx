import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { commentBlog } from "../reducers/blogReduer";
import {
  Button,
  Label,
  Header,
  Icon,
  CommentGroup,
  List,
  ListItem,
  Input,
  Divider,
} from "semantic-ui-react";
const Blog = ({ blog, like, deleteBlogOf }) => {
  if (!blog) {
    return <div>loading ....</div>;
  }

  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const handleComment = (event) => {
    event.preventDefault();
    dispatch(commentBlog(blog.id, comment));
    setComment("");
  };

  return (
    <div
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        padding: "20px ",
        margin: "10px 0",
      }}
    >
      <Header as="h1">
        {blog.title}{" "}
        <Button
          floated="right"
          onClick={() => deleteBlogOf(blog.id)}
          color="red"
        >
          <Icon name="trash alternate" /> delete
        </Button>
      </Header>
      <Header as="h3">
        <a href={blog.url} target="blank">
          {blog.url}
        </a>
      </Header>
      <div>
        <Button size="mini" as="div" labelPosition="right">
          <Button size="mini" color="red" onClick={() => like(blog.id)}>
            <Icon name="heart" />
            Like
          </Button>
          <Label as="a" basic color="red" pointing="left">
            {blog.likes}
          </Label>
        </Button>
      </div>
      <Header as="h5">
        added by <b>{blog.author}</b>
      </Header>
      <br />
      <CommentGroup>
        <Header as="h3" dividing>
          Comments
        </Header>
        <List>
          {blog.comments.map((comment) => {
            return (
              <ListItem key={comment.id}>
                <Icon name="comment" style={{ padding: "0px 25px 10px 0px" }} />
                {comment.content}
              </ListItem>
            );
          })}
        </List>
      </CommentGroup>

      <Input
        fluid
        icon="comment"
        placeholder="Wanna say something?"
        type="text"
        name="comment"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      <br />
      <Button color="green" onClick={handleComment}>
        Comment
      </Button>
    </div>
  );
};

export default Blog;
