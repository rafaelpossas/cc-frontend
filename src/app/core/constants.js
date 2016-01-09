/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('baseurl','https://dev-001.c-scope.net')
        .constant('toastr', toastr)
        .constant('moment', moment);
})();
