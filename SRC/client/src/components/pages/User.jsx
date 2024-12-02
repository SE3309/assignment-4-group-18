import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [editUser, setEditUser] = useState(null);

  // Fetch users from the API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/users"); // API to get all users
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await axios.post("http://localhost:5050/api/users", newUser); // API to add a user
      alert("User added successfully!");
      setNewUser({ name: "", email: "", password: "" }); // Reset form
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error adding user");
    }
  };

  const handleEdit = (user) => {
    setEditUser(user); // Open the edit form with user data
  };

  const handleUpdateUser = async () => {
    if (!editUser.name || !editUser.email || !editUser.password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await axios.put(`http://localhost:5050/api/users/${editUser.userID}`, editUser);
      alert("User updated successfully!");
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user");
    }
  };

  const handleDelete = async (userID) => {
    if (window.confirm(`Are you sure you want to delete user with ID: ${userID}?`)) {
      try {
        await axios.delete(`http://localhost:5050/api/users/${userID}`); // API to delete user
        setUsers(users.filter((user) => user.userID !== userID));
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user");
      }
    }
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Users Management</h1>

      {/* Add User Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h3>Add a New User</h3>
        </div>
        <div className="card-body">
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              className="form-control mb-2"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="form-control mb-2"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="form-control mb-2"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <button className="btn btn-primary" onClick={handleAddUser}>
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Edit User Form */}
      {editUser && (
        <div className="card mb-4">
          <div className="card-header">
            <h3>Edit User</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                className="form-control mb-2"
                value={editUser.name}
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="form-control mb-2"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                className="form-control mb-2"
                value={editUser.password}
                onChange={(e) =>
                  setEditUser({ ...editUser, password: e.target.value })
                }
              />
              <button className="btn btn-success" onClick={handleUpdateUser}>
                Update User
              </button>
              <button
                className="btn btn-secondary ml-2"
                onClick={() => setEditUser(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.userID}>
                <td>{user.userID}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn btn-success mx-2"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(user.userID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No users available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}