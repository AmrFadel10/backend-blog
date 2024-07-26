const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			minLength: 2,
			maxLength: 100,
		},
		description: {
			type: String,
			required: true,
			trim: true,
			minLength: 10,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		image: {
			type: Object,
			url: String,
			publicId: String,
			default: {
				url: "",
				publicId: null,
			},
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

postSchema.virtual("comments", {
	ref: "Comment",
	foreignField: "post",
	localField: "_id",
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
