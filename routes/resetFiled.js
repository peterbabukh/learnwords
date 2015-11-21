var User = require('../models/User').User;
var WordSchema = require('../models/WordSchema');
var Words = require('../Words');
var _ = require('underscore');


exports.get = function(req, res) {

    User.findOne({'_id': req.session.user._id}, function (err, user) {
        if (err) return console.log(err);

        User.
            find({ '_id': req.session.user._id }).
            select('words').
            exec(function(err, data) {

                // remove words with creator == 'admin'
                _.each(data[0].words, function(item) {
                    if (item.creator == 'admin') {
                        var doc = user.words.id(item._id).remove();
                    }
                });

                // creates and saves word models from Words.json and pushes them to user
                _.each(Words, function(item) {
                    item._user_id = user._id;
                    var word = new WordSchema(item);
                    word.save(function(err){
                        if (err) return console.log(err);
                    });
                    user.words.push( word );
                });

                // reset selectOptions to [] to avoid conflict in mainInterfaceView rendering
                user.selectOptions = [];
                user.markModified('selectOptions');

                user.save(function(err) {
                    if (err) return console.log(err);

                    return res.redirect('/list');
                });

            });

    });

};