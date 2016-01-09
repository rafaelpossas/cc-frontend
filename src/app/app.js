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

