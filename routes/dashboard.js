const router = require("express").Router();

const { authenticated } = require("../middlewares/auth");
const adminController = require("../controllers/adminController");

//! desc dashboard handle post creation
//! route post /dashboard/add-post
router.post("/add-post", authenticated, adminController.createPost);

//! desc Dashboard Handle Post Edit
//! route POST /dashbord/edit-post/:id
router.put("/edit-post/:id", authenticated, adminController.editPost);

//! desc  Dashboard Handle Image Upload
//! route  POST /dashboard/image-apload
router.post("/image-upload", authenticated, adminController.uploadImage);

//!  desc  Delete Post
//! route  GET /dashboard/delete-post/:id
router.delete("/delete-post/:id", authenticated, adminController.deletePost);

module.exports = router;
