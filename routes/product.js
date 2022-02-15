const Product = require('../models/Product');
const router = require('express').Router();
const {
   verifyToken,
   verifyTokenAndAuthorization,
   verifyTokenAndAdmin,
} = require('./verifyToken');

//@create product  POST method

router.post('/', verifyTokenAndAdmin, async (req, res) => {
   const newProduct = new Product(req.body);

   try {
      const savedProduct = await newProduct.save();
      res.status(200).json(savedProduct);
   } catch (error) {
      res.status(500).json(error);
   }
});
//@Update a product   PUT METHOD
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
   try {
      const updatedProduct = await Product.findByIdAndUpdate(
         //Taking the paramater Id
         req.params.id,
         {
            //set my req.body
            $set: req.body,
         },
         //New to true to update the 'SET' above done in our request body
         { new: true }
      );
      res.status(200).json(updatedProduct);
   } catch (error) {
      res.status(500).json(error);
   }
});

//@Delete product  DELETE METHOD
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
   try {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json('Product is successfully deleted');
   } catch (error) {
      res.status(500).json(error);
   }
});

//@Find product by user & admin thus no need to verify token GET method
router.get('/find/:id', async (req, res) => {
   try {
      const product = await Product.findById(req.params.id);

      res.status(200).json(product);
   } catch (error) {
      res.status(500).json(error);
   }
});

//@Find all products by admin and user by new & Category GET method thus no need for verify token
router.get('/', async (req, res) => {
   const qNew = req.query.new;
   const qCategory = req.query.category;

   try {
      let products;
      if (qNew) {
         products = await Product.find().sort({ createdAt: -1 }).limit(5);
      } else if (qCategory) {
         //products that has categories within our models - product.categories
         products = await Product.find({
            categories: {
               $in: [qCategory],
            },
         });
      } else {
         //If no category, all products within our database
         products = await Product.find();
      }
      res.status(200).json(products);
   } catch (error) {
      res.status(500).json(error);
   }
});

module.exports = router;
