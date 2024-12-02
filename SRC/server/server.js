const express = require('express');
const mysql = require('mysql2');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,       
  user: process.env.USERNAME,  
  password: process.env.PASSWORD, 
  database: process.env.DBNAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
});


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 5050');
});
