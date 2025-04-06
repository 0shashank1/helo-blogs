const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const {
  getBlogById,
  postCommentToaBlog,
  getAddPost,
  uploadBlog,
  deleteBlogById,
} = require("../controllers/blog");

const router = Router();

//configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });


//add new post
router.get("/add-new", getAddPost);


router.get("/:id", getBlogById);

//delete blog by id
router.get("/delete/:id", deleteBlogById );

//post comment to a blog
router.post("/comment/:blogId", postCommentToaBlog);



//upload blog
router.post("/", upload.single("coverImage"), uploadBlog);

module.exports = router;
