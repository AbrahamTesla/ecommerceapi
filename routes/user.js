const User = require('../models/User');
const {
   verifyToken,
   verifyTokenAndAuthorization,
   verifyTokenAndAdmin,
} = require('./verfiyToken');

const router = require('express').Router();

//@Update a user   PUT METHOD
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
   //Verify password since user can update their password
   if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
         password,
         process.env.SECRET_KEY
      ).toString();
   }
   try {
      const updatedUser = await User.findByIdAndUpdate(
         //Taking the paramater Id
         req.params.id,
         {
            //set my req.body
            $set: req.body,
         },
         //New to true to update the 'SET' above done in our request body
         { new: true }
      );
      res.status(200).json(updatedUser);
   } catch (error) {
      res.status(500).json(error);
   }
});

//@Delete user  DELETE METHOD
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
   try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('User is successfully deleted');
   } catch (error) {
      res.status(500).json(error);
   }
});

//@Find User by admin  GET method
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
   try {
      const user = await User.findById(req.params.id);

      //Only sending information except 'password' therefore destructure
      const { password, ...others } = user._doc;

      res.status(200).json(others);
   } catch (error) {
      res.status(500).json(error);
   }
});

module.exports = router;
