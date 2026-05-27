const userModel=require('../models/user.model');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const sendMail=require('../services/mailSender.service');

async function sendOTP(email, otp){
    try{
        const to=email;
        const subject="Verification OTP for Grocery APP";
        const text=`<p>Your OTP for email verification is: <strong>${otp}</strong></p>`;
        await sendMail(to,subject,text);
        console.log("OTP sent successfully!");
    }catch(err){
        console.log("Error in sending OTP!",err);
    }
}

async function verifyOTP(req,res){
    try{
        const {email,otp}=req.body;
        const user= await userModel.findOne({email:email}).select("+otp +otpExpiry");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not exists!",
            })
        }
        if(user.isVerified){
            return res.status(400).json({
                success:false,
                message:"Email already verified!",
            })
        }
        const currentTime=new Date().getTime();
        if(user.otpExpiry < currentTime){
            return res.status(400).json({
                success:false,
                message:"OTP Expired, Register again!"
            })
        }
        const isOtpMatched=await bcrypt.compare(otp,user.otp);
        if(isOtpMatched){
            await userModel.findOneAndUpdate({email},{
                otp:null,otpExpiry:null,isVerified:true
            });
        }else{
            return res.status(400).json({
                success:false,
                message:"Invalid OTP!"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Email verified successfully!",
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to verify email!"
        })
    }
}

async function registerUser(req,res){
    try{
        console.log("Entered into registerUser controller!");
        const {name,email,phone,password}=req.body;
        if(!name || !email || !phone || !password){
            return res.status(400).json({
                success: false,
                message:"All fields are required!",
            })
        }
        const isUserAlreadyExists=await userModel.findOne({
            $or:[{email:email},{phone:phone}]
        });
        if(isUserAlreadyExists){
            if(isUserAlreadyExists.email==email){
                    return res.status(400).json({
                    success:false,
                    message:"Email already exists!"
                })
            }
            if(isUserAlreadyExists.phone==phone){
                return res.status(400).json({
                    success:false,
                    message:"Phone number already exists!"
                })
            }
        }
        const otp=parseInt(Math.random()*1000000);
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=await userModel.create({
            name:name,
            email:email,
            phone:phone,
            password:hashedPassword,
            otp: await bcrypt.hash(otp.toString(),10),
            otpExpiry:new Date().getTime() + 5*60*100,
        })
        console.log("Registration successful!");
        await sendOTP(email, otp.toString());
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:newUser,
        })

    }catch(err){
        console.log("Error in registering user!", err);
        res.status(500).json({
            success:false,
            message:"Unable to create a user!"
        })
    }
}

async function loginUser(req,res){
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Email and Password are required!",
            })
        }
        const user=await userModel.findOne({email:email}).select('+password');
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid Credentials!",
            })
        }
        if(!user.isVerified){
            return res.status(400).json({
                success:false,
                message:"Please verify your email first!"
            });
        }
        const isPasswordMatched=await bcrypt.compare(password,user.password);
        if(!isPasswordMatched){
            return res.status(400).json({
                success:false,
                message:"Invalid Credentials",
            })
        }
        const token=jwt.sign({id:user._id, role:user.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
        res.cookie("groceryToken",token,{
            httpOnly:true,
            sameSite:"lax",
            secure:false,
            path:"/"
        });
        res.status(200).json({
            success:true,
            message:"User logged in successfully!",
            data:{
                id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                role:user.role,
                token:token,
            }
        })
    }
    catch(err){
        console.log("Error in login user!",err);
        return res.status(500).json({
            success:false,
            message:"Unable to login user!"
        })
    }
}

async function logoutUser(req,res){
    try{
        res.clearCookie("groceryToken",{
            httpOnly:true,
            sameSite:"lax",
            secure:false,
            path:"/"
        });
        console.log("User logged out successfully!");
        res.status(200).json({
            success:true,
            message:"User logged out successfully!",
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to logout user!"
        })
    }
}


module.exports={registerUser,loginUser,logoutUser,verifyOTP};