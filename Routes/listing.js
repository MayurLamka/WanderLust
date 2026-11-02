const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwned, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listingController.js");
const multer = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage})



router.route("/")
    .get(wrapAsync(listingController.index)) //index route
    .post(isLoggedIn,  upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

//Search route
router.get("/search", wrapAsync(listingController.searchDestination));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

//filter route
router.get("/category/:category", wrapAsync(listingController.filterCategory));

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwned, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateRoute))
    
    .delete(isLoggedIn, isOwned, wrapAsync(listingController.deleteListing));


//Edit rout
router.get("/:id/edit", isLoggedIn, isOwned, wrapAsync(listingController.editForm));

module.exports = router;