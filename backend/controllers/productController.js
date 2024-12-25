const Product = require('../models/Product');

const addProduct = async (req, res) => {
    const product = req.body;

    try {
        const newProduct = new Product(product);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (error) {
        res.status(500).send(error); 
    }
};

const getOne = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        res.send(product);
    } catch (error) {
        res.status(500).send(error); 
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedProduct) { 
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteResult = await Product.deleteOne({ _id: id });
        if (!deleteResult.deletedCount) { 
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

module.exports = { addProduct, getProducts, getOne, updateProduct, deleteProduct };
