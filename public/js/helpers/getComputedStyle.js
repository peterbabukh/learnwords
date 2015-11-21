
define( function(require) {

    'use strict';

    return {
        getStyle: function(elem) {
            return window.getComputedStyle ? getComputedStyle(elem, "") : elem.currentStyle;
        }
    }
});