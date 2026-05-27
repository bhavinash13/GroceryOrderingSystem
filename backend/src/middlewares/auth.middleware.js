const jwt=require('jsonwebtoken')

function extractToken(req){
    if(req.cookies && req.cookies.groceryToken) return req.cookies.groceryToken;
    const auth=req.headers['authorization'];
    if(auth && auth.startsWith('Bearer ')) return auth.slice(7);
    return null;
}

async function verifyUser(req,res,next){
    try{
        const token=extractToken(req);
        if(!token){
            return res.status(401).json({success:false,message:"Please Login first!"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }catch(err){
        return res.status(401).json({success:false,message:"Session expired, please login again!"});
    }
}

async function verifyAdmin(req,res,next){
    try{
        const token=extractToken(req);
        if(!token){
            return res.status(401).json({success:false,message:"Please login as an Admin!"})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(decoded.role!=='admin' && decoded.role!=='super_admin'){
            return res.status(403).json({success:false, message:"Admin access required!"})
        }
        req.user=decoded;
        next();
    }catch(err){
        return res.status(401).json({success:false, message:"Session expired, please login again!"});
    }
}

module.exports={verifyUser, verifyAdmin};