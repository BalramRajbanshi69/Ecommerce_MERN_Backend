require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");     
const fs = require("fs");        

const app = express();
const dbConnect = require("./db/db")
const logger = require('./middleware/logger'); 
dbConnect();

let PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
  origin: ["https://ecommerce-mern-theta-kohl.vercel.app/"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));




// Define routes - combine and ensure correct middleware application
const productRoute = require("./routes/ProductRoute"); 
const cartRoute = require("./routes/Cart_route");

// Routes
app.use("/api/auth", require("./routes/Auth"));
app.use("/api/contact", require('./routes/Contact_route')); 
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use(logger);


app.get("/",(req,res)=>{
  res.send("Hello world!");
    console.log("hello world!");   
  
})

//start server
app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});