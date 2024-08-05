import userModel from "../models/userModel.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Login User
const loginUser=async (req, res)=>{
    const {email,password}=req.body;
    try {
        const user= await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"User doesn't exist"})
        }
        
        // password->Entered by the user, user.password->password stored in the database

        const isMatch= await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.json({success:false,message:"Invalid Credentials"})
        }

        const token = createToken(user._id)
        return res.json({success:true,token})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

// Register User
const registerUser=async (req,res)=>{
    const { name, password, email } = req.body;
    try {
      // Checking if user already exists
      const exist = await userModel.findOne({ email });
      if (exist) {
        return res.json({ success: false, message: "User already exists" });
      }

      // Validating email format and strong password
      if (!validator.isEmail(email)) {
        return res.json({
          success: false,
          message: "Please enter valid a email",
        });
      }

      if (password.length < 8) {
        return res.json({
          success: false,
          message: "Please enter a strong password",
        });
      }

      // Encrypting the password ->no b/w 5-15 higher number strongest password
      const salt = await bcrypt.genSalt(10);

      // Hashing password using salt
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new userModel({
        name: name,
        email: email,
        password: hashedPassword,
      });

      const user = await newUser.save();
      const token = createToken(user._id);

      res.json({ success: true, token });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
    }

}

export { loginUser, registerUser };