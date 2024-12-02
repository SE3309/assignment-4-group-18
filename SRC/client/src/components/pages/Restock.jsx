import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Restock() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [location, setLocation] = useState('');
  const [quantityToAdd, setQuantityToAdd] = useState('');

  // Fetch products where restockThreshold > quantity
  useEffect(() => {
    axios
      .get('http://localhost:5050/api/inventory/restock')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching restock products:', error);
        setMessage('Error fetching data');
      });
  }, []);

  // Handle restocking the product
  const handleRestock = (productID, currentLocation) => {
    setSelectedProduct(productID);
    setLocation(currentLocation);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for inputs
    if (!location || !quantityToAdd) {
      setMessage('Please enter location and quantity.');
      return;
    }

    // Fetch the current product to get the current quantity
    const product = products.find(
      (p) => p.productID === selectedProduct && p.location === location
    );

    if (!product) {
      setMessage('Product not found at the given location.');
      return;
    }

    // Calculate the new quantity by adding the quantity to the current quantity
    const updatedQuantity = product.quantity + parseInt(quantityToAdd);

    // Prepare data for API request
    const restockData = {
      quantity: updatedQuantity, // Sending the updated quantity
    };

    // Send PUT request to update inventory
    axios
      .put(
        `http://localhost:5050/api/inventory/update/${selectedProduct}/${location}`,
        restockData
      )
      .then((response) => {
        setMessage(response.data); // Success message

        // Update the local state to reflect the updated inventory in real-time
        setProducts(
          products.map((p) =>
            p.productID === selectedProduct && p.location === location
              ? { ...p, quantity: updatedQuantity }
              : p
          )
        );

        setShowForm(false); // Hide the form after successful update
        setLocation('');
        setQuantityToAdd('');
      })
      .catch((error) => {
        console.error('Error updating inventory:', error);
        setMessage('Error updating inventory');
      });
  };

  return (
    <div className="container">
      <h1 className="text-center">Restock Page</h1>
      {message && <p className="text-danger">{message}</p>}

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Location</th>
            <th>Quantity</th>
            <th>Restock Threshold</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="9">No products need restocking at the moment.</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.productID}>
                <td>{product.productID}</td>
                <td>{product.productName}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>{product.price}</td>
                <td>{product.location}</td>
                <td>{product.quantity}</td>
                <td>{product.restockThreshold}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() =>
                      handleRestock(product.productID, product.location)
                    }
                  >
                    Restock
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Restock Form */}
      {showForm && (
        <div className="mt-4">
          <h4>Update Quantity for Product ID {selectedProduct}</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity to Add:</label>
              <input
                type="number"
                id="quantity"
                className="form-control"
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary mt-3">
              Update Inventory
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
