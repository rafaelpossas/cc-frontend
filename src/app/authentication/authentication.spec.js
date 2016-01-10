describe('Authentication',function() {


    var $httpBackend;
    var $controller;
    var $rootScope;
    var $q;
    var $scope;
    var $state;
    var authenticationRepository;
    var logger;
    var Login;
    var userData;
    var common;

    var data;
    var credentialsSuccess = {
        username:'admin@c-scope.net',
        password:'hhrp104a'
    }
    var credentialsFail = {
        username:'wrongLogin',
        password:'wrongPassword'
    }
    var loginSuccess = function (credentials) {
        /!* jscs:disable requireCamelCaseOrUpperCaseIdentifiers *!/
        return angular.fromJson(credentials).user_primary_email === 'admin@c-scope.net';
    };
    var loginFail = function (credentials) {
        /!* jscs:disable requireCamelCaseOrUpperCaseIdentifiers *!/
        return angular.fromJson(credentials).user_primary_email === 'wrongLogin';
    };

    beforeEach(module('app.core'));
    beforeEach(module('app.authentication'));

    beforeEach(inject(function(_authenticationRepository_,_common_,
                               _$httpBackend_,_$controller_,_userData_) {
        authenticationRepository = _authenticationRepository_;
        common = _common_;
        $httpBackend = _$httpBackend_;
        $controller = _$controller_;
        $rootScope = common.$rootScope;
        $q = common.$q;
        $state = common.$state;
        $scope = $rootScope.$new();
        logger = common.logger;
        userData = _userData_;
        Login = $controller('Login',{
            $scope:$scope,
            authenticationRepository: _authenticationRepository_,
            common: _common_,
            userData: _userData_
        });
        data = readJSON('src/app/authentication/authentication.mock.json');


    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
    });

    it('should authenticate the user through the login page',function(){
        spyOn(authenticationRepository,'login').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve(data['success'].response.result);
            return deferred.promise;
        });
        spyOn($state,'go').and.callFake(function(data){
            expect(data).toBe('dashboard');
        });
        Login.handleLoginSubmit(credentialsSuccess);
        $rootScope.$apply();
        expect(authenticationRepository.login).toHaveBeenCalledWith(credentialsSuccess)
    });
    it('should return authentication status success from the backend',function() {

        $httpBackend.expectPOST(/.*auth\/user\/local/,loginSuccess)
            .respond(200,data['success']);

        authenticationRepository.login(credentialsSuccess)
            .then(function(data) {
                expect(data.is_authenticated_yn).toBe('y');
            });
        $httpBackend.flush();

    });
    it('should not authenticate the user when bad credentials are provided',function() {
        spyOn(authenticationRepository,'login').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve(data['failure'].response.result);
            return deferred.promise;
        });
        spyOn(logger,'warning').and.callFake(function(msg,obj,title){
            expect(msg).toBe('Invalid username and/or password');
            expect(obj.username).toBe('wrongLogin');
            expect(obj.password).toBe('wrongPassword');
            expect(title).toBe('Login Error');
        })
        Login.handleLoginSubmit(credentialsFail);
        $rootScope.$apply();
        expect(logger.warning).toHaveBeenCalled();

    });
    it('should return authentication failed status from the backend',function() {
        $httpBackend.expectPOST(/.*auth\/user\/local/,loginFail)
            .respond(200,data['failure']);

        authenticationRepository.login(credentialsFail)
            .then(function(data) {
                expect(data.is_authenticated_yn).toBe('n');
            });
        $httpBackend.flush();

    });

});
