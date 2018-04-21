
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config=require('../config/database');
const User = require('../models/user');

//signup
router.post('/signup', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    //validating, is username already exists
    User.getUserByUserName(newUser.username, (err, user) => {
        if (err) throw err
        if (!user) {
            User.addUser(newUser, (err, newUser) => {
                if (err) {
                    res.json({ success: false, message: 'Failed to register' });
                } else {
                    res.json({ success: true, message: 'User registerd', user: newUser });
                }
            });
        }
        if (user) {
            return res.json({ success: false, message: 'username already exists.' });
        }
    })
});

//login 
router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    User.getUserByUserName(username, (err, user) => {
        if (err) throw error
        if (!user) {
            res.statusCode=400;
            return res.json({ success: false, message: 'User not found' });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err
            if (isMatch) {
                //generate token
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800
                });
                res.json({
                    success: true,
                    token: 'jwt ' + token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email
                    }
                });
            }
            else{
                return res.json({success:false,message:'wrong password'});
            }
        });
    });
});

//getting profile
router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    res.json({user:req.user})
});

module.exports = router;