define( function(require) {

    'use strict';

    var Backbone = require('backbone');
    var i18n = require('i18n!../../js/nls/ru/locales');
    var appHeaderTemplate = require('text!../../templates/appHeaderTemplate.html');

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