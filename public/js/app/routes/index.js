define([
    'app/MainInterfaceView',
    'app/FieldsetView',
    'app/WordsCollectionView'
], function(
    MainInterfaceView,
    FieldsetView,
    WordsCollectionView
) {

    'use strict';

    return {
        'home': MainInterfaceView,
		'fieldset': FieldsetView,
		'list': WordsCollectionView
    }
	
});