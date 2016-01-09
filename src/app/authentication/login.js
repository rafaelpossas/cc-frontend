
(function() {
    'use strict';

    angular
        .module('app.authentication')
        .controller('Login',Login);

    Login.$inject = [
        '$scope',
        'authenticationRepository',
        'userData',
        'common'
    ];
    function Login($scope,authenticationRepository,userData,common) {
        var vm = this;
        vm.handleLoginSubmit = handleLoginSubmit;
        vm.creds = {username:'rafael'};
        activate();

        ////////////////////////
        function activate() {
            $scope.forgot = false;
            $scope.showForget = function(value) {
                $scope.forgot = value;
                return $scope.forgot;
            };

            $scope.handleLoginSubmit = handleLoginSubmit;
        }
        function handleLoginSubmit(credentials) {

            authenticationRepository.login(credentials)
                .then(function success(data) {
                    /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
                    /* jshint -W106 */
                    if (data.is_authenticated_yn.toLowerCase() !== 'y') {
                        return common.logger
                            .warning('Invalid username and/or password',credentials,'Login Error');
                    }else if (data.reset_needed_yn.toLowerCase() === 'y' ||
                              data.locked_yn.toLowerCase() === 'y') {
                        return common.logger
                            .warning('Unable to login, user is locked',credentials,'Login Error');
                    }else {
                        userData
                            .setupAuthentication(credentials.username,
                                data.is_authenticated_yn, data.session_id);
                        common.$state.go('dashboard');
                    }

                },function error(err) {
                });
        }
    }
})();
