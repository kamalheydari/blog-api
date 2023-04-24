const router = require('express').Router();

const userController = require('../controllers/userController');

//? desc registe handle
//? route post /users/register
router.post('/register', userController.createUser);

//? desc login handle
//? route post/users/login
router.post('/login', userController.handleLogin);

//? desc handle forget password
//? route post/users/forget-password
router.post('/forget-password', userController.handleForgetPassword);

// ? desc   Handle Reset Password
// ? route  POST /users/reset-password/:token
router.post('/reset-password/:token', userController.handleResetPassword);

module.exports = router;