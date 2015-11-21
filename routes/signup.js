var passport = require('passport');

exports.get = function(req, res){
    res.render('register', {
        message: req.flash('message'),
        title: 'learn English words'
    });
};

exports.post = passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true
});
