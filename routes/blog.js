const router = require('express').Router();

const blogController = require('../controllers/blogController');

//? desc weblog index page
//? route get /
router.get('/', blogController.getIndex);

//? desc weblog post page
//? route get /:id
router.get('/post/:id', blogController.getSinglePost);

// ? desc Handle Contact Page
// ? route POST /contact
router.post('/contact', blogController.handleContactPage);

module.exports = router;