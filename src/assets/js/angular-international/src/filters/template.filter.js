(function (angular) {
    'use strict';
    angular.module('amalieiev.international').filter('template', ['$template', function ($template) {
        return $template;
    }])
}(angular));