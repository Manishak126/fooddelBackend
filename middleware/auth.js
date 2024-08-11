import jwt from "jsonwebtoken"
const authMiddleware = async (req,res, next)=>{
    const {token}= req.headers;
    if(!token){
        return res.json({success:false,message:"Not Authorized Login again"})
    }
    try{
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);//decoding the token

        req.body.userId = token_decode.id;//saving the token id after decoding the token into req.body.userId
        
        next();
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export default authMiddleware;