define( function(require) {

	'use strict';

	var Backbone = require('backbone');
	var WordsCollection = require('app/WordsCollection');

	var UserModel = Backbone.Model.extend({

		urlRoot: '/user',

		defaults: {
			words: new WordsCollection()
		},

		// prevents caching of fetched data
		fetch: function (options) {
			options = options || {};
			options.cache = false;
			return Backbone.Model.prototype.fetch.call(this, options);
		},

		// parse the response to get clean collection
		parse: function(response) {
			response.words = new WordsCollection(response.words);
			return response;
		}

	});

	return UserModel;

});