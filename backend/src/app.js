const express = require('express');
const app=express();
const cookieParser=require('cookie-parser');
const cors=require('cors');
const authRoutes=require('./routes/auth.route')
const productRoutes=require('./routes/product.route');
const cartRoutes=require('./routes/cart.route')
const wishlistRoutes=require('./routes/wishlist.route')



app.use(cors({
    
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth',authRoutes);

app.use('/api/v1/products',productRoutes);

app.use('/api/v1/cart',cartRoutes);

app.use('/api/v1/wishlist',wishlistRoutes);

module.exports=app;