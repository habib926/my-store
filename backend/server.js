const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. DATABASE CONNECTION ---
// Agar Cloud (Atlas) connect na ho toh "mongodb://localhost:27017/professional_store" likh dena
const MONGO_URI = "mongodb://admin:admin123@cluster0-shard-00-00.xhkedci.mongodb.net:27017,cluster0-shard-00-01.xhkedci.mongodb.net:27017,cluster0-shard-00-02.xhkedci.mongodb.net:27017/professional_store?ssl=true&replicaSet=atlas-xhkedci-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Cloud Database Connected Successfully! ☁️✅"))
  .catch((err) => {
    console.log("Cloud DB Error, trying local... ⚠️");
    mongoose.connect("mongodb://localhost:27017/professional_store")
      .then(() => console.log("Local Database Connected! 🏠✅"))
      .catch((e) => console.log("Database Error: ", e));
  });

// --- 2. PRODUCT MODEL ---
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema, 'products');

// --- 3. API ROUTES ---

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: "Product Added!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product Deleted!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server Active on Port ${PORT} 🚀`));