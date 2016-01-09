/**
 * Created by rafae on 7/01/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('permissions', permissions);

    permissions.$inject = ['config','userData'];

    /* @ngInject */
    function permissions(config,userData) {
        var service = {
            isAuthenticated: isAuthenticated
        };
        return service;

        ////////////////

        function isAuthenticated() {
            if (!config.currentUser) {
                config.currentUser = userData.getUserData();
            }

            if (config.currentUser && config.currentUser.isAuthenticated === 'y') {
                return true;
            }else {
                return false;
            }
        }
    }

})();

