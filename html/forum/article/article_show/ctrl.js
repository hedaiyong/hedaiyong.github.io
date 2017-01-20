/**
 * Created by hedy02 on 2016/10/24.
 */
'use strict';
article_show_app.controller('article_show_ctrl', function ($scope,$window, $location, $http, $timeout, GLOBAL_CONFIG,UtilService,$interval) {
    $scope.isMobile = UtilService.isMobile();

    $scope.comment = {
        likeCollect:{},
        id:UtilService.getUrlParameter('articleID')
    };
    $scope.user = {
        jobs:GLOBAL_CONFIG.user.jobs,
        sex:['男','女'],
        info:''
    };
    $scope.getArticle = function (articleID) {
        $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/getArticleOpen?articleID=' + articleID)
            .success(function (ret) {
                if (ret.code=='000') {
                    $scope.article = ret.data.article;
                    $scope.user.info = ret.data.user;
                }
            }).error(function (msg) {
            console.log("Fail! " + msg);
        });
    };
    
    

    $scope.getArticle($scope.comment.id);

    $scope.article = {
        title:"",
        content:'',
        tag:[]    //类似id、name 的数组
    };


    //发送内网外网ip地址给服务器
    if ($window.localStorage[$scope.comment.id] == undefined || (new Date().getTime() -  $window.localStorage[$scope.comment.id] ) > 1000 * 60 * 60 * 24){
        var timer = $interval(function () {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ":" + GLOBAL_CONFIG.url.port + '/api/addArticleReadCountOpen?articleID=' + $scope.comment.id
            ).success(function (res) {
                if (res.code == '000') {
                    $interval.cancel(timer);
                    $window.localStorage[$scope.comment.id] = new Date().getTime();
                } else {
                    console.log("fail " + res.message);
                }
            }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        }, 4000, 1);
    }
    

});