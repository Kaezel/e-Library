const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')


// GET and POST routes for LOGIN ADMIN

router.get("/admin", authController.getLoginAdmin);

// GET and POST routes for LOGIN EMAIL

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

// GET and POST routes for SIGNUP EMAIL

router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

// GET routes for LOGIN GOOGLE

router.get('/auth/google', authController.getGooglePassAuth);
router.get('/google/callback', authController.getGoogleAuthFailure, authController.getGoogleCallback);
router.get('/google/failure', authController.getGoogleFailure);

// Checking before LOGIN

router.get('/protected', authController.isLoggedIn, authController.getProtected);

// GET and POST routes for LOGOUT

router.get('/logout', authController.getLogout);
router.post('/logout', authController.postLogout);

// GET and POST routes for FORGOT PASSWORD

router.get('/forgot-password', authController.getForgotPw);
router.post('/forgot-password', authController.postForgotPw);

module.exports = router;