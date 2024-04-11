const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

/**
 * App Routes 
*/
router.get('/index', bookController.homepage);
router.get('/all-categories', bookController.allCategories);
router.get('/book/:id', bookController.exploreBook );
router.get('/categories', bookController.exploreCategories);
router.get('/categories/:id', bookController.exploreCategoriesById);
router.post('/search', bookController.searchBook);
router.get('/explore-latest', bookController.exploreLatest);
router.get('/view-all', bookController.viewAll);
router.get('/submit-book', bookController.submitBook);
router.post('/submit-book', bookController.submitBookOnPost);

module.exports = router;