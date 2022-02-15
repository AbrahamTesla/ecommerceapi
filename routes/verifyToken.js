const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
   const authHeader = req.headers.token;

   if (authHeader) {
      //Space between Bearer and the token by taking the second array [1] which is our token
      const token = authHeader.split(' ')[1];
      //Used 'verify' function to validate token.  If not verified, return the error.
      jwt.verify(token, process.env.JWT, (err, user) => {
         if (err) res.status(403).json('Token is not valid');

         //If everything is authenticated assign 'req.user' to 'user' params above
         req.user = user;

         //Go to our router - next destination
         next();
      });
   } else {
      res.status(401).json("You're not aunthenticated");
   }
};

const verifyTokenAndAuthorization = (req, res, next) => {
   verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
         next();
      } else {
         res.status(403).json("You're not allowed");
      }
   });
};

//Verify if its Admin which has access to orders and products
const verifyTokenAndAdmin = (req, res, next) => {
   verifyToken(req, res, () => {
      if (req.user.isAdmin) {
         next();
      } else {
         res.status(403).json("You're not allowed");
      }
   });
};

module.exports = {
   verifyToken,
   verifyTokenAndAuthorization,
   verifyTokenAndAdmin,
};
