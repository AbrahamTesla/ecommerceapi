const router = require('express').Router();

//GET method
router.get('/usertest', (req, res) => {
   res.send('Usertest is successful');
});

//Post new user
router.post('/userposttest', (req, res) => {
   const username = req.body.username;
   res.send('your username is:' + username);
});
module.exports = router;
