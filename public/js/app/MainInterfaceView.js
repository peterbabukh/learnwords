define([
    'backbone',
    'app/UserModel',
    'i18n!../../js/nls/ru',
    'underscore.string',
    'text!../../templates/mainPage.html',
    'text!../../templates/trTemplate.html',
    'app/WordsCollection',
    'app/AppHeaderView'
], function(
    // I chose this syntax instead of var Backbone = require('backbone')
    // to support minification during build, which otherwise fails
    Backbone,
    User,
    i18n,
    s,
    mainPage,
    trTemplate,
    WordsCollection,
    AppHeaderView
) {

    'use strict';

    var MainInterfaceView = Backbone.View.extend({

        el: $('.content-box'),

        template: _.template( mainPage ),

        events: {
            'click .select-displayorder': 'selectOptions',
            'click .select-lang': 'selectOptions',
            'click .select-check': 'selectOptions',
            'click .hint-button': 'showHint',
            'click .enter-button': 'enterAnswer',
            'keypress .input-field': 'inputWord',
            'click .show-wordlist-button': 'showWordlistTable',
            'click .hide-table-button': 'hideWordlistTable'
        },

        initialize: function() {
            this.childViews = [];
            this.user = new User();

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
                    self.selectOptions = user.get('selectOptions');
                },
                error: function (user, response, options) {
                    alert( i18n.msg.systemErrorMessage );
                    //console.log( i18n.msg.systemErrorMessage );
                    self.goTo('/');
                    window.location.reload();
                }
            }).done(function(){
                self.$el.html( self.template( i18n ) );

                // Adds AppHeader block, reserved for service options to be added
                // in future, like other kinds of authorization, contact info, etc.,
                // styled with css position absolute.
                self.appendHeader();

                // launch of the logic
                self.resetSelection();
            });
            return this;
        },

        // Fetching of all words from the server consumes time and resources.
        // To do it once i store all fetched words in this.collection,
        // but i need another one, this.proxyCollection, to perform
        // operations, because the user might want to change selectOptions frequently.
        proxyCollection: [],

        // currently displayed word
        wordObject: null,

        // array index in this.proxyCollection
        wordIndex: 0,

        values: {
            lang: 'enWord',
            order: 'alphabet'
        },

        // resets the data upon each select element change
        resetSelection: function() {
            this.wordIndex = 0;
            this.createProxyCollection();
            this.createWordlistTable();
            this.displayNextWord();
        },

        createProxyCollection: function() {
            var self = this;
            var values = this.values;
            var selectOptions = this.selectOptions;


            var proxyColl = [];
            if ( selectOptions != 0 ) {
                _.each(selectOptions, function(obj) {
                    var grade = obj.grade;
                    var display_type = obj.display_type;
                    var o = {};
                    var match;

                    o['grade'] = isNaN( +grade ) ? grade : +grade;
                    o[display_type] = isNaN( +obj.name ) ? obj.name : +obj.name;

                    match = self.collection.where( o );

                    if (match.length) {
                        proxyColl.push(  match );
                    }
                });

                proxyColl = _.flatten( proxyColl );

            } else {
                _.each(self.collection.models, function(model) {
                    proxyColl.push( model );
                });
            }

            proxyColl = this.sortProxyCollection(proxyColl);
            this.proxyCollection = proxyColl;
        },

        // shows the next word upon every correct answer
        displayNextWord: function() {
            var generatedObject;

            if ( this.wordIndex == this.proxyCollection.length ) {
                this.wordIndex = 0;
            }

            generatedObject = this.proxyCollection[ this.wordIndex++ ];
            this.wordObject = this.parseGeneratedObject( generatedObject );

            $('.display-field').text( this.wordObject.displayWord );
        },

        // parses the model of the word to be displayed
        parseGeneratedObject: function(obj) {
            var values = this.values;
            var answer = ( values.lang == 'enWord' ) ? obj.get('ruWord') : obj.get('enWord');
            var synonyms = ( values.lang == 'enWord' ) ? obj.get('ruSynonyms') : obj.get('enSynonyms');
            return {
                displayWord: s.clean( obj.get(values.lang) ),
                answerWord: s.clean( answer ),
                synonyms: synonyms
            };
        },

        sortProxyCollection: function(proxyCollection) {
            var values = this.values;
            switch( values.order ) {
                case 'random':
                    return _.shuffle( proxyCollection );
                case 'alphabet':
                    return this.sortOrder( proxyCollection, values.lang );
                case 'reverse':
                    return this.sortOrder( proxyCollection, values.lang ).reverse();
                default:
                    return this.sortOrder( proxyCollection, values.lang );
            }
        },

        sortOrder: function(arr, val) {
            return arr.sort( function(a, b) {
                if ( a.get(val) > b.get(val) ) {
                    return 1;
                }
                if (a.get(val) < b.get(val)) {
                    return -1;
                }
                return 0;
            } );
        },

        // changes the selected option in DOM
        selectOptions: function(event) {
            event = event || window.event;
            var target = event.target || event.srcElement;

            this.$el.find('.hint-word').css({ display: 'none' });

            $(target).closest('select')
                .find('option')
                .attr('selected', false);
            $(target).attr('selected', true);

            this.findSelectedValues();
            this.resetSelection();
        },

        // gets values of selected options from DOM
        findSelectedValues: function() {
            var order = this.$el.find('option.select-displayorder[selected]').val();
            var lang = this.$el.find('option.select-lang[selected]').val();
            this.values = {
                order: order,
                lang: lang
            };
        },

        // displays hint word
        showHint: function() {
            var table = $('.wordlist-table-box');
            if ( table.hasClass('visible') ) return;

            if (this.wordObject == null) return;
            $('.input-text').text( i18n.msg.answerIs );
            $('.hint-word').text( this.wordObject.answerWord )
                .css({ display: 'block' });
            document.querySelector('.usedhints-count span').innerHTML++;
            document.querySelector('.nohints-count span').innerHTML--;
            $('.input-field').select().focus();
        },

        // starts logic when the user hits enter
        enterAnswer: function() {
            var input = $('.input-field').val().toLowerCase().trim();
            if ( this.wordObject == null ) {
                alert( i18n.alert.chooseWordGroup );
                return;
            } else if ( input == 0 && this.wordObject ) {
                alert( i18n.alert.enterWordTranslation );
                return;
            }

            if ( this.checkAnswer() ) {
                var table = $('.wordlist-table-box');
                var noHintsCount = $('.nohints-count span');

                document.querySelector('.rightanswer-count span').innerHTML++;

                if ( !table.hasClass('visible') ) {
                    noHintsCount.html( Number( noHintsCount.html() ) + 1 );
                }

                if (noHintsCount.html() > 0 && noHintsCount.html() % 10 == 0) {
                    $('#celebrate-img').css({display: 'inline'});
                }

                $('.input-text').html('<span class="right">' + i18n.msg.correct + '</span>');
                $('.input-field').val('');
                $('#rightanswer-img').css({ display: 'inline' });

                this.displayNextWord();

            } else {

                $('.input-text').html('<span class="wrong">' + i18n.msg.wrongAnswer + '</span>');
            }

            $('.input-field').select().focus();
        },

        // checks if the answer is correct
        checkAnswer: function() {
            var checkMode = $('option.select-check[selected]').val();
            var singleAnswer = this.wordObject.answerWord;
            var synonyms = this.wordObject.synonyms;

            if ( checkMode == 'strict' ) {
                return this.checkArray( singleAnswer );
            } else {
                return this.checkArray( synonyms );
            }
        },

        // checks if user's answer exists in the synonyms array
        checkArray: function(string) {
            var array = string.split(',');
            var answer = s.clean( $('.input-field').val().toLowerCase() );

            return array.some(function(a) {
                return s.clean( a.toLowerCase() ) == answer;
            });
        },

        // keyboard Enter and keypress events
        inputWord: function(event) {
            event = event || window.event;

            if (event.keyCode === 13 || event.which === 13) {
                $('.enter-button').click();

            } else if (event === event) {
                $('.input-text').html('');
                $('#rightanswer-img').css({ display: 'none' });
                $('#celebrate-img').css({ display: 'none' });
                $('.hint-word').css({ display: 'none' });
            }
        },

        // slides down the list of chosen words
        showWordlistTable: function(event) {

            event.preventDefault();

            var table = $('.wordlist-table-box');

            if ( !this.wordObject ) {
                alert( i18n.alert.chooseWordGroup );
                return;
            }

            if ( table.hasClass('visible') ) {
                return;
            }

            var conf = confirm( i18n.conf.countersWillBeZero );
            if (conf) {
                document.querySelector('.nohints-count span').innerHTML = 0;
                document.querySelector('.usedhints-count span').innerHTML = 0;
                table.addClass('visible')
                    .slideDown();
            }
        },

        // creates the table of chosen words
        createWordlistTable: function() {
            var template,
                lang,
                array;

            $('.wordlist-table').empty();

            template = _.template( trTemplate );
            lang = $('option.select-lang[selected]').val();
            array = _.sortBy( this.proxyCollection, lang );
            _.each( array, function(obj) {
                var o = {};
                o.cellOne = obj.get(lang);
                o.synonyms = (lang == 'enWord') ? obj.get('ruSynonyms') : obj.get('enSynonyms');
                $('.wordlist-table').append( template( o ) );
            });
        },

        hideWordlistTable: function() {
            var table = $('.wordlist-table-box');
            table.removeClass('visible')
                .slideUp();
        },

        appendHeader: function() {
            var appHeaderView = new AppHeaderView();
            // used prepend instead of append for further adaptive css purposes
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

    return MainInterfaceView;

});