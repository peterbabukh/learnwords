define(function(a){"use strict";a("jquery"),$.fn.some=function(a,b){for(var c,d=0,e=this.length;e>d;d++)if(this.hasOwnProperty(d)&&(c="undefined"==typeof b?a(this[d],d,this):a.call(b,this[d],d,this)))return!0;return!1}});