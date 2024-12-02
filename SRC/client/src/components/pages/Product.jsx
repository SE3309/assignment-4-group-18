import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    description: "",
  });
  const [editProduct, setEditProduct] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const BASE_URL = "http://localhost:5050";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchReviews = async (product) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/reviews/${product.productID}`);
      setReviews(response.data);
      setCurrentProduct(product); // Set the current product
      setShowReviews(true); // Open the modal
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      setShowReviews(true); // Show the modal even if no reviews are available
    }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post(`${BASE_URL}/api/products`, newProduct);
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
      await axios.put(
        `${BASE_URL}/api/products/${editProduct.productID}`,
        editProduct
      );
      alert("Product updated successfully!");
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
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
                  className="btn btn-info"
                  onClick={() => fetchReviews(product)}
                >
                  View Reviews
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showReviews && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "20px",
            zIndex: 1000,
            width: "500px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <h3>Reviews for {currentProduct?.name}</h3>
          {reviews.length > 0 ? (
            reviews.map((review) => (
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
          <button
            className="btn btn-secondary"
            onClick={() => setShowReviews(false)}
          >
            Close
          </button>
        </div>
      )}

      {showReviews && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={() => setShowReviews(false)}
        ></div>
      )}
    </div>
  );
}
