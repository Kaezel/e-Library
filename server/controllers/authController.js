const bcrypt = require('bcrypt');
const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const users = require("../models/Account");
require('../models/database');

// GET and POST functions for LOGIN Admin

exports.getLoginAdmin = (req, res) => {
    res.render("admin", { 
        layout: './layouts/startingPage', 
    });
}

// GET and POST functions for LOGIN EMAIL

exports.getLogin = (req, res) => {
    const message = req.query.message || null;
    res.render("login", { 
        message: message, 
        layout: './layouts/startingPage', 
        email: "" 
    });
}

exports.postLogin = async(req, res) => {
    const { email } = req.body;

    try {
        const check = await users.findOne({ email: req.body.email });
        if (!check) {
            res.render("login", { 
                message: "Email not found.", 
                layout: './layouts/startingPage', 
                email: ""
            });
        } else {
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (!isPasswordMatch) {
                res.render("login", { 
                    message: "Wrong password.", 
                    layout: './layouts/startingPage', 
                    email: email
                });
            } else {
                if (email === "admin@elibrary.com" && isPasswordMatch) {
                    req.login(check, function(err) {
                        if (err) {
                            console.log(err);
                            res.render("login", { 
                                message: "An error occurred. Please try again.", 
                                layout: './layouts/startingPage',
                                email: email
                            });
                        } else {
                            req.session.userEmail = check.email;
                            res.redirect("/admin/users");
                        }
                    });
                } else {
                    req.login(check, function(err) {
                        if (err) {
                            console.log(err);
                            res.render("login", { 
                                message: "An error occurred. Please try again.", 
                                layout: './layouts/startingPage',
                                email: email
                            });
                        } else {
                            req.session.userEmail = check.email;
                            res.redirect("/index");
                        }
                    });
                }
            }
        }
    } catch {
        res.render("login", { 
            message: "An error occurred. Please try again.", 
            layout: './layouts/startingPage',
            email: email
        });
    }
}

// GET and POST functions for SIGNUP EMAIL

exports.getSignup = (req, res) => {
    res.render("signup", { 
        message: null, 
        layout: './layouts/startingPage' 
    });
}

exports.postSignup = async(req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password,
        securityQuestion: req.body.securityQuestion,
    }

    const existingUser = await users.findOne({ email: data.email });

    if (existingUser) {
        res.render('signup', { 
            message: 'Email already exists! Please use a different email.', 
            layout: './layouts/startingPage' 
        });
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;

        const userdata = await users.insertMany(data);
        console.log(userdata);

        res.redirect('/login?message=Account has been created.');
    }
}

// GET functions for LOGIN GOOGLE

// auth/google
exports.getGooglePassAuth = (req, res, next) => {
    passport.authenticate('google', { scope: [ 'email', 'profile' ] })(req, res, next);
}

// google/callback
exports.getGoogleAuthFailure = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/google/failure' })(req, res, next);
}

exports.getGoogleCallback = (req, res) => {
    req.session.userEmail = req.user.email;
    res.redirect('/protected');
}

// google/failure
exports.getGoogleFailure = (req, res, next) => {
    res.send('Failed to authenticate.');
}

// Checking before LOGIN

exports.isLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
}

exports.getProtected = (req, res) => {
    res.redirect("index");
}

// Configure Google OAuth2 strategy for authentication
const GOOGLE_CLIENT_ID = process.env.googleClientID;
const GOOGLE_CLIENT_SECRET = process.env.googleClientSECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true
    },
    async function(request, accessToken, refreshToken, profile, done) {
        const existingUser = await users.findOne({ email: profile.email });

        if (existingUser) {
            return done(null, existingUser);
        }

        const newUser = await new users({
            name: profile.displayName,
            email: profile.emails[0].value,
        }).save();

        done(null, newUser);
    }
));

// Serialize user ID to store in the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Deserialize user based on stored ID
passport.deserializeUser(async function(id, done) {
    const user = await users.findById(id);
    done(null, user);
});

// GET and POST functions for LOGOUT

exports.getLogout = (req, res) => {
    req.logout(() => {
        req.session.destroy();
        res.send('Goodbye!');
    });
}

exports.postLogout = (req, res) => {
    req.logout(() => {
        req.session.destroy(function(err) {
            if (err) {
                console.error(err);
                res.status(500).send('An error occurred while logging out.');
            } else {
                res.redirect('/');
            }
        });
    });
}

// GET and POST functions for FORGOT PASSWORD

exports.getForgotPw = (req, res) => {
    res.render('forgot-password', { 
        message: null, 
        layout: './layouts/startingPage', 
        email: "", 
        newPassword: "", 
        confirmPassword: "", 
        securityQuestion: "" 
    });
}

exports.postForgotPw = async(req, res) => {
    const { email, newPassword, confirmPassword, securityQuestion } = req.body;

    try {
        const user = await users.findOne({ email: email });

        if (!user) {
            res.render("forgot-password", { 
                message: "No account with this email address exists.", 
                layout: './layouts/startingPage',
                email: "", 
                newPassword: "", 
                confirmPassword: "", 
                securityQuestion: "" });
        } else if (newPassword !== confirmPassword) {
            res.render("forgot-password", { 
                message: "Passwords do not match.",
                layout: './layouts/startingPage',
                email: email,
                newPassword: newPassword,
                confirmPassword: "",
                securityQuestion: securityQuestion
            });
        } else if (user.securityQuestion !== securityQuestion) {
            res.render("forgot-password", { 
                message: "Your security question answer is incorrect.", 
                layout: './layouts/startingPage',
                email: email,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
                securityQuestion: ""
            });
        } else {
            const isMatch = await bcrypt.compare(newPassword, user.password);
            if (isMatch) {
                res.render("forgot-password", { 
                    message: "New password cannot be the same as the old password.", 
                    layout: './layouts/startingPage',
                    email: email,
                    newPassword: "",
                    confirmPassword: "",
                    securityQuestion: securityQuestion
                });
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
            
                user.password = hashedPassword;
                await user.save();
            
                res.redirect('/login?message=Password updated successfully.');
            }
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}