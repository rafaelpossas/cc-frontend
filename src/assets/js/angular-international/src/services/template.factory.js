(function (angular) {
    'use strict';
    angular.module('amalieiev.international').factory('$template', [function () {
        return function (tpl, data) {
            var key;
            for (key in data) {
                tpl = tpl.replace(new RegExp('{' + key + '}', 'gi'), data[key]);
            }
            return tpl;
        };
    }])
}(angular));