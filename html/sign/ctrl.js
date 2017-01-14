/**
 * Created by hedy02 on 2016/9/19.
 */
'use strict';
signUp_project_app.controller('signUp_project_ctrl', function ($window,$scope, $http, AUTH_EVENTS, $rootScope,AuthService, GLOBAL_CONFIG) {
    
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
            disabled:false,
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

        if ($scope.credentials.phone == '' || $scope.credentials.phone == null ||  $scope.credentials.phone.length != 11){
            $scope.common.phone.showError = true;
            if ( $scope.credentials.phone.length != 11)
                $scope.common.phone.msg = "手机号格式不正确哦";
            else $scope.common.phone.msg = "手机号没有输入哦";

        }else if ($scope.credentials.tvercode == '' || $scope.credentials.tvercode == null || $scope.credentials.tvercode.length != 4){
            $scope.common.tvercode.showError = true;
            if ($scope.credentials.tvercode.length != 4)
                $scope.common.tvercode.msg = "验证码格式不对哦";
            else   $scope.common.tvercode.msg = "验证码没有输入哦";
        }else {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/sendVercodeOpen?'
                + '&phone=' + $scope.credentials.phone
                + '&tvercode=' + $scope.credentials.tvercode
                )
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.common.phone.showError = false;
                        $scope.common.tvercode.showError = false;
                        $scope.common.vercode.text = '验证码已发送';
                        $scope.common.vercode.disabled = true;
                    }else if(ret.code = '107'){
                        $scope.common.phone.showError = true;
                        $scope.common.phone.msg = "手机号格式不正确哦";
                    }else if(ret.code = '108'){
                        $scope.common.tvercode.showError = true;
                        $scope.common.tvercode.msg = "验证码不对哦";
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



