var async = require('async');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var _ = require('underscore');
var User = require('../models/User').User;
var Words = require('../Words');
var WordSchema = require('../models/WordSchema');
var i18n = require('i18next');
var googleReCaptcha = require('../lib/googleReCaptcha');

module.exports = function (app) {

// serialize users into and deserialize users out of the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {


            // checks googleReCaptcha
            googleReCaptcha(req.body["g-recaptcha-response"], function(success) {
                if (!success) {

                    console.log('Invalid recaptcha');
                    return done(null, false,
                        req.flash('message', i18n.t('text.invalidRecaptcha') ) );

                } else {

                    // checks in mongodb if a user with username exists or not
                    User.findOne({ 'username':  username },
                        function(err, user) {
                            // In case of any error, return using the done method
                            if (err)
                                return done(err);
                            // Username does not exist, log error & redirect back
                            if (!user){
                                console.log('User Not Found with username ' + username);
                                return done(null, false,
                                    req.flash('message', i18n.t('text.invalidEmailOrPassword') ) );
                            }

                            // User exists but wrong password, log the error
                            // it uses User.schema.checkPassword method
                            if (!user.checkPassword(password)){
                                console.log('Invalid Password');

                                return done(null, false,
                                    req.flash('message', i18n.t('text.invalidEmailOrPassword') ) );
                            }

                            // User and password both match, return user from
                            // done method which will be treated like success
                            req.session.user = user;
                            return done(null, user);
                        }
                    );

                }
            });


        }
    ));


    passport.use('signup', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {

            // checks googleReCaptcha
            googleReCaptcha(req.body["g-recaptcha-response"], function (success) {
                // if recaptcha fails...
                if (!success) {

                    console.log('Invalid recaptcha');
                    return done(null, false,
                        req.flash('message', i18n.t('text.invalidRecaptcha')));

                } else {

                    findOrCreateUser = function () {

                        // find a user in Mongo with provided username
                        User.findOne({'username': username}, function (err, user) {
                            // In case of any error return
                            if (err) {
                                console.log('Error in SignUp: ' + err);
                                return done(err);
                            }
                            // already exists
                            if (user) {
                                console.log('User already exists');
                                return done(null, false,
                                    req.flash('message', i18n.t('text.suchUserExists')));
                            } else {
                                // if there is no user with that email
                                // create the user
                                var newUser = new User();

                                // set the user's local credentials
                                // it is registration by email and password, NOT by name
                                //so here username is email
                                newUser.username = username;
                                newUser.salt = Math.random() + '';
                                newUser.hashedPassword = newUser.encryptPassword(password);
                                newUser.words = [];
                                newUser.selectOptions = [];

                                // create and save word models and push them to user
                                _.each(Words, function (item) {
                                    item._user_id = newUser._id;
                                    var word = new WordSchema(item);
                                    word.save(function (err) {
                                        if (err) return console.log(err);
                                    });
                                    newUser.words.push(word);
                                });

                                // save the user
                                newUser.save(function (err) {
                                    if (err) {
                                        console.log('Error in Saving user: ' + err);
                                        throw err;
                                    }
                                    // set a cookie with the newUser's info
                                    req.session.user = newUser;
                                    console.log('User Registration succesful');
                                    return done(null, newUser);
                                });

                            }
                        });
                    };

                    // Delay the execution of findOrCreateUser and execute
                    // the method in the next tick of the event loop
                    process.nextTick(findOrCreateUser);
                }
            });
        }
    ));


    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());


};