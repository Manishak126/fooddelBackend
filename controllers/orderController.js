import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user Order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:3000"

  try {
    console.log("Received Order Data: ",req.body);
    
    // Creating new User
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    // Saving the order in database
      const savedOrder = await newOrder.save();
      console.log("Order saved successfully:", savedOrder);

    // Cleaning users cart data
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // using user items and creating line_items needed for the stripe payment.
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price*100,
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2*100,
      },
      quantity: 1,
    });

    mongoose.set("debug", true);
    // console.log("Line Items:", line_items);
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });
    res.json({success:true,session_url:session.url})
  } catch (error) {
    console.log("Error placing order",error.message);
    res.status(500).json({success:false,message:error.message})
  }

  // console.log("stripe session: ", session);
};

const verifyOrder = async(req, res)=>{
      const {orderId, success} = req.body;
      try{
        if(success=="true"){
          await orderModel.findByIdAndUpdate(orderId, {payment:true})
          res.json({success:true,message:"paid"})
        }
        else{
          await orderModel.findByIdAndDelete(orderId)
          res.json({success:false,message:"Not Paid"})
        }
      }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
      }
}

// User Orders for frontend
const userOrders = async (req, res)=>{
  try {
    const orders = await orderModel.find({userId:req.body.userId})//we will get user Id from the middleware
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// Listing Orders for admin pannel
const listOrders = async(req, res) =>{
  try {
    const orders= await orderModel.find({});
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
  }
}

// api for updating order status
const updateStatus = async(req, res) =>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    res.json({success:true,message:"status updated"})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:message.error})
  }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };