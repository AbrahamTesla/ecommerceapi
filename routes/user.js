const User = require('../models/User');
const {
   verifyToken,
   verifyTokenAndAuthorization,
   verifyTokenAndAdmin,
} = require('./verifyToken');

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

//@Find all Users  GET method
router.get('/', verifyTokenAndAdmin, async (req, res) => {
   //For querying - which is 'new' the name of our query
   const query = req.query.new;
   try {
      //If there's a 'query' find 5 users and sort it. Else, if there's no query return all users
      const users = query
         ? await User.find().sort({ _id: -1 }).limit(5)
         : await User.find();
      res.status(200).json(users);
   } catch (error) {
      res.status(500).json(error);
   }
});

//@Get Users stats returning total number of users per month limit to current year only.   GET METHOD

router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
   const date = new Date();
   //Get last year
   const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

   try {
      //Using mongoose aggregate to group items together
      const data = await User.aggregate([
         //match my conditon greater than last year but less than today
         { $match: { createdAt: { $gte: lastYear } } },
         {
            $project: {
               //creating a variable 'month' by taking the month from the mongoDB createAt
               month: { $month: '$createdAt' },
            },
         },
         {
            //group by '_id' unique id by month (e.g 9 = sept, 8 = Aug) and get total user number which the sume of all registered user by 1
            $group: {
               _id: '$month',
               total: { $sum: 1 },
            },
         },
      ]);
      res.status(200).json(data);
   } catch (error) {
      res.status(500).json(error);
   }
});

module.exports = router;
