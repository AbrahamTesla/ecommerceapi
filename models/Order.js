const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
   {
      userId: {
         type: String,
         required: true,
      },
      producs: [
         {
            productId: {
               type: String,
            },
            quantity: {
               type: Number,
               default: 1,
            },
         },
      ],
      amount: {
         type: Number,
         required: true,
      },
      // Will take all the input in every lines - line 1 street, line 2 postal code and etc...
      address: { type: Object, required: true },
      status: { type: String, default: 'pending' },
   },
   { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
