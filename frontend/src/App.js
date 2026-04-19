import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Connection Error", err);
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
      await axios.post('http://localhost:5000/api/products', newProduct);
      alert("Success! Product Uploaded. ✨");
      fetchProducts();
      e.target.reset();
    } catch (err) { alert("Error uploading!"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this item?")) {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 text-slate-900">
      <nav className="bg-slate-900 text-white p-4 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-black text-orange-500 italic">PRO<span className="text-white">STORE</span></h1>
          <input onChange={(e)=>setSearch(e.target.value)} type="text" placeholder="Search..." className="hidden md:block w-1/3 p-2 rounded text-black outline-none" />
          <div className="font-bold flex gap-4"><span>Login</span> <span>🛒 {products.length}</span></div>
        </div>
      </nav>

      <div className="container mx-auto mt-8 p-6 bg-white rounded-3xl shadow-lg border-b-8 border-orange-500">
        <h2 className="text-2xl font-black mb-6">ADMIN PANEL</h2>
        <form className="grid grid-cols-1 md:grid-cols-5 gap-4" onSubmit={handleAddProduct}>
          <input name="name" placeholder="Name" className="border-2 p-3 rounded-xl outline-none focus:border-orange-500" required />
          <input name="price" type="number" placeholder="Price $" className="border-2 p-3 rounded-xl outline-none focus:border-orange-500" required />
          <input name="image" placeholder="Image URL" className="border-2 p-3 rounded-xl outline-none focus:border-orange-500" required />
          <input name="category" placeholder="Category" className="border-2 p-3 rounded-xl outline-none focus:border-orange-500" required />
          <button type="submit" className="bg-orange-500 text-white font-black py-3 rounded-xl hover:bg-slate-900 transition">UPLOAD</button>
        </form>
      </div>

      <div className="container mx-auto mt-12 px-4">
        <h3 className="text-3xl font-bold mb-8 underline decoration-orange-500">INVENTORY</h3>
        {loading ? <div className="text-center py-10 font-bold">Connecting...</div> : 
         products.length === 0 ? <div className="text-center p-10 bg-white rounded shadow text-gray-400">No products found. Add one above!</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(item => (
              <div key={item._id} className="bg-white rounded-3xl shadow hover:shadow-xl transition group relative overflow-hidden border">
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
          </div>
        )}
      </div>
    </div>
  );
}

export default App;