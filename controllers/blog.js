
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const getAddPost = (req, res) => {
    return res.render("addBlog", {
      user: req.user,
    });
}


const getBlogById = async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy"
    );
    return res.render("blog", {
      user: req.user,
      blog,
      comments,
    });
}


const postCommentToaBlog  = async (req, res) => {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
}




const uploadBlog = async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
      body,
      title,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
}




module.exports = {
    getBlogById,
    postCommentToaBlog,
    getAddPost,
    uploadBlog,
};
