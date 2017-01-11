/**
 * Created by hedy02 on 2016/9/19.
 */
'use strict';
signUp_project_app.controller('signUp_project_ctrl', function ($window,$scope, $rootScope, AUTH_EVENTS, AuthService) {
    $scope.credentials = {
        nickname:'',
        phone: '',
        vercode: '',
        password: ''
    };
    $scope.setCurrentUser = function (user) {
        $window.localStorage['userID']=user.id;
        $window.localStorage['nickname']=user.nickname;
        $window.localStorage['userType']=user.type;
    };
    $scope.signUp = function (credentials) {
        AuthService.signUp(credentials).then(function (user) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.setCurrentUser(user);
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };
});



