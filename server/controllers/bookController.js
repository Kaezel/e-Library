require('../models/database');
const Category = require('../models/Category');
const Book = require('../models/Book');


exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Book.find({}).sort({_id: -1}).limit(limitNumber);

    const cat = { latest };

    res.render('index', { title: 'Perpustakaan', categories, cat } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /all-categories
 * Categories 
*/

exports.allCategories = async(req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const Teknologi = await Book.find({ 'category': 'Teknologi' }).limit(limitNumber);
    const Fiksi = await Book.find({ 'category': 'Fiksi' }).limit(limitNumber);
    const Horor = await Book.find({ 'category': 'Horor' }).limit(limitNumber);

    const cat = { Teknologi, Fiksi, Horor };

    res.render('all-categories', { title: 'Perpustakaan', categories, cat } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 

/**
 * GET /categories
 * Categories 
*/

exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 10;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Perpustakaan', categories } );
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
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Book.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Perpustakaan', categoryById, activeCategory: categoryId } );
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
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

/**
 * POST /search
 * Search 
*/

exports.searchBook = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let book = await Book.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Perpustakaan', book } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
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
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /view-all
 * View all books
*/

exports.viewAll = async(req, res) => {
  try {
    const limitNumber = 0;
    const book = await Book.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('view-all', { title: 'Perpustakaan', book } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /submit-book
 * Submit Book
*/
exports.submitBook = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-book', { title: 'Perpustakaan', infoErrorsObj, infoSubmitObj, email: req.session.userEmail } );
}

/**
 * POST /submit-book
 * Submit Book
*/
exports.submitBookOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newBook = new Book({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ulasan: req.body.ulasan,
      category: req.body.category,
      image: newImageName
    });
    
    await newBook.save();

    req.flash('infoSubmit', 'Book has been added.')
    res.redirect('/submit-book');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-book');
  }
}




// Delete Book
// async function deleteBook(){
//   try {
//     await Book.deleteOne({ name: 'New Book From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteBook();


// Update Book
// async function updateBook(){
//   try {
//     const res = await Book.updateOne({ name: 'New Book' }, { name: 'New Book Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateBook();