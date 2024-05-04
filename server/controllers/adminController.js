const User = require("../models/Account");
const Book = require('../models/Book');
const Category = require('../models/Category');
require('../models/database');

// GET and POST functions for users, books and categories page

async function getDataAndRender(req, res, model, pageName, sortOption) {
    try {
        const message = req.query.message || null;
        const limitNumber = 10;
        const page = Number(req.query.page) || 1;
        const skip = (page - 1) * limitNumber;
        const searchTerm = req.query.searchTerm;
        let data;
        let dataLength;

        if (searchTerm) {
            data = await model.find({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { email: { $regex: searchTerm, $options: 'i' } },
                    { category: { $regex: searchTerm, $options: 'i' } }
                ]
            }).skip(skip).limit(limitNumber);
            dataLength = await model.countDocuments({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { email: { $regex: searchTerm, $options: 'i' } },
                    { category: { $regex: searchTerm, $options: 'i' } }
                ]
            });
        } else {
            data = await model.find({}).sort(sortOption).skip(skip).limit(limitNumber);
            dataLength = await model.countDocuments({});
        }

        const totalPages = Math.ceil(dataLength / limitNumber);
        const lowerBound = skip + 1;
        const upperBound = Math.min(skip + limitNumber, dataLength);

        res.render('admin', {
            message: message,
            page: pageName, 
            [pageName]: data,
            dataLength: dataLength,
            lowerBound,
            upperBound,
            currentPage: page,
            totalPages: totalPages,
            layout: './layouts/adminLayout'
        });
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured" });
    }
}

exports.getUsers = async(req, res) => {
    await getDataAndRender(req, res, User, 'users', { _id: -1 });
}

exports.getBooks = async(req, res) => {
    await getDataAndRender(req, res, Book, 'books', { _id: -1 });
}

exports.getCategories = async(req, res) => {
    try {
        const message = req.query.message || null;
        const limitNumber = 10;
        const page = Number(req.query.page) || 1;
        const skip = (page - 1) * limitNumber;
        const searchTerm = req.query.searchTerm;
        let data;
        let dataLength;

        if (searchTerm) {
            data = await Category.find({ name: { $regex: searchTerm, $options: 'i' } }).skip(skip).limit(limitNumber);
            dataLength = await Category.countDocuments({ name: { $regex: searchTerm, $options: 'i' } });
        } else {
            data = await Category.find({}).sort({ _id: -1 }).skip(skip).limit(limitNumber);
            dataLength = await Category.countDocuments({});
        }

        for (let category of data) {
            category.bookCountByCategory = await Book.countDocuments({ 'category': category.name });
        }

        const totalPages = Math.ceil(dataLength / limitNumber);
        const lowerBound = skip + 1;
        const upperBound = Math.min(skip + limitNumber, dataLength);

        res.render('admin', {
            message: message,
            page: 'categories', 
            categories: data,
            dataLength: dataLength,
            lowerBound,
            upperBound,
            currentPage: page,
            totalPages: totalPages,
            layout: './layouts/adminLayout'
        });
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured" });
    }
}


// GET and POST functions for search data

exports.getSearchAdmin = async function(req, res) {
    const searchTerm = req.query.searchTerm;
    const searchType = req.query.searchType;

    switch(searchType) {
        case 'users':
            exports.getUsers(req, res);
            break;
        case 'books':
            exports.getBooks(req, res);
            break;
        case 'categories':
            exports.getCategories(req, res);
            break;
        default:
            res.status(400).send({message: "Invalid search type"});
    }
};

// GET and POST functions for delete users, books, and categories data from database

// Delete User
async function getDelete(req, res, model, redirectPath, renderPath) {
    try {
        const item = await model.findById(req.params.id);
        res.render(renderPath, { [renderPath]: item });
    } catch (err) {
        console.log(err);
        res.redirect(redirectPath);
    }
}

async function postDelete(req, res, model, redirectPath, message) {
    try {
        await model.findByIdAndDelete(req.params.id);
        res.redirect(`${redirectPath}?message=${message}`);
    } catch (err) {
        console.log(err);
        res.redirect(redirectPath);
    }
}

// Delete User
exports.getDeleteUser = async function(req, res) {
    await getDelete(req, res, User, '/admin/users', 'user');
}

exports.postDeleteUser = async function(req, res) {
    await postDelete(req, res, User, '/admin/users', 'User has been deleted.');
}

// Delete Book
exports.getDeleteBook = async function(req, res) {
    await getDelete(req, res, Book, '/admin/books', 'book');
}

exports.postDeleteBook = async function(req, res) {
    await postDelete(req, res, Book, '/admin/books', 'Book has been deleted.');
}

// Delete Category
exports.getDeleteCategory = async function(req, res) {
    await getDelete(req, res, Category, '/admin/categories', 'category');
}

exports.postDeleteCategory = async function(req, res) {
    await postDelete(req, res, Category, '/admin/categories', 'Category has been deleted.');
}

// GET and POST functions for edit data

// edit user data
exports.getEditUser = async function(req, res) {
    var userId = req.params.id;

    try {
        var user = await User.findById(userId);
        res.render('adminEdit', { 
            page: 'users',
            user: user,
            layout: './layouts/editLayout'
        });
    } catch (err) {
        console.log(err);
        res.redirect('/admin/users');
    }
}

exports.postUpdateUser = async function(req, res){
    var userId = req.params.id;

    try {
        var updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        res.redirect('/admin/users?message=User has been updated successfully.');
    } catch (err) {
        console.log(err);
        res.redirect('/admin/users');
    }
}

// edit book data
exports.getEditBook = async function(req, res) {
    var bookId = req.params.id;

    try {
        var book = await Book.findById(bookId);
        res.render('adminEdit', { 
            page: 'books', 
            book: book,
            layout: './layouts/editLayout'
        });
    } catch (err) {
        console.log(err);
        res.redirect('/admin/books');
    }
}

exports.postUpdateBook = async function(req, res){
    var bookId = req.params.id;

    let imageUploadFile;
    let imageBuffer;
    let updateData = {...req.body};

    if(req.files && Object.keys(req.files).length !== 0){
        imageUploadFile = req.files.image;
        imageBuffer = imageUploadFile.data;
        updateData.image = {
            data: imageBuffer,
            contentType: 'image/png'
        };
    }

    try {
        var updatedBook = await Book.findByIdAndUpdate(bookId, updateData, { new: true });
        res.redirect('/admin/books?message=Book has been updated successfully.');
    } catch (err) {
        console.log(err);
        res.redirect('/admin/books');
    }
}

// add category data
exports.getAddCategory = function(req, res){
    res.render('adminEdit', { 
        page: 'addCategory', 
        layout: './layouts/editLayout'
    });
}

exports.postAddCategory = async(req, res) => {
    const data = {
        name: req.body.name,
    }

    const existingCategory = await Category.findOne({ name: data.name });

    if (existingCategory) {
        res.redirect('/admin/categories?message=Category already exists!');
    } else {
        const categorydata = await Category.insertMany(data);
        console.log(categorydata);

        res.redirect('/admin/categories?message=Category has been added successfully.');
    }
}

// edit category data
exports.getEditCategory = async function(req, res) {
    var categoryId = req.params.id;

    try {
        var category = await Category.findById(categoryId);
        res.render('adminEdit', { 
            page: 'categories',
            category: category,
            layout: './layouts/editLayout'
        });
    } catch (err) {
        console.log(err);
        res.redirect('/admin/categories');
    }
}

exports.postUpdateCategory = async function(req, res){
    var categoryId = req.params.id;

    try {
        var updatedCategory = await Category.findByIdAndUpdate(categoryId, req.body, { new: true });
        res.redirect('/admin/categories?message=Category has been updated successfully.');
    } catch (err) {
        console.log(err);
        res.redirect('/admin/categories');
    }
}