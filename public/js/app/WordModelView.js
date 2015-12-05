define([
    'backbone',
    'underscore.string',
    'i18n!../../js/nls/ru',
    'text!../../templates/wordItem.html',
    'text!../../templates/wordItemHeader.html',
    'helpers/some'
], function(
    // I chose this syntax instead of var Backbone = require('backbone')
    // to support minification during build, which otherwise fails
    Backbone,
    s,
    i18n,
    wordItem,
    wordItemHeader
) {

    'use strict';

    var WordItemView = Backbone.View.extend({

        tagName: 'tr',

        className: 'table-item',

        initialize: function() {
            this.model.on('destroy', this.remove, this);
            this.model.on('change', this.render, this);
        },

        events: {
            'click .delete': 'deleteModel',
            'click .edit': 'editModel',
            'click .saveEdits': 'saveEdits'
        },

        template: _.template( wordItem ),

        render: function() {
            this.$el.html( this.template( this.model.toJSON() ) );
            return this;
        },

        deleteModel: function() {
            var self = this;
            var conf = confirm( i18n.conf.confirmModelDelete );

            if (conf) {
                if ( this.$el.prev().attr('class') == 'tr-header' ) {
                    this.$el.prev().remove();
                }

                this.model.destroy({
                    // pass id to mongodb
                    data: { 'id': self.model.get('_id') },
                    success: function (model, response, options) {
                    },
                    error: function (model, xhr, options) {
                        console.log(error);
                    }
                });
            }

            return false;

        },

        editModel: function() {
            var prevElement = this.$el.prev().attr('class');
            if ( prevElement == 'tr-header' ) return;

            this.$el.find('td.enWord, td.ruWord, td.enSynonyms, td.ruSynonyms, td.wordGroup')
                .attr('contenteditable', true)
                .css('background-color', '#faffaf');

            this.$el.find('td')
                .first()
                .focus();

            this.$el.find('.enSynonyms, .ruSynonyms').css('display', '');

            var header = _.template( wordItemHeader );

            this.$el.before( header( i18n ) );
        },

        saveEdits: function() {
            var obj = {};

            var blank = this.$el.find('td').some(function(elem) {
                return s.isBlank( $(elem).text() );
            });

            if ( blank ) {
                alert( i18n.alert.fillAllInputs );
                if ( this.$el.prev().attr('class') == 'tr-header' ) {
                    this.$el.prev().remove();
                }
                this.render();
                this.$el.find('.edit').click();
                obj = null;
                return;
            }

            this.validateEdits();

            var data = this.$el.find('td.enWord, td.ruWord, td.enSynonyms, td.ruSynonyms, td.wordGroup');

            _.each(data, function(el) {
                obj[ $(el).attr('class') ] = s.clean( $(el).text() );
            });

            this.$el.find('td.enWord, td.ruWord, td.enSynonyms, td.ruSynonyms, td.wordGroup')
                .attr('contenteditable', false)
                .css('background-color', '');

            this.$el.find('.enSynonyms, .ruSynonyms').css('display', 'none');

            if ( this.$el.prev().attr('class') == 'tr-header' ) {
                this.$el.prev().remove();
            }

            this.model.save(obj);
        },

        validateEdits: function() {
            var enWord = s.clean( this.$el.find('td.enWord').text() );
            var ruWord = s.clean( this.$el.find('td.ruWord').text() );
            var enSynonyms = this.$el.find('td.enSynonyms');
            var ruSynonyms = this.$el.find('td.ruSynonyms');
            $(enSynonyms).text( this.addSynonym(enWord, enSynonyms) );
            $(ruSynonyms).text( this.addSynonym(ruWord, ruSynonyms) );
        },

        addSynonym: function(word, syn) {
            var synToArray = syn.text().split(',');

            var match = synToArray.some(function(el) {
                return s.clean( el ) == word;
            });

            if ( !match ) {
                return word + ', ' + syn.text();
            }
        }

    });

    return WordItemView;

});