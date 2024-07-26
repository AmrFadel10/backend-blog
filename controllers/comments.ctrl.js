const Comment = require("../models/comment_models");
const User = require("../models/user_model");
const HandleError = require("../utils/handleError");
const {
	createCommentValid,
	updateCommentValid,
} = require("../utils/validations/comments.valid");

/**
 * @des create Coomment
 * @route /api/comments
 * @method POST
 * @access public
 */
exports.createCommentCtrl = async (req, res, next) => {
	try {
		const { error } = createCommentValid(req.body);
		if (error) {
			return res.status(400).json({ meesage: error.details[0].message });
		}
		const profile = await User.findById(req.user.id);
		if (!profile) {
			return next(new HandleError(401, "user id is invalid"));
		}
		const comment = await Comment.create({
			post: req.body.post,
			text: req.body.text,
			user: req.user.id,
			username: profile.username,
		});
		res.status(201).json(comment);
	} catch (error) {
		next(error);
	}
};

/**
 * @des Get all Comments
 * @route /api/comments
 * @method GET
 * @access private [only Admin]
 */

exports.getAllCommentsCtrl = async (req, res, next) => {
	try {
		const comments = await Comment.find();

		res.status(200).json(comments);
	} catch (error) {
		next(error);
	}
};
/**
 * @des Get one Comment
 * @route /api/v2/comments/:id
 * @method GET
 * @access private [only Admin]
 */

exports.getCommentCtrl = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.id);

		if (!comment) {
			return next(new HandleError(401, "comment not found!"));
		}
		res.status(200).json(comment);
	} catch (error) {
		next(error);
	}
};

/**
 * @des Delete Comment
 * @route /api/v2/comments/:id
 * @method DELETE
 * @access private [only Admin & user who made it]
 */

exports.deleteCommentCrl = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.id);
		if (!comment) {
			return next(new HandleError(401, "This comment not found"));
		}
		if (req.user.isAdmin || req.user.id === comment.user.toString()) {
			await Comment.findByIdAndDelete(req.params.id);
			return res.status(200).json({ message: "The Comment has been deleted" });
		} else {
			return next(new HandleError(403, "access denied, not Allowed"));
		}
	} catch (error) {
		next(error);
	}
};

/**
 * @des Update Comment
 * @route /api/v2/comments/:id
 * @method PUT
 * @access private [ user who made it]
 */

exports.updateCommentCtrl = async (req, res, next) => {
	try {
		const { error } = updateCommentValid(req.body);
		if (error) {
			return res.status(400).json({ meesage: error.details[0].message });
		}
		let comment = await Comment.findById(req.params.id);
		if (!comment) {
			return next(new HandleError(401, "Comment not found"));
		}
		if (req.user.id !== comment.user.toString()) {
			return next(
				new HandleError(
					403,
					"Access denied, only users himself can edit his comment"
				)
			);
		}
		comment = await Comment.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					text: req.body.text,
				},
			},
			{ new: true }
		);
		res.status(200).json(comment);
	} catch (error) {
		next(error);
	}
};
