const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Base64 images ke liye limit barha di

// --- DATABASE CONNECTION ---
const MONGO_URI = "mongodb+srv://admin:admin123@cluster0.xhkedci.mongodb.net/professional_store?retryWrites=true&w=majority";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGO_URI);
};

// --- PRODUCT MODEL ---
const productSchema = new mongoose.Schema({
    name: String, price: Number, image: String, category: String
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');

// --- ROUTES ---

app.get('/api/products', async (req, res) => {
    await connectDB();
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json([]);
    }
});

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

// Local testing ke liye port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

module.exports = app; 