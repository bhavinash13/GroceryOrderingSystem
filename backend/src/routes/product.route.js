const express=require('express');
const router=express.Router();

const productController=require('../controllers/product.controller');
const upload=require('../middlewares/multer.middleware');
const groceryValidator=require('../validators/grocery.validator');
const authMiddleware=require('../middlewares/auth.middleware');

router.post('/create-product',authMiddleware.verifyAdmin,upload.single("image"),groceryValidator.itemValidator,productController.createProduct);
router.get('/get-all-products',productController.getAllProducts);
router.get('/get-product/:id',productController.getProduct);
router.get('/get-products-by-category/:category',productController.getProductsByCategory);
router.post('/update-product/:id',authMiddleware.verifyAdmin,upload.single("image"),productController.updateProduct);
router.delete('/delete-product/:id',authMiddleware.verifyAdmin,productController.deleteProduct);


module.exports=router;