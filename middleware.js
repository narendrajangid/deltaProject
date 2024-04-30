// // const passport = require("passport");
// // const LocalStrategy = require("passport-local");
const Listing = require("./models/listing")
const Review = require("./models/review.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js")



// const validateListing = (req, res, next)=> {
//     let {error} = reviewSchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }       
// }


// listing owner//
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  console.log("Listing:", listing);
  console.log("Listing owner:", listing && listing.owner);
  console.log("Current user:", res.locals.currUser);
  if (!listing ||!listing.owner) {
    req.flash("error", "Cannot find that listing or it has no owner!");
    return res.redirect("/listings");
  }
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// module.exports.validateListing = (req, res, next) =>{
//     let{error}= listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }else {
//         next();
//     }
// };

// module.exports.validateReview = (req, res, next)=> {
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }       
// }


module.exports.isLoggedIn = (req ,res, next) => {
  // console.log(req.path ,"..", req.originalUrl )
  if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
      req.flash("error", "you must be logged in first")
      res.redirect("/login");
  } else {
      next();     
  }
}


module.exports.saveRedirectUrl = (req,res,next) => {
  if (req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}


module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewid } = req.params;
  const review = await Review.findById(reviewid);
  if (!review) {
    req.flash("error", "Cannot find that review!");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not authorized to do that!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};