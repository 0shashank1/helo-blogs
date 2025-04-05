const { Router } = require("express");
const  {
  handleGetSignin,
  handleGetSignup,
  handlePostSignin,
  handleLogout,
  handleGetMyPosts,
  handlePostSignup,

} = require("../controllers/user")
const router = Router();

router.get("/signin", handleGetSignin);

router.get("/signup", handleGetSignup );

router.post("/signin", handlePostSignin);

router.get("/logout", handleLogout);

router.get("/myposts", handleGetMyPosts);

router.post("/signup",handlePostSignup);

module.exports = router;
