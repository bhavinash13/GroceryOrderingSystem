const cartModel=require('../models/cart.model')
const userModel=require('../models/user.model')
const sendMail=require('../services/mailSender.service');

async function addToCart(req,res){
    try{
        const userId=req.user.id;
        const {productId}=req.body;
        if(!productId){
            return res.status(400).json({success:false,message:"product not found"})
        }
        let cart=await cartModel.findOne({userId:userId});
        if(!cart){
            cart=await cartModel.create({
                userId:userId,
                products:[
                    {
                        productId,
                        quantity:1
                    }
                ]
            });
            return res.status(200).json({success:true,message:"Product added to cart!"});
        }
        const existingProduct=cart.products.find(item=>item.productId.toString()===productId);
        if(existingProduct){
            existingProduct.quantity+=1;
        }else{
            cart.products.push({
                productId,
                quantity:1
            });
        }
        await cart.save();
        return res.status(200).json({success:true,message:"Product added successfully!"});
    }catch(err){
        return res.status(500).json({success:false,message:"Unable to add to Cart!",err});
    }
}

async function getCart(req,res){
    try{
        const userId=req.user.id;
        const cart=await cartModel.findOne({userId}).populate("products.productId");
        return res.status(200).json({success:true,message:"Product fetched successfully!",cart});
    }catch(err){
        return res.status(500).json({success:false,message:"Unable to get Cart Item!"});
    }
}

async function deleteFromCart(req,res){
    try{
        const userId=req.user.id;
        const {productId}=req.body;
        const cart=await cartModel.findOne({userId});
        if(!cart){
            return res.status(400).json({success:false,message:"Cart not found!"});
        }
        cart.products=cart.products.filter(item=>item.productId.toString()!==productId);
        await cart.save();
        return res.status(200).json({success:true,message:"Product removed from cart",cart});
    }catch(err){
        return res.status(500).json({success:false,message:"Unable to remove product!"});
    }
}

async function buyCart(req,res){
    try{
        const userId=req.user.id;
        const user=await userModel.findById(userId);
        const userName=user.name;
        const userEmail=user.email;
        const {address}=req.body;
        const cart=await cartModel.findOne({userId}).populate("products.productId");
        if(!cart || cart.products.length===0){
            return res.status(400).json({success:false, message:"Order cannot be placed with empty cart!"});
        }
        let orderDetails="";
        cart.products.forEach((item,index)=>{
            orderDetails+=`
            ${index+1}. Product: ${item.productId.name}
            Quantity: ${item.quantity}
            Price: Rs.${item.productId.price}
            `;
        });
        const subject=`New Grocery Order from ${userName}`;
        const text=`
            A new grocery order has been placed.
            Customer Name: ${userName}
            Customer Email: ${userEmail}
            Delivery Address: ${address}

            Ordered Products: ${orderDetails}
            Please prepare for delivery.
        `;
        await sendMail(process.env.EMAIL,subject,text);
        cart.products=[];
        await cart.save();
        return res.status(200).json({
            success:true,
            message:"Order placed successfully!"
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Unable to place order!"});
    }
}


module.exports={addToCart,getCart,deleteFromCart, buyCart};