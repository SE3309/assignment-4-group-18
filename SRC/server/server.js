const express = require('express');
const mysql = require('mysql2');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
app.use(cors());

app.use(express.json());
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
    ORDER BY r.datePosted DESC
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

// Get all products where restockThreshold > quantity
app.get('/api/inventory/restock', (req, res) => {
  const query = `
    SELECT 
      Product.productID, 
      Product.name AS productName, 
      Product.category, 
      Product.brand, 
      Product.price, 
      Inventory.location, 
      Inventory.quantity, 
      Inventory.restockThreshold
    FROM Inventory
    JOIN Product ON Inventory.productID = Product.productID
    WHERE Inventory.restockThreshold > Inventory.quantity
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving inventory data');
    }
    res.json(results);
  });
});

// PUT Product Inventory based on productID and location
app.put('/api/inventory/update/:productID/:location', (req, res) => {
  const { productID, location } = req.params; // Get productID and location from URL params
  const { quantity } = req.body; // Get quantity from the request body

  if (quantity === undefined) {
    return res.status(400).send('Quantity is required');
  }

  // SQL query to update the inventory based on productID and location
  const query = `
    UPDATE Inventory
    SET quantity = ?
    WHERE productID = ? AND location = ?
  `;

  db.query(query, [quantity, productID, location], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating inventory');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('No inventory found for the given productID and location');
    }

    res.send('Inventory updated successfully');
  });
});


// Mark orders made before a certain date as EXPIRED
app.put('/api/orders/expire/:date', (req, res) => {
  const { date } = req.params; // Get the date parameter from URL
  const query = `
    UPDATE Orders
    SET orderStatus = 'EXPIRED'
    WHERE orderDate < ?
  `;

  // Execute the query
  db.query(query, [date], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error marking orders as EXPIRED');
    }
    // If no orders were updated, send a 404 message
    if (results.affectedRows === 0) {
      return res.status(404).send('No orders found before the given date');
    }

    res.send(`${results.affectedRows} orders marked as EXPIRED`);
  });
});

// Mark a specific order as EXPIRED
app.put('/api/orders/setexpire/:orderID', (req, res) => {
  const { orderID } = req.params; // Get the orderID from URL
  const query = `
    UPDATE Orders
    SET orderStatus = 'EXPIRED'
    WHERE orderID = ?
  `
  db.query(query, [orderID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error marking order as EXPIRED');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('No order found with the given orderID');
    }
    res.send(`Order ${orderID} marked as EXPIRED`);
  });
});
// View all orders made before a certain date
app.get('/api/orders/before/:date', (req, res) => {
  const { date } = req.params;// Get the date parameter from URL
  const query = `
    SELECT * FROM Orders
    WHERE orderDate < ?
  `;

  // Execute the query
  db.query(query, [date], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving orders');
    }

    // If no orders are found, send a 404 message
    if (results.length === 0) {
      return res.status(404).send('No orders found before the given date');
    }

    res.json(results); // Return the orders
  });
});


// Endpoint to get low stock products with sales data
app.get('/api/reports/low-stock-sales', (req, res) => {
  const query = `
    SELECT 
      p.productID, 
      p.name AS productName,
      p.category,
      p.brand,
      p.price,
      MIN(i.quantity) AS currentStock, 
      i.restockThreshold,
      IF(MIN(i.quantity) < i.restockThreshold, 'Yes', 'No') AS isLowStock,
      COALESCE(SUM(oi.quantity), 0) AS totalSold,  -- SUM of quantities sold
      COALESCE(SUM(oi.quantity * p.price), 0) AS totalSales -- Total sales value
    FROM 
      Inventory i
    JOIN 
      Product p ON i.productID = p.productID
    LEFT JOIN 
      OrderItem oi ON i.productID = oi.productID
    LEFT JOIN 
      Orders o ON oi.orderID = o.orderID
    WHERE 
      o.orderStatus != 'EXPIRED'  -- Exclude expired orders
    GROUP BY 
      p.productID, i.restockThreshold  -- Include necessary columns in GROUP BY
    HAVING 
      isLowStock = 'Yes'  -- Filter only low stock products
    ORDER BY 
      totalSold DESC;  -- Sort by the most sold products
  `;

  // Execute the query to fetch data from the database
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching low stock sales data:', err);
      return res.status(500).send('Error fetching data');
    }

    // Check if results are empty
    if (results.length === 0) {
      return res.status(404).send('No low stock products with sales found');
    }

    // Return the results as a JSON response
    res.json(results);
  });
});


app.listen(5050, () => {
  console.log('Server is running on port 5050');
});
