import express from "express"
import { addFood, listFood, removeFood } from "../controllers/foodController.js"
import multer from "multer"//to store image

const foodRouter= express.Router();//Creating router

// Image Storage Engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{//cb->call back
        return cb(null, `${Date.now()}${file.originalname}`)//giving unique name to each image we are using template literal
    }
})

const upload = multer({storage:storage})

foodRouter.post("/add",upload.single("image") ,addFood)//using middleware to upload the image that we have created using the multer package

foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood)

export default foodRouter;