const mongoose=require('mongoose');
const validator=require('validator');
const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim:true,
        minlength:3,
        maxlength:30
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        index:true,
        validate:{
            validator: validator.isEmail,
            message:'Invalid mail format',
        },
    },
    phone:{
        type:String,
        required:true,
        unique:true,
        trim: true,
    },
    password:{
        type:String,
        required:true,
        minlength: 8,
        select: false,
    },
    role:{
        type:String,
        default:'customer',
        enum:['customer','admin','super_admin','delivery_agent']
    },
    otp:{
        type:String,
        default:null,
        select:false,
    },
    otpExpires:{
        type:Date,
        default:null,
        select:false,
    },
    isVerified:{
        type:Boolean,
        default:false,
    }

},{timestamps:true});

const userModel = new mongoose.model("User",userSchema);
module.exports=userModel;