/**
 * Created by hedy02 on 2016/9/19.
 */
'use strict';
stao_project_list_app.controller('stao_project_list_ctrl', function ($scope, UtilService,$rootScope, $http, GLOBAL_CONFIG, GLOBAL_VALUE) {
    $scope.isMobile = UtilService.isMobile();

    $scope.page = {
        name:'',
        region:'',
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
    
    $scope.project_list = {
        getProjectList: function ( pageSize, curPage) {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/queryProjectListOpen?pageSize=' + pageSize
                + '&region=' + $scope.page.region
                + '&curPage=' + curPage
                + '&name=' + $scope.page.name
                )
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.project_list.data = ret.data.data;
                        $scope.page.totalItems =  ret.data.totalItems;
                    }
                }).error(function (msg) {
                console.log("Fail! " + msg);
            });
        }
    };
    
    $scope.pageChanged = function (name, region) {
        if (arguments.length > 1){
            $scope.page.name = encodeURI(encodeURI(name));
            $scope.page.region = encodeURI(encodeURI(region));
            $scope.page.curPage = 1;
        }
        $scope.project_list.getProjectList($scope.page.pageSize, $scope.page.curPage);
    };
    
    $scope.pageChanged();

});



