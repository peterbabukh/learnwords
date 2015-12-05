define([
    'backbone',
    'app/ApplicationRouter'
], function(Backbone, ApplicationRouter) {

    'use strict';

    var ApplicationController = Backbone.Model.extend({

        initialize: function() {

            // Enable router.navigate() within every view.
            Backbone.View.prototype.goTo = function (location) {
                applicationRouter.navigate(location, {trigger: true});
            };

            // Add close method to all views to remove the view’s element and its
            // subviews form DOM and thus prevent memory leaks.
            // Will be used in further refactoring where slash navigation
            // will be replaced by backbone hash navigation.
            /*
            Backbone.View.prototype.close = function() {
                if (this.onClose) {
                    this.onClose();
                }
                this.remove();
            };
            */

            // override the id attribute for models
            // to map from mongodb _id to id
            Backbone.Model.prototype.idAttribute = '_id';

            var applicationRouter = new ApplicationRouter();

            //Backbone.history.start();
            Backbone.history.start({pushState: true});

        }

    });

    return ApplicationController;

});