const { createUserCtrl, loginUserCtrl } = require("../controllers/auth.ctrl");

const router = require("express").Router();

// /api/v2/auth/signup
router.post("/signup", createUserCtrl);

// /api/v2/auth/login
router.post("/login", loginUserCtrl);

module.exports = router;
