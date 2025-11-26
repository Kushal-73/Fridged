import mongoose from "mongoose";
import hatch_pass from "../middleware/hatch_password.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  score:{
    type:Number,
    default:0,
  },
  items: [{
    name: { type: String, required: true },

    quantity: { 
      type: Number, 
      required: true,
      min: 0,
      validate: Number.isInteger
    }
  }],
},{ timestamps: true });

userSchema.pre('save', function(next) {
  this.items = this.items.filter(item => item.quantity >= 0);
  
  next();
});

userSchema.pre("save", hatch_pass);

const User = mongoose.model("User", userSchema);

export default User;
