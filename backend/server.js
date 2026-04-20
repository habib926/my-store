const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
const MONGO_URI = "mongodb+srv://admin:admin123@cluster0.xhkedci.mongodb.net/professional_store?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Cloud DB Connected! ✅"))
  .catch((err) => console.log("DB Error: ", err));

// --- PRODUCT MODEL ---
const productSchema = new mongoose.Schema({
    name: String, price: Number, image: String, category: String
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema, 'products');

// --- ROUTES ---
app.get('/api/products', async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
});

app.post('/api/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json({ message: "Success" });
});

app.delete('/api/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// --- PRODUCTION PORT ---
// Render khud port assign karta hai, is liye process.env.PORT zaroori hai
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));