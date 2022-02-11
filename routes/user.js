const User = require('../models/User');
const { verifyToken, verifyTokenAndAuthorization } = require('./verfiyToken');

const router = require('express').Router();

//@Update PUT
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

module.exports = router;
