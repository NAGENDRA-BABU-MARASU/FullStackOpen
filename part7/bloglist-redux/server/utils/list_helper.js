
const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item['likes']
  const likes = blogs.reduce(reducer, 0)
  return likes
}

const favoriteBlog = (blogs) => {
  const mostLikes = Math.max(...blogs.map(blog => blog['likes']))
  const blogWithMostLikes = blogs.filter(blog => blog['likes'] === mostLikes)
  return blogWithMostLikes[0];
}

const mostBlogs = (blogs) => {
  console.log(_.countBy(blogs, ))

}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
};
