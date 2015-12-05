define(['backbone'], function(Backbone) {

    'use strict';

    var WordModel = Backbone.Model.extend({

        defaults: function() {

            return {
                enWord: 'blank',
                ruWord: 'blank',
                enSynonyms: 'blank',
                ruSynonyms: 'blank',
                grade: 'optional',
                wordGroup: 'my group',
                lesson: 1.1,
                creator: 'admin'
            };
        },

        // urlRoot (not just url) to pass /:id to the backend
        // upon DELETE and PUT methods
        urlRoot: '/words'

    });

    return WordModel;

});