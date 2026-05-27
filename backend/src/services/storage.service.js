const ImageKit=require("imagekit")
const ImageKitClient=new ImageKit({
    urlEndpoint:process.env.IMAGEKIT_ENDPOINT,
    publicKey:process.env.IMAGEKIT_PUBLICKEY,
    privateKey:process.env.IMAGEKIT_PRIVATEKEY,
});

async function uploadImage(file){
    try{
        console.log("Inside uploadImage service!");
        const response=await ImageKitClient.upload({
            file:file.buffer,
            fileName: Date.now()+"-"+file.originalname,
            folder:"/Tracex_Grocery_App/products"
        });
        console.log("Image uploaded in service!");
        return response;
    }catch(err){
        console.log("Error in uploading the image to imagekit!",err);
        throw err;
    }
}

async function deleteImage(fileId){
    try{
        await ImageKitClient.deleteFile(fileId);
        console.log("Image deleted successfully!");
    }catch(err){
        console.log("Error in deleting the image from imagekit!", err);
    }
}
module.exports={uploadImage,deleteImage};