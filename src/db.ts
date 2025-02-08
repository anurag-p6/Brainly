import mongoose,{model,Schema} from "mongoose"
import { ObjectId } from "mongoose"

mongoose.connect("mongodb+srv://anurag:lvPAOjmTC9fKK0gF@cluster0.yovxw.mongodb.net/Brainly")

const userSchema = new Schema({
  username: {type:String, unique:true},
  password: {type:String,require:true},
})

const contentSchema = new Schema({
  title:String,
  link:String,
  tags:[{type:mongoose.Types.ObjectId, ref:'Tag'}],
  type:String,
  userId:{type:mongoose.Types.ObjectId, ref:'users',required:true}
})

const linkSchema = new Schema({
  hash:String,
  userId:{type:mongoose.Types.ObjectId,ref:'users',req:true}
})

export const userModel = model("users",userSchema);
export const contentModel = model("contents",contentSchema)
export const linkModel = model("links",linkSchema)