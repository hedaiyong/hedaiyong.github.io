/**
 * Created by hedy02 on 2016/9/19.
 */
'use strict';
stao_project_list_app.controller('stao_project_list_ctrl', function ($scope, $rootScope, $http, GLOBAL_CONFIG, GLOBAL_VALUE) {
    $scope.isLogin = GLOBAL_VALUE.isLogin;
    $rootScope.ip = GLOBAL_CONFIG.url.ip;
    $rootScope.port = GLOBAL_CONFIG.url.port;
    $scope.pageSize = 12;


    $scope.page = {
        name:'',
        totalPage: 1,
        totalItems: 1,
        pageSize: 12,
        curPage: 1,
        maxSize: 5,
        first_text: '首页',
        last_text: '尾页',
        next_text: '下页',
        previous_text: '上页'

    };

    $scope.pageInit = function (result) {
        $scope.page.pageSize = $scope.pageSize;
        $scope.page.totalItems = result.totalItems;
        $scope.page.curPage = result.curPage;
    };
    $scope.project_list = {
        getProjectList: function (name, region,  pageSize, curPage) {
            $http.get('http://' + $rootScope.ip + ':' + $rootScope.port + '/api/qProjectSalesListOpen?pageSize=' + pageSize
                + '&region=' + region
                + '&curPage=' + curPage
                + '&name=' + name
                )
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.project_list.data = ret.data.data;
                        $scope.pageInit(ret.data);
                    }
                }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        }
    };
    
    $scope.pageChanged = function (name, region) {
        $scope.project_list.getProjectList(name, region, $scope.page.pageSize, $scope.page.curPage);
    };
    
    $scope.pageChanged('', '');

});



