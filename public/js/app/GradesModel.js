define([
	'backbone'
], function(Backbone) {

	'use strict';

	var UserModel = Backbone.Model.extend({

		urlRoot: '/grades'

	});

	return UserModel;

});