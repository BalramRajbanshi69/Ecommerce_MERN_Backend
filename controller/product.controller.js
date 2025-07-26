const ProductModal = require("../model/ProductModal");

// const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"; 

exports.createProduct = async (req, res) => {
    const file = req.file;
    let imageFullPath;

    if (!file) {
        imageFullPath = "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";
    } else {

        imageFullPath = `/uploads/${req.file.filename}`;
    }

    const { name, description, price, inStock } = req.body;
    if (!name || !description || !price || !inStock) {
        return res.status(400).json({
            message: "Please provide all required fields: name, description, price, inStock",
        });
    }

    const productData = await ProductModal.create({
        user:req.user.id,
        name,
        description,
        price,
        inStock,
        productImage: imageFullPath
    });
    await productData.save();
    res.status(200).json({
        message: "Product added successfully",
        data: productData,
    });
};


    

    // get all products
exports.getAllProducts = async (req, res) => {
  try {
    const product = await ProductModal.find();
    res.json({
      message: "All products fetched successfully",
      data:product
    });
  } catch (error) {
    res.status(500).send("internal server error");
  }
};



// update product
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, description, inStock } = req.body;
    if (!name || !price || !description || !inStock) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const newProduct = {};
    if (name) newProduct.name = name;
    if (price) newProduct.price = price;
    if (description) newProduct.description = description;
    if (inStock) newProduct.inStock = inStock;
    let product = await ProductModal.findByIdAndUpdate(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (!product.user || product.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "You are not authorized" });
    }
    product = await ProductModal.findByIdAndUpdate(
      id,
      { $set: newProduct },
      { new: true }
    );
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}





// delete product 
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    let product = await ProductModal.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (!product.user || product.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "You are not authorized" });
    }
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}



// here need to get user specific products
exports.getUserProducts = async (req, res) => {
  try {
    const userId = req.user.id; // Fetch user ID from the request
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const products = await ProductModal.find({ user: userId });
    res.json({
      message:"fetched user products successfully",
      data:products
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};



// get product by id
exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductModal.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  } 
}


