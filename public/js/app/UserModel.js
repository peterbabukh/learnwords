define([
	'backbone',
	'app/WordsCollection'
], function(Backbone, WordsCollection) {

	'use strict';

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