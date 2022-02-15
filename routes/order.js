const Order = require('../models/Order');
const router = require('express').Router();
const {
   verifyToken,
   verifyTokenAndAuthorization,
   verifyTokenAndAdmin,
} = require('./verfiyToken');

//@Create Order  POST method

router.post('/', verifyToken, async (req, res) => {
   const newOrder = new Order(req.body);

   try {
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder);
   } catch (error) {
      res.status(500).json(error);
   }
});
//@Update Order  PUT METHOD
//Only Admin can update the order
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
   try {
      const updatedOrder = await Order.findByIdAndUpdate(
         //Taking the paramater Id
         req.params.id,
         {
            //set my req.body
            $set: req.body,
         },
         //New to true to update the 'SET' above done in our request body
         { new: true }
      );
      res.status(200).json(updatedOrder);
   } catch (error) {
      res.status(500).json(error);
   }
});

//@Delete ORDERS  DELETE METHOD
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
   try {
      await Order.findByIdAndDelete(req.params.id);
      res.status(200).json('Order is successfully deleted');
   } catch (error) {
      res.status(500).json(error);
   }
});

//@Get user orders
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
   try {
      //find since users can have more than one orders
      const orders = await Order.find({ userId: req.params.userId });

      res.status(200).json(orders);
   } catch (error) {
      res.status(500).json(error);
   }
});

//@GET ALL all Admin has access thus verifyTokenAndAdmin
router.get('/', verifyTokenAndAdmin, async (req, res) => {
   try {
      const orders = await Order.find();
      res.status(200).json(orders);
   } catch (error) {
      res.status(500).json(error);
   }
});

module.exports = router;
