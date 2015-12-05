define([
    'backbone',
    'i18n!../../js/nls/ru',
    './routes/index'
], function(Backbone, i18n, routes) {

    'use strict';

    var ApplicationRouter = Backbone.Router.extend({

         routes: {
             '*path': 'default'
         },

         default: function (path) {
             if ( routes[path] ) {
                 var view = new routes[path]();
                 this.showView(view);
             }
         },

        // Renders new view, removing the old view’s element and its
        // subviews form DOM and thus preventing memory leaks.
        // Here I disabled this option as here is navigation from back end, but i kept it
        // for future refactor to backbone full hash navigation.
        showView: function (view) {

            //if (this.currentView) {
            //    if (this.currentView.close) this.currentView.close();
            //}
            //this.currentView = view;

            view.render().el;

        }

    });

    return ApplicationRouter;

});
