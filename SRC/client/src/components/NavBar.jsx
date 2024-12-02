import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="navbar">
      <h1>Website</h1>
      <div>
        <Link to="/">Home</Link>
        <Link to="/product">Product</Link>
        <Link to="/user">User</Link>
        <Link to="/restock">Restock</Link>
        <Link to="/orders">Orders</Link>
      </div>
    </div>
  );
}
