var User = require('../models/User').User;
var WordSchema = require('../models/WordSchema');
var Words = require('../Words');
var _ = require('underscore');


exports.get = function(req, res) {

    User.findOne({'_id': req.session.user._id}, function (err, user) {
        if (err) return next(err);

        // deletes all words
        while (user.words.length) {
            user.words[0].remove();
        }

        // creates and saves word models and pushes them to user
        _.each(Words, function(item) {
            item._user_id = user._id;
            var word = new WordSchema(item);
            user.words.push( word );
        });

        // reset selectOptions to [] to avoid conflict in mainInterfaceView rendering
        user.selectOptions = [];
        user.markModified('selectOptions');

        user.save(function(err) {
            if (err) return next(err);

            return res.redirect('/list');
        });

    });
};