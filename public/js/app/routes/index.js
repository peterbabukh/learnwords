define( function(require) {

    'use strict';
	
	var MainInterfaceView = require('app/MainInterfaceView');
    var FieldsetView = require('app/FieldsetView');
    var WordsCollectionView = require('app/WordsCollectionView');

    return {
        'home': MainInterfaceView,
		'fieldset': FieldsetView,
		'list': WordsCollectionView
    }
	
});