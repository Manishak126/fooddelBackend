import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    cartData:{type:Object,default:{}},
},{minimize:false})//if the minimize is not false then this cart data will not be created incase there is no data provided

const userModel= mongoose.models.user|| mongoose.model("user", userSchema);
export default userModel;