require("dotenv").config();
const app= require('./src/app');
const connectDB=require('./src/db/db');

async function connectDBAndStartServer(){
    try{
        await connectDB();
        app.listen(process.env.PORT,()=>{
            console.log(`Server started and running on port: ${process.env.PORT}`);
        });
    }catch(err){
        console.log("Error while starting server:",err);
    }
}

connectDBAndStartServer();
