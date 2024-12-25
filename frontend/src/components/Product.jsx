import React, { useState, useEffect } from 'react';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [editMode, setEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5020/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Add a new product
  const handleAdd = async () => {
    try {
      const response = await fetch('http://localhost:5020/api/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        const addedProduct = await response.json();
        setProducts((prevProducts) => [...prevProducts, addedProduct]);
        setNewProduct({ name: '', price: '' });
        console.log('Product added successfully');
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Update an existing product
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5020/api/products/update/${editingProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === editingProductId ? updatedProduct : product
          )
        );
        setNewProduct({ name: '', price: '' });
        setEditMode(false);
        setEditingProductId(null);
        console.log('Product updated successfully');
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Delete a product
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5020/api/products/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
        console.log('Product deleted successfully');
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  // Prepare product for editing
  const handleEdit = (product) => {
    setEditMode(true);
    setEditingProductId(product._id);
    setNewProduct({ name: product.name, price: product.price });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>

      {/* Form for adding/updating products */}
      <form onSubmit={handleFormSubmit} className="mb-4">
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
            className={`px-4 py-2 rounded ${
              editMode ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {editMode ? 'Update Product' : 'Add Product'}
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
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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

export default Product;
