import React, { useEffect, useState } from 'react';
import axios from 'axios';

// APKA LIVE BACKEND LINK (Vercel wala)
const API_URL = "https://my-store-ten-iota.vercel.app/backend-api/api/products";

function App() {
  const [products, setProducts] = useState([]); // Hamesha empty array se shuru karein
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      // Check karein ke data array hai ya nahi
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setProducts([]); // Agar array nahi hai toh khali list rakhen
      }
      setLoading(false);
    } catch (err) {
      console.error("Connection Error", err);
      setProducts([]); // Error ki soorat mein bhi khali list rakhen taake crash na ho
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const newProduct = {
      name: e.target.name.value,
      price: Number(e.target.price.value),
      image: e.target.image.value,
      category: e.target.category.value
    };
    try {
      await axios.post(API_URL, newProduct);
      alert("Success! Product Uploaded. ✨");
      fetchProducts();
      e.target.reset();
    } catch (err) { alert("Error: " + err.message); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this item?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchProducts();
      } catch (err) { alert("Delete failed!"); }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 text-slate-900">
      <nav className="bg-slate-900 text-white p-4 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-black text-orange-500 italic">PROSTORE</h1>
          <input onChange={(e)=>setSearch(e.target.value)} type="text" placeholder="Search brands..." className="hidden md:block w-1/3 p-2 rounded text-black outline-none" />
          <div className="font-bold flex gap-4"><span>Login</span> <span>🛒 {products.length}</span></div>
        </div>
      </nav>

      <div className="container mx-auto mt-8 p-6 bg-white rounded-3xl shadow-lg border-b-8 border-orange-500">
        <h2 className="text-2xl font-black mb-6 uppercase">Admin Manager</h2>
        <form className="grid grid-cols-1 md:grid-cols-5 gap-4" onSubmit={handleAddProduct}>
          <input name="name" placeholder="Name" className="border-2 p-3 rounded-xl outline-none" required />
          <input name="price" type="number" placeholder="Price $" className="border-2 p-3 rounded-xl outline-none" required />
          <input name="image" placeholder="Image URL (Unsplash Link preferred)" className="border-2 p-3 rounded-xl outline-none" required />
          <input name="category" placeholder="Category" className="border-2 p-3 rounded-xl outline-none" required />
          <button type="submit" className="bg-orange-500 text-white font-black py-3 rounded-xl hover:bg-slate-900 transition shadow-lg">UPLOAD</button>
        </form>
      </div>

      <div className="container mx-auto mt-12 px-4">
        <h3 className="text-3xl font-bold mb-8 underline decoration-orange-500">STORE FRONT</h3>
        {loading ? <div className="text-center py-10 font-bold animate-pulse text-gray-400">Connecting to Cloud...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Array.isArray ka check crash hone se bachata hai */}
            {Array.isArray(products) && products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(item => (
              <div key={item._id} className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition group relative overflow-hidden border">
                <button onClick={() => handleDelete(item._id)} className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition z-10">✕</button>
                <div className="h-56"><img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="" /></div>
                <div className="p-5">
                  <p className="text-orange-600 font-bold text-xs uppercase">{item.category}</p>
                  <h4 className="text-lg font-bold truncate">{item.name}</h4>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-black">${item.price}</span>
                    <button className="bg-slate-900 text-white px-4 py-1 rounded-full hover:bg-orange-500 transition">Buy</button>
                  </div>
                </div>
              </div>
            ))}
            {products.length === 0 && !loading && <p className="col-span-full text-center text-gray-400 font-bold">No products found. Add one above! 🚀</p>}
          </div>
        )}
      </div>
      <footer className="mt-20 py-10 text-center bg-slate-900 text-gray-500">© 2026 PROSTORE | Habib</footer>
    </div>
  );
}

export default App;