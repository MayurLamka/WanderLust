const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/userController")


router.get("/signup", userController.renderSignup);



router.post("/signup", WrapAsync(userController.signup));

router.get("/login", userController.renderLogin);

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",
        { failureRedirect: "/login", failureFlash: true }), userController.login);

router.get("/logout", userController.logout);
module.exports = router;

