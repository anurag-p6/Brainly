import express from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { userModel, contentModel, linkModel } from "./db"
import bcrypt, { hash } from "bcrypt"
import { userMiddleware } from "./middleware"
import dotenv from 'dotenv';
import { random } from "./utils"
import cors from "cors"

dotenv.config();
const jwtsecret = process.env.JWT_PASS;
const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  const hashedpassword = await bcrypt.hash(password, 4)
  try {
    await userModel.create({
      username: username,
      password: hashedpassword
    })

    res.status(201).json({
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
    return ;
  }
   
  const isPasswordValid:boolean = await bcrypt.compare(password,existingUser?.password)
  
  if(isPasswordValid){
    const token:string = jwt.sign({
      //@ts-ignore
      id:existingUser._id,
      //@ts-ignore
  },jwtsecret)

    res.json({
      token:token
    })
  } else {
    res.status(403).json({
      message:"Incorrect password"
    })
  }
})


app.post("/api/v1/content",userMiddleware, async (req, res) => {
     const link = req.body.link;
     const title = req.body.title;
     const type = req.body.type;

     await contentModel.create({
      link,
      type,
      title,
      //@ts-ignore
      userId:req.userId,
      tags:[]
     })

     res.json({
      message:"content added"
     })
})

app.get("/api/v1/content",userMiddleware,async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    
    const content = await contentModel.find({
      userId:userId,
    }).populate("userId","username")

    res.json({
      content,
    })
})

app.delete("/api/v1/content",userMiddleware, async (req, res) => {
  const {contentId} = req.body;
  await contentModel.deleteOne({
    contentId,
    //@ts-ignore
    userId:req.userId,
  })

  res.json({
    message:"content deleted sucessfully"
  })
    
})

app.post("/api/v1/brain/share",userMiddleware, async (req, res) => {
   const share = req.body.share;

   if(share){
    const existingLink = await linkModel.findOne({
      //@ts-ignore
      userId:req.userId
    });

    if(existingLink){ 
      res.json({
        hash:existingLink.hash,
      })
      return;
    }

    const hash = random(10);
    await linkModel.create({
      //@ts-ignore
      userId:req.userId,
      hash,
    })

    res.json({
      hash:hash,
    });

   } else {
     await linkModel.deleteOne({
      //@ts-ignore
      userId:req.userId,
     });
   }

   res.json({
    message:"updated sharable link"
   })
})

app.get("/api/v1/brain/:shareLink",userMiddleware, async (req,res) => {
  const hash = req.params.shareLink;

  const link = await linkModel.findOne({
    hash,
  });

  if(!link){
    res.status(411).json({
      message:"Sorry incorrect input"
    })
    return;
  }

  const content = await contentModel.find({
    userId:link.userId,
  });

  const user = await userModel.findOne({
    _id:link.userId,
  });

  res.json({
    username:user?.username,
    content:content,
  })
})

app.listen(3000,() => {
  console.log("Listenn at port 3000")
});