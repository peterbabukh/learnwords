define([
    'backbone',
    'i18n!../../js/nls/ru',
    'text!../../templates/appHeaderTemplate.html'
], function(Backbone, i18n, appHeaderTemplate) {

    'use strict';

    var AppHeaderView = Backbone.View.extend({

        template: _.template( appHeaderTemplate ),

        initialize: function () {
        },

        events: {
            'click .signout-btn': 'signOut'
        },

        render: function () {
            this.$el.html( this.template( i18n ) );
            return this;
        },

        signOut: function () {
            var conf = confirm( i18n.conf.signOutWarning );
            if (conf) {
                this.goTo('/signout');
                window.location.reload();
            }
        }

    });

    return AppHeaderView;

});