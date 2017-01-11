/**
 * Created by hedy02 on 2016/9/19.
 */
'use strict';
comment_list_app.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
})
    .controller('MainCommentListCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG) {

    })
    .controller('TplRightCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG) {

    })
    .controller('TplCommentListCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG,UtilService) {
        $scope.dateUtil = UtilService;

        $scope.comment = {
            list: [],
            page: {
                totalPage: 1,
                totalItems: 1,
                pageSize: 12,
                curPage: 1,
                maxSize: 5,
                first_text: '首页',
                last_text: '尾页',
                next_text: '下页',
                previous_text: '上页'
            }
        };

        $scope.getCommentListOpen = function () {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/getCommentListOpen?pageSize=' + $scope.comment.page.pageSize
                + "&curPage=" + $scope.comment.page.curPage
            )
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.comment.list = ret.data.data;
                        $scope.comment.page.totalItems = ret.data.totalItems;
                        $scope.comment.page.curPage = ret.data.curPage;
                    } else {
                        $window.location = '../../common/error/500.html';
                    }
                }).error(function (msg) {
                $window.location = '../../common/error/500.html';
            });
        };

        $scope.getCommentListOpen();
    })
;
