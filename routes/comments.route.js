const {
	createCommentCtrl,
	getAllCommentsCtrl,
	deleteCommentCrl,
	updateCommentCtrl,
	getCommentCtrl,
} = require("../controllers/comments.ctrl");
const { validParams } = require("../middlewares/validateParams");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");

const router = require("express").Router();
router
	.route("/")
	.post(verifyToken, createCommentCtrl)
	.get(isAdmin, getAllCommentsCtrl);

router
	.route("/:id")
	.get(validParams, verifyToken, getCommentCtrl)
	.delete(validParams, verifyToken, deleteCommentCrl)
	.put(validParams, verifyToken, updateCommentCtrl);
module.exports = router;
