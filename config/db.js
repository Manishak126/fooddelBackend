import mongoose from "mongoose"

export const connectDB= async()=>{
    await mongoose.connect('mongodb+srv://manishakri126:manisha_123@cluster0.sufaw2b.mongodb.net/fooddelbackend').then(()=>console.log("Connected to database successfuly"))
} 