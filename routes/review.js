const express= require("express");
const router= express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn ,isReviewAuthor}= require("../middleware.js");


// review  post review // 
router.post("/",
  isLoggedIn,
  // validateReview,
  wrapAsync
  (async (req,res) => {
    let listing =  await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "new review created !");
    res.redirect(`/listings/${listing._id}`);
    }));
    
// delete review/
router.delete(
  "/:reviewid", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async (req, res)=>{
    let{id, reviewid}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "review deleted")
    res.redirect(`/listings/${id}`);
}));

module.exports = router ; 