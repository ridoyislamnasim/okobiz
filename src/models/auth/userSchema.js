import mongoose from "mongoose";
const Schema = mongoose.Schema
const Userschema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },

  
}, { timestamps: true });
export const UserSchema = mongoose.model("user", Userschema);

