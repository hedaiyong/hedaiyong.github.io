/**
 * Created by hedy02 on 2016/9/19.
 */
'use strict';
signUp_project_app.controller('signUp_project_ctrl', function ($window,$scope, $rootScope, AUTH_EVENTS, AuthService, GLOBAL_CONFIG) {
    
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
            text:'发送验证码',
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
    //发送手机验证码
    $scope.common.sendCode = function () {
        var phoneReg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,2,3,5-9]))\\d{8}$/;

        if (!phoneReg.test($scope.credentials.phone)){
            $scope.common.phone.showError = true;
            $scope.common.phone.msg = "手机号格式不正确哦";
        }else if ($scope.credentials.tvercode == '' || $scope.credentials.tvercode == null || $scope.credentials.tvercode.length != 4){
            $scope.common.tvercode.showError = true;
            $scope.common.tvercode.msg = "验证要输入哦";
        }else {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/sendVercodeOpen?'
                + '&phone=' + $scope.credentials.phone
                + '&tvercode=' + $scope.credentials.tvercode
                + '&key=' + key)
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.common.phone.showError = false;
                        $scope.common.tvercode.showError = false;
                        $scope.common.vercode.text = '验证码已发送';
                    }
                }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        }
    };

    $scope.common.init = function () {
        $scope.common.phone.showError = false;
        $scope.common.tvercode.showError = false;
        $scope.common.vercode.showError = false;
        $scope.common.nickname.showError = false;
        $scope.common.password.showError = false;
        $scope.common.vercode.text = '发送验证码';
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
            $scope.common.init();
            $window.location.href = 'http://' + GLOBAL_CONFIG.url.domain + '/html/forum/user/user.html'
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };
});



