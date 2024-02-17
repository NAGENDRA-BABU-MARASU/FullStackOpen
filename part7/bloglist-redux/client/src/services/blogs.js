import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.post(baseUrl, newBlog, config);
  return request.then((response) => response.data);
};

const update = (updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.put(
    `${baseUrl}/${updatedBlog.id}`,
    updatedBlog,
    config,
  );
  return request.then((response) => response.data);
};

const deleteBlog = (blogId) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.delete(`${baseUrl}/${blogId}`, config);
  return request;
};

const commentBlog = (blogId, comment) => {
  const config = { headers: { Authorization: token } };
  const request = axios.post(`${baseUrl}/${blogId}/comments`, {comment}, config)
  return request.then(response => response.data)
};

export default {
  getAll,
  create,
  setToken,
  update,
  deleteBlog,
  commentBlog
};
