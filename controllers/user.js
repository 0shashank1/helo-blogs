const User = require("../models/user");
const Blog = require("../models/blog");
const path = require("path");
const fs = require("fs");
const { createHmac, randomBytes } = require("crypto");


const handleGetSignin = (req, res) => {    return res.render("signin") };

const handleGetSignup = (req, res) => {   return res.render("signup");  };


//checks for authentication
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


//handleUpdateProfileImage, handleEditProfile, handleUpdateUserName,handleUpdateUserPassword
//are for user profile edit
const handleUpdateProfileImage = async(req, res) => {
  const user = await User.findById(req.user._id);
  if(user.profileImageURL !== "/images/default.png" ) {
    const filePath = path.join(process.cwd(), "public", user.profileImageURL);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } 
      });
  }
  await User.updateOne({ _id: req.user._id }, { $set: { profileImageURL: `/images/${req.file.filename}` } });
  res.render("editprofile", {
    user: req.user,
  });

}

const handleEditProfile = (req,res) => {
  res.render("editprofile", {
    user: req.user,
  });
}

const handleUpdateUserName = async (req, res) => {
  if(!req.body || !req.body.username ) {
    return res.render("editprofile", {
      user: req.user,
      error: "please enter username",
    });
  }
  await User.updateOne({ _id: req.user._id }, { $set: { fullName: req.body.username } });
  req.user = {
    ...req.user,
    fullName: req.body.username,
  }
  res.render("editprofile", {
    user: req.user,
  });  

}

const handleUpdateUserPassword = async (req, res) => {
  if(!req.body || !req.body.password ) {
    return res.render("editprofile", {
      user: req.user,
      error: "please enter pasword",
    });
  }
  const saltt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", saltt)
    .update(req.body.password)
    .digest("hex");

  await User.updateOne({ _id: req.user._id }, { $set: { salt: saltt, password: hashedPassword  } });
  res.render("editprofile", {
    user: req.user,
  });  

}


const handlePostSignup =  async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
}


//for user profile view
const getUserDetails = async (req, res) => {
  const userdetails = await User.findById(req.params.id);
  const userfound = { 
    fullName: userdetails.fullName ,
    email: userdetails.email,
    role: userdetails.role,
    profileImageURL: userdetails.profileImageURL,
  }
  const userBlogs = await Blog.find({ createdBy : req.params.id});
  res.render("viewprofile",{
    blogs: userBlogs,
    userdetails: userfound,
    user: req.user,
  });
}

module.exports = {
    handleGetSignin,
    handleGetSignup,
    handlePostSignin,
    handleLogout,
    handleGetMyPosts,
    handlePostSignup,
    handleEditProfile,
    handleUpdateProfileImage,
    handleUpdateUserName,
    handleUpdateUserPassword,
    getUserDetails,
};