describe('amalieiev.international', function () {
    describe('templateFilter', function () {

        beforeEach(module('amalieiev.international'));

        it('templateFilter should interpolate template', function () {
            inject(function ($compile, $rootScope) {
                var element = angular.element('<div>{{message | template:data }}</div>');
                $rootScope.message = '{name} is {age} years old';
                $rootScope.data = {name: 'jon', age: 20};
                $compile(element)($rootScope);
                $rootScope.$digest();
                expect(element.html()).toEqual('jon is 20 years old');
            });
        });
    });
});