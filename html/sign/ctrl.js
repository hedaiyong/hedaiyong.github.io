/**
 * Created by hedy02 on 2016/9/19.
 */
'use strict';
signUp_project_app.controller('signUp_project_ctrl', function ($window,$scope, $rootScope, AUTH_EVENTS, AuthService) {
    
    $scope.credentials = {
        nickname:'',
        phone: '',
        vercode: '',
        tvercode: '',
        password: ''
    };

    $scope.common = {
        nickname:{
            showError:false,
            msg:''
        },
        phone:{
            showError:false,
            msg:''
        },
        //短信验证码
        vercode:{
            showError:false,
            msg:''
        },
        //图片验证码
        tvercode:{
            showError:false,
            msg:''
        },
        password:{
            showError:false,
            msg:''
        },
        sendCodeText:'发送验证码'
    };

    $scope.common.sendCode = function () {
        var phoneReg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,2,3,5-9]))\\d{8}$/;

        if (!phoneReg.test($scope.credentials.phone)){

        }else {

        }
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



