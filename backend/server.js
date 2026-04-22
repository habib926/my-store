const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- MONGODB ATLAS CONNECTION ---
const MONGO_URI = "mongodb+srv://admin:admin123@cluster0.xhkedci.mongodb.net/professional_store?retryWrites=true&w=majority";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected ✅");
    } catch (err) {
        console.error("DB Error:", err);
    }
};

// --- PRODUCT MODEL ---
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
        res.status(200).json(Array.isArray(products) ? products : []);
    } catch (err) {
        res.status(500).json([]); // Error ki soorat mein khali array bhejein taake site crash na ho
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
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed" });
    }
});

// Serverless environments mein port zaroori nahi hota lekin local ke liye:
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

module.exports = app; // VERCEL ISKE BAGHAIR NAHI CHALTA