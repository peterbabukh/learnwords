define( function(require) {

    'use strict';

    var Backbone = require('backbone');
    var WordsCollection = require('app/WordsCollection');
    var i18n = require('i18n!../../js/nls/ru');
    var fieldset = require('text!../../templates/fieldset.html');
    var gradeCol = require('text!../../templates/gradeCol.html');
    var gradeTree = require('text!../../templates/gradeTree.html');
    var GradesModel = require('app/GradesModel');
    var User = require('app/UserModel');
    var AppHeaderView = require('app/AppHeaderView');

    var FieldsetView = Backbone.View.extend({

        el: $('.content-box'),

        initialize: function() {
            this.gradesModel = new GradesModel();
            this.user = new User();
            this.childViews = [];
        },

        events: {
            'click .checkbox-select-box': 'createGrades',
            'click .choose-all-groups': 'selectAllCheckboxes',
            'click .submit-form': 'submitForm',
            'click .lesson-list': 'toggleLessonList'
        },

        fieldsetTemplate: _.template( fieldset ),

        gradeTemplateTree: _.template( gradeTree ),

        gradeTemplateCol: _.template( gradeCol ),

        render: function() {
            var self = this;

            // removes not needed child views
            if ( this.childViews.length ) {
                this.onClose();
            }

            // could use UserModel to fetch from server db,
            // but decided to fetch only lean selected array instead of User
            // via another model ->> gradesModel
            this.gradesModel.fetch({
                success: function (grades, response, options) {
                    self.collection = grades.get('words');
                },
                error: function (grades, response, options) {
                    alert( i18n.msg.systemErrorMessage );
                    //console.log( i18n.msg.systemErrorMessage );
                    self.handleError();
                }
            }).done(function(){
                self.handleSuccess();
            });
            return this;
        },

        handleSuccess: function () {
            this.$el.html( this.fieldsetTemplate( i18n ) );

            // Adds AppHeader block, reserved for service options to be added
            // in future, like other kinds of authorization, contact info, etc.,
            // styled with css position absolute.
            this.appendHeader();

            this.createGrades();
        },

        handleError: function () {
            alert( i18n.msg.systemErrorMessage );
            //console.log( i18n.msg.systemErrorMessage );
            this.goTo('/fieldset');
            window.location.reload();
        },

        createGrades: function() {
            var self = this;
            var template;
            var currentSelect = self.$el.find('option:selected').val();
            console.log(currentSelect);
            var grades = this.valuesToArray( 'grade' );

            // as we have both number and string grade names
            // sort them to ensure correct display of grade fieldsets
            grades = grades.sort(function(a,b) {return String(a) > String(b);} );

            template = (currentSelect == 'lesson') ? self.gradeTemplateTree : self.gradeTemplateCol;

            $('.checkbox-container').empty();

            _.each( grades, function(index) {
                var gradeBox = template({
                    grade: index,
                    array: self.getLessons(index, currentSelect),
                    display_type: currentSelect,
                    i18n: i18n
                });
                $('.checkbox-container').append( gradeBox );
            });
        },

        // select/disselect all checkboxes logic
        selectAllCheckboxes: function(event) {
            event = event || window.event;
            var target = event.target || event.srcElement;
            var elems = $(target)
                .closest('fieldset')
                .find('[type~="checkbox"]');
            if (target.checked == true) {
                _.each(elems, function(i) {
                    i.checked = true;
                });
            } else {
                _.each(elems, function(i) {
                    i.checked = false;
                });
            }
        },

        // show/hide nested ul
        toggleLessonList: function(event) {
            event = event || window.event;
            var target = event.target || event.srcElement;
            target = $(target).closest('li');
            $(target).find('ul').toggle();
        },

        submitForm: function() {
            var self = this;
            var selectOptions = [];
            var elems = this.$el.find('.choose-group-input:checked');

            _.each( elems, function(el) {
                var obj = {
                    grade: $(el).attr('data-grade'),
                    display_type: $(el).attr('data-type'),
                    name: $(el).attr('name')
                };
                selectOptions.push( obj );
            });

            if ( selectOptions.length === 0 ) {
                alert( i18n.alert.chooseWordGroup );
                return false;
            }

            this.user.save({ "selectOptions": selectOptions }, {
                wait: true,
                // set method to PUT
                type: 'PUT',
                success: function(model, response) {
                    self.goTo('/home');
                },
                error: function(model, error) {
                    console.log(error);
                    self.goTo('/fieldset');
                    window.location.reload();
                }

            });

        },

        // create array of unigue grade numbers to be used in legend of grade fieldsets
        valuesToArray: function( key ) {
            var arr = this.collection;
            return this.sortOrder( _.uniq( _.pluck(arr, key) ) );
        },

        // create sorted array of unique values of specified key in collection of models
        // to be used as checkbox names and values
        getLessons: function(gradeNumber, lessonOrWordgroup) {

            // filter selected lessons or wordGroups
            var modelArray = _.where( this.collection, { grade: gradeNumber } );

            // make an array of unique property names and sort them
            var propArray = this.sortOrder( _.uniq( _.pluck(modelArray, lessonOrWordgroup) ) );

            // as the modelArray is too long, we have to sort propArray again
            // to display proper sorting
            return propArray.sort();
        },

        sortOrder: function(arr) {
            return arr.sort( function(a, b) {
                return (typeof a == 'number') ? a - b : a > b;
            } );
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


    return FieldsetView;


});