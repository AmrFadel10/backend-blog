const cloudinary = require("cloudinary");
cloudinary.config({
	cloud_name: "dh7ibwhqo",
	api_key: "397564969546264",
	api_secret: "neAssNZrOixrJryEWlxwea4gVYQ",
});

exports.uploadPhoto = async (photoImage) => {
	try {
		return await cloudinary.uploader.upload(photoImage, {
			resource_type: "auto",
		});
	} catch (error) {
		return error;
	}
};

//remove photo
exports.removePhoto = async (publicId) => {
	try {
		const result = await cloudinary.uploader.destroy(publicId);
		return result;
	} catch (error) {
		return error;
	}
};
