// authController.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const path = require("path");
const collection = require("../models/Account");
require('../models/auth');

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

router.get("/login", (req, res) => {
  res.render("login", { message: null, layout: false });
});

router.get("/signup", (req, res) => {
  res.render("signup", { message: null, layout: false });
});

router.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
  
    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ email: data.email });
  
    if (existingUser) {
        // Render the same page with an error message
        res.render('signup', { message: 'Email already exists! Please use a different email.', layout: false });
    } else {
    // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
  
        data.password = hashedPassword; // Replace the original password with the hashed one
  
        const userdata = await collection.insertMany(data);
        console.log(userdata);
  
        res.render("login", { message: null, layout: false });
    }
});

router.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email });
        if (!check) {
            res.render("login", { message: "Email not found!", layout: false });
        } else {
            // Compare the hashed password from the database with the plaintext password
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (!isPasswordMatch) {
                res.render("login", { message: "Wrong password!", layout: false });
            } else {
                // Log in the user
                req.login(check, function(err) {
                    if (err) {
                        console.log(err);
                        res.render("login", { message: "An error occurred. Please try again.", layout: false });
                    } else {
                        req.session.userEmail = check.email;
                        res.redirect("/index");
                    }
                });
            }
        }
    } catch {
        res.render("login", { message: "An error occurred. Please try again.", layout: false });
    }
});

router.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

router.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/protected',
        failureRedirect: '/google/failure'
    })
);

router.get('/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

router.get('/protected', isLoggedIn, (req, res) => {
  res.redirect("index");
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        req.session.destroy();
        res.send('Goodbye!');
    });
});

router.post('/logout', function(req, res) {
    req.logout(() => {
        req.session.destroy(function(err) {
            if (err) {
                // handle error
            } else {
                res.redirect('/');
            }
        });
    });
});

module.exports = router;