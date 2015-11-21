define( function(require) {

	'use strict';

	var Backbone = require('backbone');
	var WordsCollection = require('app/WordsCollection');

	var UserModel = Backbone.Model.extend({

		urlRoot: '/user',

		defaults: {
			words: new WordsCollection()
		},

		// parse the response to get clean collection
		parse: function(response) {
			response.words = new WordsCollection(response.words);
			return response;
		}

	});

	return UserModel;

});