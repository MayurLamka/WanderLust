const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});

    res.render("./listing/index.ejs", { allListings })
}

module.exports.renderNewForm = (req, res) => {

    res.render("./listing/new.ejs")
}

module.exports.showListing = async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", populate: {
                path: "author",
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }

    res.render("listing/show.ejs", { listing })

}

module.exports.createListing = async (req, res, next) => {

    let url = req.file.path;
    let filename = req.file.filename;


    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("Success", "New listing created");
    res.redirect("/listings")

}

module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    const lowQualityImageUrl = originalImageUrl.replace(
        "/upload/",
        "/upload/w_250/"
    );

    
    res.render("listing/edit.ejs", { listing, lowQualityImageUrl });
}

module.exports.updateRoute = async (req, res) => {
    let { id } = req.params;


    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save()
    }

    req.flash("Success", "Listing updated");

    res.redirect(`/listings/${id}`)

}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("Success", "Listing deleted");
    res.redirect("/listings");
}