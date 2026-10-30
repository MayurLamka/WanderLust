const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwned, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listingController.js");



router.route("/")
    .get(wrapAsync(listingController.index)) //index route
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing)); 
//create route


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

//show route
router.get("/:id", wrapAsync(listingController.showListing));


//Edit rout
router.get("/:id/edit", isLoggedIn, isOwned, wrapAsync(listingController.editForm));

//update route
router.put("/:id", isLoggedIn, isOwned, validateListing, wrapAsync(listingController.updateRoute));

// delete route
router.delete("/:id", isLoggedIn, isOwned, wrapAsync(listingController.deleteListing));

module.exports = router;