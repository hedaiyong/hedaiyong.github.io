/**
 * Created by hedy02 on 2016/9/19.
 */
'use strict';
stao_project_app.controller('stao_project_ctrl', function ($scope,UtilService, $http, GLOBAL_CONFIG, GLOBAL_VALUE) {
    $scope.isLogin = GLOBAL_VALUE.isLogin;
    $scope.isMobile = UtilService.isMobile();

    $scope.pageSize = 12;


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

    $scope.pageInit = function (result) {
        $scope.page.pageSize = $scope.pageSize;
        $scope.page.totalItems = result.totalItems;
        $scope.page.curPage = result.curPage;
    };
    $scope.project_list = {
        getProjectList: function ( pageSize, curPage) {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/qProjectSalesListOpen?pageSize=' + pageSize
                + '&region=' + $scope.page.region
                + '&curPage=' + curPage
                + '&name=' + $scope.page.name
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
    
    $scope.pageChanged = function (name,region) {
        if (arguments.length > 1){
            $scope.page.name = encodeURI(encodeURI(name));
            $scope.page.region = encodeURI(encodeURI(region));
            $scope.page.curPage = 1;
        }
        $scope.project_list.getProjectList(  $scope.page.pageSize, $scope.page.curPage);
    };
    
    $scope.pageChanged();

});



