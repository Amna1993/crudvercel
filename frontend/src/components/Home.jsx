import React, { useState, useEffect } from 'react';

const apiUrl = process.env.REACT_APP_API_URL; // Dynamically fetch API URL

const Home = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data); // Set fetched products to state
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Handle form submission (Add Product)
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/products/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        setProducts((prevProducts) => [...prevProducts, addedProduct]); // Add new product to state
        setNewProduct({ name: '', price: '' }); // Clear the form
        console.log('Product added successfully');
      } else {
        console.error('Failed to add product:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>

      {/* Form for adding a product */}
      <form onSubmit={handleAdd} className="mb-4">
        <div className="flex space-x-4">
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            className="border px-4 py-2 rounded"
            required
          />
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            placeholder="Product Price"
            className="border px-4 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>
      </form>

      {/* Table to display products */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Price</th>
              <th className="text-center px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.price}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    onClick={() => console.log(`Edit product: ${product._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => console.log(`Delete product: ${product._id}`)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
