const User = require("../models/user_model");
const HandleError = require("../utils/handleError");
const { updateUserValid } = require("../utils/validations/users.valid");
const path = require("path");
const fs = require("fs");
const { uploadPhoto, removePhoto } = require("../utils/cloudinary");

/**-----------------------------------------------------------------
 * @desc    get All users
 * @route   /api/v2/users/
 * @method  GET
 * @access  private
-------------------------------------------------------------------*/
exports.getAllUserCtrl = async (req, res, next) => {
	try {
		const users = await User.find().populate("posts");
		if (!users) {
			return next(new HandleError(404, "No users found!"));
		}
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};
/**-----------------------------------------------------------------
 * 
 * @desc    get user
 * @route   /api/v2/users/:id
 * @method  GET
 * @access  public
-------------------------------------------------------------------*/
exports.getUserCtrl = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id).populate("posts");
		if (!user) {
			return next(new HandleError(404, "No user found!"));
		}
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

/**-------------------------------------------------------------------
 * @desc    update user
 * @route   /api/v2/user/:id
 * @method  PUT
 * @access  private
---------------------------------------------------------------------*/
exports.updateUserCtrl = async (req, res, next) => {
	try {
		const { error } = updateUserValid(req.body);
		if (error) {
			return next(new HandleError(400, error.details[0].message));
			// return res.status(400).json({message:error.details[0].message})
		}

		const user = await User.findById(req.params.id);

		if (!user) {
			return next(new HandleError(404, "No user found!"));
		}

		const updateUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					username: req.body.username,
					password: req.body.password,
					bio: req.body.bio,
				},
			},
			{ new: true }
		);
		res.status(200).json(updateUser);
	} catch (error) {
		next(error);
	}
};

/**-----------------------------------------------------------------
 * @desc    get users count
 * @route   /api/v2/users/count
 * @method  GET
 * @access  public
-------------------------------------------------------------------*/

exports.getUserCountCtrl = async (req, res, next) => {
	try {
		const count = await User.countDocuments();
		if (!count) {
			return next(new HandleError(404, "No users found!"));
		}
		res.status(200).json(count);
	} catch (error) {
		next(error);
	}
};

/**-----------------------------------------------------------------
 * @desc    upload profile photo
 * @route   /api/v2/users/upload-profile-photo
 * @method  post
 * @access  private
-------------------------------------------------------------------*/
exports.uploadProfilePhotoCtrl = async (req, res, next) => {
	try {
		//validation photo
		if (!req.file) {
			return next(new HandleError(400, "No image provided"));
		}

		//get path the photo from server
		const imagePath = path.join(__dirname, "..", "images", req.file.filename);
		// get user from db
		const user = await User.findById(req.user.id);

		//remove photo if found
		if (user.profilePhoto.publicId !== null) {
			await removePhoto(user.profilePhoto.publicId);
		}

		// upload photo
		const result = await uploadPhoto(imagePath);

		//update photo in database
		const photoDetails = {
			url: result.secure_url,
			publicId: result.public_id,
		};
		user.profilePhoto = photoDetails;
		await user.save();

		//respose to user
		res.status(200).json({
			message: "profile photo was updated successfully!",
			photoDetails,
		});

		//remove photo from server
		fs.unlinkSync(imagePath);
	} catch (error) {
		next(error);
	}
};

/**--------------------------------------------------------------
 * @desc    delete user
 * @route   /api/v2/users/:id
 * @method  DELETE
 * @access  private
------------------------------------------------------------------*/
exports.deleteUserCtrl = async (req, res, next) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);

		if (!user) {
			return next(new HandleError(404, "No user found!"));
		}
		//remove photo if found
		if (user.profilePhoto.publicId !== null) {
			await removePhoto(user.profilePhoto.publicId);
		}
		res.status(200).json({ message: "User has been deleted successfully!" });
	} catch (error) {
		next(error);
	}
};
