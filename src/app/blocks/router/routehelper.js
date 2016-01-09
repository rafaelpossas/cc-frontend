(function() {
    'use strict';

    angular
        .module('blocks.router')
        .provider('routehelperConfig', routehelperConfig)
        .factory('routehelper', routehelper);

    routehelper.$inject = ['common','permissions', 'routehelperConfig'];

    // Must configure via the routehelperConfigProvider
    function routehelperConfig() {
        /* jshint validthis:true */
        this.config = {
            // These are the properties we need to set
            // $stateProvider: undefined
            // $urlRouteProvider: undefined
            // docTitle: ''
            // resolveAlways: {ready: function(){ } }
        };

        this.$get = function() {
            return {
                config: this.config
            };
        };
    }

    function routehelper(common,permissions,routehelperConfig) {
        var handlingRouteChangeError = false;
        var routeCounts = {
            errors: 0,
            changes: 0
        };
        var $routeProvider = routehelperConfig.config.$routeProvider;
        var $urlRouterProvider = routehelperConfig.config.$urlRouterProvider;

        var service = {
            configureRoutes: configureRoutes,
            routeCounts: routeCounts
        };

        init();

        return service;
        ///////////////

        function init() {
            handleRoutingErrors();
            handleRoutingSuccess();
            handlePermissions();
        }

        function configureRoutes(routes) {
            routes.forEach(function(route) {
                route.config.resolve =
                    angular.extend(route.config.resolve || {},
                        routehelperConfig.config.resolveAlways);
                $routeProvider.state(route.name, route.config);
            });
            $urlRouterProvider.otherwise('/');
        }

        function handleRoutingErrors() {
            // Route cancellation:
            // On routing error, go to the dashboard.
            // Provide an exit clause if it tries to do it twice.
            common.$rootScope.$on('$stateChangeError',
                function(event, toState, toParams, fromState,fromParams,error) {
                    if (handlingRouteChangeError) {
                        return;
                    }
                    routeCounts.errors++;
                    handlingRouteChangeError = true;
                    var destination =
                        (toState && (toState.name || toState.templateUrl)) ||
                        'unknown target';
                    var msg = 'Error routing to ' + destination + '. ' + (error || '');
                    common.logger.warning(msg, [toState]);
                    common.logger.log(error.stack);
                    common.$location.path('/');
                }
            );
        }
        function handleRoutingSuccess() {
            common.$rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams,fromState,fromParams) {
                    console.log('routeChangeSuccess');
                    routeCounts.changes++;
                }
            );
        }
        function handlePermissions() {
            common.$rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams) {
                    if (!permissions.isAuthenticated() && toState.name !== 'login') {
                        event.preventDefault();
                        common.$state.go('login');
                    }
                }
            );
        }

    }
})();
