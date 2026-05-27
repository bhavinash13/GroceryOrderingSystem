const productModel=require('../models/product.model');
const {uploadImage,deleteImage} = require('../services/storage.service')

async function createProduct(req,res){
    try{
        console.log("Creating product..");
        const {name,description,price,category,unit,brand,discountPrice=0,stock}=req.body;
        let imageURL="";
        let imageFileId="";
        if(req.file){
            const uploadedImage=await uploadImage(req.file);
            imageURL=uploadedImage.url;
            imageFileId=uploadedImage.fileId;
        }
        console.log("Image uploaded..")
        const newProduct = await productModel.create({
            name,description,price,category,unit,brand,discountPrice,stock,image:imageURL,imageFileId
        });
        console.log("Product created!");
        return res.status(200).json({
            success:true,
            message:"Product created succesfully!"
        })
    }catch(err){
        console.log("Error in creating grocery product!", err);
        return res.status(500).json({
            success:false,
            message:"Unable to create grocery product"
        })
    }
}

async function getAllProducts(req,res){
    try{
        const allProducts=await productModel.find();
        return res.status(200).json({
            success:true,
            message:"All grocery products are fetched successfully!",
            products: allProducts,
        })
    }catch(err){
        console.log(" Failed to fetch the grocery products!");
        return res.status(500).json({
            success:false,
            message:"Unable to fetch all grocery products!"
        })
    }
}

async function getProduct(req,res){
    try{
        const id=req.params.id;
        const product=await productModel.findById(id);
        if(!product){
            return res.status(400).json({success:false, message:"Product not found"});
        }
        return res.status(200).json({success:true,message:"Product fetched successfully!",product:product});
    }catch(err){
        return res.status(500).json({success:false,message:"Unable to fetch product",err});
    }
}

async function getProductsByCategory(req,res){
    try{
        const {category}=req.params.category;
        const products=await productModel.find({category:category});
        return res.status(200).json({success:true, message:"Products fetched successfully!",products});
    }catch(err){
        return res.status(500).json({success:false,message:"Unable to fetch category products"});
    }
}

async function updateProduct(req,res){
    try{
        const id=req.params.id;
        const data=req.body;
        const product=await productModel.findById(id);
        if(!product){
            return res.status(400).json({success:false,message:"Product not exists!"});
        }
        if(req.file){
            return res.status(400).json({success:false,message:"Image updation is not allowed"});
        }
        const updatedProduct=await productModel.findByIdAndUpdate(id,data,{returnDocument:"after",runValidators:true});
        console.log("Product details updated successfully!");
        return res.status(200).json({
            success:true,
            message:"Product updated successfully!",
            data:updatedProduct,
        })
    }catch(err){
        console.log("Error in updating product details!",err);
        return res.status(500).json({
            success:false,
            message:"Unable to update product"
        })
    }
}

async function deleteProduct(req,res){
    try{
        const id=req.params.id;
        const deletedProduct=await productModel.findByIdAndDelete(id);
        if(!deletedProduct){
            return res.status(400).json({success:false,message:"Product not found!"});
        }
        if(deletedProduct.imageFileId){
            await deleteImage(deletedProduct.imageFileId);
        }
        return res.status(200).json({
            success:true,
            message:"Product deleted successfully!",
            data:deletedProduct,
        });
    }catch(err){
        console.log("Error in deleting a grocery product!",err);
        return res.status(500).json({
            success:false,
            message:"Failed to delete the product!",
        });
    }
}

module.exports={createProduct,getAllProducts,getProduct,getProductsByCategory,updateProduct,deleteProduct};