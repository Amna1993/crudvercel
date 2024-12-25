const express = require("express");
const { addProduct, getProducts, getOne, updateProduct, deleteProduct } = require("../controllers/productController");

const router = express.Router();

router.post("/add", addProduct);
router.get("/",getProducts);
router.get("/:id", getOne);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);
module.exports = router;
