var crypto = require('crypto');
var async = require('async');
var util = require('util');
var mongoose = require('../lib/mongoose');

var WordSchema = require('./WordSchema').schema;

var Schema = mongoose.Schema;

var schema = new Schema({

    name: {
        type: String
    },

    username: {
        type: String,
        unique: true,
        required: true
    },

     hashedPassword: {
         type: String,
         required: true
     },

     salt: {
         type: String,
         required: true
     },

     created: {
         type: Date,
         default: Date.now
     },

    modified: {
        type: Date,
        default: Date.now
    },

    words: [WordSchema],

    selectOptions: {
        type: [Schema.Types.Mixed]
    }

});

schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

exports.User = mongoose.model('User', schema);