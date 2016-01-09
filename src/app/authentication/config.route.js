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
