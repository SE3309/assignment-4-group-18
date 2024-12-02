import React, { useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:5050";

  // Fetch orders before the selected date
  const fetchOrders = async () => {
    if (!date) {
      setMessage("Please select a valid date.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/orders/before/${date}`);
      setOrders(response.data);
      setMessage("");
    } catch (error) {
      console.error("Error fetching orders:", error);
      setMessage(
        error.response?.status === 404
          ? "No orders found before the selected date."
          : "Error fetching orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // Mark a specific order as expired
  const markAsExpired = async (orderID) => {
    try {
      await axios.put(`${BASE_URL}/api/orders/setexpire/${orderID}`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderID === orderID
            ? { ...order, orderStatus: "EXPIRED" }
            : order
        )
      );
      setMessage(`Order ${orderID} marked as EXPIRED.`);
    } catch (error) {
      console.error(`Error marking order ${orderID} as expired:`, error);
      setMessage("Error marking order as expired.");
    }
  };

  // Mark all orders as expired
  const markAllAsExpired = async () => {
    if (!date) {
      setMessage("Please select a valid date.");
      return;
    }

    try {
      const response = await axios.put(`${BASE_URL}/api/orders/expire/${date}`);
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          orderStatus: "EXPIRED",
        }))
      );
      setMessage(response.data); // Success message
    } catch (error) {
      console.error("Error marking all orders as expired:", error);
      setMessage("Error marking all orders as expired.");
    }
  };

  return (
    <div className="container">
      <h1 className="text-center">Orders Management</h1>

      {/* Date Input and View Orders */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="form-group">
          <label htmlFor="orderDate">Select a Date:</label>
          <input
            type="date"
            id="orderDate"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={fetchOrders}>
          View Orders
        </button>
      </div>

      {/* Global Mark as Expired */}
      {orders.length > 0 && (
        <div className="text-right mb-3">
          <button className="btn btn-danger" onClick={markAllAsExpired}>
            Mark All as Expired
          </button>
        </div>
      )}

      {/* Orders Table */}
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <>
          {message && <p className="text-danger">{message}</p>}
          {orders.length > 0 ? (
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>User ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderID}>
                    <td>{order.orderID}</td>
                    <td>{order.orderDate}</td>
                    <td>{order.orderStatus}</td>
                    <td>{order.userID}</td>
                    <td>
                      <button
                        className="btn btn-warning"
                        onClick={() => markAsExpired(order.orderID)}
                        disabled={order.orderStatus === "EXPIRED"}
                      >
                        {order.orderStatus === "EXPIRED"
                          ? "Already Expired"
                          : "Mark as Expired"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No orders to display.</p>
          )}
        </>
      )}
    </div>
  );
}