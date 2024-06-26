const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(fileUpload());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('starting', { layout: './layouts/startingPage' });
});

const bookRoutes = require('./server/routes/bookRoutes.js')
app.use('/', bookRoutes);

const authRoutes = require('./server/routes/authRoutes.js');
app.use('/', authRoutes);

const adminRoutes = require('./server/routes/adminRoutes');
app.use('/', adminRoutes);

app.listen(port, ()=> console.log(`Running on port http://localhost:${port}`));