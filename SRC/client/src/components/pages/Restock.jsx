import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Restock() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [location, setLocation] = useState("");
  const [quantityToAdd, setQuantityToAdd] = useState("");

  const [reportData, setReportData] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);

  const BASE_URL = "http://localhost:5050";

  // Fetch products where restockThreshold > quantity
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/inventory/restock`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching restock products:", error);
        setMessage("Error fetching data");
      });
  }, []);

  const handleRestock = (productID, currentLocation) => {
    setSelectedProduct(productID);
    setLocation(currentLocation);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!location || !quantityToAdd) {
      setMessage("Please enter location and quantity.");
      return;
    }

    const product = products.find(
      (p) => p.productID === selectedProduct && p.location === location
    );

    if (!product) {
      setMessage("Product not found at the given location.");
      return;
    }

    const updatedQuantity = product.quantity + parseInt(quantityToAdd);

    const restockData = {
      quantity: updatedQuantity,
    };

    axios
      .put(`${BASE_URL}/api/inventory/update/${selectedProduct}/${location}`, restockData)
      .then((response) => {
        setMessage(response.data);

        setProducts(
          products.map((p) =>
            p.productID === selectedProduct && p.location === location
              ? { ...p, quantity: updatedQuantity }
              : p
          )
        );

        setShowForm(false);
        setLocation("");
        setQuantityToAdd("");
      })
      .catch((error) => {
        console.error("Error updating inventory:", error);
        setMessage("Error updating inventory");
      });
  };

  // Fetch low stock report
  const fetchLowStockReport = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/reports/low-stock-sales`);
      setReportData(response.data);
      setShowReportModal(true);
    } catch (error) {
      console.error("Error fetching low stock report:", error);
      setMessage(
        error.response?.status === 404
          ? "No low stock products with sales found."
          : "Error fetching data."
      );
      setShowReportModal(true);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center">Restock Page</h1>
        <button className="btn btn-primary" onClick={fetchLowStockReport}>
          Generate Low Stock Report
        </button>
      </div>
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
                <td>
                  {isNaN(Number(product.price))
                    ? "N/A"
                    : `$${Number(product.price).toFixed(2)}`}
                </td>
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

      {showForm && (
        <>
          <div className="modal-overlay" onClick={() => setShowForm(false)}></div>
          <div className="modal">
            <h4 className="modal-title">Restock Product ID {selectedProduct}</h4>
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
              <button
                type="button"
                className="btn btn-secondary mt-3 ml-2"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </>
      )}

      {showReportModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowReportModal(false)}></div>
          <div className="modal">
            <h3 className="modal-title">Low Stock Report</h3>
            {message ? (
              <p>{message}</p>
            ) : (
              <table className="table table-bordered mt-4">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Current Stock</th>
                    <th>Restock Threshold</th>
                    <th>Total Sold</th>
                    <th>Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((product) => (
                    <tr key={product.productID}>
                      <td>{product.productID}</td>
                      <td>{product.productName}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>
                        {isNaN(Number(product.price))
                          ? "N/A"
                          : `$${Number(product.price).toFixed(2)}`}
                      </td>
                      <td>{product.currentStock}</td>
                      <td>{product.restockThreshold}</td>
                      <td>{product.totalSold}</td>
                      <td>
                        {isNaN(Number(product.totalSales))
                          ? "N/A"
                          : `$${Number(product.totalSales).toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              className="btn btn-secondary mt-3"
              onClick={() => setShowReportModal(false)}
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
}
