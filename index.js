const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const stripeRoute = require('./routes/stripe');

mongoose
   .connect(process.env.MONGO_URL)
   .then(() => console.log('DB succesfully connected'))
   .catch(error => console.log(error));

//Cors
app.use(cors());
//To send or post json to our database
app.use(express.json());

//Auth Routes
app.use('/api/auth', authRoute);
//Users Routes
app.use('/api/users', userRoute);
//Product Routes
app.use('/api/products', productRoute);
//Cart Routes
app.use('/api/carts', cartRoute);
//Order Route
app.use('/api/orders', orderRoute);
//Stripe Route
app.use('/api/checkout', stripeRoute);

app.listen(process.env.PORT || 5000, () => {
   console.log('Server is running');
});
