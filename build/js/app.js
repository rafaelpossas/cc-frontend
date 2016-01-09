(function() {
    'use strict';

    // Declare app level module which depends on views, and components

    angular.module('app', [
        /*
         * Order is not important. Angular makes a
         * pass to register all of the modules listed
         * and then when app.dashboard tries to use app.data,
         * its components are available.
         */

        /*
         * Everybody has access to these.
         * We could place these under every feature area,
         * but this is easier to maintain.
         */
        'app.core',
        'app.widgets',
        'app.layout',

        /*
         * Feature areas
         */
        'app.authentication'
    ]);
})();


/**
 * Created by rafae on 6/01/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.authentication', []);

})();

(function () {
    'use strict';

    angular
        .module('app.core', [
            /*
             *  Angular Modules
             */
            'ui.router','ngCookies',
            /*
             *  Reusable cross app code modules
             */
            'blocks.exception','blocks.logger','blocks.router',
            /*
             *  3rd Party modules
             */
            'amalieiev.international'

        ]);

})();

(function () {
    'use strict';

    angular
        .module('app.layout', []);

})();

/**
 * Created by rafae on 6/01/2016.
 */
(function() {
    'use strict';

    angular.module('app.widgets', []);
})();

(function() {
    'use strict';

    angular.module('blocks.exception', ['blocks.logger']);
})();

(function() {
    'use strict';

    angular.module('blocks.logger', []);
})();

(function() {
    'use strict';

    angular.module('blocks.router', [
        'ui.router',
        'blocks.logger'
    ]);
})();

/**
 * Created by rafae on 7/01/2016.
 */
(function() {
    angular
        .module('app')
        .run(appRun);

    //////////////////////////

    appRun.$inject = ['common','$international'];

    function appRun(common,$international) {
        common.$rootScope.locale = $international.locale;
    }
})();


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

/**
 * Created by rafae on 6/01/2016.
 */
(function() {
    'use strict';

    angular
        .module('app.authentication')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                name: 'login',
                config: {
                    url:'/login',
                    templateUrl: 'app/authentication/login.html',
                    controller: 'Login'
                }
            }
        ];
    }
})();


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

(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];

    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }
    var config = {
        appErrorPrefix: '[Customer Compass Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Customer Compass',
        version: '1.0.0',
        locale: 'en-us',
        availableLanguages: {
            'en-us': 'us',
            'en-au': 'au',
            'zh-tw': 'tw'
        },
        endpoints:{
            authCloud:{
                url:'/authentication_cloud/',
                accept: 'application/vnd.bs_authentication_cloud.v1+json'
            },
            dashboard:{url:'/service-dashboard/'},
            esb:{url:'/api'},
            journeyExplorer:{
                url:'/journey_explorer/',
                accept:'application/vnd.bs_journey_explorer.v1+json'
            },
            metadata:{url:'/metadata_manager/'},
            modelledDatastore:{url:'/modelled_data_store'},
            paf:{url:'/paf_engine/'},
            permissions:{url:'/permissions_engine/'},
            query:{url:'/query_store/'},
            report:{url:'/report_engine/'},
            userManagement:{url:'/user_management/'},
            widget:{url:'/widget_designer/'}
        },
        currentUser: undefined
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = [
        '$logProvider',
        '$internationalProvider',
        'exceptionHandlerProvider',
        'routehelperConfigProvider',
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function configure($logProvider,$internationalProvider, exceptionHandlerProvider,
                       routehelperConfigProvider,$stateProvider,$urlRouterProvider) {

        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        $internationalProvider.config({
            preferredLocale: config.locale,
            urlTemplate: 'assets/i18n/{locale}/{part}.json'
        });

        $internationalProvider.addPart('main');
        //// Configure the common route provider
        routehelperConfigProvider.config.$routeProvider = $stateProvider;
        routehelperConfigProvider.config.$urlRouterProvider = $urlRouterProvider;
        //routehelperConfigProvider.config.docTitle = 'Customer Compass: ';
        //var resolveAlways = { /* @ngInject */
        //    //ready: function(dataservice) {
        //    //    return dataservice.ready();
        //    //}
        //};
        //routehelperConfigProvider.config.resolveAlways = resolveAlways;
        //
        exceptionHandlerProvider.configure(config.appErrorPrefix);
    }
})();

/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('baseurl','https://dev-001.c-scope.net')
        .constant('toastr', toastr)
        .constant('moment', moment);
})();

(function() {
    'use strict';
    angular
        .module('app.core')
        .factory('endpoint', endpoint);

    endpoint.$inject = ['config','baseurl'];
    function endpoint(config,baseurl) {
        var service = {
            getApiUrl:getApiUrl
        };
        return service;

        /////////////////
        function getApiUrl(module,esb) {
            if (esb) {
                return baseurl + config.endpoints['esb'].url + config.endpoints[module].url;
            }else {
                return baseurl + config.endpoints[module].url;
            }
            return undefined;
        }
    }
})();


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


/**
 * Created by rafae on 7/01/2016.
 */
/**
 * Created by rafae on 6/01/2016.
 */
(function() {
    'use strict';

    angular
        .module('app.layout')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                name: 'dashboard',
                config: {
                    url:'/',
                    templateUrl: 'app/layout/dashboard.html',
                    controller: 'Dashboard'
                }
            }
        ];
    }
})();

/**
 * Created by rafae on 7/01/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('Dashboard', Dashboard);

    //Dashboard.$inject

    /* @ngInject */
    function Dashboard() {

        activate();

        ////////////////
        function activate() {}

    }
})();


// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run
(function() {
    'use strict';

    angular
        .module('blocks.exception')
        .provider('exceptionHandler', exceptionHandlerProvider)
        .config(config);

    /**
     * Must configure the exception handling
     * @return {[type]}
     */
    function exceptionHandlerProvider() {
        /* jshint validthis:true */
        this.config = {
            appErrorPrefix: undefined
        };

        this.configure = function (appErrorPrefix) {
            this.config.appErrorPrefix = appErrorPrefix;
        };

        this.$get = function() {
            return {config: this.config};
        };
    }

    /**
     * Configure by setting an optional string value for appErrorPrefix.
     * Accessible via config.appErrorPrefix (via config value).
     * @param  {[type]} $provide
     * @return {[type]}
     * @ngInject
     */
    function config($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    /**
     * Extend the $exceptionHandler service to also display a toast.
     * @param  {Object} $delegate
     * @param  {Object} exceptionHandler
     * @param  {Object} logger
     * @return {Function} the decorated $exceptionHandler service
     */
    function extendExceptionHandler($delegate, exceptionHandler, logger) {
        return function(exception, cause) {
            var appErrorPrefix = exceptionHandler.config.appErrorPrefix || '';
            var errorData = {exception: exception, cause: cause};
            exception.message = appErrorPrefix + exception.message;
            $delegate(exception, cause);
            /**
             * Could add the error to a service's collection,
             * add errors to $rootScope, log errors to remote web server,
             * or log locally. Or throw hard. It is entirely up to you.
             * throw exception;
             *
             * @example
             *     throw { message: 'error message we added' };
             */
            logger.error(exception.message, errorData);
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('blocks.exception')
        .factory('exception', exception);

    /* @ngInject */
    function exception(logger) {
        var service = {
            catcher: catcher
        };
        return service;

        function catcher(message) {
            return function(reason) {
                logger.error(message, reason);
            };
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('blocks.logger')
        .factory('logger', logger);

    logger.$inject = ['$log', 'toastr'];

    function logger($log, toastr) {
        var service = {
            showToasts: true,

            error   : error,
            info    : info,
            success : success,
            warning : warning,

            // straight to console; bypass toastr
            log     : $log.log
        };

        return service;
        /////////////////////

        function error(message, data, title) {
            toastr.error(message, title);
            $log.error('Error: ' + message, data);
        }

        function info(message, data, title) {
            toastr.info(message, title);
            $log.info('Info: ' + message, data);
        }

        function success(message, data, title) {
            toastr.success(message, title);
            $log.info('Success: ' + message, data);
        }

        function warning(message, data, title) {
            toastr.warning(message, title);
            $log.warn('Warning: ' + message, data);
        }
    }
}());

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
