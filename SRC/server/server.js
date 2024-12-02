const express = require('express');
const mysql = require('mysql2');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const db = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,       
  user: process.env.USERNAME,  
  password: process.env.PASSWORD, 
  database: process.env.DBNAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// CRUD FOR USERS
// Get all users
app.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM User';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving users');
    }
    res.json(results);
  });
});

// Add a new user
app.post('/api/users', (req, res) => {
  const { name, email, password } = req.body;
  const query = 'INSERT INTO User (name, email, password) VALUES (?, ?, ?)';
  
  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding user');
    }
    res.status(201).send(`User added with ID: ${result.insertId}`);
  });
});

// Update a user
app.put('/api/users/:userID', (req, res) => {
  const { userID } = req.params;
  const { name, email, password } = req.body;
  
  const query = `
    UPDATE User 
    SET name = ?, email = ?, password = ?
    WHERE userID = ?
  `;
  
  db.query(query, [name, email, password, userID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating user');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }
    res.send('User updated');
  });
});

// Delete a user
app.delete('/api/users/:userID', (req, res) => {
  const { userID } = req.params;
  
  const query = 'DELETE FROM User WHERE userID = ?';
  
  db.query(query, [userID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting user');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }
    res.send('User deleted');
  });
});

// CRUD for product
// Retrieve all products
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM Product';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving products');
    }
    res.json(results);
  });
});
// Add a new product
app.post('/api/products', (req, res) => {
  const { name, category, brand, price, description } = req.body;
  const query = 'INSERT INTO Product (name, category, brand, price, description) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [name, category, brand, price, description], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding product');
    }
    res.status(201).send(`Product added with ID: ${result.insertId}`);
  });
});
// Update a product
app.put('/api/products/:productID', (req, res) => {
  const { productID } = req.params;
  const { name, category, brand, price, description } = req.body;
  
  const query = `
    UPDATE Product 
    SET name = ?, category = ?, brand = ?, price = ?, description = ?
    WHERE productID = ?
  `;
  
  db.query(query, [name, category, brand, price, description, productID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating product');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Product not found');
    }
    res.send('Product updated');
  });
});
// Delete a product
app.delete('/api/products/:productID', (req, res) => {
  const { productID } = req.params;
  
  const query = 'DELETE FROM Product WHERE productID = ?';
  
  db.query(query, [productID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting product');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Product not found');
    }
    res.send('Product deleted');
  });
});
// USING JOIN Get all reviews for a specific product
app.get('/api/reviews/:productID', (req, res) => {
  const { productID } = req.params;
  const query = `
    SELECT r.reviewID, r.rating, r.reviewDescription, r.datePosted, u.name AS customerName
    FROM Review r
    JOIN User u ON r.customerID = u.userID
    WHERE r.productID = ?
  `;
  
  db.query(query, [productID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving reviews');
    }
    if (results.length === 0) {
      return res.status(404).send('No reviews found for this product');
    }
    res.json(results);
  });
});


app.listen(5050, () => {
  console.log('Server is running on port 5050');
});
