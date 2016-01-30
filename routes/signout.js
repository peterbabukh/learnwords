var User = require('../models/User').User;

exports.get = function(req, res) {

    // remove all words attached to this user
    User.findOne({'_id': req.session.user._id}, function(err, user) {
        if (err) return console.log(err);

        // deletes all words
        while (user.words.length) {
            user.words[0].remove();
        }

        // saves the user to fix changes
        user.save(function(err) {
            if (err) return console.log(err);

            // remove the user
            User.remove({'_id': req.session.user._id}, function (err) {
                if (err) return console.log(err);

                req.session.destroy(function(err) {
                    if (err) return console.log(err);

                    return res.redirect('/');

                });
            });
        });
    });
};
