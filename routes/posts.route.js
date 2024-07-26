const {
	createPostCtrl,
	getAllPostsCtrl,
	getPostCtrl,
	deletePostCtrl,
	updateImagePostCtrl,
	updatePostCtrl,
	updateLikesCtrl,
} = require("../controllers/posts.ctrl");
const { upload } = require("../middlewares/multer");
const { validParams } = require("../middlewares/validateParams");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const router = require("express").Router();

// /api/v2/posts/
router
	.route("/")
	.post(isAdmin, upload.single("image"), createPostCtrl)
	.get(getAllPostsCtrl);

// /api/v2/posts/update-img/:id
router
	.route("/update-image/:id")
	.put(validParams, verifyToken, upload.single("image"), updateImagePostCtrl);

// /api/v2/posts/update-img/:id
router.route("/likes/:id").put(validParams, verifyToken, updateLikesCtrl);

// /api/v2/posts/:id
router
	.route("/:id")
	.get(validParams, getPostCtrl)
	.delete(validParams, verifyToken, deletePostCtrl)
	.put(validParams, verifyToken, upload.single("image"), updatePostCtrl);

module.exports = router;
