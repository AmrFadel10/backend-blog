const epxress = require("express");
const DBConnection = require("./config/DBConnection");
require("dotenv").config();

//Run application
const app = epxress();

//Database Connection
DBConnection();

//Middlewares
app.use(epxress.json());
app.use(epxress.urlencoded({ extended: false }));

//Routes
app.use("/api/v2/auth", require("./routes/auth.route"));
app.use("/api/v2/users", require("./routes/users.route"));
app.use("/api/v2/posts", require("./routes/posts.route"));
app.use("/api/v2/comments", require("./routes/comments.route"));

//Error handler
app.use((err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	res.status(err.statusCode).json({
		err,
		message: err.message,
		stack: err.stack,
	});
});

//Active server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`The server is in ${process.env.NOD_ENV} mode on port ${port}`);
});
