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

