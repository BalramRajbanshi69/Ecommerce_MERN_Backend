const {
  addToCart,
  removeFromCart,
  updateCartItems,
  getMyCartItems,
} = require("../controller/cart.controller"); // Ensure this path and functions are correct
const FetchUser = require("../middleware/FetchUser");
const router = require("express").Router();

router
  .route("/:productId")
  .post(FetchUser, addToCart) // Add product to cart by ID
  .delete(FetchUser, removeFromCart) // Remove product from cart by ID
  .patch(FetchUser, updateCartItems); // Update cart item quantity/details by ID

router.route("/").get(FetchUser, getMyCartItems); // Get all cart items for the user

module.exports = router;