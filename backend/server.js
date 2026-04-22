const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
const MONGO_URI = "mongodb+srv://admin:admin123@cluster0.xhkedci.mongodb.net/professional_store?retryWrites=true&w=majority";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGO_URI);
};

// MODEL
const productSchema = new mongoose.Schema({
    name: String, price: Number, image: String, category: String
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');

// ROUTES
app.get('/api/products', async (req, res) => {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
});

app.post('/api/products', async (req, res) => {
    await connectDB();
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json({ message: "Success" });
});

app.delete('/api/products/:id', async (req, res) => {
    await connectDB();
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));

module.exports = app; // VERCEL KE LIYE ZAROORI HAI