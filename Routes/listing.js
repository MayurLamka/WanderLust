const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwned, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listingController.js");



router.route("/")
    .get(wrapAsync(listingController.index)) //index route
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwned, validateListing, wrapAsync(listingController.updateRoute))
    .delete(isLoggedIn, isOwned, wrapAsync(listingController.deleteListing));


//Edit rout
router.get("/:id/edit", isLoggedIn, isOwned, wrapAsync(listingController.editForm));

module.exports = router;