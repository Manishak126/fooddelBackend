import userModel from "../models/userModel.js"

// add items to user cart
const addToCart= async (req,res)=>{
    try{
      let userData = await userModel.findOne({ _id: req.body.userId }); //we are sending the decoded user id from token that we did in middleware
      let cartData = await userData.cartData;

      //if that item id is not available in the cart the user will create a new cart entry
      if (!cartData[req.body.itemId]) {
        cartData[req.body.itemId] = 1;
      }
      //   if that item id is available in the cart the user will increment the cart entry
      else {
        cartData[req.body.itemId] += 1;
      }

    //   finding the item by id and updating the cart data in userModel
      await userModel.findByIdAndUpdate(req.body.userId,{cartData});

      res.json({success:true,message:"Added to Cart"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

// remove items from user cart
const removeFromCart= async (req,res)=>{
    try {
        let userData= await userModel.findById(req.body.userId);
        let cartData= await userData.cartData;
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId]-=1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Removed from the cart"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

// fetch user cart data
const getCart = async(req,res)=>{
    try{
        let userData= await userModel.findById(req.body.userId);
        let cartData= await userData.cartData;
        res.json({success:true,cartData})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

export {addToCart, removeFromCart, getCart}