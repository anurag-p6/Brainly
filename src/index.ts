import express from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { userModel, contentModel } from "./db"
import bcrypt, { hash } from "bcrypt"
import { middleware } from "./middleware"
import dotenv from 'dotenv';

dotenv.config();
const jwtsecret = process.env.JWT_PASS;
const app = express();
app.use(express.json())
app.post("/api/v1/signup", async (req, res) => {

  const { username } = req.body;
  const { password } = req.body;

  const hashedpassword = await bcrypt.hash(password, 4)
  try {
    await userModel.create({
      username: username,
      password: hashedpassword
    })

    res.json({
      message: "Sign up sucessfully"
    })
  } catch (e) {
    res.status(411).json({
      message: "User already exists"
    })
  }
})

interface obj{
  username:string;
  password:any;
  _id:any
}

app.post("/api/v1/signin", async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;


  const existingUser:obj | null = await userModel.findOne({
    username,
  })

  if(!existingUser){
    res.status(411).json({
      message:"user not found"
    })
  }
   
  const isPasswordValid:boolean = await bcrypt.compare(password,existingUser?.password)
  
  if(isPasswordValid){
    const token:string = jwt.sign({
      //@ts-ignore
      id:existingUser._id,
      //@ts-ignore
  },jwtsecret)

    res.json({
      message:token
    })
  } else {
    res.status(403).json({
      message:"Incorrect password"
    })
  }
})


app.post("/api/v1/content",middleware, async (req, res) => {
     const link = req.body.link;
     const type = req.body.type;

     await contentModel.create({
      link,
      type,
      //@ts-ignore
      userId:req.userId,
      tags:[]
     })

     res.json({
      message:"content added"
     })
})

app.get("/api/v1/content", (req, res) => {

})

app.delete("/api/v1/content", (req, res) => {

})

app.post("/api/v1/brain/share", (req, res) => {

})

app.get("/apiv1/brain/:shareLink")

app.listen(3000);