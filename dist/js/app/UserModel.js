define(function(a){"use strict";var b=a("backbone"),c=a("app/WordsCollection"),d=b.Model.extend({urlRoot:"/user",defaults:{words:new c},parse:function(a){return a.words=new c(a.words),a}});return d});