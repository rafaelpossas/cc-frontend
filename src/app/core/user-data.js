(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('userData', userData);

    userData.$inject = ['$cookies','config','common'];

    function userData($cookies,config,common) {
        var service = {
            wipeUserData: wipeUserData,
            getUserData: getUserData,
            setUserData: setUserData,
            setupAuthentication: setupAuthentication
        };
        return service;

        ////////////////

        function wipeUserData() {
            $cookies.remove('username');
            $cookies.remove('isAuthenticated');
            $cookies.remove('sessionId');
            delete common.$http.defaults.headers.common.Token;
            config.currentUser = undefined;
        }
        function getUserData() {
            var currentUser = {
                username: $cookies.get('username'),
                isAuthenticated: $cookies.get('isAuthenticated'),
                sessionId: $cookies.get('sessionId'),
                locale: $cookies.get('locale')
            };
            return currentUser;
        }
        function setUserData(userName,isAuthenticated,sessionId,locale) {

            $cookies.put('username',userName);
            $cookies.put('isAuthenticated',isAuthenticated);
            $cookies.put('sessionId',sessionId);
            $cookies.put('locale',locale);
            common.$http.defaults.headers.common.Token = 'MULESESSID=' + sessionId;
            return getUserData();
        }

        function setupAuthentication(username,isAuthenticated,sessionId) {
            //TODO: Implement Locale Selection
            config.currentUser = setUserData(username,isAuthenticated,sessionId,'en-use');

        }
    }

})();

