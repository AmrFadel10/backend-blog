const Post = require("../models/post_models");
const path = require("path");
const fs = require("fs");
const { uploadPhoto, removePhoto } = require("../utils/cloudinary");
const HandleError = require("../utils/handleError");
const {
	createPostValid,
	updatePostValid,
} = require("../utils/validations/posts.valid");

/**------------------------------------------------------------
 * @desc   create post
 * @route  /api/v2/posts
 * @method POST
 * @access private (only admins)
--------------------------------------------------------------*/

exports.createPostCtrl = async (req, res, next) => {
	//validation
	if (!req.file) {
		return next(new HandleError(400, "No image provided"));
	}
	try {
		const { error } = createPostValid(req.body);
		if (error) {
			return next(HandleError(400, error.details[0].message));
		}
		//image path
		const photoPath = path.join(__dirname, "..", "images", req.file.filename);

		//uplaod image
		const photo = await uploadPhoto(photoPath);

		//create post
		const post = await Post.create({
			title: req.body.title,
			description: req.body.description,
			category: req.body.category,
			user: req.user.id,
			image: {
				url: photo.secure_url,
				publicId: photo.public_id,
			},
		});

		//response to client
		res.status(201).json(post);

		//delete photo from the server
		fs.unlinkSync(photoPath);
	} catch (error) {
		next(error);
	}
};

/**
 * @desc   Get all posts
 * @route  api/v2/posts/
 * @method GET
 * @access public
 */

exports.getAllPostsCtrl = async (req, res, next) => {
	try {
		const limit = 5;
		let posts;
		if (req.query.numberPage) {
			const numberPage = +req.query.numberPage;
			const skip = (numberPage - 1) * limit;

			posts = await Post.find()
				.sort("-createdAt")
				.limit(limit)
				.skip(skip)
				.populate("user")
				.populate("comments");
		} else if (req.query.category) {
			posts = await Post.find({ category: req.query.category })
				.sort("-createdAt")
				.populate("user")
				.populate("comments");
		} else {
			posts = await Post.find()
				.sort("-createdAt")
				.populate("user")
				.populate("comments");
		}
		res.status(200).json(posts);
	} catch (error) {
		next(error);
	}
};

/**-----------------------------------------------------------------
 * @desc    get one post 
 * @route   /api/v2/posts/count
 * @method  GET
 * @access  public
-------------------------------------------------------------------*/

exports.getPostCtrl = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id).populate("comments");
		if (!post) {
			return next(new HandleError(404, "No post available!"));
		}
		res.status(200).json(post);
	} catch (error) {
		next(error);
	}
};

/**--------------------------------------------------------------
 * @desc    delete post
 * @route   /api/v2/posts/:id
 * @method  DELETE
 * @access  private (user himself || admin)
------------------------------------------------------------------*/
exports.deletePostCtrl = async (req, res, next) => {
	try {
		let post = await Post.findById(req.params.id);

		if (!post) {
			return next(new HandleError(400, "No post found!"));
		}

		if (req.user.id !== post.user.toString() && !req.user.idAdmin) {
			return next(
				new HandleError(403, "Just admin or user himslef can delete this post!")
			);
		}

		//find user and delete
		post = await Post.findByIdAndDelete(req.params.id);

		//remove photo
		await removePhoto(post.image.publicId);

		res.status(200).json({ message: "Post has been deleted successfully!" });
	} catch (error) {
		next(error);
	}
};

/**
 * @desc   update post
 * @route  /api/v2/posts/:id
 * @method PUT
 * @access private (owner of the post )
 */

exports.updatePostCtrl = async (req, res, next) => {
	try {
		//Check post if available
		let post = await Post.findById(req.params.id);
		if (!post) {
			return next(new HandleError(400, "No post found!"));
		}

		//validation
		const { error } = updatePostValid(req.body);
		if (error) {
			return next(new HandleError(400, error.details[0].message));
		}
		//Authorization
		if (req.user.id !== post.user.toString()) {
			return next(
				new HandleError("403", "Just owner of the post can edit it!")
			);
		}
		post = await Post.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					title: req.body.title,
					description: req.body.description,
					category: req.body.category,
				},
			},
			{ new: true }
		);
		res.status(200).json(post);
	} catch (error) {
		next(error);
	}
};

/**
 * @desc   update image post
 * @route  /api/v2/posts/update-img/:id
 * @method PUT
 * @access private (owner of the post )
 */

exports.updateImagePostCtrl = async (req, res, next) => {
	try {
		if (!req.file) {
			return next(new HandleError(400, "No image provided!"));
		}
		//Check post if available
		let post = await Post.findById(req.params.id);
		if (!post) {
			return next(new HandleError(400, "No post found!"));
		}

		//Authorization
		if (req.user.id !== post.user.toString()) {
			return next(
				new HandleError("403", "Just owner of the post can edit it!")
			);
		}

		//remove image from cloundinary
		await removePhoto(post.image.publicId);

		//upload image on cloundinary
		const pathimage = path.join(__dirname, "..", "images", req.file.filename);
		const result = await uploadPhoto(pathimage);

		//update post
		post = await Post.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					image: {
						url: result.url,
						publicId: result.public_id,
					},
				},
			},
			{ new: true }
		);
		res.status(200).json(post);

		//delete image from images directory
		fs.unlinkSync(pathimage);
	} catch (error) {
		next(error);
	}
};

/**
 * @desc   update likes post
 * @route  /api/v2/posts/likes/:id
 * @method PUT
 * @access private  (only logged in user)
 */
exports.updateLikesCtrl = async (req, res, next) => {
	try {
		//Check post if available
		let post = await Post.findById(req.params.id);
		if (!post) {
			return next(new HandleError(400, "No post found!"));
		}

		//check if user id already exist in likes array
		const alreadyLiked = post.likes.find((id) => id.toString() === req.user.id);
		if (alreadyLiked) {
			post = await Post.findByIdAndUpdate(
				req.params.id,
				{
					$pull: { likes: req.user.id },
				},
				{ new: true }
			);
		} else {
			post = await Post.findByIdAndUpdate(
				req.params.id,
				{
					$push: { likes: req.user.id },
				},
				{ new: true }
			);
		}

		res.status(200).json(post);
	} catch (error) {
		next(error);
	}
};
