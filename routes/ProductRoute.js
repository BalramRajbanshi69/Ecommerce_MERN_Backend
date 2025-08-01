const express = require("express");
const router = express.Router();
const FetchUser = require("../middleware/FetchUser");
// const { multer, storage } = require("../middleware/multerConfig"); 
// const upload = multer({ storage: storage });

const upload = require("../middleware/multerConfig")

const {
  getUserProducts,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  createProduct,
} = require("../controller/product.controller"); 



router.route("/").post(FetchUser, upload.single("productImage"),  createProduct)
router.route("/").get(getAllProducts)
router.route("/userproducts").get(FetchUser,getUserProducts);
router.route("/:id")
  .get(getProductById) 
  .put(FetchUser, upload.single("productImage"), updateProduct) 
  .delete(FetchUser, deleteProduct); 


module.exports = router;