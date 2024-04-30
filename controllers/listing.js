const Listing = require("../models/listing");

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.newRoute = (req,res) => {
    res.render("listings/new.ejs")
 }


module.exports.showRoute = async (req,res) => {
    let { id } = req.params;
        const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
        if(!listing){
            req.flash("error", "Cannot find that listing!");
            return res.redirect("/listings");
        }
        res.render('listings/show.ejs', {listing});
}

// module.exports.createRoute = async (req,res) =>{
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id
//     await newListing.save();
//     req.flash("success", "Successfully made a new listing!");
//     res.redirect("/listings");
// }

// module.exports.editRoute =async (req,res) =>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     if(!listing){
//         req.flash("error", "Cannot find that listing!");
//         return res.redirect("/listings");
//     }
//     res.render("listings/edit.ejs", { listing })
// }

// module.exports.updateRoute = async (req,res) => {
//     if(!req.body.listing){
//         throw new ExpressError(400, "send valid data for listing");
//     }
//     let {id} = req.params
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     req.flash("success", "Successfully updated listing!");
//     res.redirect("/listings")
// }

// module.exports.deleteRoute = async (req ,res) => {
//     let {id} = req.params;
//     const deletedlisting = await Listing.findByIdAndDelete(id);
//     req.flash("success",  "listing deleted !");
//     res.redirect("/listings");
//     console.log(deletedlisting);
// }