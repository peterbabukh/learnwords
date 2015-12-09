define( function(require) {

	'use strict';

	var Backbone = require('backbone');

	var UserModel = Backbone.Model.extend({

		urlRoot: '/grades'

	});

	return UserModel;

});