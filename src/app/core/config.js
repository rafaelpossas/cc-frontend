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
