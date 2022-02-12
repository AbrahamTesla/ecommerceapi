const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');

mongoose
   .connect(process.env.MONGO_URL)
   .then(() => console.log('DB succesfully connected'))
   .catch(error => console.log(error));

//To send or post json to our database
app.use(express.json());

//Auth Routes
app.use('/api/auth', authRoute);
//Users Routes
app.use('/api/users', userRoute);
//Product Routes
app.use('/api/products', productRoute);

app.listen(process.env.PORT || 5000, () => {
   console.log('Server is running');
});
