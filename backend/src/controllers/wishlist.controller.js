const wishlistModel=require('../models/wishlist.model');

async function addToWishlist(req,res){
    try{
        const userId=req.user.id;
        const {productId}=req.body;
        if(!productId){
            return res.status(400).json({success:false,message:"Can't find the product"});
        }
        let wishlist=await wishlistModel.findOne({userId:userId});
        if(!wishlist){
            wishlist=await wishlistModel.create({userId:userId,products:[
                {productId:productId}
            ]})
            return res.status(200).json({success:true,message:"Product added succcessfully!"});
        }
        const existingProduct=wishlist.products.find(item=>item.productId.toString()===productId);
        if(existingProduct){
            return res.status(400).json({success:false,message:"Product already exists!"});
        }
        wishlist.products.push({
            productId
        });
        await wishlist.save();
        return res.status(200).json({success:true,message:"Product added to wishlist successfully!"});
    }catch(err){
        return res.status(500).json({success:false,message:"Product unablt to add to wishlist!"});
    }
}

async function getWishlist(req,res){
    try{
        const userId=req.user.id;
        const wishlist=await wishlistModel.findOne({userId:userId}).populate("products.productId");
        if(!wishlist){
            return res.status(400).json({success:false,message:"No products in wishlist"});
        }
        return res.status(200).json({success:true,message:"Products from wishlist fetched succesfully!",wishlist});
    }catch(err){
        return res.status(500).json({success:false,message:"Unablt to fetch products from wishlist!",err});
    }
}

async function deleteFromWishlist(req,res){
    try{
        const userId=req.user.id;
        const {productId}=req.body;
        if(!productId){
            return res.status(400).json({successs:false,message:"Product not found!"});
        }
        const wishlist=await wishlistModel.findOne({userId:userId});
        if(!wishlist){
            return res.status(400).json({success:false,message:"No products in wishlist!"});
        }
        wishlist.products=wishlist.products.filter(item=>item.productId.toString()!==productId);
        await wishlist.save();
        return res.status(200).json({success:true,message:"Product deleted from wishlist successfully!"});
    }catch(err){
        return res.status(500).json({success:false,message:"Unable to delet product from wishlist"});
    }
}


module.exports={addToWishlist,getWishlist,deleteFromWishlist};