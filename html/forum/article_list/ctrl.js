/**
 * Created by hedy02 on 2016/9/19.
 */
'use strict';
article_list_app.config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
})
    .controller('MainArticleListCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG) {

    })
    .controller('TplArticleListCtrl', function ($scope, $window, $rootScope, $http, $timeout, GLOBAL_CONFIG,UtilService) {
        $scope.dateUtil = UtilService;

        $scope.article = {
            list: [],
            page: {
                key: '',
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

        $scope.getArticleListOpen = function () {
            $http.get('http://' + GLOBAL_CONFIG.url.ip + ':' + GLOBAL_CONFIG.url.port + '/api/getArticleListOpen?key=' + $scope.article.page.key
                + "&pageSize=" + $scope.article.page.pageSize
                + "&curPage=" + $scope.article.page.curPage
            )
                .success(function (ret) {
                    if (ret.code == '000') {
                        $scope.article.list = ret.data.data;
                        $scope.article.page.totalItems = ret.data.totalItems;
                        $scope.article.page.curPage = ret.data.curPage;
                    } else {
                        $window.location = '../../common/error/500.html';
                    }
                }).error(function (msg) {
                $window.location = '../../common/error/500.html';
            });
        };

        $scope.getArticleListOpen();
    })
;
