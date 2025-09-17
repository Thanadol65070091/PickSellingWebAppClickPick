
require('dotenv').config();
const express = require('express');
const app = express();
const productRoutes = require('../routes/productRoutes.js');
const userRoutes = require('../routes/userRoutes.js');


app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Welcome to the Shop');
});

app.use('/products', productRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
