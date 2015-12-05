define([
    'backbone',
    'app/WordModel',
    'underscore.string',
    'i18n!../../js/nls/ru',
    'text!../../templates/newEntry.html',
    'helpers/formToJSON',
    'helpers/some'
], function(
    // I chose this syntax instead of var Backbone = require('backbone')
    // to support minification during build, which otherwise fails
    Backbone,
    WordModel,
    s,
    i18n,
    newEntry
) {

    'use strict';

    var NewEntryFormView = Backbone.View.extend({

        events: {
            'blur .enWord': 'transferEnData',
            'blur .ruWord': 'transferRuData',
            'click .submit-entry': 'addNewEntry'
        },

        template: _.template( newEntry ),

        render: function() {
            this.$el.append( this.template( i18n ) );
            return this;
        },

        addNewEntry: function(event) {
            event = event || window.event;
            event.preventDefault();
            var target = event.target || event.srcElement;
            var form = $(target).closest('form');

            if ( !this.validateForm(form) ) {
                alert( i18n.alert.fillAllInputs );
                return;
            }

            var obj = form.serializeObject();

            if ( !this.validateObject(obj) ) {
                alert( i18n.alert.suchModelExists );
                return;
            }

            $('.res').empty();
            form.find('input[type="text"]')
                .not('[name="wordGroup"]')
                .val('');
            var wordModel = new WordModel( obj );
            this.collection.push(wordModel);
            wordModel.save({
                creator: 'user'
            });
        },

        validateObject: function(obj) {
            var status = true;
            this.collection.each(function(elem) {
                if ( s.clean( obj['enWord'].toLowerCase() ) ==
                    s.clean( elem.get('enWord').toLowerCase() ) ||
                    s.clean( obj['ruWord'].toLowerCase() ) ==
                    s.clean( elem.get('ruWord').toLowerCase() ) ) {
                    status = false;
                }
            });
            return status === true;
        },

        validateForm: function(form) {
            var blank = $(form)
                .find('input[type*="text"]')
                .some(function(elem) {
                    return s.isBlank( $(elem).val() );
                });
            return blank ? false : true;
        },

        transferEnData: function() {
            this.transferData('.enWord', 'input[name="enSynonyms"]');
        },

        transferRuData: function() {
            this.transferData('.ruWord', 'input[name="ruSynonyms"]');
        },

        transferData: function(word, syn) {
            var data = this.$el.find( word ).val();
            var text = this.$el.find( syn ).val();
            if ( s.isBlank( data ) ) return;
            if ( !s.isBlank( text ) ) {
                if ( text.indexOf(data + ',') != -1 ) return;
                this.$el.find( syn ).val( data + ', ' + text );
            } else {
                this.$el.find( syn ).val( data + ', ' );
            }
        }

    });

    return NewEntryFormView;

});