import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReduer";
import { setNotificationFor } from "../reducers/notificationReducer";
import { Button, Form, FormInput } from "semantic-ui-react";
const BlogForm = ({ blogFormRef }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const blogObject = {
      title,
      author,
      url,
    };
    dispatch(createBlog(blogObject));
    dispatch(
      setNotificationFor(`you added a new blog : ${blogObject.title}`, 5),
    );
    setTitle("");
    setUrl("");
    setAuthor("");
    blogFormRef.current.toggleVisibility();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormInput
        label="Title"
        value={title}
        name="title"
        onChange={({ target }) => setTitle(target.value)}
      />
      <FormInput
        label="Author"
        name="author"
        value={author}
        onChange={({ target }) => setAuthor(target.value)}
      />
      <FormInput
        label="URL"
        value={url}
        name="url"
        onChange={({ target }) => setUrl(target.value)}
      />
      <Button primary type="submit">
        Create blog
      </Button>
    </Form>
  );
};

export default BlogForm;
