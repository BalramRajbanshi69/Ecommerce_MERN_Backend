// const ProductModal = require("../model/ProductModal");
// const fs = require("fs").promises;
// const path = require("path");
// const User = require("../model/User");
// const cloudinary = require("cloudinary").v2;

// // const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"; 

// exports.createProduct = async (req, res) => {
//   const userId = req.user?.id
//    let imageURL;

//     if (!req.file) {
//         imageURL = "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";
//     } else {

//         imageURL = req.file.path;
//     }

//     const { name, description, price, inStock } = req.body;
//     if (!name || !description || !price || !inStock) {
//         return res.status(400).json({
//             message: "Please provide all required fields: name, description, price, inStock",
//         });
//     }

//     const productData = await ProductModal.create({
//         user:userId,
//         name,
//         description,
//         price,
//         inStock,
//         productImage: [imageURL]
//     });
//     await productData.save();
//     res.status(200).json({
//         message: "Product added successfully",
//         data: productData,
//     });
// };


    






// // exports.updateProduct = async (req, res) => {
// //     try {
// //         const id = req.params.id;
// //         const { name, price, description, inStock } = req.body;
// //         const newProduct = {};

// //         // Find the existing product first to check authorization and old image
// //         let product = await ProductModal.findById(id);

// //         if (!product) {
// //             return res.status(404).json({ error: "Product not found" });
// //         }

// //         if (!product.user || product.user.toString() !== req.user.id) {
// //             return res.status(401).json({ error: "You are not authorized" });
// //         }

// //         // Update basic fields if provided
// //         if (name) newProduct.name = name;
// //         if (price) newProduct.price = price;
// //         if (description) newProduct.description = description;
// //         if (inStock) newProduct.inStock = inStock;

// //         // Handle product image update
// //         // Assuming req.file contains the new image details if uploaded
// //         if (req.file) {
// //             const newImagePath = req.file.path; // This is the path where multer saved the new image

// //             // Check if there's an old image and it's not a default Unsplash URL
// //             if (product.productImage && product.productImage[0] && !product.productImage[0].startsWith("https://")) {
// //                 const oldFilePath = path.join(__dirname, "..", product.productImage[0]);
// //                 try {
// //                     // Check if the old image is different from the new one before deleting
// //                     // This prevents deleting the file if the same file was uploaded again (though unlikely with unique filenames)
// //                     if (oldFilePath !== newImagePath) { // Simple check, depends on how your `productImage[0]` is stored (relative or absolute)
// //                         await fs.unlink(oldFilePath);
// //                         console.log("Old file deleted successfully:", oldFilePath);
// //                     }
// //                 } catch (err) {
// //                     console.error("Error deleting old file:", err);
// //                     // Continue even if old file deletion fails to update the product
// //                 }
// //             }
// //             // Update with the new image path
// //             newProduct.productImage = [newImagePath.replace(/\\/g, '/')]; // Store as an array, normalize path for consistency
// //         }

// //         // Perform the update
// //         product = await ProductModal.findByIdAndUpdate(
// //             id,
// //             { $set: newProduct },
// //             { new: true } // Return the updated document
// //         );

// //         res.status(200).json({ success: true, data: product });
// //     } catch (error) {
// //         console.error("Update product error:", error);
// //         res.status(500).json({ error: "Internal server error" });
// //     }
// // };


// exports.updateProduct = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { name, price, description, inStock } = req.body;
//     const newProduct = {};

//     // Find the existing product
//     let product = await ProductModal.findById(id);
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     if (!product.user || product.user.toString() !== req.user.id) {
//       return res.status(401).json({ error: "You are not authorized" });
//     }

//     // Update basic fields if provided
//     if (name) newProduct.name = name;
//     if (price) newProduct.price = price;
//     if (description) newProduct.description = description;
//     if (inStock) newProduct.inStock = Number(inStock); // Ensure inStock is a number

//     // Handle product image update
//     if (req.file) {
//       const newImagePath = `/Uploads/${req.file.filename}`; // Store relative path
//       if (
//         product.productImage &&
//         product.productImage[0] &&
//         !product.productImage[0].startsWith('https://')
//       ) {
//         const oldFilePath = path.join(__dirname, '..', product.productImage[0]);
//         try {
//           await fs.unlink(oldFilePath);
//           console.log('Old file deleted successfully:', oldFilePath);
//         } catch (err) {
//           console.error('Error deleting old file:', err);
//           // Continue even if deletion fails
//         }
//       }
//       newProduct.productImage = [newImagePath]; // Store as array
//     }

//     // Perform the update
//     product = await ProductModal.findByIdAndUpdate(
//       id,
//       { $set: newProduct },
//       { new: true }
//     );

//     res.status(200).json({ success: true, data: product });
//   } catch (error) {
//     console.error('Update product error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// exports.deleteProduct = async (req, res) => {
//     try {
//         const id = req.params.id;
//         if (!id) {
//             return res.status(400).json({ error: "Please provide id" });
//         }

//         const product = await ProductModal.findByIdAndDelete(id);
//         if (!product) {
//             return res.status(404).json({ error: "Product not found" });
//         }

//         if (!product.user || product.user.toString() !== req.user.id) {
//             return res.status(401).json({ error: "You are not authorized" });
//         }

//         // Delete associated image file if it exists and is not the default Unsplash URL
//         if (product.productImage && product.productImage[0] && !product.productImage[0].startsWith("https://")) {
//          const filePath = path.join(__dirname, "..", product.productImage[0]);  
//              try {
//                 await fs.unlink(filePath);
//                 console.log("File deleted successfully:", filePath);
//             } catch (err) {
//                 console.error("Error deleting file:", err);
//             }
//         }

//          await User.updateMany(
//             {}, // Match all users
//             { $pull: { cart: { product: id } } } // Pull (remove) the item from the cart array where product matches the deleted product's ID
//         );


//         res.status(200).json({
//             success: true,
//             message: "Product deleted successfully",
//         });
//     } catch (error) {
//         console.error("Delete product error:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };



const ProductModal = require("../model/ProductModal");
const User = require("../model/User");
const cloudinary = require("cloudinary").v2;

exports.createProduct = async (req, res) => {
  try {
    const userId = req.user?.id;
    let imageURL;
    let publicId = null;

    // Check if a file was uploaded via multer-cloudinary
    if (!req.file) {
      // If no file, use a default placeholder image URL
      imageURL = "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";
    } else {
      // If a file was uploaded, multer-cloudinary stores the Cloudinary URL in req.file.path
      imageURL = req.file.path;
      // The public_id is typically stored in req.file.filename by multer-storage-cloudinary
      publicId = req.file.filename;
    }

    const { name, description, price, inStock } = req.body;
    if (!name || !description || !price || !inStock) {
      // If required fields are missing but an image was uploaded, delete the orphaned image from Cloudinary
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
        console.warn("Deleted orphaned Cloudinary image due to missing product fields.");
      }
      return res.status(400).json({
        message: "Please provide all required fields: name, description, price, inStock",
      });
    }

    const productData = await ProductModal.create({
      user: userId,
      name,
      description,
      price,
      inStock,
      productImage: [imageURL], // Store the Cloudinary URL
      publicId: publicId,       // Store the Cloudinary public_id for easy deletion later
    });

    res.status(200).json({
      message: "Product added successfully",
      data: productData,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, inStock } = req.body;

    if (!name || !description || !price  || !inStock || !id) {
      return res.status(400).json({
        message: "Please provide all required fields"
      });
    }

    const oldData = await ProductModal.findById(id);
    if (!oldData) {
      return res.status(404).json({
        message: "No data found with that id"
      });
    }

    const oldProductImageURL = oldData.productImage[0];
    let newImageURL = oldProductImageURL;

    if (req.file) { // A new file was uploaded to Cloudinary
      // Extract the public_id from the old image URL
      const parts = oldProductImageURL.split('/');
      const filenameWithExtension = parts[parts.length - 1]; // e.g., 'product-123456789.jpg'
      const oldPublicId = parts[parts.length - 2] + '/' + filenameWithExtension.split('.')[0]; // e.g., 'e-commerce-products/product-123456789'
      
      // Delete the old file from Cloudinary, but only if it's not the default image
      if (!oldProductImageURL.startsWith("https://plus.unsplash.com")) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
          console.log("Old image deleted from Cloudinary successfully");
        } catch (err) {
          console.error("Error deleting old image from Cloudinary:", err);
        }
      }
      
      // Set the new image URL from the uploaded file
      newImageURL = req.file.path;
    }

    const datas = await ProductModal.findByIdAndUpdate(id, {
      name,
      description,
      price,
      inStock,
      productImage: [newImageURL]
    }, {
      new: true,
    });

    res.status(200).json({
      message: "Product updated successfully",
      data: datas
    });
  } catch (error) {
    console.error("Edit product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Please provide product ID" });
    }

    const product = await ProductModal.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Extract the image URL and public_id from the product data
    const oldProductImageURL = product.productImage[0];

    // Delete the image from Cloudinary, but only if it's not the default image
    if (oldProductImageURL && !oldProductImageURL.startsWith("https://plus.unsplash.com")) {
      const parts = oldProductImageURL.split('/');
      const filenameWithExtension = parts[parts.length - 1];
      const oldPublicId = parts[parts.length - 2] + '/' + filenameWithExtension.split('.')[0];
      
      try {
        await cloudinary.uploader.destroy(oldPublicId);
        console.log(`Successfully deleted image from Cloudinary with public_id: ${oldPublicId}`);
      } catch (err) {
        console.error(`Error deleting image from Cloudinary with public_id: ${oldPublicId}:`, err);
      }
    }

    // Delete the product from the database
    await ProductModal.findByIdAndDelete(id);

    // Remove the product from all user carts
    await User.updateMany(
      {},
      { $pull: { cart: { product: id } } }
    );


    res.status(200).json({
      success: true,
      message: "Product and associated image deleted successfully",
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