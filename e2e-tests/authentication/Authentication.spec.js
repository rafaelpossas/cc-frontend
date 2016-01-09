
describe('Authentication e2e',function() {

    it('should automatically redirect to /#login when the use is not logged', function(done) {
        browser.get('index.html');
        browser.getCurrentUrl()
            .then(function(actualUrl) {
                expect(actualUrl.indexOf('#/login') !== -1);
                done();
            });
    });
    it('should contain the complete sign up form',function() {
        var usernameInput = element(by.id('usernameInput'));
        usernameInput.sendKeys('admin@c-scope.net');
        expect(usernameInput.getAttribute('value')).toEqual('admin@c-scope.net');
    });
})