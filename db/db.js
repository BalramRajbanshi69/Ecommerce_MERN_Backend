const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL;

const dbConnect = ()=>{
  mongoose.connect(MONGO_URL).then(()=>{
    console.log('MongoDB connected Successfully');
  }).catch(()=>{
    console.log('Error connecting to MongoDB');
  })
}

module.exports = dbConnect