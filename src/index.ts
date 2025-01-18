import express from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import {userModel} from "./db"


const app = express();
app.use(express.json())
app.post("/api/v1/signup", (req,res) => {

   const {username} = req.body;
   const {password}= req.body;

   userModel.create({
    username:username,
    password:password
   })

   res.json({
     message:"Sign up sucessfully"
   })
})

app.post("/api/v1/signin", (req,res) => {

})

app.post("/api/v1/content", (req,res) => {

})

app.get("/api/v1/content", (req,res) => {

})

app.delete("/api/v1/content", (req,res) => {

})

app.post("/api/v1/brain/share",(req,res) => {

})

app.get("/apiv1/brain/:shareLink")

app.listen(3000);