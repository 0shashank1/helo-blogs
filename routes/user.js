const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");



const  {
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

} = require("../controllers/user")

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/images/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });



const cropImgage = (req, res, next) => {
  const inputPath = path.join(process.cwd(), "public", "images", req.file.filename );
  const tempPath = path.join(process.cwd(), "public", "images", "input-temp.jpg");
  sharp(inputPath)
  .metadata()
  .then(({ width, height }) => {
    const size = Math.min(width, height);
    const left = Math.floor((width - size) / 2);
    const top = Math.floor((height - size) / 2);

    return sharp(inputPath)
      .extract({ width: size, height: size, left, top })
      .toFile(tempPath);
  })
  .then(() => {
    fs.renameSync(tempPath, inputPath);
    next();
  })
  .catch(err => {
    console.error(" Error processing image:", err);
  });
}



router.get("/signin", handleGetSignin);

router.get("/signup", handleGetSignup );

router.post("/signin", handlePostSignin);

router.get("/logout", handleLogout);

router.get("/myposts", handleGetMyPosts);

router.get("/editprofile", handleEditProfile);

router.post("/updateProfileimg",upload.single("profileImage"), cropImgage, handleUpdateProfileImage);

router.post("/updateUserName", handleUpdateUserName);

router.post("/updateUserPassword", handleUpdateUserPassword);

router.post("/signup",handlePostSignup);

router.get("/:id", getUserDetails);


module.exports = router;
