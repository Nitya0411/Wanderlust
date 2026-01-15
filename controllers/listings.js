const Listing=require("../models/listing");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

module.exports.index=async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("./listings/index.ejs",{allListing});
    
};

module.exports.searchListings = async (req, res) => {
    const { location } = req.query;
    const allListing = await Listing.find({ location: new RegExp(location, 'i') });
    if(allListing.length==0){
        req.flash("error",`No listings found for ${location}`);
        return res.redirect("/listings");
    }
    
    res.render("./listings", { allListing, location });
};

module.exports.categoryListings = async (req, res) => {
    const { category } = req.params;
    const allListing = await Listing.find({ category });
    if (allListing.length === 0) {
        req.flash("error", `No listings found for ${category}`);
        return res.redirect("/listings");
    }
    res.render("./listings", { allListing, category });
};

module.exports.renderNewForm=(req,res)=>{
    res.render("./listings/new.ejs");
};


module.exports.createListing=async (req,res,next)=>{
      let response=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
    limit: 1
 })
    .send();

    const listing=new Listing(req.body.listing);
        if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    listing.owner=req.user._id;
    listing.geometry=response.body.features[0].geometry;
    console.log("GEOMETRY SAVED:", listing.geometry);
    await listing.save();
    req.flash("success","New listing created successfully!");
    res.redirect("/listings");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Requested listing does not exist!");
        return  res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
    
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Requested listing does not exist!");
        return res.redirect("/listings");
    }
    let originalImage=listing.image.url;
   originalImage = originalImage.replace("/upload", "/upload/w_250,h_300,c_fill");

    res.render("./listings/edit.ejs",{listing,originalImage});};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    let listing = await Listing.findById(id);

    // Geocode the new location
    if (req.body.listing.location) {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        }).send();
        listing.geometry = response.body.features[0].geometry;
    }

    // Update other fields
    listing.set(req.body.listing);
    
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

