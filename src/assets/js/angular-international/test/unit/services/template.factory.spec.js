describe('amalieiev.international', function () {
    describe('$templateFactory', function () {

        beforeEach(module('amalieiev.international'));

        it('$templateFactory should interpolate template', function () {
            inject(function ($template) {
                expect($template).toBeDefined();
                expect($template('hello {name}', {name: 'jon'})).toEqual('hello jon');
                expect($template('{name} is {age} years old', {name: 'jon', age: 20})).toEqual('jon is 20 years old');
            });
        });
    });
});