const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

//@ POST Register new user
router.post('/register', async (req, res) => {
   //Destructuring
   const { username, email, password } = req.body;

   const newUser = new User({
      username,
      email,
      //CrytoJS , and tostring to save in DB
      password: CryptoJS.AES.encrypt(
         password,
         process.env.SECRET_KEY
      ).toString(),
   });

   try {
      const saveUser = await newUser.save();
      //Successfully added 201
      res.status(201).json(saveUser);
   } catch (error) {
      res.status(501).json(error);
   }
});
//LOGIN
router.post('/login', async (req, res) => {
   const { username } = req.body;

   try {
      //Using method findOne to find the right user
      const user = await User.findOne({ username });

      //If wrong user , 401 wrong credentials
      !user && res.status(401).json('Wrong Credentials');

      //Using CryptoJS to decrypt
      const hashedPassword = CryptoJS.AES.decrypt(
         user.password,
         process.env.SECRET_KEY
      );

      //Turning it to string again with enconding Utf8
      const passwordToString = hashedPassword.toString(CryptoJS.enc.Utf8);

      //If wrong password, 401 wrong credentials
      passwordToString !== req.body.password &&
         res.status(401).json('Wrong Credentials');

      const jwtToken = jwt.sign(
         {
            id: user._id,
            isAdmin: user.isAdmin,
         },
         process.env.JWT,
         { expiresIn: '3d' }
      );
      //However, best practice never send your password.  Therefore, use spread operator send 'others' except password
      // res.status(201).json(user);
      //user._doc due to how mongoDB store information
      const { password, ...others } = user._doc;

      res.status(201).json({ ...others, jwtToken });
   } catch (error) {
      res.status(501).json(error);
      console.log(error);
   }
});
module.exports = router;
