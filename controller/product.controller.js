const ProductModal = require("../model/ProductModal");
const fs = require("fs").promises;
const path = require("path");
const User = require("../model/User");

// const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"; 

exports.createProduct = async (req, res) => {
    const file = req.file;
    let imageRelativePath;

    if (!file) {
        imageRelativePath = "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";
    } else {

        imageRelativePath = `/uploads/${req.file.filename}`;
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
        productImage: [imageRelativePath]
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




// exports.updateProduct = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const { name, price, description, inStock } = req.body;
//         const newProduct = {};

//         // Find the existing product first to check authorization and old image
//         let product = await ProductModal.findById(id);

//         if (!product) {
//             return res.status(404).json({ error: "Product not found" });
//         }

//         if (!product.user || product.user.toString() !== req.user.id) {
//             return res.status(401).json({ error: "You are not authorized" });
//         }

//         // Update basic fields if provided
//         if (name) newProduct.name = name;
//         if (price) newProduct.price = price;
//         if (description) newProduct.description = description;
//         if (inStock) newProduct.inStock = inStock;

//         // Handle product image update
//         // Assuming req.file contains the new image details if uploaded
//         if (req.file) {
//             const newImagePath = req.file.path; // This is the path where multer saved the new image

//             // Check if there's an old image and it's not a default Unsplash URL
//             if (product.productImage && product.productImage[0] && !product.productImage[0].startsWith("https://")) {
//                 const oldFilePath = path.join(__dirname, "..", product.productImage[0]);
//                 try {
//                     // Check if the old image is different from the new one before deleting
//                     // This prevents deleting the file if the same file was uploaded again (though unlikely with unique filenames)
//                     if (oldFilePath !== newImagePath) { // Simple check, depends on how your `productImage[0]` is stored (relative or absolute)
//                         await fs.unlink(oldFilePath);
//                         console.log("Old file deleted successfully:", oldFilePath);
//                     }
//                 } catch (err) {
//                     console.error("Error deleting old file:", err);
//                     // Continue even if old file deletion fails to update the product
//                 }
//             }
//             // Update with the new image path
//             newProduct.productImage = [newImagePath.replace(/\\/g, '/')]; // Store as an array, normalize path for consistency
//         }

//         // Perform the update
//         product = await ProductModal.findByIdAndUpdate(
//             id,
//             { $set: newProduct },
//             { new: true } // Return the updated document
//         );

//         res.status(200).json({ success: true, data: product });
//     } catch (error) {
//         console.error("Update product error:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };


exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, description, inStock } = req.body;
    const newProduct = {};

    // Find the existing product
    let product = await ProductModal.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!product.user || product.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "You are not authorized" });
    }

    // Update basic fields if provided
    if (name) newProduct.name = name;
    if (price) newProduct.price = price;
    if (description) newProduct.description = description;
    if (inStock) newProduct.inStock = Number(inStock); // Ensure inStock is a number

    // Handle product image update
    if (req.file) {
      const newImagePath = `/Uploads/${req.file.filename}`; // Store relative path
      if (
        product.productImage &&
        product.productImage[0] &&
        !product.productImage[0].startsWith('https://')
      ) {
        const oldFilePath = path.join(__dirname, '..', product.productImage[0]);
        try {
          await fs.unlink(oldFilePath);
          console.log('Old file deleted successfully:', oldFilePath);
        } catch (err) {
          console.error('Error deleting old file:', err);
          // Continue even if deletion fails
        }
      }
      newProduct.productImage = [newImagePath]; // Store as array
    }

    // Perform the update
    product = await ProductModal.findByIdAndUpdate(
      id,
      { $set: newProduct },
      { new: true }
    );

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "Please provide id" });
        }

        const product = await ProductModal.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (!product.user || product.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "You are not authorized" });
        }

        // Delete associated image file if it exists and is not the default Unsplash URL
        if (product.productImage && product.productImage[0] && !product.productImage[0].startsWith("https://")) {
         const filePath = path.join(__dirname, "..", product.productImage[0]);  
             try {
                await fs.unlink(filePath);
                console.log("File deleted successfully:", filePath);
            } catch (err) {
                console.error("Error deleting file:", err);
            }
        }

         await User.updateMany(
            {}, // Match all users
            { $pull: { cart: { product: id } } } // Pull (remove) the item from the cart array where product matches the deleted product's ID
        );


        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



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


