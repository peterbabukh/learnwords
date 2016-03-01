var User = require('../models/User').User;
var WordSchema = require('../models/WordSchema');


exports.delete = function(req, res) {

    User.findOne({'_id': req.session.user._id}, function (err, user) {
        if (err) return next(err);

        // remove a word item by id
        user.words.id( req.params.id ).remove(function (err) {
            if (err) return next(err);

            // reset selectOptions to [] to avoid conflict in mainInterfaceView rendering
            user.selectOptions = [];
            user.markModified('selectOptions');

            user.save(function(err) {
                if (err) return next(err);

                res.send(user);

            });
        });
    });
};


exports.put = function(req, res) {

    // Updates item in subdoc.
    // .findOneAndUpdate() method will return the modified document
    // or otherwise you can just use .update() as a method
    // if you don't need the document returned
    User.findOneAndUpdate({ '_id': req.session.user._id, 'words._id': req.params.id },
        {
            '$set': {
                'words.$': req.body
                // 'words.$.attribute': req.body.attribute
            }
        },
        function(err,word) {
            if (err) return next(err);
            res.end();
        }
    );

};


exports.post = function(req, res) {

    User.findOne({'_id': req.session.user._id}, function (err, user) {
        if (err) return next(err);

        var obj = {};
        obj.wordGroup = req.body.wordGroup;
        obj.enWord = req.body.enWord;
        obj.ruWord = req.body.ruWord;
        obj.enSynonyms = req.body.enSynonyms;
        obj.ruSynonyms = req.body.ruSynonyms;
        obj.grade = 'факультатив';
        obj.lesson = req.body.lesson;
        obj.creator = req.body.creator;
        obj._user_id = user._id;

        var word = new WordSchema(obj);

        user.words.push( word );

        user.save(function(err) {
            if (err) return next(err);
			
            res.send(user);

        });

    });

};