const express= require("express");
const router= express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("../schema.js");
const listingController = require("../controllers/listing.js")
const {isLoggedIn ,isOwner}= require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

// index route
router.get("/", wrapAsync(listingController.index));

// new route
router.get("/new", isLoggedIn, listingController.newRoute);


// show route
router.get('/:id',wrapAsync(listingController.showRoute));

//create listing
router.post("/", 
  isLoggedIn,
  upload.single("listing[image]"),
//  validateListing,
  async (req,res,next) =>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
});

//edit route
router.get("/:id/edit",
isLoggedIn, 
isOwner,
//  validateListing,
wrapAsync( 
    async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl })
}));

//update route
router.put("/:id", 
isLoggedIn,
isOwner,
upload.single("listing[image]"),
//   validateListing,
wrapAsync
(async (req,res) => {
    let {id} = req.params
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Successfully updated listing!");
    res.redirect("/listings")
}));

//delete route
router.delete("/:id",
isLoggedIn, 
//   validateListing,
isOwner,
wrapAsync
( async (req ,res) => {
    let {id} = req.params;
    const deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success",  "listing deleted !");
    res.redirect("/listings");
    console.log(deletedlisting);
}));

module.exports = router ; 
