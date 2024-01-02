// Import the required modules
const express = require("express")
const router = express.Router();

// Import the required controllers and middleware functions
const {
fetchAllCartItem , addToCart , removeFromCart
} = require("../controllers/cartController");


const { auth  , isUser } = require("../middleware/auth");

const { addToWishlist, removeFromWishlist, fetchAllWishlistItem, removeAllWislist } = require("../controllers/wishlistController");


// ********************************************************************************************************
//                                      cart routes
// ********************************************************************************************************

router.get("/fetchAllCartItems",auth , isUser ,  fetchAllCartItem)

router.post("/addToCart/:productId",auth , isUser ,  addToCart)

router.post('/removeFromCart/:productId' ,auth , isUser ,  removeFromCart);


// ***************************************************************************************
//                                     wishlist routes
//***************************************************************************************

router.post('/addToWishlist/:productId' , auth , isUser ,addToWishlist);

router.delete("/removeFromWishlist/:productId" , auth , isUser , removeFromWishlist);

router.get("/fetchAllWishlistItem" , auth , isUser , fetchAllWishlistItem);

router.delete("/removeAllWislist" , auth , isUser , removeAllWislist);


module.exports = router;