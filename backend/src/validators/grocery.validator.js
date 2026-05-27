const {body,validationResult}=require('express-validator')
const validationMiddleware=require('../middlewares/validation.middleware');

const itemValidator=[
    body("name").trim().not().isEmpty().withMessage("Grocery name is required"),
    body("price").not().isEmpty().withMessage("Price is required").isFloat({min:0}).withMessage("Price must be a positive number"),
    body("unit").trim().not().isEmpty().withMessage("Unit is required"),
    body("category").trim().not().isEmpty().withMessage("Category is required"),
    body("brand").trim().not().isEmpty().withMessage("Brand is required"),
    body("stock").not().isEmpty().withMessage("Stock is required").isInt({min:0}).withMessage("Stock should be positive number"),

    validationMiddleware
];

module.exports={itemValidator};