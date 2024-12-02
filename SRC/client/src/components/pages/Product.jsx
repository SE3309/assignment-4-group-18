import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    description: "",
  });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchReviews = async (productID) => {
    try {
      const response = await axios.get(`http://localhost:5050/api/reviews/${productID}`);
      setReviews((prev) => ({ ...prev, [productID]: response.data }));
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews((prev) => ({ ...prev, [productID]: [] }));
    }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post("http://localhost:5050/api/products", newProduct);
      alert("Product added successfully!");
      setIsAdding(false);
      setNewProduct({
        name: "",
        category: "",
        brand: "",
        price: "",
        description: "",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = async () => {
    try {
      await axios.put(`http://localhost:5050/api/products/${editProduct.productID}`, editProduct);
      alert("Product updated successfully!");
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (productID) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5050/api/products/${productID}`);
        alert("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Products Management</h1>

      {isAdding && (
        <div className="card mb-4">
          <div className="card-header">Add Product</div>
          <div className="card-body">
            <input
              type="text"
              placeholder="Name"
              className="form-control mb-2"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Category"
              className="form-control mb-2"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Brand"
              className="form-control mb-2"
              value={newProduct.brand}
              onChange={(e) =>
                setNewProduct({ ...newProduct, brand: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              className="form-control mb-2"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              className="form-control mb-2"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
            <button className="btn btn-success" onClick={handleAddProduct}>
              Add Product
            </button>
            <button
              className="btn btn-secondary ml-2"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {editProduct && (
        <div className="card mb-4">
          <div className="card-header">Edit Product</div>
          <div className="card-body">
            <input
              type="text"
              placeholder="Name"
              className="form-control mb-2"
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Category"
              className="form-control mb-2"
              value={editProduct.category}
              onChange={(e) =>
                setEditProduct({ ...editProduct, category: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Brand"
              className="form-control mb-2"
              value={editProduct.brand}
              onChange={(e) =>
                setEditProduct({ ...editProduct, brand: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              className="form-control mb-2"
              value={editProduct.price}
              onChange={(e) =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              className="form-control mb-2"
              value={editProduct.description}
              onChange={(e) =>
                setEditProduct({ ...editProduct, description: e.target.value })
              }
            />
            <button className="btn btn-success" onClick={handleEditProduct}>
              Save Changes
            </button>
            <button
              className="btn btn-secondary ml-2"
              onClick={() => setEditProduct(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <button
        className="btn btn-primary mb-3"
        onClick={() => setIsAdding(true)}
      >
        Add Product
      </button>

      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productID}>
              <td>{product.productID}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>${product.price}</td>
              <td>
                <button
                  className="btn btn-success mx-2"
                  onClick={() => setEditProduct(product)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger mx-2"
                  onClick={() => handleDeleteProduct(product.productID)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-info"
                  onClick={() => fetchReviews(product.productID)}
                >
                  View Reviews
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {Object.keys(reviews).map((productID) => (
        <div key={productID} className="card mt-4">
          <div className="card-header">
            Reviews for Product {productID}
          </div>
          <div className="card-body">
            {reviews[productID].length > 0 ? (
              reviews[productID].map((review) => (
                <div key={review.reviewID}>
                  <p>
                    <strong>{review.customerName}:</strong> {review.rating}/5
                  </p>
                  <p>{review.reviewDescription}</p>
                  <hr />
                </div>
              ))
            ) : (
              <p>No reviews for this product.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
