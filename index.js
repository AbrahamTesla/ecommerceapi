const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

mongoose
   .connect(process.env.MONGO_URL)
   .then(() => console.log('DB succesfully connected'))
   .catch(error => console.log(error));

app.listen(5000, () => {
   console.log('Server is running');
});
