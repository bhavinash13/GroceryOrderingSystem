const mongoose=require('mongoose');
const categoryEnum=[
    "vegetables", "fruits", "diary", "food-grains", "drinks", "snacks"
];
const unitEnum=[
    "kg", "g", "pieces", "l", "ml",
];
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    category:{
        type:String,
        enum:categoryEnum,
        required:true,
    },
    unit:{
        type:String,
        enum:unitEnum,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    discountPrice:{
        type:Number,
        default:0,
    },
    stock:{
        type:Number,
        required:true,
        min:0,
        default:0
    },
    image:{
        type:String,
        default:""
    },
    imageFileId:{
        type:String,
        default:""
    },
    isAvailable:{
        type:Boolean,
        default:true,
    },
},{timestamps:true});

const productModel =mongoose.model("Product",productSchema);
module.exports=productModel;
