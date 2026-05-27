const express=require("express");
const router=express.Router();

const wishlistController=require('../controllers/wishlist.controller')
const authMiddleware=require('../middlewares/auth.middleware')

router.post('/add-to-wishlist',authMiddleware.verifyUser,wishlistController.addToWishlist);
router.get('/get-wishlist',authMiddleware.verifyUser,wishlistController.getWishlist);
router.delete('/delete-from-wishlist',authMiddleware.verifyUser,wishlistController.deleteFromWishlist);

module.exports=router;