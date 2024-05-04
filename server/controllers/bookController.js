require('../models/database');
const Category = require('../models/Category');
const Book = require('../models/Book');
const nodemailer = require('nodemailer');

exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Book.find({}).sort({_id: -1}).limit(limitNumber);

    const cat = { latest };

    res.render('index', { title: 'Perpustakaan', categories, cat } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /all-categories
 * Categories 
*/
exports.allCategories = async(req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).sort({name: 1}).limit(limitNumber);

    let cat = {};
    for (let category of categories) {
      cat[category.name] = await Book.find({ 'category': category.name }).limit(limitNumber);
    }

    res.render('all-categories', { title: 'Perpustakaan', categories, cat } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /categories/:id
 * Categories By Id
*/

exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryName = req.params.id;
    const limitNumber = 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limitNumber;
    const categoryById = await Book.find({ 'category': categoryName }).skip(skip).limit(limitNumber);

    const dataLength = await Book.countDocuments({ 'category': categoryName });
    const totalPages = Math.ceil(dataLength / limitNumber);
    const lowerBound = skip + 1;
    const upperBound = Math.min(skip + limitNumber, dataLength);

    res.render('categories', { 
      title: 'Perpustakaan', 
      categoryById, 
      activeCategory: categoryName, 
      dataLength,
      currentPage: page,
      totalPages: totalPages,
      lowerBound,
      upperBound,
    } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /book/:id
 * Book 
*/
exports.exploreBook = async(req, res) => {
  try {
    let bookId = req.params.id;
    const book = await Book.findById(bookId);
    res.render('book', { title: 'Perpustakaan', book } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 

/**
 * POST /search
 * Search 
*/
exports.searchBook = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let book = await Book.find({ name: { $regex: searchTerm, $options: 'i' } });
    res.render('search', { title: 'Perpustakaan', book } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
  
}

/**
 * GET /explore-latest
 * Explore Latest 
*/
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 10;
    const book = await Book.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Perpustakaan', book } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /view-all
 * View all books
*/
exports.viewAll = async(req, res) => {
  try {
    const limitNumber = 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limitNumber;
    const book = await Book.find({}).sort({ name: 1 }).skip(skip).limit(limitNumber);
    
    const dataLength = await Book.countDocuments({});
    const totalPages = Math.ceil(dataLength / limitNumber);
    const lowerBound = skip + 1;
    const upperBound = Math.min(skip + limitNumber, dataLength);
    
    res.render('view-all', { 
      title: 'Perpustakaan', 
      book,
      dataLength,
      currentPage: page,
      totalPages: totalPages,
      lowerBound,
      upperBound,
    } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET and POST /submit-book
 * Submit Book
*/
exports.submitBook = async(req, res) => {
  try {
    const categories = await Category.find().sort({name: 1});

    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-book', { title: 'Perpustakaan', infoErrorsObj, infoSubmitObj, email: req.session.userEmail, categories } );
  } catch (error) {
    req.flash('infoErrors', error);
    res.redirect('/submit-book');
  }
}

exports.submitBookOnPost = async (req, res) => {
  try {

    let imageUploadFile;
    let imageBuffer;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files were uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      imageBuffer = imageUploadFile.data;

    }

    const existingBook = await Book.findOne({ name: req.body.name });
    if (existingBook) {
      req.flash('infoErrors', 'The book already exists. Contact admin to add a review to the book.');
      return res.redirect('/submit-book');
    }

    const newBook = new Book({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ulasan: req.body.ulasan,
      category: req.body.category,
      image: {
        data: imageBuffer,
        contentType: 'image/png'
      }
    });
    
    await newBook.save();

    req.flash('infoSubmit', 'Book has been added.')
    res.redirect('/submit-book');
  } catch (error) {
    req.flash('infoErrors', error);
    res.redirect('/submit-book');
  }
}

// GET checkBook to check input by name

exports.checkBook = async (req, res) => {
  try {
    const bookName = req.query.name;

    const existingBook = await Book.findOne({ name: bookName });

    if (existingBook) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET book.image by ID

exports.bookImageById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || !book.image.data) {
      return res.status(404).send();
    }
    res.set('Content-Type', book.image.contentType);
    res.send(book.image.data);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
}

exports.getAbout = (req, res) => {
  res.render( "about" );
}

exports.getContact = (req, res) => {
  res.render( "contact-us" );
}

// Handle GET request for the contact form page
exports.getContactPage = (req, res) => {
  res.sendFile(__dirname + '/views/contact-us.ejs');
};

// Handle POST request when the contact form is submitted
exports.handleContactForm = (req, res) => {
  console.log(req.body);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'richard.535220018@stu.untar.ac.id',
      pass: 'Alfonsus02',
    },
  });

  const mailOptions = {
    from: req.body.email,
    to: 'richard.535220018@stu.untar.ac.id',
    subject: `Message from ${req.body.email}: ${req.body.subject}`,
    text: req.body.message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send('error');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('success');
    }
  });
};