const express=require("express");
const router=express.Router();

const cartController=require("../controllers/cart.controller")
const authMiddleware=require("../middlewares/auth.middleware")

router.post("/add-to-cart",authMiddleware.verifyUser,cartController.addToCart);
router.get('/get-cart',authMiddleware.verifyUser,cartController.getCart);
router.delete('/delete-from-cart',authMiddleware.verifyUser,cartController.deleteFromCart);
router.post('/buy-cart',authMiddleware.verifyUser,cartController.buyCart);

module.exports=router;