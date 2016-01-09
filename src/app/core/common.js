/**
 * Created by rafae on 6/01/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('common', common);

    common.$inject = [
        '$location',
        '$q',
        '$rootScope',
        '$timeout',
        '$http',
        'logger',
        'endpoint',
        '$state',
    ];

    /* @ngInject */
    function common($location, $q, $rootScope, $timeout,
                    $http, logger,endpoint,$state) {

        var service = {
            // common angular dependencies
            $broadcast: $broadcast,
            $q: $q,
            $timeout: $timeout,
            $http: $http,
            $state: $state,
            $rootScope: $rootScope,
            $location: $location,
            // core app dependencies
            endpoint: endpoint,
            logger: logger, // for accessibility
            // generic
            isNumber: isNumber,
            textContains: textContains
        };

        return service;
        //////////////////////

        function $broadcast() {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }

        function isNumber(val) {
            // negative or positive
            return (/^[-]?\d+$/).test(val);
        }

        function textContains(text, searchText) {
            return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
        }
    }
})();
