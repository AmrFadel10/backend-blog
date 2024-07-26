const {
	createUserValid,
	loginUserValid,
} = require("../utils/validations/auth.valid");
const { tokenForSignup, generateToken } = require("../utils/generateTokens");
const User = require("../models/user_model");
const HandleError = require("../utils/handleError");

/**-----------------------------------------------------------------
 * @desc   Create new user
 * @route  /api/v2/auth/signup
 * @method POST
 * @access Public
-------------------------------------------------------------------*/
exports.createUserCtrl = async (req, res, next) => {
	const { username, email, password } = req.body;

	try {
		const { error } = createUserValid(req.body);
		if (error) {
			return next(new HandleError(400, error.details[0].message));
			// return res.status(400).json({message:error.details[0].message})
		}
		const user = await User.findOne({ email });
		if (user) {
			return next(new HandleError(400, "This user already exists!"));
		}
		//---------------------------------------------------------------------
		//@Todo verify account
		//---------------------------------------------------------------------

		// const token = tokenForSignup({username,email,password})
		// const activeLink = `http`

		//add user to database
		await User.create({ username, email, password });
		res.status(201).json({ message: "Account created successfully!" });
	} catch (error) {
		next(error);
	}
};

/**-----------------------------------------------------------------
 * @desc   login user
 * @route  /api/v2/auth/login
 * @method POST
 * @access Public
-------------------------------------------------------------------*/
exports.loginUserCtrl = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		//validation
		const { error } = loginUserValid(req.body);
		if (error) {
			return next(new HandleError(400, error.details[0].message));
		}

		//check user exists
		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			return next(new HandleError(400, "Email or password is wrong!"));
		}
		//compare password
		const isPassword = await user.comparePassword(password);
		if (!isPassword) {
			return next(new HandleError(400, "Email or password is wrong!"));
		}

		//generate token
		const token = generateToken({ id: user._id, isAdmin: user.isAdmin });

		//---------------------------------------------------------------------
		//@Todo verify account
		//---------------------------------------------------------------------
		const { _id, isAdmin, profilePhoto } = user._doc;
		res.status(201).json({ id: _id, isAdmin, profilePhoto, token });
	} catch (error) {
		next(error);
	}
};
