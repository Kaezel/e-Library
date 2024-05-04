const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')

// Routes for render page
router.get('/admin/users', adminController.getUsers);
router.get('/admin/books', adminController.getBooks);
router.get('/admin/categories', adminController.getCategories);

// Routes for functions delete data
router.get('/users/delete/:id', adminController.getDeleteUser);
router.post('/users/delete/:id', adminController.postDeleteUser);
router.get('/books/delete/:id', adminController.getDeleteBook);
router.post('/books/delete/:id', adminController.postDeleteBook);
router.get('/delete-categories/:id', adminController.getDeleteCategory);
router.post('/delete-categories/:id', adminController.postDeleteCategory);

// Routes for functions search data
router.get('/admin/search', adminController.getSearchAdmin);

// Routes for functions update data
router.get('/users/:id/edit', adminController.getEditUser);
router.post('/users/:id', adminController.postUpdateUser);
router.get('/books/:id/edit', adminController.getEditBook);
router.post('/books/:id', adminController.postUpdateBook);
router.get('/add-categories', adminController.getAddCategory)
router.post('/add-categories', adminController.postAddCategory)
router.get('/edit-categories/:id/edit', adminController.getEditCategory);
router.post('/edit-categories/:id', adminController.postUpdateCategory);

module.exports = router;