const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

/**
 * App Routes 
*/
router.get('/index', bookController.homepage);
router.get('/book/:id', bookController.exploreBook );
router.get('/book/:id/image', bookController.bookImageById);
router.get('/all-categories', bookController.allCategories);
router.get('/categories/:id', bookController.exploreCategoriesById);
router.post('/search', bookController.searchBook);
router.get('/explore-latest', bookController.exploreLatest);
router.get('/view-all', bookController.viewAll);
router.get('/submit-book', bookController.submitBook);
router.post('/submit-book', bookController.submitBookOnPost);
router.get('/about', bookController.getAbout);
router.get('/contact-us', bookController.getContact);
router.get('/', bookController.getContactPage);
router.post('/', bookController.handleContactForm);
router.get('/check-book', bookController.checkBook);

module.exports = router;