
import dotenv from 'dotenv';   
dotenv.config();
import express from 'express';
const app = express();
import productRoutes  from './routes/productRoutes.js';
import userRoutes  from './routes/userRoutes.js';
import orderRoutes   from './routes/orderRoutes.js';
import orderItemRoutes  from './routes/orderItemRoutes.js';
import authRoutes    from  "./routes/authRoutes.js";
import customizationRoutes from './routes/customizationRoutes.js';



app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Welcome to the Shop');
});

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/order_items', orderItemRoutes);
app.use("/api/auth", authRoutes);
app.use('/customizations', customizationRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
