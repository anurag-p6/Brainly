import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"


interface CustomRequest extends Request {
  userId?: string;
}
dotenv.config();
export const userMiddleware:any = (req:CustomRequest,res:Response,next:NextFunction) => {
    const token = req.headers["authorization"];
    //@ts-ignore
    const decoded = jwt.verify(token,process.env.JWT_PASS)
    if(decoded){
   //@ts-ignore
      req.userId = decoded.id;
      next();

    } else{
      res.status(403).json({
        message:"You are not logged in"
      })
    }
}