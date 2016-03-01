var crypto = require('crypto');
var async = require('async');
var util = require('util');
var mongoose = require('../lib/mongoose');

var WordSchema = require('./WordSchema').schema;

var Schema = mongoose.Schema;

var schema = new Schema({

    email: {
        type: String,
        unique: true
    },

    hashedPassword: {
        type: String
    },

    salt: {
        type: String
    },

    resetPasswordToken: String,

    resetPasswordExpires: Number,

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
    return crypto.createHmac('sha256', this.salt).update(password).digest('hex');
};

schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

exports.User = mongoose.model('User', schema);