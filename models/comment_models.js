const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	text: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
});

module.exports =
	mongoose.models.Comment || mongoose.model("Comment", commentSchema);
