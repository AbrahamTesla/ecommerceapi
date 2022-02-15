const Cart = require('../models/Cart');
const router = require('express').Router();
const {
   verifyToken,
   verifyTokenAndAuthorization,
   verifyTokenAndAdmin,
} = require('./verfiyToken');

//@Create CART  POST method

router.post('/', verifyToken, async (req, res) => {
   const newCart = new Cart(req.body);

   try {
      const savedCart = await newCart.save();
      res.status(200).json(savedCart);
   } catch (error) {
      res.status(500).json(error);
   }
});
//@Update CART  PUT METHOD
//User can update it's own cart - verifyTokenAndAuthorization
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
   try {
      const updatedCart = await Cart.findByIdAndUpdate(
         //Taking the paramater Id
         req.params.id,
         {
            //set my req.body
            $set: req.body,
         },
         //New to true to update the 'SET' above done in our request body
         { new: true }
      );
      res.status(200).json(updatedCart);
   } catch (error) {
      res.status(500).json(error);
   }
});

//@Delete CART  DELETE METHOD
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
   try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json('Cart is successfully deleted');
   } catch (error) {
      res.status(500).json(error);
   }
});

//@Get user cart by user
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
   try {
      //findOne since every user has one cart
      const cart = await Cart.findOne({ userId: req.params.userId });

      res.status(200).json(cart);
   } catch (error) {
      res.status(500).json(error);
   }
});

//@GET ALL all Admin has access thus verifyTokenAndAdmin
router.get('/', verifyTokenAndAdmin, async (req, res) => {
   try {
      const carts = await Cart.find();
      res.status(200).json(carts);
   } catch (error) {
      res.status(500).json(error);
   }
});

module.exports = router;
