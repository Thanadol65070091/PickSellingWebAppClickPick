
require('dotenv').config();
const express = require('express');
const app = express();
const productRoutes = require('../routes/productRoutes.js');
const userRoutes = require('../routes/userRoutes.js');
const orderRoutes = require('../routes/orderRoutes.js');
const orderItemRoutes = require('../routes/orderItemRoutes.js');
const customizationRoutes = require('../routes/customizationRoutes.js');


app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Welcome to the Shop');
});

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/order_items', orderItemRoutes);
app.use('/customizations', customizationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
