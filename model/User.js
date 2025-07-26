const mongoose = require('mongoose');
const {Schema} = mongoose;
const UserSchema = new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
    },
     cart:[
        {
        quantity:{
            type:Number,
            required:true
        },
        product:{type:Schema.Types.ObjectId, ref:"Product"}
    }],
  date:{
    type:Date,
    default:Date.now
  }
});

const User = mongoose.model('User', UserSchema); 
module.exports = User;