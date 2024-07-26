const mongoose = require("mongoose");
const HandleError = require("../utils/handleError");

exports.validParams = (req, res, next) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		next(new HandleError(400, "Wrong user id!"));
	} else {
		next();
	}
};
