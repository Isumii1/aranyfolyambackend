const express = require("express");
const {
    allProducts,
    addProduct,
    deleteProduct,
    updateProduct
} = require("../controllers/productController");

const { auth } = require("../middleware/userMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
const uploadProductImage = require("../middleware/uploadProductImage");

const router = express.Router();

router.get("/all", allProducts);
router.post("/add", auth, isAdmin, uploadProductImage.single("product_image"), addProduct);
router.delete("/del/:product_id", auth, isAdmin, deleteProduct);
router.put("/update", auth, isAdmin, uploadProductImage.single("product_image"), updateProduct);

module.exports = router;