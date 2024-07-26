const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			trim: true,
			required: true,
			minLength: 2,
			maxLength: 20,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			minLength: 5,
			maxLength: 100,
			unique: true,
		},
		password: {
			type: String,
			trim: true,
			required: true,
			minLength: 8,
			select: false,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		isAccountVerified: {
			type: Boolean,
			default: false,
		},
		profilePhoto: {
			type: Object,
			default: {
				url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
				publicId: null,
			},
		},
		bio: String,
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
userSchema.virtual("posts", {
	ref: "Post",
	foreignField: "user",
	localField: "_id",
});

//Hashed password before save it in database
userSchema.pre("save", async function () {
	if (this.isModified("password")) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}
});

//Compare password
userSchema.methods.comparePassword = async function (matchPassword) {
	return await bcrypt.compare(matchPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
