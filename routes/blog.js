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

router.get("/add-new", getAddPost);

router.get("/:id", getBlogById);


router.get("/delete/:id", deleteBlogById );

router.post("/comment/:blogId", postCommentToaBlog);




router.post("/", upload.single("coverImage"), uploadBlog);

module.exports = router;
