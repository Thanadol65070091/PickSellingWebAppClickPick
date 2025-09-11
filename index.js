const express = require('express')
const mysql = require('mysql')
const app = express()
const hostname = 'localhost';
const port = 3000;
const db = mysql.createConnection({
    host:process.env.DB_HOST,
    port: process.env.DB_PORT,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

app.get('/',(req, res)=> {
    res.send("Hell");
});

app.listen(port, hostname, () => {
          console.log(`Server running at http://${hostname}:${port}/`);
});
 