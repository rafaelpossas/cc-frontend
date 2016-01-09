(function() {
    'use strict';

    angular
        .module('app.authentication')
        .factory('authenticationRepository', authenticationRepository);

    authenticationRepository.$inject = [
        'common'
    ];
    function authenticationRepository(common) {
        var api = 'authCloud';
        var service = {
            login: login
        };
        return service;

        ////////////////

        function login(credentials) {
            var deferred = common.$q.defer();
            common.$http({
                method: 'POST',
                url: common.endpoint.getApiUrl(api,true) + 'auth/user/local',
                data: {
                    /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
                    /* jshint -W106 */
                    user_primary_email: credentials.username,
                    password: credentials.password
                },
                headers: {
                    Accept: 'application/vnd.bs_authentication_cloud.v1+json' //TODO
                }
            }).then(function success(res) {
                    deferred.resolve(res.data.response.result);
                },function error(err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }
    }
})();
