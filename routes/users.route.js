const {
	getAllUserCtrl,
	getUserCtrl,
	updateUserCtrl,
	getUserCountCtrl,
	uploadProfilePhotoCtrl,
	deleteUserCtrl,
} = require("../controllers/users.ctrl");
const { upload } = require("../middlewares/multer");
const { validParams } = require("../middlewares/validateParams");
const {
	isUserHimself,
	isAdmin,
	isUserHimselfOrAdmin,
	verifyToken,
} = require("../middlewares/verifyToken");

const router = require("express").Router();

// /api/v2/users/
router.route("/").get(isAdmin, getAllUserCtrl);

// /api/v2/users/count
router.route("/count").get(isAdmin, getUserCountCtrl);

// /api/v2/users/upload-profile-photo
router
	.route("/upload-profile-photo")
	.post(verifyToken, upload.single("image"), uploadProfilePhotoCtrl);

// /api/v2/users/:id
router
	.route("/:id")
	.get(validParams, getUserCtrl)
	.put(validParams, isUserHimself, updateUserCtrl)
	.delete(validParams, isUserHimselfOrAdmin, deleteUserCtrl);

module.exports = router;
