const {body,validationResult} = require("express-validator");
const validationMiddleware = require('../middlewares/validation.middleware')

const registerValidator=[
    body("name").trim().not().isEmpty().withMessage("Name is required").isLength({min:3,max:30}).withMessage("Name must be between 3 and 30 characters"),
    body("email").trim().isEmail().toLowerCase().withMessage("Valid email is required").isLength({min:5,max:128}).withMessage("Email must be valid in characters"),
    body("phone").trim().not().isEmpty().withMessage("Phone number is required").isMobilePhone().withMessage("Invalid phone number"),
    body("password").isLength({min:8,max:64}).withMessage("Password must be between 8 and 64 characters").matches(/[A-Z]/).withMessage("Password must contain atleast one uppercase letter").matches(/[0-9]/).withMessage("Password must contain at lest one number"),

    validationMiddleware
];

const loginValidator=[
    body("email").isEmail().toLowerCase().withMessage("Valid email is required"),
    body("password").not().isEmpty().withMessage("Password is required"),

    validationMiddleware
];

module.exports={registerValidator,loginValidator};