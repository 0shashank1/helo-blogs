const path = require("path");
const fs = require("fs");
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

const deleteBlogById = async (req, res) => {
  await Comment.deleteMany({ blogId : req.params.id });
  const blog = await Blog.findById(req.params.id);

  const filePath = path.join(process.cwd(), "public", blog.coverImageURL);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } 
  });
  await Blog.findByIdAndDelete(req.params.id);
  const myposts = await Blog.find({ createdBy : req.user._id});
    res.render("myposts", {
      user: req.user,
      blogs: myposts,
    });
  
};


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
    if(!body || !title || !req.file.filename){
      return res.render("addBlog", {
        user: req.user,
        error: "field not be empty",
      });
    }
    const ext = req.file.filename.split('.').pop();
    const extensions = ["jpeg", "jpg", "png"];
    if(extensions.includes(ext)){
      const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
      });
      return res.redirect(`/blog/${blog._id}`);
    }
    else{
      return res.render("addBlog", {
        user: req.user,
        error: "format not supported",
      });
    }
}




module.exports = {
    getBlogById,
    postCommentToaBlog,
    getAddPost,
    uploadBlog,
    deleteBlogById,
};
