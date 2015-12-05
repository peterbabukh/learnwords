define([
    'backbone',
    'app/WordModelView',
    'app/NewEntryFormView',
    'i18n!../../js/nls/ru',
    'helpers/getComputedStyle',
    'app/UserModel',
    'text!../../templates/wordsCollectionViewHeader.html',
    'text!../../templates/liTemplate.html',
    'text!../../templates/tableTemplate.html',
    'app/WordsCollection',
    'app/AppHeaderView'
], function(
    // I chose this syntax instead of var Backbone = require('backbone')
    // to support minification during build, which otherwise fails
    Backbone,
    WordModelView,
    NewEntryFormView,
    i18n,
    getStyle,
    User,
    wordsCollectionViewHeader,
    liTemplate,
    tableTemplate,
    WordsCollection,
    AppHeaderView
) {

    'use strict';

    var WordsCollectionView = Backbone.View.extend({

        el: $('.content-box'),

        initialize: function() {
            this.user = new User();
            this.childViews = [];
        },

        events: {
            'click .groups-li': 'selectGroup',
            'click .td-filter': 'filterTable',
            'click .reset-filed': 'resetFiledItems',
            'click .reset-all': 'resetAllItems'
        },

        render: function() {
            var self = this;

            // removes not needed child views
            if ( this.childViews.length ) {
                this.onClose();
            }

            this.user.fetch({
                success: function (user, response, options) {
                    self.collection = new WordsCollection( user.get('words').models );
                    self.collection.on('add', self.handleSuccess, self);
                    //self.listenTo(self.collection, 'successOnFetch', self.handleSuccess);
                    //self.listenTo(self.collection, 'errorOnFetch', self.handleError);
                },
                error: function (user, response, options) {
                    self.handleError();
                }
            }).done(function(){
                self.handleSuccess();
            });

            return this;
        },

        handleSuccess: function () {
            // adds navigation links
            var pageHeader = _.template( wordsCollectionViewHeader, i18n );
            this.$el.html( pageHeader );

            // adds new entry form
            this.showNewEntryForm();
            this.createGroupList();

            // adds list of all words
            this.createTable();

            // sets opacity to filter arrows
            this.setOpacity( this.opacityIndex );

            // adds AppHeader block, reserved for service options to be added
            // in future, like other kinds of authorization, contact info, etc.,
            // styled with css position absolute.
            this.appendHeader();

        },

        handleError: function () {
            alert( i18n.msg.systemErrorMessage );
            console.log( i18n.msg.systemErrorMessage );
            this.goTo('/list');
            window.location.reload();
        },

        showNewEntryForm: function() {
            var newEntryFormView = new NewEntryFormView();
            newEntryFormView.collection = this.collection;
            this.$el.append( newEntryFormView.render().el );

            // need it to remove this view upon removal of this.$el
            this.childViews.push( newEntryFormView );
        },

        createGroupList: function() {
            var template = _.template( liTemplate );
            var groups = _.uniq( _.pluck( _.sortBy( this.collection.toJSON(), 'wordGroup' ), 'wordGroup' ) );

            _.each( groups, function(elem) {
                $('.groups-ul').append( template({ li: elem.trim() }) );
            } );
        },

        createTable: function() {
            var table = _.template( tableTemplate );
            this.$el.append( table( i18n ) );
            this.collection.each(function(elem) {
                elem.set('i18n', i18n);
                var wordModelView = new WordModelView( { model: elem } );

                // need it to remove this view upon removal of this.$el
                this.childViews.push( wordModelView );

                $('.collection-table').append( wordModelView.render().el );
            }, this);
            this.setHeadWidth();
        },

        setHeadWidth: function() {
            var cells = document.querySelectorAll('.collection-table tr:first-child td');
            var filter = document.querySelectorAll('.td-filter');
            _.each(filter, function(el, index) {
                var csPaddings = parseInt( getStyle.getStyle(el).paddingRight ) * 2;
                var csBorder = parseInt( getStyle.getStyle(el).borderRight );
                el.width = cells[index].offsetWidth - csPaddings - csBorder + 'px';
            });
        },

        selectGroup: function(event) {
            event = event || window.event;
            var target = event.target || event.srcElement;
            $('.new-entry-input').val( $(target).text() );
        },

        filterTable: function(event) {
            event = event || window.event;
            var target,
                index;

            target = event.target || event.srcElement;
            target = $(target).closest('td');
            index = $(target)[0].cellIndex;

            switch( index ) {
                case 0:
                    this.collection.comparator = function(model){
                        return model.get('enWord');
                    };
                    this.collection.sort();
                    break;
                case 1:
                    this.collection.comparator = function(model){
                        return model.get('ruWord');
                    };
                    this.collection.sort();
                    break;
                case 2:
                    this.collection.comparator = function(model){
                        return model.get('wordGroup');
                    };
                    this.collection.sort();
                    break;
                default:
                    this.collection.comparator = function(model){
                        return model.get('enWord');
                    };
            }

            this.opacityIndex = index;
            // delete existing table to replace it with rearranged rows
            $('.fixed-head, .collection-table-container').remove();
            this.createTable();
            this.setOpacity( this.opacityIndex );

        },

        opacityIndex: 0,

        // sets opacity to sprite arrow
        setOpacity: function(index) {
            var array = this.$el.find('.filter-arrow');

            _.each(array, function(elem) {
                if ( $(elem).css({ opacity: 1.0 }) ) {
                    $(elem).css({ opacity: 0.2 });
                }
            });

            $(array[index]).css({ opacity: 1.0 });
        },

        // renew the db.user.words.creator = 'admin'
        resetFiledItems: function() {
            var self = this;
            var conf = confirm( i18n.conf.baseReloadFirstWarning.join(' ') );
            if (conf) {
                var conf_rep = confirm( i18n.conf.baseReloadSecondWarning.join(' ') );
                if (conf_rep) {

                    $.when(self.goTo('/resetFiled')).then(function() {
                        window.location.reload();
                    });

                }
            }

        },

        // renew the whole subdoc 'words' on db
        resetAllItems: function() {
            var self = this;
            var conf = confirm( i18n.conf.fullReloadFirstWarning.join(' ') );
            if (conf) {
                var conf_rep = confirm( i18n.conf.fullReloadSecondWarning.join(' ') );
                if (conf_rep) {

                    $.when(self.goTo('/resetAll')).then(function() {
                        window.location.reload();
                    });

                }
            }
        },

        appendHeader: function() {
            var appHeaderView = new AppHeaderView();
            this.$el.prepend( appHeaderView.render().el );
            // need it to remove this view upon removal of this.$el
            this.childViews.push( appHeaderView );
        },

        // Removes the children views' and their children views' elements
        // from DOM and thus prevents memory leaks
        onClose: function() {
            var arr = this.childViews;
            _.each(arr, function(view){
                view.close();
            });
        }

    });

    return WordsCollectionView;

});