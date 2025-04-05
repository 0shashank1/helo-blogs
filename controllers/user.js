const User = require("../models/user");
const Blog = require("../models/blog");


const handleGetSignin = (req, res) => {    return res.render("signin") };

const handleGetSignup = (req, res) => {   return res.render("signup");  };


const handlePostSignin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const token = await User.matchPasswordAndGenerateToken(email, password);
  
      return res.cookie("token", token).redirect("/");
    } catch (error) {
      return res.render("signin", {
        error: "Incorrect Email or Password",
      });
    }
}

const handleLogout = (req, res) => {   
  res.clearCookie("token").redirect("/");  

}


const handleGetMyPosts = async (req, res) => {
  try {
    const myposts = await Blog.find({ createdBy : req.user._id});
    res.render("myposts", {
      user: req.user,
      blogs: myposts,
    });
  } catch (error) {
    console.log("you have no posts");
  }
};



const handlePostSignup =  async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
}

module.exports = {
    handleGetSignin,
    handleGetSignup,
    handlePostSignin,
    handleLogout,
    handleGetMyPosts,
    handlePostSignup,
};