const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- DB CONNECTION ---
const MONGO_URI = "mongodb+srv://admin:admin123@cluster0.xhkedci.mongodb.net/professional_store?retryWrites=true&w=majority";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGO_URI);
};

// --- MODEL ---
const productSchema = new mongoose.Schema({
    name: String, price: Number, image: String, category: String
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');

// --- ROUTES ---

// 1. Get Products
app.get('/api/products', async (req, res) => {
    await connectDB();
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json([]);
    }
});

// 2. Add Product
app.post('/api/products', async (req, res) => {
    await connectDB();
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: "Success" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 3. Delete Product
app.delete('/api/products/:id', async (req, res) => {
    await connectDB();
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed" });
    }
});

// Vercel handles the port automatically
module.exports = app;