import mongoose,{model,Schema} from "mongoose"

mongoose.connect("mongodb+srv://anurag:lvPAOjmTC9fKK0gF@cluster0.yovxw.mongodb.net/Brainly")

const userSchema = new Schema({
  username: {type:String, unique:true},
  password: String
})

export const userModel = model("user",userSchema)