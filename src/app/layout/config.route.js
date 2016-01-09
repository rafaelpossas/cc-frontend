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
